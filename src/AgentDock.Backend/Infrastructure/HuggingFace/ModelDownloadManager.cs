using System.Collections.Concurrent;
using AgentDock.Backend.Core.Interfaces;
using Microsoft.Extensions.Hosting;

namespace AgentDock.Backend.Infrastructure.HuggingFace;

/// <summary>
/// Gerencia downloads de modelos em fila
/// </summary>
public class ModelDownloadManager
{
    private readonly HuggingFaceService _huggingFaceService;
    private readonly ILlamaService _llamaService;
    private readonly ILogger<ModelDownloadManager> _logger;
    private readonly string _modelsPath;
    private readonly ConcurrentDictionary<string, DownloadTask> _activeDownloads = new();
    private readonly ConcurrentQueue<DownloadTask> _downloadQueue = new();
    private readonly SemaphoreSlim _downloadSemaphore = new(1, 1); // 1 download por vez
    
    // HashSet para rastrear arquivos sendo baixados (evitar duplicatas)
    private readonly ConcurrentDictionary<string, string> _downloadingFiles = new();

    public ModelDownloadManager(
        HuggingFaceService huggingFaceService,
        ILlamaService llamaService,
        ILogger<ModelDownloadManager> logger,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        _huggingFaceService = huggingFaceService;
        _llamaService = llamaService;
        _logger = logger;
        
        try
        {
            // Usar diret�rio de modelos do llama.cpp
            var llamaConfig = configuration.GetSection("Llama");
            var configuredModelsPath = llamaConfig.GetValue<string>("ModelsPath");
            var resolvedPath = string.IsNullOrWhiteSpace(configuredModelsPath)
                ? "models"
                : configuredModelsPath;

            var primaryPath = ResolvePath(resolvedPath, environment.ContentRootPath);
            if (!Directory.Exists(primaryPath))
            {
                var runtimePath = ResolvePath(resolvedPath, AppDomain.CurrentDomain.BaseDirectory);
                if (Directory.Exists(runtimePath))
                {
                    primaryPath = runtimePath;
                }
            }

            _modelsPath = primaryPath;
            _logger.LogInformation("Using models path: {Path}", _modelsPath);
            
            // Garantir que o diret�rio existe
            Directory.CreateDirectory(_modelsPath);
            _logger.LogInformation("? Models directory ready: {ModelsPath}", _modelsPath);
            
            // Iniciar worker de download
            _ = Task.Run(ProcessDownloadQueueAsync);
            _logger.LogInformation("? Download queue processor started");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "? Error initializing ModelDownloadManager");
            
            // Fallback de emerg�ncia
            _modelsPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "AgentDock",
                "models"
            );
            Directory.CreateDirectory(_modelsPath);
            _logger.LogWarning("Using emergency fallback path: {Path}", _modelsPath);
            
