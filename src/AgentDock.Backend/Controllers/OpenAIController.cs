using AgentDock.Backend.Core.Interfaces;
using AgentDock.Backend.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("v1")]
public class OpenAIController : ControllerBase
{
    private readonly ILlamaService _llamaService;
    private readonly ILogger<OpenAIController> _logger;

    public OpenAIController(ILlamaService llamaService, ILogger<OpenAIController> logger)
    {
        _llamaService = llamaService;
        _logger = logger;
    }

    [HttpPost("chat/completions")]
    public async Task<IActionResult> ChatCompletions([FromBody] OpenAIChatRequest request, CancellationToken ct)
    {
        // Map OpenAI request to internal ChatRequest
        var internalRequest = new ChatRequest
        {
            Model = request.Model,
            Messages = request.Messages.Select(m => new ChatMessage { Role = m.Role, Content = m.Content }).ToList(),
            Stream = request.Stream ?? false,
            Options = new ChatOptions
            {
                Temperature = request.Temperature,
                NumPredict = request.MaxTokens,
                TopP = request.TopP,
            }
        };

        if (internalRequest.Stream)
        {
            Response.Headers.Append("Content-Type", "text/event-stream");
            Response.Headers.Append("Cache-Control", "no-cache");
            Response.Headers.Append("Connection", "keep-alive");

            var id = $"chatcmpl-{Guid.NewGuid()}";
            var created = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            // Send initial role chunk
            var roleChunk = new OpenAIChatResponse
            {
                Id = id,
                Created = created,
                Model = request.Model,
                Choices = new List<OpenAIChatChoice>
                {
                    new OpenAIChatChoice
                    {
                        Index = 0,
                        Delta = new OpenAIChatMessage { Role = "assistant", Content = "" },
                        FinishReason = null
                    }
                }
            };
            await Response.WriteAsync($"data: {JsonSerializer.Serialize(roleChunk)}\n\n", ct);

            await foreach (var chunk in _llamaService.ChatStreamAsync(internalRequest, ct))
            {
                if (chunk.Done) continue; // Skip the done marker from service if it's just empty

                var openAiChunk = new OpenAIChatResponse
                {
                    Id = id,
                    Created = created,
                    Model = request.Model,
                    Choices = new List<OpenAIChatChoice>
                    {
                        new OpenAIChatChoice
                        {
                            Index = 0,
                            Delta = new OpenAIChatMessage
                            {
                                Content = chunk.Message.Content
                            },
                            FinishReason = null
                        }
                    }
                };

                var json = JsonSerializer.Serialize(openAiChunk);
                await Response.WriteAsync($"data: {json}\n\n", ct);
                await Response.Body.FlushAsync(ct);
            }

            // Send [DONE] chunk with finish_reason
            var doneChunk = new OpenAIChatResponse
            {
                Id = id,
                Created = created,
                Model = request.Model,
                Choices = new List<OpenAIChatChoice>
                {
                    new OpenAIChatChoice
                    {
                        Index = 0,
                        Delta = new OpenAIChatMessage { Content = "" },
                        FinishReason = "stop"
                    }
                }
            };
            await Response.WriteAsync($"data: {JsonSerializer.Serialize(doneChunk)}\n\n", ct);
            await Response.WriteAsync("data: [DONE]\n\n", ct);
            
            return new EmptyResult();
        }
        else
        {
            var result = await _llamaService.ChatAsync(internalRequest, ct);
            
            var response = new OpenAIChatResponse
            {
                Id = $"chatcmpl-{Guid.NewGuid()}",
                Created = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                Model = request.Model,
                Choices = new List<OpenAIChatChoice>
                {
                    new OpenAIChatChoice
                    {
                        Index = 0,
                        Message = new OpenAIChatMessage
                        {
                            Role = result.Message.Role,
                            Content = result.Message.Content
                        },
                        FinishReason = "stop"
                    }
                },
                Usage = new OpenAIUsage
                {
                    PromptTokens = (int)(result.PromptEvalCount ?? 0),
                    CompletionTokens = (int)(result.EvalCount ?? 0),
                    TotalTokens = (int)((result.PromptEvalCount ?? 0) + (result.EvalCount ?? 0))
                }
            };

            return Ok(response);
        }
    }
    
    [HttpGet("models")]
    public async Task<IActionResult> ListModels(CancellationToken ct)
    {
        try 
        {
            var result = await _llamaService.ListModelsAsync(ct);
            
            var response = new 
            {
                @object = "list",
                data = result.Models.Select(m => new 
                { 
                    id = m.Name, 
                    @object = "model", 
                    created = DateTimeOffset.UtcNow.ToUnixTimeSeconds(), 
                    owned_by = "user" 
                }).ToArray()
            };
            
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing models");
            return StatusCode(500, new { error = "Failed to list models" });
        }
    }
}
