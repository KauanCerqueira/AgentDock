using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SystemController : ControllerBase
{
    private readonly SystemMonitorService _systemMonitorService;

    public SystemController(SystemMonitorService systemMonitorService)
    {
        _systemMonitorService = systemMonitorService;
    }

    [HttpGet("stats")]
    public ActionResult<SystemStats> GetStats()
    {
        try
        {
            var stats = _systemMonitorService.GetSystemStats();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error retrieving system stats", error = ex.Message });
        }
    }
}
