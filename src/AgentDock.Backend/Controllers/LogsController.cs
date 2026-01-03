using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LogsController : ControllerBase
{
    private readonly LogsService _logsService;

    public LogsController(LogsService logsService)
    {
        _logsService = logsService;
    }

    [HttpGet("activity")]
    public IActionResult GetActivityLogs(
        [FromQuery] int limit = 100,
        [FromQuery] string? category = null,
        [FromQuery] string? type = null)
    {
        var logs = _logsService.GetLogs(limit, category, type);
        return Ok(logs);
    }

    [HttpGet("performance")]
    public IActionResult GetPerformanceMetrics([FromQuery] int minutes = 60)
    {
        var metrics = _logsService.GetPerformanceMetrics(minutes);
        return Ok(metrics);
    }

    [HttpGet("statistics")]
    public IActionResult GetStatistics()
    {
        var stats = _logsService.GetLogStatistics();
        return Ok(stats);
    }

    [HttpPost("activity")]
    public IActionResult AddLog([FromBody] AddLogRequest request)
    {
        _logsService.AddLog(
            request.Category,
            request.Type,
            request.Message,
            request.Details,
            request.Metadata
        );
        return Ok();
    }
}

public class AddLogRequest
{
    public string Category { get; set; } = "user";
    public string Type { get; set; } = "info";
    public string Message { get; set; } = "";
    public string? Details { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}
