using AgentDock.Backend.Core.Models;

namespace AgentDock.Backend.Core.Interfaces;

/// <summary>
/// Interface para comunicação com o motor de IA local (llama.cpp)
/// </summary>
public interface ILlamaService
{
    /// <summary>
    /// Envia uma mensagem de chat e retorna a resposta completa
    /// </summary>
    Task<ChatResponse> ChatAsync(ChatRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Envia uma mensagem de chat com streaming (para respostas em tempo real)
    /// </summary>
    IAsyncEnumerable<ChatResponse> ChatStreamAsync(ChatRequest request, CancellationToken cancellationToken = default);

    /// <summary>
    /// Lista todos os modelos GGUF disponíveis localmente
    /// </summary>
    Task<ListModelsResponse> ListModelsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Carrega um modelo GGUF na memória
    /// </summary>
    Task<bool> LoadModelAsync(string modelPath, CancellationToken cancellationToken = default);

    /// <summary>
    /// Verifica se o motor de IA está online e acessível
    /// </summary>
    Task<bool> IsHealthyAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Obtém informações sobre o servidor
    /// </summary>
    Task<string> GetVersionAsync(CancellationToken cancellationToken = default);
}
