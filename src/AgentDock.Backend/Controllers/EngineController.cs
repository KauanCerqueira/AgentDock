using AgentDock.Backend.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EngineController : ControllerBase
{
    private readonly ILlamaService _llamaService;
    private readonly ILogger<EngineController> _logger;

    public EngineController(ILlamaService llamaService, ILogger<EngineController> logger)
    {
        _llamaService = llamaService;
        _logger = logger;
    }

    /// <summary>
    /// Verifica o status de saúde do Ollama
    /// </summary>
    [HttpGet("health")]
    public async Task<IActionResult> Health(CancellationToken cancellationToken)
    {
        try
        {
            var isHealthy = await _llamaService.IsHealthyAsync(cancellationToken);
            var version = await _llamaService.GetVersionAsync(cancellationToken);

            return Ok(new
            {
                status = isHealthy ? "online" : "offline",
                version = version,
                engine = "llama.cpp",
                timestamp = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking health");
            return Ok(new
            {
                status = "offline",
                error = ex.Message,
                engine = "llama.cpp",
                timestamp = DateTime.UtcNow
            });
        }
    }
}
