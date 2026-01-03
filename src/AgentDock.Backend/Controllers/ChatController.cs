using AgentDock.Backend.Core.Interfaces;
using AgentDock.Backend.Core.Models;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ILlamaService _llamaService;
    private readonly ILogger<ChatController> _logger;

    public ChatController(ILlamaService llamaService, ILogger<ChatController> logger)
    {
        _llamaService = llamaService;
        _logger = logger;
    }

    /// <summary>
    /// Envia uma mensagem para o modelo de IA
    /// </summary>
    [HttpPost("send")]
    public async Task<IActionResult> SendMessage(
        [FromBody] ChatRequest request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (request.Stream)
            {
                return BadRequest("Use /api/chat/stream for streaming responses");
            }

            var response = await _llamaService.ChatAsync(request, cancellationToken);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            return StatusCode(500, new { error = "Failed to communicate with AI", details = ex.Message });
        }
    }

    /// <summary>
    /// Envia uma mensagem com resposta em streaming
    /// </summary>
    [HttpPost("stream")]
    public async IAsyncEnumerable<string> StreamMessage(
        [FromBody] ChatRequest request,
        [EnumeratorCancellation] CancellationToken cancellationToken)
    {
        await foreach (var chunk in _llamaService.ChatStreamAsync(request, cancellationToken))
        {
            yield return System.Text.Json.JsonSerializer.Serialize(chunk);
        }
    }

    /// <summary>
    /// Endpoint simplificado para compatibilidade com o frontend atual
    /// </summary>
    [HttpGet("history")]
    public IActionResult GetHistory()
    {
        // TODO: Implementar persistência de histórico (SQLite, arquivo JSON, etc.)
        return Ok(new List<ChatMessage>());
    }
}
