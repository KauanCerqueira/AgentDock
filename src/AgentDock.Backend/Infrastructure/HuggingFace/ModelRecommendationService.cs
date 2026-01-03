using AgentDock.Backend.Services;

namespace AgentDock.Backend.Infrastructure.HuggingFace;

/// <summary>
/// Sugestão de modelo personalizada
/// </summary>
public class ModelSuggestion
{
    public string ModelId { get; set; } = string.Empty;
    public string Filename { get; set; } = string.Empty;
    public string Reason { get; set; } = string.Empty;
    public int Score { get; set; }
    public ModelRequirements Requirements { get; set; } = new();
    public HardwareCompatibility Compatibility { get; set; } = new();
    public List<string> Pros { get; set; } = new();
    public List<string> Cons { get; set; } = new();
    public string UseCase { get; set; } = string.Empty;
}

/// <summary>
/// Serviço de recomendação inteligente de modelos
/// </summary>
public class ModelRecommendationService
{
    private readonly HuggingFaceService _huggingFaceService;
    private readonly SystemMonitorService _systemMonitor;
    private readonly ILogger<ModelRecommendationService> _logger;

    // Modelos populares conhecidos com casos de uso
    private readonly Dictionary<string, ModelProfile> _knownModels = new()
    {
        ["llama-2-7b"] = new() { 
            Name = "Llama 2 7B", 
            UseCase = "Chat geral e assistente",
            MinParams = 7,
            Strengths = new() { "Conversação natural", "Seguir instruções", "Multilíngue" }
        },
        ["llama-2-13b"] = new() { 
            Name = "Llama 2 13B", 
            UseCase = "Chat avançado e tarefas complexas",
            MinParams = 13,
            Strengths = new() { "Raciocínio avançado", "Contexto longo", "Maior precisão" }
        },
        ["codellama"] = new() { 
            Name = "Code Llama", 
            UseCase = "Programação e código",
            MinParams = 7,
            Strengths = new() { "Geração de código", "Debug", "Explicações técnicas" }
        },
        ["mistral"] = new() { 
            Name = "Mistral 7B", 
            UseCase = "Chat rápido e eficiente",
            MinParams = 7,
            Strengths = new() { "Velocidade", "Qualidade alta", "Baixo consumo" }
        },
        ["phi-2"] = new() { 
            Name = "Phi-2", 
            UseCase = "Modelo compacto para hardware limitado",
            MinParams = 2,
            Strengths = new() { "Muito rápido", "Pouca RAM", "Boa qualidade" }
        },
        ["neural-chat"] = new() { 
            Name = "Neural Chat", 
            UseCase = "Conversação natural",
            MinParams = 7,
            Strengths = new() { "Respostas naturais", "Contexto", "Amigável" }
        }
    };

    public ModelRecommendationService(
        HuggingFaceService huggingFaceService,
        SystemMonitorService systemMonitor,
        ILogger<ModelRecommendationService> logger)
    {
        _huggingFaceService = huggingFaceService;
        _systemMonitor = systemMonitor;
        _logger = logger;
    }

