using AgentDock.Backend.Core.Interfaces;
using AgentDock.Backend.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModelsController : ControllerBase
{
    private readonly ILlamaService _llamaService;
    private readonly ILogger<ModelsController> _logger;

    public ModelsController(ILlamaService llamaService, ILogger<ModelsController> logger)
    {
        _llamaService = llamaService;
        _logger = logger;
    }

    /// <summary>
    /// Lista todos os modelos instalados
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
            _logger.LogError(ex, "Error fetching models");
            return StatusCode(500, new { error = "Failed to fetch models", details = ex.Message });
        }
    }
}
