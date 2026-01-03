using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly SettingsService _settingsService;

    public SettingsController(SettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public IActionResult GetSettings()
    {
        return Ok(_settingsService.GetSettings());
    }

    [HttpPut]
    public IActionResult UpdateSettings([FromBody] UserSettings settings)
    {
        _settingsService.UpdateSettings(settings);
        return Ok();
    }
}

[ApiController]
[Route("api/[controller]")]
public class SnippetsController : ControllerBase
{
    private readonly SettingsService _settingsService;

    public SnippetsController(SettingsService settingsService)
    {
        _settingsService = settingsService;
    }

    [HttpGet]
    public IActionResult GetSnippets([FromQuery] string? category = null, [FromQuery] bool? favoriteOnly = null)
    {
        return Ok(_settingsService.GetSnippets(category, favoriteOnly));
    }

    [HttpGet("{id}")]
    public IActionResult GetSnippet(string id)
    {
        var snippet = _settingsService.GetSnippet(id);
        if (snippet == null)
            return NotFound();
        return Ok(snippet);
    }

    [HttpPost]
    public IActionResult CreateSnippet([FromBody] PromptSnippet snippet)
    {
        var created = _settingsService.AddSnippet(snippet);
        return CreatedAtAction(nameof(GetSnippet), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateSnippet(string id, [FromBody] PromptSnippet snippet)
    {
        if (_settingsService.UpdateSnippet(id, snippet))
            return Ok();
        return NotFound();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteSnippet(string id)
    {
        if (_settingsService.DeleteSnippet(id))
            return NoContent();
        return NotFound();
    }

    [HttpPost("{id}/use")]
    public IActionResult UseSnippet(string id)
    {
        _settingsService.UseSnippet(id);
        return Ok();
    }
}
