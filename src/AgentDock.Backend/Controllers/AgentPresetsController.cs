using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AgentPresetsController : ControllerBase
{
    private readonly AgentPresetsService _presetsService;

    public AgentPresetsController(AgentPresetsService presetsService)
    {
        _presetsService = presetsService;
    }

    [HttpGet]
    public IActionResult GetPresets([FromQuery] string? category = null)
    {
        return Ok(_presetsService.GetPresets(category));
    }

    [HttpGet("{id}")]
    public IActionResult GetPreset(string id)
    {
        var preset = _presetsService.GetPreset(id);
        if (preset == null)
            return NotFound();
        return Ok(preset);
    }

    [HttpPost]
    public IActionResult CreatePreset([FromBody] AgentPreset preset)
    {
        var created = _presetsService.AddPreset(preset);
        return CreatedAtAction(nameof(GetPreset), new { id = created.Id }, created);
    }

    [HttpPost("{id}/use")]
    public IActionResult UsePreset(string id)
    {
        _presetsService.UsePreset(id);
        return Ok();
    }

    [HttpDelete("{id}")]
    public IActionResult DeletePreset(string id)
    {
        if (_presetsService.DeletePreset(id))
            return NoContent();
        return BadRequest("Cannot delete built-in presets");
    }
}
