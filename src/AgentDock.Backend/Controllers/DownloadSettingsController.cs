using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DownloadSettingsController : ControllerBase
{
    private readonly DownloadSettingsService _settingsService;
    private readonly ILogger<DownloadSettingsController> _logger;

    public DownloadSettingsController(
        DownloadSettingsService settingsService,
        ILogger<DownloadSettingsController> logger)
    {
        _settingsService = settingsService;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetSettings()
    {
        try
        {
            var settings = _settingsService.GetSettings();
            var downloadPath = _settingsService.GetDownloadPath();
            
            return Ok(new
            {
                settings.NotifyOnComplete,
                settings.NotifyOnError,
                settings.MaxConcurrentDownloads,
                settings.AutoLoadAfterDownload,
                downloadPath,
                customPath = !string.IsNullOrEmpty(settings.DownloadPath)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting download settings");
            return StatusCode(500, new { error = "Failed to get settings", details = ex.Message });
        }
    }

    [HttpPut]
    public IActionResult UpdateSettings([FromBody] DownloadSettings settings)
    {
        try
        {
            _settingsService.UpdateSettings(settings);
            return Ok(new { message = "Settings updated successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating download settings");
            return StatusCode(500, new { error = "Failed to update settings", details = ex.Message });
        }
    }

    [HttpPost("choose-folder")]
    public IActionResult ChooseFolder([FromBody] FolderRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Path))
            {
                return BadRequest(new { error = "Path cannot be empty" });
            }

            if (!Directory.Exists(request.Path))
            {
                return BadRequest(new { error = "Directory does not exist" });
            }

            var settings = _settingsService.GetSettings();
            settings.DownloadPath = request.Path;
            _settingsService.UpdateSettings(settings);

            return Ok(new { message = "Download folder updated", path = request.Path });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error choosing download folder");
            return StatusCode(500, new { error = "Failed to update folder", details = ex.Message });
        }
    }
}

public class FolderRequest
{
    public string Path { get; set; } = string.Empty;
}
