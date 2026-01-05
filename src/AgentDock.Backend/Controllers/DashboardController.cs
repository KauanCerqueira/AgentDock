using AgentDock.Backend.Services;
using AgentDock.Backend.Infrastructure.HuggingFace;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly DashboardStatsService _dashboardStats;
    private readonly SystemMonitorService _systemMonitor;
    private readonly ModelDownloadManager _downloadManager;
    private readonly ILogger<DashboardController> _logger;

    public DashboardController(
        DashboardStatsService dashboardStats,
        SystemMonitorService systemMonitor,
        ModelDownloadManager downloadManager,
        ILogger<DashboardController> logger)
    {
        _dashboardStats = dashboardStats;
        _systemMonitor = systemMonitor;
        _downloadManager = downloadManager;
        _logger = logger;
    }

    /// <summary>
    /// Retorna estatísticas completas do dashboard
    /// </summary>
    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        try
        {
            // Atualizar estatísticas de modelos baseado no sistema de arquivos PRIMEIRO
            var (modelCount, totalSizeGb, activeModel) = GetModelStats();
            
            var stats = _dashboardStats.GetStats();
            var systemStats = _systemMonitor.GetSystemStats();
            
            return Ok(new
            {
                // Estatísticas de uso
                usage = new
                {
                    totalConversations = stats.TotalConversations,
                    totalMessages = stats.TotalMessages,
                    totalTokensUsed = stats.TotalTokensUsed,
                    avgTokensPerMessage = Math.Round(stats.AvgTokensPerMessage, 1),
                    totalRequests = stats.TotalRequests,
                    successfulRequests = stats.SuccessfulRequests,
                    failedRequests = stats.FailedRequests,
                    avgResponseTimeMs = Math.Round(stats.AvgResponseTimeMs, 0),
                    successRate = Math.Round(stats.SuccessRate, 1)
                },
                
                // Estatísticas de modelos (sempre atualizado do filesystem)
                models = new
                {
                    total = modelCount,
                    installed = modelCount,
                    activeModel = activeModel ?? stats.ActiveModel,
                    storageGb = Math.Round(totalSizeGb, 2)
                },
                
                // Estatísticas de downloads
                downloads = new
                {
                    total = stats.TotalDownloads,
                    completed = stats.CompletedDownloads,
                    active = _downloadManager.GetAllDownloads().Count(d => d.Status == DownloadStatus.Downloading),
                    totalDownloadedGb = Math.Round(totalSizeGb, 2)
                },
                
                // Sistema
                system = new
                {
                    cpuUsagePercent = systemStats.CpuUsagePercent,
                    totalMemoryGb = systemStats.TotalMemoryGb,
                    usedMemoryGb = systemStats.UsedMemoryGb,
                    availableMemoryGb = systemStats.AvailableMemoryGb,
                    memoryUsagePercent = systemStats.TotalMemoryGb > 0 
                        ? (systemStats.UsedMemoryGb / systemStats.TotalMemoryGb) * 100 
                        : 0,
                    gpu = systemStats.GpuInfo != null ? new
                    {
                        name = systemStats.GpuInfo.Name,
                        usagePercent = systemStats.GpuInfo.UsagePercent,
                        memoryUsedGb = systemStats.GpuInfo.MemoryUsedGb,
                        memoryTotalGb = systemStats.GpuInfo.MemoryTotalGb,
                        temperatureCelsius = systemStats.GpuInfo.TemperatureCelsius
                    } : null,
                    network = systemStats.NetworkInfo != null ? new
                    {
                        downloadSpeedMbps = systemStats.NetworkInfo.DownloadSpeedMbps,
                        uploadSpeedMbps = systemStats.NetworkInfo.UploadSpeedMbps
                    } : null
                },
                
                // Atividades recentes
                recentActivities = stats.RecentActivities.Take(10).Select(a => new
                {
                    id = a.Id,
                    timestamp = a.Timestamp,
                    type = a.Type,
                    title = a.Title,
                    description = a.Description,
                    modelName = a.ModelName,
                    tokensUsed = a.TokensUsed,
                    durationMs = a.DurationMs
                }),
                
                // Histórico de uso (últimas 24h)
                usageHistory = stats.UsageHistory.OrderBy(h => h.Timestamp).Select(h => new
                {
                    timestamp = h.Timestamp,
                    requests = h.Requests,
                    tokensUsed = h.TokensUsed,
                    avgResponseTimeMs = Math.Round(h.AvgResponseTimeMs, 0)
                }),
                
                // Metadados
                meta = new
                {
                    lastUpdated = DateTime.UtcNow,
                    firstActivityDate = stats.FirstActivityDate,
                    uptimeHours = Math.Round((DateTime.UtcNow - stats.FirstActivityDate).TotalHours, 1),
                    modelsPath = _downloadManager.GetModelsPath()
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting dashboard stats");
            return StatusCode(500, new { error = "Failed to get dashboard stats", details = ex.Message });
        }
    }

    /// <summary>
    /// Retorna apenas atividades recentes
    /// </summary>
    [HttpGet("activities")]
    public IActionResult GetActivities([FromQuery] int limit = 20, [FromQuery] string? type = null)
    {
        try
        {
            var stats = _dashboardStats.GetStats();
            var activities = stats.RecentActivities.AsEnumerable();
            
            if (!string.IsNullOrEmpty(type))
            {
                activities = activities.Where(a => a.Type == type);
            }
            
            return Ok(activities.Take(limit).Select(a => new
            {
                id = a.Id,
                timestamp = a.Timestamp,
                type = a.Type,
                title = a.Title,
                description = a.Description,
                modelName = a.ModelName,
                tokensUsed = a.TokensUsed,
                durationMs = a.DurationMs
            }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting activities");
            return StatusCode(500, new { error = "Failed to get activities" });
        }
    }

    /// <summary>
    /// Retorna histórico de uso
    /// </summary>
    [HttpGet("usage-history")]
    public IActionResult GetUsageHistory([FromQuery] int hours = 24)
    {
        try
        {
            var stats = _dashboardStats.GetStats();
            var cutoff = DateTime.UtcNow.AddHours(-hours);
            
            return Ok(stats.UsageHistory
                .Where(h => h.Timestamp >= cutoff)
                .OrderBy(h => h.Timestamp)
                .Select(h => new
                {
                    timestamp = h.Timestamp,
                    requests = h.Requests,
                    tokensUsed = h.TokensUsed,
                    avgResponseTimeMs = Math.Round(h.AvgResponseTimeMs, 0)
                }));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting usage history");
            return StatusCode(500, new { error = "Failed to get usage history" });
        }
    }

    /// <summary>
    /// Obtém estatísticas de modelos diretamente do filesystem
    /// </summary>
    private (int count, double sizeGb, string? activeModel) GetModelStats()
    {
        try
        {
            var modelsPath = _downloadManager.GetModelsPath();
            _logger.LogDebug("Checking models at: {Path}", modelsPath);
            
            if (!Directory.Exists(modelsPath))
            {
                _logger.LogWarning("Models directory does not exist: {Path}", modelsPath);
                return (0, 0, null);
            }

            var ggufFiles = Directory.GetFiles(modelsPath, "*.gguf");
            
            if (ggufFiles.Length == 0)
            {
                _logger.LogInformation("No .gguf models found in: {Path}", modelsPath);
                return (0, 0, null);
            }
            
            var totalSize = ggufFiles.Sum(f => new FileInfo(f).Length) / 1024.0 / 1024.0 / 1024.0;
            
            // Pegar o modelo mais recente como "ativo"
            var mostRecent = ggufFiles
                .Select(f => new FileInfo(f))
                .OrderByDescending(f => f.LastWriteTime)
                .FirstOrDefault();
            
            var activeModel = mostRecent?.Name;
            
            _logger.LogInformation("Found {Count} models, {Size:F2} GB, active: {Active}", 
                ggufFiles.Length, totalSize, activeModel);
            
            // Atualizar o serviço de stats também
            _dashboardStats.UpdateModelStats(ggufFiles.Length, ggufFiles.Length, totalSize);
            
            return (ggufFiles.Length, totalSize, activeModel);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to get model stats");
            return (0, 0, null);
        }
    }
}
