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
    public IActionResult StartDownload([FromBody] DownloadRequest request)
    {
        try
        {
            var downloadId = _downloadManager.QueueDownload(request.ModelId, request.Filename);
            return Ok(new { downloadId, status = "queued" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting download");
            return StatusCode(500, new { error = "Failed to start download", details = ex.Message });
        }
    }

    /// <summary>
    /// Obtém status de um download
    /// </summary>
    [HttpGet("download/{downloadId}")]
    public IActionResult GetDownloadStatus(string downloadId)
    {
        var task = _downloadManager.GetDownloadStatus(downloadId);
        if (task == null)
        {
            return NotFound(new { error = "Download not found" });
        }

        return Ok(new
        {
            task.Id,
            task.Filename,
            task.Status,
            task.PercentComplete,
            task.DownloadedBytes,
            task.TotalBytes,
            task.SpeedMBps,
            task.ErrorMessage,
            task.IsReadyToUse,
            task.ModelPath
        });
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
