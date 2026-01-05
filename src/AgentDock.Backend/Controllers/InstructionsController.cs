using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InstructionsController(MockDataService mockData) : ControllerBase
{
    [HttpGet]
    public IActionResult GetInstructions()
    {
        return Ok(mockData.GetInstructions());
    }

    [HttpGet("{id}")]
    public IActionResult GetInstruction(string id)
    {
        var instruction = mockData.GetInstruction(id);
        if (instruction == null) return NotFound();
        return Ok(instruction);
    }

    [HttpPost]
    public IActionResult CreateInstruction([FromBody] CreateInstructionRequest request)
    {
        var instruction = mockData.CreateInstruction(
            request.Name,
            request.Description,
            request.Content,
            request.Category
        );
        return CreatedAtAction(nameof(GetInstruction), new { id = instruction.Id }, instruction);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateInstruction(string id, [FromBody] UpdateInstructionRequest request)
    {
        var instruction = mockData.UpdateInstruction(
            id,
            request.Name,
            request.Description,
            request.Content,
            request.Category,
            request.IsEnabled
        );
        if (instruction == null) return NotFound();
        return Ok(instruction);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteInstruction(string id)
    {
        var instruction = mockData.GetInstruction(id);
        if (instruction == null) return NotFound();
        mockData.DeleteInstruction(id);
        return NoContent();
    }

    [HttpPost("{id}/toggle")]
    public IActionResult ToggleInstruction(string id)
    {
        var instruction = mockData.GetInstruction(id);
        if (instruction == null) return NotFound();
        mockData.ToggleInstruction(id);
        return Ok(mockData.GetInstruction(id));
    }

    [HttpPost("reorder")]
    public IActionResult ReorderInstructions([FromBody] ReorderRequest request)
    {
        mockData.ReorderInstructions(request.InstructionIds);
        return Ok();
    }
}

public class CreateInstructionRequest
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Content { get; set; } = "";
    public string Category { get; set; } = "general";
}

public class UpdateInstructionRequest
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Content { get; set; } = "";
    public string Category { get; set; } = "general";
    public bool IsEnabled { get; set; } = true;
}

public class ReorderRequest
{
    public List<string> InstructionIds { get; set; } = new();
}