    /// <summary>
    /// Obtém sugestões personalizadas baseadas no hardware do usuário
    /// </summary>
    public async Task<List<ModelSuggestion>> GetPersonalizedSuggestionsAsync(string? useCase = null, int maxSuggestions = 5)
    {
        var systemStats = _systemMonitor.GetSystemStats();
        var suggestions = new List<ModelSuggestion>();

        _logger.LogInformation("Generating suggestions for hardware: {RAM}GB RAM, {GPU}", 
            systemStats.AvailableMemoryGb, 
            systemStats.GpuInfo?.Name ?? "No GPU");

        // Determinar categoria de hardware
        var hardwareCategory = DetermineHardwareCategory(systemStats);

        // Buscar modelos recomendados baseado no hardware
        var recommendedModelIds = GetRecommendedModelIds(hardwareCategory, useCase);

        foreach (var modelId in recommendedModelIds)
        {
            try
            {
                var files = await _huggingFaceService.ListModelFilesAsync(modelId);
                
                foreach (var file in files)
                {
                    if (file.Requirements == null) continue;

                    var compatibility = _huggingFaceService.CheckCompatibility(
                        file.Requirements,
                        systemStats.AvailableMemoryGb,
                        systemStats.GpuInfo?.MemoryTotalGb
                    );

                    // Calcular score baseado em compatibilidade e hardware
                    var score = CalculateScore(file.Requirements, compatibility, hardwareCategory);

                    if (compatibility.CanRun && score > 50) // Apenas modelos viáveis
                    {
                        var suggestion = CreateSuggestion(
                            modelId, 
                            file, 
                            compatibility, 
                            hardwareCategory,
                            score
                        );

                        suggestions.Add(suggestion);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get suggestions for {ModelId}", modelId);
            }
        }

        // Ordenar por score e retornar top N
        return suggestions
            .OrderByDescending(s => s.Score)
            .Take(maxSuggestions)
            .ToList();
    }

    private HardwareCategory DetermineHardwareCategory(SystemStats stats)
    {
        var ramGb = stats.AvailableMemoryGb;
        var hasGpu = stats.GpuInfo != null && stats.GpuInfo.MemoryTotalGb > 4;
        var vramGb = stats.GpuInfo?.MemoryTotalGb ?? 0;

        if (ramGb >= 24 && hasGpu && vramGb >= 16)
            return HardwareCategory.High;
        
        if (ramGb >= 16 && hasGpu && vramGb >= 8)
            return HardwareCategory.MediumHigh;
        
        if (ramGb >= 12 || hasGpu)
            return HardwareCategory.Medium;
        
        if (ramGb >= 8)
            return HardwareCategory.Low;
        
        return HardwareCategory.VeryLow;
    }

    private List<string> GetRecommendedModelIds(HardwareCategory category, string? useCase)
    {
        var models = new List<string>();

        // Modelos base recomendados por categoria
        switch (category)
        {
            case HardwareCategory.High:
                models.AddRange(new[] { 
                    "meta-llama/Llama-2-13b-chat-hf",
                    "mistralai/Mistral-7B-Instruct-v0.2",
                    "codellama/CodeLlama-13b-Instruct-hf"
                });
                break;
            
            case HardwareCategory.MediumHigh:
            case HardwareCategory.Medium:
                models.AddRange(new[] { 
                    "meta-llama/Llama-2-7b-chat-hf",
                    "mistralai/Mistral-7B-Instruct-v0.2",
                    "codellama/CodeLlama-7b-Instruct-hf",
                    "Intel/neural-chat-7b-v3-1"
                });
                break;
            
            case HardwareCategory.Low:
                models.AddRange(new[] { 
                    "microsoft/phi-2",
                    "meta-llama/Llama-2-7b-chat-hf",
                    "mistralai/Mistral-7B-Instruct-v0.2"
                });
                break;
            
            case HardwareCategory.VeryLow:
                models.AddRange(new[] { 
                    "microsoft/phi-2"
                });
                break;
        }

        // Filtrar por caso de uso se especificado
        if (!string.IsNullOrEmpty(useCase))
        {
            if (useCase.ToLower().Contains("code") || useCase.ToLower().Contains("program"))
            {
                models = models.Where(m => m.Contains("codellama", StringComparison.OrdinalIgnoreCase)).ToList();
                if (models.Count == 0)
                    models.Add("codellama/CodeLlama-7b-Instruct-hf");
            }
        }

        return models;
    }

    private int CalculateScore(ModelRequirements requirements, HardwareCompatibility compatibility, HardwareCategory category)
    {
        var score = 0;

        // Score base por compatibilidade
        score += compatibility.Level switch
        {
            CompatibilityLevel.Excellent => 100,
            CompatibilityLevel.Good => 80,
            CompatibilityLevel.Adequate => 60,
            CompatibilityLevel.Poor => 40,
            _ => 0
        };

        // Bonus por quantização otimizada
        if (requirements.Quantization.Contains("Q4_K_M"))
            score += 20; // Melhor balanceamento
        else if (requirements.Quantization.Contains("Q5_K_M"))
            score += 15;
        else if (requirements.Quantization.Contains("Q4"))
            score += 10;

        // Penalidade por utilização alta de RAM
        if (compatibility.RamUtilizationPercent > 80)
            score -= 20;
        else if (compatibility.RamUtilizationPercent > 60)
            score -= 10;

        // Bonus por GPU disponível
        if (compatibility.VramUtilizationPercent > 0 && compatibility.VramUtilizationPercent < 70)
            score += 15;

        // Ajustar por categoria de hardware
        if (category == HardwareCategory.VeryLow && requirements.ParameterCount > 7)
            score -= 30;

        return Math.Max(0, Math.Min(100, score));
    }

    private ModelSuggestion CreateSuggestion(
        string modelId, 
        HuggingFaceFile file, 
        HardwareCompatibility compatibility,
        HardwareCategory category,
        int score)
    {
        var suggestion = new ModelSuggestion
        {
            ModelId = modelId,
            Filename = file.Filename,
            Requirements = file.Requirements!,
            Compatibility = compatibility,
            Score = score
        };

        // Identificar modelo conhecido
        var knownModel = _knownModels.FirstOrDefault(kv => 
            modelId.Contains(kv.Key, StringComparison.OrdinalIgnoreCase)
        );

        if (knownModel.Value != null)
        {
            suggestion.UseCase = knownModel.Value.UseCase;
            suggestion.Pros.AddRange(knownModel.Value.Strengths);
        }

        // Gerar razão personalizada
        suggestion.Reason = GenerateReason(file.Requirements!, compatibility, category);

        // Adicionar prós baseado em compatibilidade
        if (compatibility.Level == CompatibilityLevel.Excellent)
            suggestion.Pros.Add("Hardware ideal para este modelo");
        
        if (file.Requirements!.Quantization.Contains("Q4_K_M"))
            suggestion.Pros.Add("Quantização otimizada (Q4_K_M)");
        
        if (file.Requirements.ParameterCount <= 7)
            suggestion.Pros.Add("Modelo compacto e rápido");

        // Adicionar contras baseado em avisos
        suggestion.Cons.AddRange(compatibility.Warnings);

        if (compatibility.RamUtilizationPercent > 70)
            suggestion.Cons.Add("Alta utilização de RAM");

        return suggestion;
    }

    private string GenerateReason(ModelRequirements requirements, HardwareCompatibility compatibility, HardwareCategory category)
    {
        var parts = new List<string>();

        // Compatibilidade
        parts.Add(compatibility.Level switch
        {
            CompatibilityLevel.Excellent => "Excelente para seu hardware",
            CompatibilityLevel.Good => "Ótimo para seu hardware",
            CompatibilityLevel.Adequate => "Adequado para seu hardware",
            _ => "Funciona no seu hardware"
        });

        // Tamanho do modelo
        if (requirements.ParameterCount > 0)
        {
            parts.Add($"modelo {requirements.ParameterCount}B");
        }

        // Quantização
        if (requirements.Quantization.Contains("Q4_K_M"))
        {
            parts.Add("com quantização balanceada");
        }

        return string.Join(", ", parts);
    }
}

public enum HardwareCategory
{
    VeryLow,    // < 8GB RAM
    Low,        // 8-12GB RAM
    Medium,     // 12-16GB RAM ou GPU básica
    MediumHigh, // 16-24GB RAM + GPU
    High        // 24GB+ RAM + GPU forte
}

public class ModelProfile
{
    public string Name { get; set; } = string.Empty;
    public string UseCase { get; set; } = string.Empty;
    public int MinParams { get; set; }
    public List<string> Strengths { get; set; } = new();
}
