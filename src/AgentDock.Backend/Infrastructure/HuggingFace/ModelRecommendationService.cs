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
        ["tinyllama"] = new() { 
            Name = "TinyLlama 1.1B", 
            UseCase = "Modelo ultra-compacto para hardware muito limitado",
            MinParams = 1,
            Strengths = new() { "Extremamente rápido", "Mínimo de RAM", "Bom para testes" }
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

        _logger.LogInformation("=== INICIANDO GERAÇÃO DE SUGESTÕES ===");
        _logger.LogInformation("Hardware: {RAM}GB RAM disponível, {TotalRAM}GB RAM total", 
            systemStats.AvailableMemoryGb, 
            systemStats.TotalMemoryGb);
        _logger.LogInformation("GPU: {GPU}", 
            systemStats.GpuInfo?.Name ?? "Nenhuma GPU detectada");

        // Determinar categoria de hardware
        var hardwareCategory = DetermineHardwareCategory(systemStats);
        _logger.LogInformation("Categoria de hardware determinada: {Category}", hardwareCategory);

        // Buscar modelos recomendados baseado no hardware
        var recommendedModelIds = GetRecommendedModelIds(hardwareCategory, useCase);
        _logger.LogInformation("Modelos recomendados para buscar: {Count} modelos", recommendedModelIds.Count);
        foreach (var modelId in recommendedModelIds)
        {
            _logger.LogInformation("  - {ModelId}", modelId);
        }

        var processedCount = 0;
        var errorCount = 0;
        var compatibleCount = 0;

        foreach (var modelId in recommendedModelIds)
        {
            try
            {
                processedCount++;
                _logger.LogInformation("[{Current}/{Total}] Buscando arquivos para: {ModelId}", 
                    processedCount, recommendedModelIds.Count, modelId);
                
                var files = await _huggingFaceService.ListModelFilesAsync(modelId);
                
                _logger.LogInformation("  ? Encontrados {Count} arquivos GGUF", files.Count);
                
                if (files.Count == 0)
                {
                    _logger.LogWarning("  ?? Nenhum arquivo GGUF encontrado para {ModelId}", modelId);
                    continue;
                }
                
                foreach (var file in files)
                {
                    if (file.Requirements == null)
                    {
                        _logger.LogWarning("  ?? Arquivo sem requirements: {Filename}", file.Filename);
                        continue;
                    }

                    var compatibility = _huggingFaceService.CheckCompatibility(
                        file.Requirements,
                        systemStats.AvailableMemoryGb,
                        systemStats.GpuInfo?.MemoryTotalGb
                    );

                    // Calcular score baseado em compatibilidade e hardware
                    var score = CalculateScore(file.Requirements, compatibility, hardwareCategory);

                    _logger.LogInformation("    Arquivo: {Filename}", file.Filename);
                    _logger.LogInformation("      RAM necessária: {RAM}GB, Compatibilidade: {Level}, Score: {Score}", 
                        file.Requirements.MinRamGb, 
                        compatibility.Level, 
                        score);

                    if (compatibility.CanRun && score > 50)
                    {
                        compatibleCount++;
                        var suggestion = CreateSuggestion(
                            modelId, 
                            file, 
                            compatibility, 
                            hardwareCategory,
                            score
                        );

                        suggestions.Add(suggestion);
                        _logger.LogInformation("      ? ADICIONADO como sugestão (Score: {Score})", score);
                    }
                    else
                    {
                        _logger.LogInformation("      ? Rejeitado - CanRun: {CanRun}, Score: {Score}", 
                            compatibility.CanRun, score);
                        if (compatibility.Warnings.Any())
                        {
                            _logger.LogInformation("      Avisos: {Warnings}", 
                                string.Join(", ", compatibility.Warnings));
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                errorCount++;
                _logger.LogError(ex, "? Erro ao buscar sugestões para {ModelId}: {Error}", 
                    modelId, ex.Message);
            }
        }

        _logger.LogInformation("=== RESULTADO FINAL ===");
        _logger.LogInformation("Modelos processados: {Processed}/{Total}", processedCount, recommendedModelIds.Count);
        _logger.LogInformation("Erros encontrados: {Errors}", errorCount);
        _logger.LogInformation("Arquivos compatíveis encontrados: {Compatible}", compatibleCount);
        _logger.LogInformation("Sugestões geradas: {Suggestions}", suggestions.Count);

        // Se não encontrou nenhuma sugestão, tentar modelos fallback
        if (suggestions.Count == 0)
        {
            _logger.LogWarning("?? Nenhuma sugestão encontrada com modelos primários. Tentando fallback...");
            
            var fallbackModels = new List<string>
            {
                "TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF",  // Muito compacto, funciona em qualquer hardware
                "TheBloke/phi-2-GGUF"                       // Compacto e de alta qualidade
            };

            foreach (var fallbackModel in fallbackModels)
            {
                try
                {
                    _logger.LogInformation("Tentando fallback: {ModelId}", fallbackModel);
                    var files = await _huggingFaceService.ListModelFilesAsync(fallbackModel);
                    
                    foreach (var file in files)
                    {
                        if (file.Requirements == null) continue;

                        var compatibility = _huggingFaceService.CheckCompatibility(
                            file.Requirements,
                            systemStats.AvailableMemoryGb,
                            systemStats.GpuInfo?.MemoryTotalGb
                        );

                        if (compatibility.CanRun)
                        {
                            var score = CalculateScore(file.Requirements, compatibility, hardwareCategory);
                            var suggestion = CreateSuggestion(fallbackModel, file, compatibility, hardwareCategory, score);
                            suggestions.Add(suggestion);
                            _logger.LogInformation("  ? Fallback adicionado: {Filename} (Score: {Score})", file.Filename, score);
                            
                            if (suggestions.Count >= maxSuggestions)
                                break;
                        }
                    }
                    
                    if (suggestions.Count >= maxSuggestions)
                        break;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Fallback falhou para {ModelId}", fallbackModel);
                }
            }
        }

        // Ordenar por score e retornar top N
        var result = suggestions
            .OrderByDescending(s => s.Score)
            .Take(maxSuggestions)
            .ToList();

        _logger.LogInformation("Retornando top {Count} sugestões", result.Count);
        foreach (var suggestion in result)
        {
            _logger.LogInformation("  ? {ModelId} / {Filename} (Score: {Score})", 
                suggestion.ModelId, suggestion.Filename, suggestion.Score);
        }

        return result;
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

        // Modelos GGUF recomendados por categoria
        // Usando repositórios TheBloke que contêm conversões GGUF
        switch (category)
        {
            case HardwareCategory.High:
                models.AddRange(new[] { 
                    "TheBloke/Llama-2-13B-chat-GGUF",
                    "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
                    "TheBloke/CodeLlama-13B-Instruct-GGUF"
                });
                break;
            
            case HardwareCategory.MediumHigh:
            case HardwareCategory.Medium:
                models.AddRange(new[] { 
                    "TheBloke/Llama-2-7B-Chat-GGUF",
                    "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
                    "TheBloke/CodeLlama-7B-Instruct-GGUF",
                    "TheBloke/neural-chat-7B-v3-1-GGUF"
                });
                break;
            
            case HardwareCategory.Low:
                models.AddRange(new[] { 
                    "TheBloke/phi-2-GGUF",
                    "TheBloke/Llama-2-7B-Chat-GGUF",
                    "TheBloke/Mistral-7B-Instruct-v0.2-GGUF",
                    "TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF"
                });
                break;
            
            case HardwareCategory.VeryLow:
                models.AddRange(new[] { 
                    "TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF",
                    "TheBloke/phi-2-GGUF"
                });
                break;
        }

        // Filtrar por caso de uso se especificado
        if (!string.IsNullOrEmpty(useCase))
        {
            if (useCase.ToLower().Contains("code") || useCase.ToLower().Contains("program"))
            {
                models = models.Where(m => m.Contains("codellama", StringComparison.OrdinalIgnoreCase) || 
                                          m.Contains("code", StringComparison.OrdinalIgnoreCase)).ToList();
                if (models.Count == 0)
                    models.Add("TheBloke/CodeLlama-7B-Instruct-GGUF");
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