            // Ainda iniciar o worker
            _ = Task.Run(ProcessDownloadQueueAsync);
        }
    }

    /// <summary>
    /// Verifica se um arquivo j� est� sendo baixado ou j� existe
    /// </summary>
    public (bool canDownload, string reason, string? existingDownloadId) CanDownload(string filename)
    {
        // Verificar se j� existe o arquivo completo
        var filePath = Path.Combine(_modelsPath, filename);
        if (File.Exists(filePath))
        {
            return (false, "Modelo j� foi baixado anteriormente", null);
        }
        
        // Verificar se est� na fila ou em download
        if (_downloadingFiles.TryGetValue(filename, out var existingId))
        {
            return (false, "Download j� est� em andamento", existingId);
        }
        
        // Verificar downloads ativos
        var activeDownload = _activeDownloads.Values
            .FirstOrDefault(d => d.Filename == filename && 
                (d.Status == DownloadStatus.Downloading || d.Status == DownloadStatus.Queued));
        
        if (activeDownload != null)
        {
            return (false, "Download j� est� em andamento", activeDownload.Id);
        }
        
        return (true, "OK", null);
    }

    public string? QueueDownload(string modelId, string filename)
    {
        // Verificar se pode baixar
        var (canDownload, reason, existingId) = CanDownload(filename);
        if (!canDownload)
        {
            _logger.LogWarning("?? Cannot queue download: {Reason}", reason);
            return existingId; // Retorna o ID do download existente
        }
        
        var downloadId = Guid.NewGuid().ToString();
        var task = new DownloadTask
        {
            Id = downloadId,
            ModelId = modelId,
            Filename = filename,
            Status = DownloadStatus.Queued,
            QueuedAt = DateTime.UtcNow
        };

        // Marcar arquivo como sendo baixado
        _downloadingFiles[filename] = downloadId;
        
        _downloadQueue.Enqueue(task);
        _activeDownloads[downloadId] = task;

        _logger.LogInformation("? Queued download: {ModelId}/{Filename} (ID: {DownloadId})", modelId, filename, downloadId);

        return downloadId;
    }

    public DownloadTask? GetDownloadStatus(string downloadId)
    {
        _activeDownloads.TryGetValue(downloadId, out var task);
        return task;
    }

    public List<DownloadTask> GetAllDownloads()
    {
        return _activeDownloads.Values
            .OrderByDescending(d => d.QueuedAt)
            .ToList();
    }

    public void CancelDownload(string downloadId)
    {
        if (_activeDownloads.TryGetValue(downloadId, out var task))
        {
            task.CancellationTokenSource?.Cancel();
            task.Status = DownloadStatus.Cancelled;
            
            // Remover do tracking de downloads
            _downloadingFiles.TryRemove(task.Filename, out _);
            
            _logger.LogInformation("?? Download cancelled: {Filename}", task.Filename);
        }
    }

    public void RemoveDownload(string downloadId)
    {
        if (_activeDownloads.TryRemove(downloadId, out var task))
        {
            _downloadingFiles.TryRemove(task.Filename, out _);
            _logger.LogInformation("??? Download removed from list: {Filename}", task.Filename);
        }
    }

    public string GetModelsPath() => _modelsPath;

    public (double availableGb, double totalGb) GetDiskSpace()
    {
        try
        {
            var pathRoot = Path.GetPathRoot(Path.GetFullPath(_modelsPath));
            if (!string.IsNullOrEmpty(pathRoot))
            {
                var driveInfo = new DriveInfo(pathRoot);
                return (
                    driveInfo.AvailableFreeSpace / 1024.0 / 1024.0 / 1024.0,
                    driveInfo.TotalSize / 1024.0 / 1024.0 / 1024.0
                );
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to get disk space");
        }
        return (0, 0);
    }

    private async Task ProcessDownloadQueueAsync()
    {
        while (true)
        {
            try
            {
                if (_downloadQueue.TryDequeue(out var task))
                {
                    await _downloadSemaphore.WaitAsync();
                    
                    try
                    {
                        await DownloadModelAsync(task);
                    }
                    finally
                    {
                        _downloadSemaphore.Release();
                        
                        // Remover do tracking quando terminar (sucesso ou falha)
                        if (task.Status != DownloadStatus.Downloading && task.Status != DownloadStatus.Queued)
                        {
                            _downloadingFiles.TryRemove(task.Filename, out _);
                        }
                    }
                }
                else
                {
                    await Task.Delay(1000);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in download queue processor");
                await Task.Delay(5000);
            }
        }
    }

    private async Task DownloadModelAsync(DownloadTask task)
    {
        task.Status = DownloadStatus.Downloading;
        task.StartedAt = DateTime.UtcNow;
        task.CancellationTokenSource = new CancellationTokenSource();

        var destinationPath = Path.Combine(_modelsPath, task.Filename);

        var progress = new Progress<DownloadProgress>(p =>
        {
            task.TotalBytes = p.TotalBytes;
            task.DownloadedBytes = p.DownloadedBytes;
            task.PercentComplete = p.PercentComplete;
            task.SpeedMBps = CalculateSpeed(task);
        });

        try
        {
            _logger.LogInformation("?? Downloading {Filename} to {Path}", task.Filename, destinationPath);
            
            await _huggingFaceService.DownloadModelAsync(
                task.ModelId,
                task.Filename,
                destinationPath,
                progress,
                task.CancellationTokenSource.Token
            );

            // Marcar como completo IMEDIATAMENTE
            task.Status = DownloadStatus.Completed;
            task.CompletedAt = DateTime.UtcNow;
            task.FilePath = destinationPath;
            task.ModelPath = destinationPath;
            task.IsReadyToUse = true;
            task.IsLoadedInLlama = false;

            _logger.LogInformation("? Download completed: {Filename} -> {Path}", task.Filename, destinationPath);

            if (File.Exists(destinationPath))
            {
                var fileInfo = new FileInfo(destinationPath);
                _logger.LogInformation("?? File verified: {Size} MB", fileInfo.Length / 1024.0 / 1024.0);
            }
            else
            {
                _logger.LogError("? Downloaded file not found: {Path}", destinationPath);
                task.ErrorMessage = "Arquivo n�o encontrado ap�s download";
            }

            // Carregar no llama.cpp em background
            _ = Task.Run(async () =>
            {
                try
                {
                    _logger.LogInformation("?? Loading model in background: {Filename}", task.Filename);
                    await Task.Delay(2000);
                    
                    var loadResult = await _llamaService.LoadModelAsync(task.Filename, CancellationToken.None);
                    task.IsLoadedInLlama = loadResult;
                    
                    if (loadResult)
                    {
                        _logger.LogInformation("? Model loaded in llama.cpp: {Filename}", task.Filename);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "?? Background load failed: {Filename}", task.Filename);
                }
            });
        }
        catch (OperationCanceledException)
        {
            task.Status = DownloadStatus.Cancelled;
            _logger.LogWarning("?? Download cancelled: {Filename}", task.Filename);
            
            if (File.Exists(destinationPath))
            {
                try { File.Delete(destinationPath); } catch { }
            }
        }
        catch (Exception ex)
        {
            task.Status = DownloadStatus.Failed;
            task.ErrorMessage = ex.Message;
            _logger.LogError(ex, "? Download failed: {Filename}", task.Filename);
            
            if (File.Exists(destinationPath))
            {
                try { File.Delete(destinationPath); } catch { }
            }
        }
    }

    private double CalculateSpeed(DownloadTask task)
    {
        if (task.StartedAt == null) return 0;

        var elapsed = (DateTime.UtcNow - task.StartedAt.Value).TotalSeconds;
        if (elapsed <= 0) return 0;

        var mbDownloaded = task.DownloadedBytes / 1024.0 / 1024.0;
        return mbDownloaded / elapsed;
    }

    private static string ResolvePath(string path, string contentRoot)
    {
        if (string.IsNullOrWhiteSpace(path))
            return Path.Combine(contentRoot, "models");

        return Path.IsPathRooted(path)
            ? path
            : Path.GetFullPath(Path.Combine(contentRoot, path));
    }
}

public class DownloadTask
{
    public string Id { get; set; } = string.Empty;
    public string ModelId { get; set; } = string.Empty;
    public string Filename { get; set; } = string.Empty;
    public DownloadStatus Status { get; set; }
    public long TotalBytes { get; set; }
    public long DownloadedBytes { get; set; }
    public double PercentComplete { get; set; }
    public double SpeedMBps { get; set; }
    public DateTime QueuedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public string? FilePath { get; set; }
    public string? ErrorMessage { get; set; }
    public CancellationTokenSource? CancellationTokenSource { get; set; }
    
    public bool IsReadyToUse { get; set; }
    public string? ModelPath { get; set; }
    public bool IsLoadedInLlama { get; set; }
}

public enum DownloadStatus
{
    Queued,
    Downloading,
    Completed,
    Failed,
    Cancelled
}
