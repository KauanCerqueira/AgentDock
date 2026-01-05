using AgentDock.Backend.Core.Interfaces;
using AgentDock.Backend.Core.Models;
using AgentDock.Backend.Infrastructure.HuggingFace;
using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModelsController : ControllerBase
{
    private readonly ILlamaService _llamaService;
    private readonly HuggingFaceService _huggingFaceService;
    private readonly ModelDownloadManager _downloadManager;
    private readonly ModelRecommendationService _recommendationService;
    private readonly SystemMonitorService _systemMonitor;
    private readonly ILogger<ModelsController> _logger;

    public ModelsController(
        ILlamaService llamaService,
        HuggingFaceService huggingFaceService,
        ModelDownloadManager downloadManager,
        ModelRecommendationService recommendationService,
        SystemMonitorService systemMonitor,
        ILogger<ModelsController> logger)
    {
        _llamaService = llamaService;
        _huggingFaceService = huggingFaceService;
        _downloadManager = downloadManager;
        _recommendationService = recommendationService;
        _systemMonitor = systemMonitor;
        _logger = logger;
    }

    /// <summary>
    /// Lista modelos instalados localmente
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetModels(CancellationToken cancellationToken)
    {
        try
        {
            var response = await _llamaService.ListModelsAsync(cancellationToken);
            return Ok(response.Models);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching local models");
            return StatusCode(500, new { error = "Failed to fetch models", details = ex.Message });
        }
    }

    /// <summary>
    /// Busca modelos GGUF no HuggingFace
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchHuggingFace([FromQuery] string query = "gguf", [FromQuery] int limit = 20)
    {
        try
        {
            var models = await _huggingFaceService.SearchModelsAsync(query, limit);
            return Ok(models);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching HuggingFace");
            return StatusCode(500, new { error = "Failed to search models", details = ex.Message });
        }
    }

    /// <summary>
    /// Obtém detalhes completos de um modelo do HuggingFace
    /// </summary>
    [HttpGet("huggingface-details")]
    public async Task<IActionResult> GetModelDetails([FromQuery] string modelId)
    {
        try
        {
            _logger.LogInformation("Fetching details for model: {ModelId}", modelId);
            var details = await _huggingFaceService.GetModelDetailsAsync(modelId);
            return Ok(details);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching model details for {ModelId}", modelId);
            return StatusCode(500, new { error = "Failed to fetch model details", details = ex.Message });
        }
    }

    /// <summary>
    /// Lista arquivos GGUF de um modelo no HuggingFace
    /// </summary>
    [HttpGet("huggingface-files")]
    public async Task<IActionResult> GetModelFiles([FromQuery] string modelId)
    {
        try
        {
            var files = await _huggingFaceService.ListModelFilesAsync(modelId);
            
            // Obter informações de hardware do sistema
            var systemStats = _systemMonitor.GetSystemStats();
            var availableRamGb = systemStats.AvailableMemoryGb;
            var availableVramGb = systemStats.GpuInfo?.MemoryTotalGb;
            
            // Calcular compatibilidade para cada arquivo
            foreach (var file in files)
            {
                if (file.Requirements != null)
                {
                    file.Compatibility = _huggingFaceService.CheckCompatibility(
                        file.Requirements, 
                        availableRamGb, 
                        availableVramGb
                    );
                }
            }
            
            return Ok(files);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing model files");
            return StatusCode(500, new { error = "Failed to list files", details = ex.Message });
        }
    }

    /// <summary>
    /// Inicia download de um modelo do HuggingFace
    /// </summary>
    [HttpPost("download")]
    public async Task<IActionResult> StartDownload([FromBody] DownloadRequest request)
    {
        try
        {
            if (request == null)
            {
                return BadRequest(new { error = "Invalid request body" });
            }

            _logger.LogInformation("?? Download request received: {ModelId}/{Filename}", request.ModelId, request.Filename);
            
            // Verificar se pode baixar (não duplicado)
            var (canDownload, reason, existingId) = _downloadManager.CanDownload(request.Filename);
            if (!canDownload)
            {
                _logger.LogWarning("?? Cannot download: {Reason}", reason);
                return Conflict(new 
                { 
                    error = reason,
                    existingDownloadId = existingId,
                    canDownload = false
                });
            }
            
            // Verificar espaço em disco
            var modelsPath = _downloadManager.GetModelsPath();
            _logger.LogInformation("?? Models path: {Path}", modelsPath);

            try
            {
                var pathRoot = Path.GetPathRoot(Path.GetFullPath(modelsPath));
                if (!string.IsNullOrEmpty(pathRoot))
                {
                    var driveInfo = new DriveInfo(pathRoot);
                    _logger.LogInformation("?? Available disk space: {Space}GB", driveInfo.AvailableFreeSpace / 1024.0 / 1024.0 / 1024.0);
                    
                    var files = await _huggingFaceService.ListModelFilesAsync(request.ModelId);
                    var file = files.FirstOrDefault(f => f.Filename == request.Filename);
                    
                    if (file != null)
                    {
                        var fileSizeGB = file.SizeBytes / 1024.0 / 1024.0 / 1024.0;
                        var availableSpaceGB = driveInfo.AvailableFreeSpace / 1024.0 / 1024.0 / 1024.0;
                        
                        _logger.LogInformation("?? File size: {Size}GB, Available: {Available}GB", fileSizeGB, availableSpaceGB);
                        
                        if (availableSpaceGB < fileSizeGB + 2)
                        {
                            _logger.LogWarning("?? Insufficient disk space!");
                            return BadRequest(new 
                            { 
                                error = "Espaço insuficiente em disco",
                                details = $"Necessário: {fileSizeGB + 2:F1}GB, Disponível: {availableSpaceGB:F1}GB",
                                requiredGB = fileSizeGB + 2,
                                availableGB = availableSpaceGB
                            });
                        }
                    }
                }
            }
            catch (Exception diskEx)
            {
                _logger.LogWarning(diskEx, "?? Failed to check disk space, proceeding anyway");
            }
            
            var downloadId = _downloadManager.QueueDownload(request.ModelId, request.Filename);
            
            if (downloadId == null)
            {
                return Conflict(new { error = "Download já está em andamento para este arquivo" });
            }
            
            _logger.LogInformation("? Download queued with ID: {DownloadId}", downloadId);
            
            return Ok(new { downloadId, status = "queued", message = "Download iniciado com sucesso" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "? Error starting download");
            return StatusCode(500, new { error = "Failed to start download", details = ex.Message });
        }
    }

    /// <summary>
    /// Lista todos os downloads (ativos, concluídos, falhos)
    /// </summary>
    [HttpGet("downloads/all")]
    public IActionResult GetAllDownloads()
    {
        try
        {
            var downloads = _downloadManager.GetAllDownloads();
            return Ok(downloads.Select(d => new
            {
                id = d.Id,
                filename = d.Filename,
                modelId = d.ModelId,
                status = d.Status.ToString(),
                percentComplete = d.PercentComplete,
                downloadedBytes = d.DownloadedBytes,
                totalBytes = d.TotalBytes,
                speedMBps = d.SpeedMBps,
                errorMessage = d.ErrorMessage,
                isReadyToUse = d.IsReadyToUse,
                modelPath = d.ModelPath,
                queuedAt = d.QueuedAt,
                startedAt = d.StartedAt,
                completedAt = d.CompletedAt
            }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting all downloads");
            return StatusCode(500, new { error = "Failed to get downloads", details = ex.Message });
        }
    }

    /// <summary>
    /// Obtém espaço em disco disponível
    /// </summary>
    [HttpGet("disk-space")]
    public IActionResult GetDiskSpace()
    {
        try
        {
            var (available, total) = _downloadManager.GetDiskSpace();
            return Ok(new { available, total });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting disk space");
            return StatusCode(500, new { error = "Failed to get disk space" });
        }
    }

    /// <summary>
    /// Cancela um download em andamento
    /// </summary>
    [HttpPost("download/{downloadId}/cancel")]
    public IActionResult CancelDownload(string downloadId)
    {
        try
        {
            _downloadManager.CancelDownload(downloadId);
            return Ok(new { message = "Download cancelado" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling download");
            return StatusCode(500, new { error = "Failed to cancel download" });
        }
    }

    /// <summary>
    /// Remove um download da lista (apenas concluídos ou falhos)
    /// </summary>
    [HttpDelete("download/{downloadId}")]
    public IActionResult RemoveDownload(string downloadId)
    {
        try
        {
            _downloadManager.RemoveDownload(downloadId);
            return Ok(new { message = "Download removido" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing download");
            return StatusCode(500, new { error = "Failed to remove download" });
        }
    }

    /// <summary>
    /// Obtém status de um download
    /// </summary>
    [HttpGet("download/{downloadId}")]
    public IActionResult GetDownloadStatus(string downloadId)
    {
        try
        {
            var task = _downloadManager.GetDownloadStatus(downloadId);
            if (task == null)
            {
                return NotFound(new { error = "Download not found", downloadId });
            }

            return Ok(new
            {
                id = task.Id,
                filename = task.Filename,
                status = task.Status.ToString(),
                percentComplete = task.PercentComplete,
                downloadedBytes = task.DownloadedBytes,
                totalBytes = task.TotalBytes,
                speedMBps = task.SpeedMBps,
                errorMessage = task.ErrorMessage,
                isReadyToUse = task.IsReadyToUse,
                modelPath = task.ModelPath,
                isLoadedInLlama = task.IsLoadedInLlama,
                statusMessage = GetStatusMessage(task)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting download status for {DownloadId}", downloadId);
            return StatusCode(500, new { error = "Error getting status" });
        }
    }
    
    /// <summary>
    /// Carrega um modelo baixado no llama.cpp
    /// </summary>
    [HttpPost("load-model")]
    public async Task<IActionResult> LoadModel([FromBody] LoadModelRequest request)
    {
        try
        {
            _logger.LogInformation("?? Loading model into llama.cpp: {Filename}", request.Filename);
            
            // Verificar se o arquivo existe
            var modelsPath = _downloadManager.GetModelsPath();
            var filePath = System.IO.Path.Combine(modelsPath, request.Filename);
            
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound(new
                {
                    error = "Model file not found",
                    filename = request.Filename,
                    path = filePath
                });
            }
            
            // Carregar no llama.cpp
            var result = await _llamaService.LoadModelAsync(request.Filename, CancellationToken.None);
            
            if (result)
            {
                _logger.LogInformation("? Model loaded successfully");
                
                return Ok(new
                {
                    success = true,
                    message = "Modelo carregado com sucesso no llama.cpp",
                    filename = request.Filename
                });
            }
            else
            {
                _logger.LogWarning("??  Failed to load model");
                
                return BadRequest(new
                {
                    success = false,
                    error = "Failed to load model",
                    details = "llama.cpp returned false"
                });
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "? Error loading model");
            return StatusCode(500, new
            {
                success = false,
                error = "Error loading model",
                details = ex.Message
            });
        }
    }
    
    private string GetStatusMessage(DownloadTask task)
    {
        return task.Status switch
        {
            DownloadStatus.Queued => "Na fila para download",
            DownloadStatus.Downloading => $"Baixando... {task.PercentComplete:F1}%",
            DownloadStatus.Completed when task.IsLoadedInLlama => "? Pronto para usar (carregado no llama.cpp)",
            DownloadStatus.Completed when task.IsReadyToUse => "? Baixado (clique para carregar no llama.cpp)",
            DownloadStatus.Completed => "? Download concluído",
            DownloadStatus.Failed => $"? Erro: {task.ErrorMessage}",
            DownloadStatus.Cancelled => "?? Cancelado",
            _ => "Status desconhecido"
        };
    }

    /// <summary>
    /// Lista modelos baixados e prontos para uso
    /// </summary>
    [HttpGet("downloaded")]
    public IActionResult GetDownloadedModels()
    {
        try
        {
            var modelsPath = _downloadManager.GetModelsPath();
            
            if (!Directory.Exists(modelsPath))
            {
                return Ok(new List<object>());
            }

            var ggufFiles = Directory.GetFiles(modelsPath, "*.gguf");
            
            var models = ggufFiles.Select(filePath =>
            {
                var fileInfo = new FileInfo(filePath);
                var filename = fileInfo.Name;
                var sizeBytes = fileInfo.Length;
                
                var requirements = _huggingFaceService.CalculateRequirements(filename, sizeBytes);
                var systemStats = _systemMonitor.GetSystemStats();
                var compatibility = _huggingFaceService.CheckCompatibility(
                    requirements,
                    systemStats.AvailableMemoryGb,
                    systemStats.GpuInfo?.MemoryTotalGb
                );

                return new
                {
                    filename,
                    path = filePath,
                    sizeBytes,
                    sizeMb = sizeBytes / 1024.0 / 1024.0,
                    sizeGb = sizeBytes / 1024.0 / 1024.0 / 1024.0,
                    downloadedAt = fileInfo.CreationTime,
                    lastModified = fileInfo.LastWriteTime,
                    requirements,
                    compatibility,
                    isReadyToUse = true
                };
            }).OrderByDescending(m => m.downloadedAt).ToList();

            return Ok(models);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting downloaded models");
            return StatusCode(500, new { error = "Failed to get downloaded models", details = ex.Message });
        }
    }

    /// <summary>
    /// Exclui um modelo baixado
    /// </summary>
    [HttpDelete("delete/{filename}")]
    public IActionResult DeleteModel(string filename)
    {
        try
        {
            _logger.LogInformation("??? Delete request for model: {Filename}", filename);
            
            var modelsPath = _downloadManager.GetModelsPath();
            var filePath = Path.Combine(modelsPath, filename);
            
            if (!System.IO.File.Exists(filePath))
            {
                _logger.LogWarning("Model file not found: {Path}", filePath);
                return NotFound(new { error = "Modelo não encontrado", filename, path = filePath });
            }
            
            // Deletar o arquivo
            System.IO.File.Delete(filePath);
            
            _logger.LogInformation("? Model deleted: {Filename}", filename);
            
            return Ok(new { success = true, message = "Modelo excluído com sucesso", filename });
        }
        catch (IOException ex)
        {
            _logger.LogError(ex, "Error deleting model - file may be in use");
            return StatusCode(500, new { error = "Não foi possível excluir o modelo", details = "O arquivo pode estar em uso. Feche qualquer aplicação que esteja usando o modelo e tente novamente." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting model: {Filename}", filename);
            return StatusCode(500, new { error = "Erro ao excluir modelo", details = ex.Message });
        }
    }

    /// <summary>
    /// Verifica compatibilidade de um modelo específico com o hardware atual
    /// </summary>
    [HttpPost("check-compatibility")]
    public IActionResult CheckCompatibility([FromBody] CompatibilityCheckRequest request)
    {
        try
        {
            var systemStats = _systemMonitor.GetSystemStats();
            var requirements = _huggingFaceService.CalculateRequirements(request.Filename, request.SizeBytes);
            var compatibility = _huggingFaceService.CheckCompatibility(
                requirements,
                systemStats.AvailableMemoryGb,
                systemStats.GpuInfo?.MemoryTotalGb
            );

            return Ok(new
            {
                requirements,
                compatibility,
                systemInfo = new
                {
                    availableRamGb = systemStats.AvailableMemoryGb,
                    totalRamGb = systemStats.TotalMemoryGb,
                    gpuName = systemStats.GpuInfo?.Name,
                    gpuVramGb = systemStats.GpuInfo?.MemoryTotalGb
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking compatibility");
            return StatusCode(500, new { error = "Failed to check compatibility", details = ex.Message });
        }
    }

    /// <summary>
    /// Obtém sugestões personalizadas de modelos baseado no hardware
    /// </summary>
    [HttpGet("suggestions")]
    public async Task<IActionResult> GetSuggestions([FromQuery] string? useCase = null, [FromQuery] int limit = 5)
    {
        try
        {
            var suggestions = await _recommendationService.GetPersonalizedSuggestionsAsync(useCase, limit);
            
            var systemStats = _systemMonitor.GetSystemStats();
            
            return Ok(new
            {
                suggestions,
                hardwareInfo = new
                {
                    availableRamGb = systemStats.AvailableMemoryGb,
                    totalRamGb = systemStats.TotalMemoryGb,
                    gpuName = systemStats.GpuInfo?.Name,
                    gpuVramGb = systemStats.GpuInfo?.MemoryTotalGb,
                    category = DetermineHardwareCategoryName(systemStats)
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting model suggestions");
            return StatusCode(500, new { error = "Failed to get suggestions", details = ex.Message });
        }
    }

    /// <summary>
    /// Obtém informações de hardware do sistema
    /// </summary>
    [HttpGet("hardware-info")]
    public IActionResult GetHardwareInfo()
    {
        try
        {
            var systemStats = _systemMonitor.GetSystemStats();
            
            return Ok(new
            {
                availableRamGb = systemStats.AvailableMemoryGb,
                totalRamGb = systemStats.TotalMemoryGb,
                usedRamGb = systemStats.UsedMemoryGb,
                ramUsagePercent = (systemStats.UsedMemoryGb / systemStats.TotalMemoryGb) * 100,
                gpu = systemStats.GpuInfo != null ? new
                {
                    name = systemStats.GpuInfo.Name,
                    totalVramGb = systemStats.GpuInfo.MemoryTotalGb,
                    usedVramGb = systemStats.GpuInfo.MemoryUsedGb,
                    availableVramGb = systemStats.GpuInfo.MemoryTotalGb - systemStats.GpuInfo.MemoryUsedGb,
                    vramUsagePercent = systemStats.GpuInfo.MemoryUsagePercent
                } : null,
                category = DetermineHardwareCategoryName(systemStats),
                osDescription = systemStats.OsDescription,
                architecture = systemStats.Architecture
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting hardware info");
            return StatusCode(500, new { error = "Failed to get hardware info", details = ex.Message });
        }
    }

    private string DetermineHardwareCategoryName(SystemStats stats)
    {
        var ramGb = stats.AvailableMemoryGb;
        var hasGpu = stats.GpuInfo != null && stats.GpuInfo.MemoryTotalGb > 4;
        var vramGb = stats.GpuInfo?.MemoryTotalGb ?? 0;

        if (ramGb >= 24 && hasGpu && vramGb >= 16)
            return "High-End";
        
        if (ramGb >= 16 && hasGpu && vramGb >= 8)
            return "Upper Mid-Range";
        
        if (ramGb >= 12 || hasGpu)
            return "Mid-Range";
        
        if (ramGb >= 8)
            return "Entry-Level";
        
        return "Limited";
    }
}

public class DownloadRequest
{
    public string ModelId { get; set; } = string.Empty;
    public string Filename { get; set; } = string.Empty;
}

public class CompatibilityCheckRequest
{
    public string Filename { get; set; } = string.Empty;
    public long SizeBytes { get; set; }
}

public class LoadModelRequest
{
    public string Filename { get; set; } = string.Empty;
}
