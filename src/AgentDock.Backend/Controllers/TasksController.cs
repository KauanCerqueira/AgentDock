using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TasksController(MockDataService mockData) : ControllerBase
{
    [HttpGet]
    public IActionResult GetTasks()
    {
        return Ok(mockData.GetTasks());
    }

    [HttpPost]
    public IActionResult CreateTask([FromBody] CreateTaskRequest request)
    {
        var task = mockData.CreateTask(request.Name, request.Type, request.Instruction);
        return Ok(task);
    }
}

public class CreateTaskRequest
{
    public string Name { get; set; } = "";
    public string Type { get; set; } = "";
    public string Instruction { get; set; } = "";
}
