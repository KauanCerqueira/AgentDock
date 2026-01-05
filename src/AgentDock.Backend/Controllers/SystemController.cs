using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/system")]
public class SystemController : ControllerBase
{
    private readonly SystemMonitorService _systemMonitorService;
    private readonly ILogger<SystemController> _logger;

    public SystemController(
        SystemMonitorService systemMonitorService,
        ILogger<SystemController> logger)
    {
        _systemMonitorService = systemMonitorService;
        _logger = logger;
    }

    /// <summary>
    /// Health check endpoint
    /// </summary>
    [HttpGet("health")]
    public IActionResult GetHealth()
    {
        try
        {
            var systemStats = _systemMonitorService.GetSystemStats();
            
            return Ok(new
            {
                status = "healthy",
                timestamp = DateTime.UtcNow,
                uptime = systemStats.UpTime,
                system = new
                {
                    cpu = systemStats.CpuUsagePercent,
                    memory = new
                    {
                        total = systemStats.TotalMemoryGb,
                        used = systemStats.UsedMemoryGb,
                        available = systemStats.AvailableMemoryGb,
                        usagePercent = (systemStats.UsedMemoryGb / systemStats.TotalMemoryGb) * 100
                    },
                    gpu = systemStats.GpuInfo != null ? new
                    {
                        name = systemStats.GpuInfo.Name,
                        vram = systemStats.GpuInfo.MemoryTotalGb,
                        usage = systemStats.GpuInfo.UsagePercent
                    } : null
                },
                services = new
                {
                    backend = "running",
                    downloadManager = "ready",
                    huggingFace = "connected"
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Health check failed");
            return StatusCode(500, new
            {
                status = "unhealthy",
                error = ex.Message
            });
        }
    }

    [HttpGet("processes")]
    public IActionResult GetProcesses()
    {
        try
        {
            _logger.LogInformation("GetProcesses called");
            
            var currentProcess = Process.GetCurrentProcess();
            var systemStats = _systemMonitorService.GetSystemStats();
            var totalMemoryGb = systemStats.TotalMemoryGb;

            _logger.LogInformation("Total memory: {TotalMemory}GB", totalMemoryGb);

            var allProcesses = Process.GetProcesses();
            _logger.LogInformation("Total processes found: {Count}", allProcesses.Length);

            var processes = allProcesses
                .Select(p =>
                {
                    try
                    {
                        var memoryMb = p.WorkingSet64 / 1024.0 / 1024.0;
                        var memoryPercent = (memoryMb / (totalMemoryGb * 1024.0)) * 100;

                        return new
                        {
                            id = p.Id,
                            name = p.ProcessName,
                            memoryMb,
                            memoryPercent,
                            cpuPercent = 0.0, // Simplified - would need performance counter
                            isSystemProcess = IsSystemProcess(p.ProcessName),
                            canKill = !IsSystemProcess(p.ProcessName) && p.Id != currentProcess.Id
                        };
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning("Failed to get info for process: {Message}", ex.Message);
                        return null;
                    }
                })
                .Where(p => p != null && p.memoryMb > 10) // Only show processes using > 10MB
                .OrderByDescending(p => p!.memoryMb)
                .Take(50)
                .ToList();

            _logger.LogInformation("Filtered processes: {Count}", processes.Count);

            var result = new
            {
                processes,
                systemStats = new
                {
                    totalMemoryGb = systemStats.TotalMemoryGb,
                    usedMemoryGb = systemStats.UsedMemoryGb,
                    availableMemoryGb = systemStats.AvailableMemoryGb,
                    memoryUsagePercent = (systemStats.UsedMemoryGb / systemStats.TotalMemoryGb) * 100,
                    cpuUsagePercent = systemStats.CpuUsagePercent
                }
            };

            _logger.LogInformation("Returning {Count} processes", processes.Count);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting processes");
            return StatusCode(500, new { error = "Failed to get processes", details = ex.Message, stackTrace = ex.StackTrace });
        }
    }

    [HttpDelete("processes/{processId}")]
    public IActionResult KillProcess(int processId)
    {
        try
        {
            var process = Process.GetProcessById(processId);

            if (process == null)
            {
                return NotFound(new { error = "Process not found" });
            }

            // Prevent killing system processes
            if (IsSystemProcess(process.ProcessName))
            {
                return BadRequest(new { error = "Cannot kill system process" });
            }

            // Prevent killing self
            if (process.Id == Process.GetCurrentProcess().Id)
            {
                return BadRequest(new { error = "Cannot kill own process" });
            }

            _logger.LogWarning("Killing process: {ProcessName} (PID: {ProcessId})", process.ProcessName, processId);

            process.Kill(entireProcessTree: true);
            process.WaitForExit(5000);

            return Ok(new { message = "Process killed successfully" });
        }
        catch (ArgumentException)
        {
            return NotFound(new { error = "Process not found or already terminated" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error killing process {ProcessId}", processId);
            return StatusCode(500, new { error = "Failed to kill process", details = ex.Message });
        }
    }

    private bool IsSystemProcess(string processName)
    {
        var systemProcesses = new[]
        {
            "system", "smss", "csrss", "wininit", "services", "lsass", "svchost",
            "winlogon", "explorer", "dwm", "taskhostw", "RuntimeBroker", "sihost",
            "fontdrvhost", "conhost", "audiodg", "spoolsv", "SearchIndexer"
        };

        return systemProcesses.Any(sp => processName.ToLower().Contains(sp));
    }

    [HttpGet("stats")]
    public IActionResult GetStats()
    {
        try
        {
            var stats = _systemMonitorService.GetSystemStats();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting system stats");
            return StatusCode(500, new { message = "Error retrieving system stats", error = ex.Message });
        }
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "SystemController is working!", timestamp = DateTime.UtcNow });
    }
}
