using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class APIKeysController : ControllerBase
{
    private static List<APIKey> _keys = new()
    {
        new APIKey
        {
            Id = "1",
            Key = "sk-agentdock-admin",
            Name = "Default API Key",
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            LastUsed = DateTime.UtcNow.AddHours(-2),
            RequestCount = 1543,
            IsActive = true
        }
    };

    [HttpGet]
    public IActionResult GetKeys()
    {
        return Ok(_keys);
    }

    [HttpPost]
    public IActionResult CreateKey([FromBody] CreateKeyRequest request)
    {
        var newKey = new APIKey
        {
            Id = Guid.NewGuid().ToString(),
            Key = $"sk-agentdock-{Guid.NewGuid().ToString().Replace("-", "")[..32]}",
            Name = request.Name ?? "Unnamed Key",
            CreatedAt = DateTime.UtcNow,
            RequestCount = 0,
            IsActive = true
        };
        
        _keys.Add(newKey);
        return Ok(newKey);
    }

    [HttpDelete("{id}")]
    public IActionResult RevokeKey(string id)
    {
        var key = _keys.FirstOrDefault(k => k.Id == id);
        if (key == null)
            return NotFound();

        key.IsActive = false;
        return Ok();
    }
}

public class APIKey
{
    public string Id { get; set; } = "";
    public string Key { get; set; } = "";
    public string Name { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public DateTime? LastUsed { get; set; }
    public int RequestCount { get; set; }
    public bool IsActive { get; set; }
}

public class CreateKeyRequest
{
    public string? Name { get; set; }
}
