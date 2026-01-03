using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkspacesController(MockDataService mockData) : ControllerBase
{
    [HttpGet]
    public IActionResult GetWorkspaces()
    {
        return Ok(mockData.GetWorkspaces());
    }

    [HttpPost("connect")]
    public IActionResult ConnectWorkspace([FromBody] ConnectWorkspaceRequest request)
    {
        var workspace = mockData.ConnectWorkspace(request.Path);
        return Ok(workspace);
    }
}

public class ConnectWorkspaceRequest
{
    public string Path { get; set; } = "";
}
