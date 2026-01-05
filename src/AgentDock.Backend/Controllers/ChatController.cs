using AgentDock.Backend.Core.Interfaces;
using AgentDock.Backend.Core.Models;
using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly ILlamaService _llamaService;
    private readonly DashboardStatsService _dashboardStats;
    private readonly ILogger<ChatController> _logger;

    public ChatController(
        ILlamaService llamaService, 
        DashboardStatsService dashboardStats,
        ILogger<ChatController> logger)
    {
        _llamaService = llamaService;
        _dashboardStats = dashboardStats;
        _logger = logger;
    }

    /// <summary>
    /// Envia uma mensagem para o modelo de IA (com suporte a conversação)
    /// </summary>
    [HttpPost("send")]
    public async Task<IActionResult> SendMessage(
        [FromBody] ChatRequest request,
        CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();
        
        try
        {
            if (request.Stream)
            {
                return BadRequest("Use /api/chat/stream for streaming responses");
            }

            var response = await _llamaService.ChatAsync(request, cancellationToken);
            stopwatch.Stop();
            
            // Estimar tokens
            var inputTokens = EstimateTokens(request.Messages?.LastOrDefault()?.Content ?? "");
            var outputTokens = EstimateTokens(response.Message?.Content ?? "");
            
            // Registrar estatísticas de sucesso
            _dashboardStats.RecordChatRequest(
                request.Model,
                inputTokens,
                outputTokens,
                stopwatch.ElapsedMilliseconds,
                true
            );
            
            _logger.LogInformation("Chat request completed: {InputTokens} input, {OutputTokens} output, {Time}ms",
                inputTokens, outputTokens, stopwatch.ElapsedMilliseconds);
            
            return Ok(response);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();
            
            // Registrar estatísticas de erro
            _dashboardStats.RecordChatRequest(request.Model, 0, 0, stopwatch.ElapsedMilliseconds, false);
            
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
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var stopwatch = Stopwatch.StartNew();
        var totalContent = "";
        
        await foreach (var chunk in _llamaService.ChatStreamAsync(request, cancellationToken))
        {
            totalContent += chunk.Message?.Content ?? "";
            yield return System.Text.Json.JsonSerializer.Serialize(chunk);
        }
        
        stopwatch.Stop();
        
        // Registrar estatísticas
        var inputTokens = EstimateTokens(request.Messages?.LastOrDefault()?.Content ?? "");
        var outputTokens = EstimateTokens(totalContent);
        
        _dashboardStats.RecordChatRequest(
            request.Model,
            inputTokens,
            outputTokens,
            stopwatch.ElapsedMilliseconds,
            true
        );
    }

    /// <summary>
    /// Endpoint simplificado para compatibilidade com o frontend atual
    /// </summary>
    [HttpGet("history")]
    public IActionResult GetHistory()
    {
        // Retornar lista vazia - usar /api/conversations para histórico real
        return Ok(new List<Core.Models.ChatMessage>());
    }
    
    /// <summary>
    /// Estima o número de tokens baseado no texto (aproximação simples)
    /// </summary>
    private int EstimateTokens(string text)
    {
        if (string.IsNullOrEmpty(text)) return 0;
        
        // Aproximação: ~4 caracteres por token em inglês, ~2-3 para português
        // Usando ~3.5 como média
        return (int)Math.Ceiling(text.Length / 3.5);
    }
}
