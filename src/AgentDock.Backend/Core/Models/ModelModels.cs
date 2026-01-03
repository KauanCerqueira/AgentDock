namespace AgentDock.Backend.Core.Models;

/// <summary>
/// Informações sobre um modelo instalado no Ollama
/// </summary>
public class ModelInfo
{
    public string Name { get; set; } = string.Empty;
    public string ModifiedAt { get; set; } = string.Empty;
    public long Size { get; set; }
    public string Digest { get; set; } = string.Empty;
    public ModelDetails? Details { get; set; }
}

public class ModelDetails
{
    public string Format { get; set; } = string.Empty;
    public string Family { get; set; } = string.Empty;
    public string ParameterSize { get; set; } = string.Empty;
    public string QuantizationLevel { get; set; } = string.Empty;
}

/// <summary>
/// Resposta da API de listagem de modelos
/// </summary>
public class ListModelsResponse
{
    public List<ModelInfo> Models { get; set; } = new();
}

/// <summary>
/// Requisição para baixar/puxar um modelo
/// </summary>
public class PullModelRequest
{
    public string Name { get; set; } = string.Empty;
    public bool Stream { get; set; } = true;
}

/// <summary>
/// Resposta de progresso do download de modelo
/// </summary>
public class PullModelResponse
{
    public string Status { get; set; } = string.Empty;
    public string Digest { get; set; } = string.Empty;
    public long Total { get; set; }
    public long Completed { get; set; }
}
