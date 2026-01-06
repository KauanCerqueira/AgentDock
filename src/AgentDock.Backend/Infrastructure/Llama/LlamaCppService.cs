using AgentDock.Backend.Core.Interfaces;
using AgentDock.Backend.Core.Models;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Hosting;

namespace AgentDock.Backend.Infrastructure.Llama;

/// <summary>
/// Implementa��o simples de comunica��o com llama.cpp server
/// </summary>
public class LlamaCppService : ILlamaService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<LlamaCppService> _logger;
    private readonly string _baseUrl;
    private readonly string _modelsPath;
    private readonly string? _defaultModelName;

    public LlamaCppService(
        HttpClient httpClient,
        ILogger<LlamaCppService> logger,
        IConfiguration configuration,
        IHostEnvironment environment)
    {
        _httpClient = httpClient;
        _logger = logger;
        _defaultModelName = configuration["Llama:DefaultModel"];

        var configuredModelsPath = configuration.GetValue<string>("Llama:ModelsPath") ?? "models";
        var primaryModelsPath = ResolvePath(configuredModelsPath, environment.ContentRootPath);
        if (!Directory.Exists(primaryModelsPath))
        {
            var runtimeModelsPath = ResolvePath(configuredModelsPath, AppDomain.CurrentDomain.BaseDirectory);
            if (Directory.Exists(runtimeModelsPath))
            {
                primaryModelsPath = runtimeModelsPath;
            }
        }

        _modelsPath = primaryModelsPath;
        Directory.CreateDirectory(_modelsPath);

        var configuredPort = configuration.GetValue<int?>("Llama:Port");
        var configuredBaseUrl = configuration["Llama:BaseUrl"];
        _baseUrl = string.IsNullOrWhiteSpace(configuredBaseUrl)
            ? $"http://127.0.0.1:{configuredPort ?? 8080}"
            : configuredBaseUrl;
        
        _httpClient.BaseAddress = new Uri(_baseUrl);
        _httpClient.Timeout = TimeSpan.FromMinutes(5);
    }

    public async Task<ChatResponse> ChatAsync(ChatRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Sending chat request to llama.cpp: Model={Model}", request.Model);

            var modelName = string.IsNullOrWhiteSpace(request.Model)
                ? _defaultModelName ?? "default"
                : request.Model;

            // llama.cpp usa formato OpenAI-compatible
            var llamaRequest = new
            {
                model = modelName,
                messages = request.Messages,
                temperature = request.Options?.Temperature ?? 0.7,
                max_tokens = request.Options?.NumPredict ?? 2048,
                stream = false
            };

            var response = await _httpClient.PostAsJsonAsync("/v1/chat/completions", llamaRequest, cancellationToken);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<LlamaResponse>(cancellationToken);
            
            return new ChatResponse
            {
                Model = request.Model,
                Message = new ChatMessage 
                { 
                    Role = "assistant", 
                    Content = result?.Choices[0]?.Message?.Content ?? "" 
                },
                Done = true,
                CreatedAt = DateTime.UtcNow.ToString("o")
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error communicating with llama.cpp");
            throw;
        }
    }

    public async IAsyncEnumerable<ChatResponse> ChatStreamAsync(
        ChatRequest request,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var llamaRequest = new
        {
            model = string.IsNullOrWhiteSpace(request.Model)
                ? _defaultModelName ?? "default"
                : request.Model,
            messages = request.Messages,
            temperature = request.Options?.Temperature ?? 0.7,
            max_tokens = request.Options?.NumPredict ?? 2048,
            stream = true
        };

        var content = new StringContent(
            JsonSerializer.Serialize(llamaRequest),
            Encoding.UTF8,
            "application/json");

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/v1/chat/completions")
        {
            Content = content
        };

        using var response = await _httpClient.SendAsync(
            httpRequest,
            HttpCompletionOption.ResponseHeadersRead,
            cancellationToken);

        response.EnsureSuccessStatusCode();

        using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var reader = new StreamReader(stream);

        while (!reader.EndOfStream && !cancellationToken.IsCancellationRequested)
        {
            var line = await reader.ReadLineAsync(cancellationToken);
            if (string.IsNullOrWhiteSpace(line) || !line.StartsWith("data: ")) continue;

            var jsonData = line.Substring(6); // Remove "data: "
            if (jsonData == "[DONE]") break;

            LlamaStreamChunk? chunk = null;
            try
            {
                chunk = JsonSerializer.Deserialize<LlamaStreamChunk>(jsonData);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse streaming chunk: {Line}", jsonData);
                continue;
            }

            if (chunk?.Choices?[0]?.Delta?.Content != null)
            {
                yield return new ChatResponse
                {
                    Model = request.Model,
                    Message = new ChatMessage 
                    { 
                        Role = "assistant", 
                        Content = chunk.Choices[0].Delta.Content 
                    },
                    Done = false
                };
            }
        }

        yield return new ChatResponse
        {
            Model = request.Model,
            Message = new ChatMessage { Role = "assistant", Content = "" },
            Done = true
        };
    }

    public async Task<ListModelsResponse> ListModelsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            // Escanear pasta de modelos por arquivos .gguf
            if (!Directory.Exists(_modelsPath))
            {
                Directory.CreateDirectory(_modelsPath);
                return new ListModelsResponse();
            }

            var ggufFiles = Directory.GetFiles(_modelsPath, "*.gguf");
            var models = ggufFiles.Select(f => new ModelInfo
            {
                Name = Path.GetFileNameWithoutExtension(f),
                Path = f,
                Size = new FileInfo(f).Length,
                ModifiedAt = File.GetLastWriteTime(f).ToString("o")
            }).ToList();

            return new ListModelsResponse { Models = models };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error listing models");
            return new ListModelsResponse();
        }
    }

    public async Task<bool> LoadModelAsync(string modelPath, CancellationToken cancellationToken = default)
    {
        var fullPath = Path.IsPathRooted(modelPath)
            ? modelPath
            : Path.Combine(_modelsPath, modelPath);

        if (!File.Exists(fullPath))
        {
            _logger.LogWarning("Requested model not found on disk: {ModelPath}", fullPath);
            return false;
        }

        // llama-server today loads a single model at startup; acknowledge request for visibility
        _logger.LogInformation("Model load requested. Ensure llama-server is running with: {ModelPath}", fullPath);
        await Task.CompletedTask;
        return true;
    }

    public async Task<bool> IsHealthyAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("/health", cancellationToken);
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public async Task<string> GetVersionAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("/v1/models", cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                return "llama.cpp server";
            }
            return "Unknown";
        }
        catch
        {
            return "Unknown";
        }
    }

    // DTOs para llama.cpp (formato OpenAI)
    private class LlamaResponse
    {
        public List<Choice>? Choices { get; set; }
    }

    private class Choice
    {
        public Message? Message { get; set; }
    }

    private class Message
    {
        public string? Content { get; set; }
    }

    private class LlamaStreamChunk
    {
        public List<StreamChoice>? Choices { get; set; }
    }

    private class StreamChoice
    {
        public Delta? Delta { get; set; }
    }

    private class Delta
    {
        public string? Content { get; set; }
    }

    private static string ResolvePath(string path, string contentRoot)
    {
        if (string.IsNullOrWhiteSpace(path))
            return Path.Combine(contentRoot, "models");

        return Path.IsPathRooted(path)
            ? path
            : Path.GetFullPath(Path.Combine(contentRoot, path));
    }
}
