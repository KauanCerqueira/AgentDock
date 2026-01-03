using AgentDock.Backend.Core.Interfaces;
using AgentDock.Backend.Core.Models;
using System.Net.Http.Json;
using System.Runtime.CompilerServices;
using System.Text;
using System.Text.Json;

namespace AgentDock.Backend.Infrastructure.Ollama;

/// <summary>
/// Implementação do serviço de comunicação com Ollama
/// </summary>
public class OllamaService : IOllamaService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<OllamaService> _logger;
    private readonly string _baseUrl;

    public OllamaService(HttpClient httpClient, ILogger<OllamaService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _baseUrl = configuration["Ollama:BaseUrl"] ?? "http://localhost:11434";
        
        _httpClient.BaseAddress = new Uri(_baseUrl);
        _httpClient.Timeout = TimeSpan.FromMinutes(5); // Modelos grandes podem demorar
    }

    public async Task<ChatResponse> ChatAsync(ChatRequest request, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Sending chat request to Ollama: Model={Model}", request.Model);

            var response = await _httpClient.PostAsJsonAsync("/api/chat", request, cancellationToken);
            response.EnsureSuccessStatusCode();

            var result = await response.Content.ReadFromJsonAsync<ChatResponse>(cancellationToken);
            return result ?? throw new InvalidOperationException("Empty response from Ollama");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error communicating with Ollama");
            throw;
        }
    }

    public async IAsyncEnumerable<ChatResponse> ChatStreamAsync(
        ChatRequest request,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        request.Stream = true;

        var content = new StringContent(
            JsonSerializer.Serialize(request),
            Encoding.UTF8,
            "application/json");

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/api/chat")
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
            if (string.IsNullOrWhiteSpace(line)) continue;

            ChatResponse? chunk;
            try
            {
                chunk = JsonSerializer.Deserialize<ChatResponse>(line);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse streaming chunk: {Line}", line);
                continue;
            }

            if (chunk != null)
            {
                yield return chunk;
                if (chunk.Done) break;
            }
        }
    }

    public async Task<ListModelsResponse> ListModelsAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Fetching model list from Ollama");

            var response = await _httpClient.GetFromJsonAsync<ListModelsResponse>(
                "/api/tags",
                cancellationToken);

            return response ?? new ListModelsResponse();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching models from Ollama");
            throw;
        }
    }

    public async IAsyncEnumerable<PullModelResponse> PullModelAsync(
        PullModelRequest request,
        [EnumeratorCancellation] CancellationToken cancellationToken = default)
    {
        var content = new StringContent(
            JsonSerializer.Serialize(request),
            Encoding.UTF8,
            "application/json");

        using var httpRequest = new HttpRequestMessage(HttpMethod.Post, "/api/pull")
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
            if (string.IsNullOrWhiteSpace(line)) continue;

            PullModelResponse? progress;
            try
            {
                progress = JsonSerializer.Deserialize<PullModelResponse>(line);
            }
            catch (JsonException ex)
            {
                _logger.LogWarning(ex, "Failed to parse pull progress: {Line}", line);
                continue;
            }

            if (progress != null)
            {
                yield return progress;
            }
        }
    }

    public async Task<bool> IsHealthyAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var response = await _httpClient.GetAsync("/", cancellationToken);
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
            var response = await _httpClient.GetAsync("/api/version", cancellationToken);
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync(cancellationToken);
                return content;
            }
            return "Unknown";
        }
        catch
        {
            return "Unknown";
        }
    }
}
