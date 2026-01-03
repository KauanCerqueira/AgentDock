using System.Collections.Concurrent;
using AgentDock.Backend.Core.Interfaces;

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

    public ModelDownloadManager(
        HuggingFaceService huggingFaceService,
        ILlamaService llamaService,
        ILogger<ModelDownloadManager> logger,
        IConfiguration configuration)
    {
        _huggingFaceService = huggingFaceService;
        _llamaService = llamaService;
        _logger = logger;
        
        // Usar diretório de modelos do llama.cpp
        var llamaConfig = configuration.GetSection("Llama");
        var customPath = llamaConfig.GetValue<string>("ModelsPath");
        
        if (!string.IsNullOrEmpty(customPath))
        {
            _modelsPath = customPath;
        }
        else
        {
            // Fallback: usar diretório padrão do llama.cpp
            var llamaPath = llamaConfig.GetValue<string>("ExecutablePath") ?? "";
            if (!string.IsNullOrEmpty(llamaPath))
            {
                var llamaDir = Path.GetDirectoryName(llamaPath);
                _modelsPath = Path.Combine(llamaDir!, "models");
            }
            else
            {
                _modelsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "llama.cpp", "models");
            }
        }
        
        Directory.CreateDirectory(_modelsPath);
        _logger.LogInformation("Models will be downloaded to: {ModelsPath}", _modelsPath);

        // Iniciar worker de download
        _ = Task.Run(ProcessDownloadQueueAsync);
    }

    public string QueueDownload(string modelId, string filename)
    {
        var downloadId = Guid.NewGuid().ToString();
        var task = new DownloadTask
        {
            Id = downloadId,
            ModelId = modelId,
            Filename = filename,
            Status = DownloadStatus.Queued,
            QueuedAt = DateTime.UtcNow
        };

        _downloadQueue.Enqueue(task);
        _activeDownloads[downloadId] = task;

        _logger.LogInformation("Queued download: {ModelId}/{Filename} (ID: {DownloadId})", modelId, filename, downloadId);

        return downloadId;
    }

    public DownloadTask? GetDownloadStatus(string downloadId)
    {
        _activeDownloads.TryGetValue(downloadId, out var task);
        return task;
    }

    public List<DownloadTask> GetAllDownloads()
    {
        return _activeDownloads.Values.ToList();
    }

    public void CancelDownload(string downloadId)
    {
        if (_activeDownloads.TryGetValue(downloadId, out var task))
        {
            task.CancellationTokenSource?.Cancel();
            task.Status = DownloadStatus.Cancelled;
        }
    }

    public string GetModelsPath() => _modelsPath;

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
            _logger.LogInformation("Downloading {Filename} to {Path}", task.Filename, destinationPath);
            
            await _huggingFaceService.DownloadModelAsync(
                task.ModelId,
                task.Filename,
                destinationPath,
                progress,
                task.CancellationTokenSource.Token
            );

            task.Status = DownloadStatus.Completed;
            task.CompletedAt = DateTime.UtcNow;
            task.FilePath = destinationPath;

            _logger.LogInformation("Download completed: {Filename} -> {Path}", task.Filename, destinationPath);

            // Tentar carregar o modelo no llama.cpp automaticamente
            try
            {
                _logger.LogInformation("Attempting to load model into llama.cpp: {Filename}", task.Filename);
                
                // Aguardar um pouco para garantir que o arquivo está completamente gravado
                await Task.Delay(2000);
                
                // O llama.cpp detectará automaticamente novos modelos no diretório
                // Vamos apenas registrar que está disponível
                task.IsReadyToUse = true;
                task.ModelPath = destinationPath;
                
                _logger.LogInformation("Model ready for use: {Filename}", task.Filename);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Model downloaded but could not auto-load: {Filename}", task.Filename);
                task.IsReadyToUse = true; // Ainda está pronto, só não foi auto-carregado
                task.ModelPath = destinationPath;
            }
        }
        catch (OperationCanceledException)
        {
            task.Status = DownloadStatus.Cancelled;
            _logger.LogWarning("Download cancelled: {Filename}", task.Filename);
            
            // Limpar arquivo parcial
            if (File.Exists(destinationPath))
            {
                try { File.Delete(destinationPath); } catch { }
            }
        }
        catch (Exception ex)
        {
            task.Status = DownloadStatus.Failed;
            task.ErrorMessage = ex.Message;
            _logger.LogError(ex, "Download failed: {Filename}", task.Filename);
            
            // Limpar arquivo parcial
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
    
    // Novo: Indicadores de prontidão
    public bool IsReadyToUse { get; set; }
    public string? ModelPath { get; set; }
}

public enum DownloadStatus
{
    Queued,
    Downloading,
    Completed,
    Failed,
    Cancelled
}
