using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(ILogger<AnalyticsController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAnalytics([FromQuery] string timeRange = "24h")
    {
        // In a real implementation, this would query a database or metrics store
        var stats = new
        {
            totalRequests = 1543,
            totalTokens = 245000,
            avgResponseTime = 1.8,
            successRate = 99.2,
            topModels = new[]
            {
                new { model = "tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf", count = 987, percentage = 64 },
                new { model = "other-model", count = 345, percentage = 22 },
                new { model = "test-model", count = 154, percentage = 10 },
            },
            topEndpoints = new[]
            {
                new { endpoint = "/v1/chat/completions", count = 1234, percentage = 80 },
                new { endpoint = "/v1/models", count = 246, percentage = 16 },
                new { endpoint = "/api/chat/send", count = 63, percentage = 4 },
            },
            requestsByHour = new[] { 45, 52, 38, 65, 78, 92, 105, 120, 135, 142, 138, 125, 110, 95, 88, 102, 115, 128, 140, 135, 120, 95, 75, 58 }
        };

        return Ok(stats);
    }
}
