namespace AgentDock.Backend.Core.Models;

/// <summary>
/// Representa uma mensagem de chat entre usuário e IA
/// </summary>
public class ChatMessage
{
    public string Role { get; set; } = "user"; // "user", "assistant", "system"
    public string Content { get; set; } = string.Empty;
}

/// <summary>
/// Requisição de chat para o Ollama
/// </summary>
public class ChatRequest
{
    public string Model { get; set; } = "llama2";
    public List<ChatMessage> Messages { get; set; } = new();
    public bool Stream { get; set; } = false;
    public ChatOptions? Options { get; set; }
}

/// <summary>
/// Opções avançadas para geração
/// </summary>
public class ChatOptions
{
    public double? Temperature { get; set; }
    public int? NumPredict { get; set; } // max_tokens
    public double? TopP { get; set; }
    public int? TopK { get; set; }
}

/// <summary>
/// Resposta de chat do Ollama
/// </summary>
public class ChatResponse
{
    public string Model { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
    public ChatMessage Message { get; set; } = new();
    public bool Done { get; set; }
    public long? TotalDuration { get; set; }
    public long? PromptEvalCount { get; set; }
    public long? EvalCount { get; set; }
}
