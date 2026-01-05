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

    [HttpGet("{id}")]
    public IActionResult GetWorkspace(string id)
    {
        var workspace = mockData.GetWorkspace(id);
        if (workspace == null) return NotFound();
        return Ok(workspace);
    }

    [HttpPost("connect")]
    public IActionResult ConnectWorkspace([FromBody] ConnectWorkspaceRequest request)
    {
        var workspace = mockData.ConnectWorkspace(request.Path);
        return Ok(workspace);
    }

    [HttpGet("{id}/files")]
    public IActionResult GetWorkspaceFiles(string id)
    {
        var files = mockData.GetWorkspaceFiles(id);
        return Ok(files);
    }

    [HttpGet("{id}/files/search")]
    public IActionResult SearchFiles(string id, [FromQuery] string query)
    {
        var results = mockData.SearchFiles(id, query);
        return Ok(results);
    }

    [HttpGet("{id}/stats")]
    public IActionResult GetWorkspaceStats(string id)
    {
        var stats = mockData.GetWorkspaceStats(id);
        return Ok(stats);
    }

    [HttpPost("{id}/files/{fileId}/tags")]
    public IActionResult AddTag(string id, string fileId, [FromBody] AddTagRequest request)
    {
        mockData.AddTagToFile(id, fileId, request.Tag);
        return Ok();
    }

    [HttpDelete("{id}/files/{fileId}/tags/{tag}")]
    public IActionResult RemoveTag(string id, string fileId, string tag)
    {
        mockData.RemoveTagFromFile(id, fileId, tag);
        return Ok();
    }

    [HttpGet("groups")]
    public IActionResult GetWorkspaceGroups()
    {
        return Ok(mockData.GetWorkspaceGroups());
    }

    [HttpPost("groups")]
    public IActionResult CreateWorkspaceGroup([FromBody] CreateGroupRequest request)
    {
        var group = mockData.CreateWorkspaceGroup(request.Name, request.Description);
        return Ok(group);
    }

    [HttpPost("groups/{groupId}/workspaces/{workspaceId}")]
    public IActionResult AddWorkspaceToGroup(string groupId, string workspaceId)
    {
        mockData.AddWorkspaceToGroup(groupId, workspaceId);
        return Ok();
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteWorkspace(string id)
    {
        mockData.DeleteWorkspace(id);
        return Ok();
    }
}

public class ConnectWorkspaceRequest
{
    public string Path { get; set; } = "";
}

public class AddTagRequest
{
    public string Tag { get; set; } = "";
}

public class CreateGroupRequest
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
}