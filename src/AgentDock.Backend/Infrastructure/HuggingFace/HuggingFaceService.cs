using System.Text.Json;
using System.Text.Json.Serialization;

namespace AgentDock.Backend.Infrastructure.HuggingFace;

/// <summary>
/// Modelo do HuggingFace
/// </summary>
public class HuggingFaceModel
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;

    [JsonPropertyName("modelId")]
    public string ModelId { get; set; } = string.Empty;

    [JsonPropertyName("sha")]
    public string Sha { get; set; } = string.Empty;

    [JsonPropertyName("downloads")]
    public int Downloads { get; set; }

    [JsonPropertyName("likes")]
    public int Likes { get; set; }

    [JsonPropertyName("tags")]
    public List<string> Tags { get; set; } = new();

    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; set; }

    public List<HuggingFaceFile> Files { get; set; } = new();
}

public class HuggingFaceFile
{
    [JsonPropertyName("path")]
    public string? Path { get; set; }
    
    [JsonPropertyName("rfilename")]
    public string? RFilename { get; set; }
    
    [JsonPropertyName("filename")]
    public string? FileName { get; set; }

    [JsonPropertyName("size")]
    public long Size { get; set; }

    [JsonPropertyName("lfs")]
    public LfsInfo? Lfs { get; set; }
    
    // Nome do arquivo consolidado
    [JsonIgnore]
    public string Filename => Path ?? RFilename ?? FileName ?? string.Empty;
    
    // Tamanho formatado
    public string SizeFormatted { get; set; } = string.Empty;
    
    // Tamanho em bytes (pode vir do LFS ou do campo size direto)
    [JsonIgnore]
    public long SizeBytes => Lfs?.Size ?? Size;
    
    // Requisitos específicos do arquivo
    public ModelRequirements? Requirements { get; set; }
    
    // Compatibilidade com hardware atual
    public HardwareCompatibility? Compatibility { get; set; }
}

public class LfsInfo
{
    [JsonPropertyName("oid")]
    public string Oid { get; set; } = string.Empty;

    [JsonPropertyName("size")]
    public long Size { get; set; }
}

/// <summary>
/// Requisitos de sistema para um modelo
/// </summary>
public class ModelRequirements
{
    public double MinRamGb { get; set; }
    public double RecommendedRamGb { get; set; }
    public double MinVramGb { get; set; }
    public double RecommendedVramGb { get; set; }
    public bool RequiresGpu { get; set; }
    public string ModelSize { get; set; } = string.Empty;
    public int ParameterCount { get; set; }
    public string Quantization { get; set; } = string.Empty;
    public List<string> SupportedPlatforms { get; set; } = new();
}

/// <summary>
/// Comparação entre requisitos e hardware
/// </summary>
public class HardwareCompatibility
{
    public bool CanRun { get; set; }
    public CompatibilityLevel Level { get; set; }
    public List<string> Warnings { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
    public double RamUtilizationPercent { get; set; }
    public double VramUtilizationPercent { get; set; }
    public string PerformanceEstimate { get; set; } = string.Empty;
}

public enum CompatibilityLevel
{
    Excellent,    // Hardware bem acima dos requisitos
    Good,         // Hardware atende recomendados
    Adequate,     // Hardware atende mínimos
    Poor,         // Pode rodar mas com problemas
    Incompatible  // Não pode rodar
}

/// <summary>
/// Serviço de integração com HuggingFace
/// </summary>
public class HuggingFaceService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<HuggingFaceService> _logger;
    private const string HF_API_BASE = "https://huggingface.co";

    public HuggingFaceService(HttpClient httpClient, ILogger<HuggingFaceService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _httpClient.Timeout = TimeSpan.FromHours(2); // Downloads podem demorar
    }

    /// <summary>
    /// Obtém detalhes completos de um modelo do HuggingFace
    /// </summary>
    public async Task<object> GetModelDetailsAsync(string modelId)
    {
        try
        {
            var url = $"https://huggingface.co/api/models/{modelId}";
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();
            
            var content = await response.Content.ReadAsStringAsync();
            var modelData = JsonSerializer.Deserialize<JsonElement>(content);
            
            // Extrair informações relevantes
            var details = new
            {
                id = modelId,
                author = modelId.Split('/')[0],
                modelName = modelId.Split('/').Length > 1 ? modelId.Split('/')[1] : modelId,
                description = modelData.TryGetProperty("description", out var desc) ? desc.GetString() : null,
                downloads = modelData.TryGetProperty("downloads", out var dl) ? dl.GetInt32() : 0,
                likes = modelData.TryGetProperty("likes", out var lk) ? lk.GetInt32() : 0,
                tags = modelData.TryGetProperty("tags", out var tg) ? 
                    tg.EnumerateArray().Select(t => t.GetString() ?? "").ToList() : 
                    new List<string>(),
                license = modelData.TryGetProperty("license", out var lic) ? lic.GetString() : null,
                lastModified = modelData.TryGetProperty("lastModified", out var lm) ? lm.GetString() : null,
                pipeline_tag = modelData.TryGetProperty("pipeline_tag", out var pt) ? pt.GetString() : null,
                library_name = modelData.TryGetProperty("library_name", out var ln) ? ln.GetString() : null
            };
            
            return details;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching model details for {ModelId}", modelId);
            
            // Retornar dados básicos em caso de erro
            return new
            {
                id = modelId,
                author = modelId.Split('/')[0],
                modelName = modelId.Split('/').Length > 1 ? modelId.Split('/')[1] : modelId,
                description = (string?)null,
                downloads = 0,
                likes = 0,
                tags = new List<string>(),
                license = (string?)null,
                lastModified = (string?)null,
                pipeline_tag = (string?)null,
                library_name = (string?)null
            };
        }
    }

    /// <summary>
    /// Busca modelos GGUF no HuggingFace
    /// </summary>
    public async Task<List<HuggingFaceModel>> SearchModelsAsync(string query = "gguf", int limit = 20)
    {
        try
        {
            var url = $"https://huggingface.co/api/models?search={Uri.EscapeDataString(query)}&filter=gguf&limit={limit}";
            var response = await _httpClient.GetFromJsonAsync<List<HuggingFaceModel>>(url);
            return response ?? new List<HuggingFaceModel>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching HuggingFace models");
            return new List<HuggingFaceModel>();
        }
    }

    /// <summary>
    /// Lista arquivos de um modelo
    /// </summary>
    public async Task<List<HuggingFaceFile>> ListModelFilesAsync(string modelId)
    {
        try
        {
            _logger.LogInformation("?? Fetching files for model: {ModelId}", modelId);
            
            var url = $"https://huggingface.co/api/models/{modelId}/tree/main";
            _logger.LogInformation("?? Request URL: {Url}", url);
            
            HttpResponseMessage httpResponse;
            try
            {
                httpResponse = await _httpClient.GetAsync(url);
                _logger.LogInformation("?? Response Status: {StatusCode}", httpResponse.StatusCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "? HTTP request failed for {ModelId}", modelId);
                return new List<HuggingFaceFile>();
            }

            if (!httpResponse.IsSuccessStatusCode)
            {
                var errorContent = await httpResponse.Content.ReadAsStringAsync();
                _logger.LogError("? HuggingFace API error for {ModelId}: {Status} - {Content}", 
                    modelId, httpResponse.StatusCode, errorContent);
                return new List<HuggingFaceFile>();
            }

            var responseContent = await httpResponse.Content.ReadAsStringAsync();
            _logger.LogInformation("?? Response length: {Length} chars", responseContent.Length);

            List<HuggingFaceFile>? response;
            try
            {
                response = JsonSerializer.Deserialize<List<HuggingFaceFile>>(responseContent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "? JSON deserialization failed for {ModelId}. Content: {Content}", 
                    modelId, responseContent.Substring(0, Math.Min(500, responseContent.Length)));
                return new List<HuggingFaceFile>();
            }
            
            if (response == null)
            {
                _logger.LogWarning("?? Empty response from HuggingFace for {ModelId}", modelId);
                return new List<HuggingFaceFile>();
            }
            
            _logger.LogInformation("?? Total files returned: {Count}", response.Count);
            
            // Filtrar apenas arquivos GGUF
            var ggufFiles = response
                .Where(f => !string.IsNullOrEmpty(f.Filename) && f.Filename.EndsWith(".gguf", StringComparison.OrdinalIgnoreCase))
                .ToList();
            
            _logger.LogInformation("? Found {Count} GGUF files for {ModelId}", ggufFiles.Count, modelId);
            
            if (ggufFiles.Count == 0)
            {
                _logger.LogWarning("?? No .gguf files found for {ModelId}. All files: {Files}", 
                    modelId, 
                    string.Join(", ", response.Take(10).Select(f => f.Filename ?? "null")));
            }
            
            // Calcular requisitos e formatar tamanho para cada arquivo
            foreach (var file in ggufFiles)
            {
                file.SizeFormatted = FormatSize(file.SizeBytes);
                file.Requirements = CalculateRequirements(file.Filename, file.SizeBytes);
                
                _logger.LogDebug("  ?? File: {Filename}, Size: {Size}, Params: {Params}B, Quant: {Quant}", 
                    file.Filename, 
                    file.SizeFormatted, 
                    file.Requirements.ParameterCount,
                    file.Requirements.Quantization);
            }
            
            return ggufFiles;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "?? Unexpected error listing model files for {ModelId}", modelId);
            return new List<HuggingFaceFile>();
        }
    }

    /// <summary>
    /// Baixa um modelo GGUF do HuggingFace
    /// </summary>
    public async Task DownloadModelAsync(
        string modelId,
        string filename,
        string destinationPath,
        IProgress<DownloadProgress>? progress = null,
        CancellationToken cancellationToken = default)
    {
        var url = $"{HF_API_BASE}/{modelId}/resolve/main/{filename}";

        _logger.LogInformation("Downloading {Filename} from {ModelId}", filename, modelId);

        try
        {
            using var response = await _httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
            response.EnsureSuccessStatusCode();

            var totalBytes = response.Content.Headers.ContentLength ?? 0;
            var downloadedBytes = 0L;

            using var contentStream = await response.Content.ReadAsStreamAsync(cancellationToken);
            using var fileStream = new FileStream(destinationPath, FileMode.Create, FileAccess.Write, FileShare.None, 8192, true);

            var buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = await contentStream.ReadAsync(buffer, cancellationToken)) > 0)
            {
                await fileStream.WriteAsync(buffer.AsMemory(0, bytesRead), cancellationToken);
                downloadedBytes += bytesRead;

                progress?.Report(new DownloadProgress
                {
                    TotalBytes = totalBytes,
                    DownloadedBytes = downloadedBytes,
                    PercentComplete = totalBytes > 0 ? (double)downloadedBytes / totalBytes * 100 : 0,
                    Filename = filename
                });
            }

            _logger.LogInformation("Successfully downloaded {Filename} ({Size} MB)", filename, downloadedBytes / 1024.0 / 1024.0);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error downloading {Filename}", filename);
            
            // Limpar arquivo parcial
            if (File.Exists(destinationPath))
            {
                try { File.Delete(destinationPath); } catch { }
            }
            
            throw;
        }
    }

    /// <summary>
    /// Calcula requisitos de sistema baseado no nome e tamanho do arquivo
    /// </summary>
    public ModelRequirements CalculateRequirements(string filename, long sizeBytes)
    {
        var sizeMb = sizeBytes / 1024.0 / 1024.0;
        var sizeGb = sizeMb / 1024.0;
        
        // Extrair informações do nome do arquivo
        var filenameLower = filename.ToLower();
        var quantization = ExtractQuantization(filenameLower);
        var parameterCount = ExtractParameterCount(filenameLower);
        
        // Estimar requisitos baseado no tamanho e quantização
        var requirements = new ModelRequirements
        {
            ModelSize = FormatSize(sizeBytes),
            ParameterCount = parameterCount,
            Quantization = quantization,
            SupportedPlatforms = new List<string> { "Windows", "Linux", "macOS" }
        };

        // Requisitos de RAM (modelo precisa ser carregado + overhead)
        // Regra geral: Tamanho do modelo + 20-50% de overhead
        requirements.MinRamGb = Math.Ceiling(sizeGb * 1.2);
        requirements.RecommendedRamGb = Math.Ceiling(sizeGb * 1.5);

        // Requisitos de VRAM para execução em GPU
        if (quantization.Contains("Q4") || quantization.Contains("Q5"))
        {
            // Quantizações mais leves podem rodar em GPUs menores
            requirements.MinVramGb = Math.Ceiling(sizeGb * 1.1);
            requirements.RecommendedVramGb = Math.Ceiling(sizeGb * 1.3);
            requirements.RequiresGpu = false; // Pode rodar em CPU
        }
        else if (quantization.Contains("Q8") || quantization.Contains("F16"))
        {
            // Quantizações mais pesadas preferem GPU
            requirements.MinVramGb = Math.Ceiling(sizeGb * 1.2);
            requirements.RecommendedVramGb = Math.Ceiling(sizeGb * 1.5);
            requirements.RequiresGpu = false; // Ainda pode rodar em CPU, mas mais lento
        }
        else
        {
            // Default para modelos sem quantização clara
            requirements.MinVramGb = Math.Ceiling(sizeGb * 1.1);
            requirements.RecommendedVramGb = Math.Ceiling(sizeGb * 1.3);
            requirements.RequiresGpu = false;
        }

        // Modelos grandes (>10GB) beneficiam muito de GPU
        if (sizeGb > 10)
        {
            requirements.RequiresGpu = false; // Ainda opcional, mas fortemente recomendado
        }

        return requirements;
    }

    /// <summary>
    /// Verifica compatibilidade com hardware do sistema
    /// </summary>
    public HardwareCompatibility CheckCompatibility(ModelRequirements requirements, double availableRamGb, double? availableVramGb = null)
    {
        var compatibility = new HardwareCompatibility
        {
            Warnings = new List<string>(),
            Recommendations = new List<string>()
        };

        // Verificar RAM
        if (availableRamGb < requirements.MinRamGb)
        {
            compatibility.CanRun = false;
            compatibility.Level = CompatibilityLevel.Incompatible;
            compatibility.Warnings.Add($"RAM insuficiente. Requerido: {requirements.MinRamGb:F1}GB, Disponível: {availableRamGb:F1}GB");
            compatibility.PerformanceEstimate = "Não pode executar - RAM insuficiente";
            return compatibility;
        }

        compatibility.CanRun = true;
        compatibility.RamUtilizationPercent = (requirements.RecommendedRamGb / availableRamGb) * 100;

        // Determinar nível de compatibilidade baseado em RAM
        if (availableRamGb >= requirements.RecommendedRamGb * 2)
        {
            compatibility.Level = CompatibilityLevel.Excellent;
            compatibility.PerformanceEstimate = "Excelente - Hardware bem acima dos requisitos";
        }
        else if (availableRamGb >= requirements.RecommendedRamGb)
        {
            compatibility.Level = CompatibilityLevel.Good;
            compatibility.PerformanceEstimate = "Bom - Atende requisitos recomendados";
        }
        else if (availableRamGb >= requirements.MinRamGb * 1.2)
        {
            compatibility.Level = CompatibilityLevel.Adequate;
            compatibility.PerformanceEstimate = "Adequado - Pode haver lentidão em modelos grandes";
            compatibility.Warnings.Add("RAM próxima do mínimo. Considere fechar outros aplicativos.");
        }
        else
        {
            compatibility.Level = CompatibilityLevel.Poor;
            compatibility.PerformanceEstimate = "Limitado - Esperado desempenho lento";
            compatibility.Warnings.Add("RAM no limite mínimo. Recomendado adicionar mais memória.");
        }

        // Verificar GPU/VRAM
        if (availableVramGb.HasValue && availableVramGb.Value > 0)
        {
            compatibility.VramUtilizationPercent = (requirements.RecommendedVramGb / availableVramGb.Value) * 100;
            
            if (availableVramGb.Value >= requirements.RecommendedVramGb)
            {
                compatibility.Recommendations.Add($"? GPU detectada ({availableVramGb.Value:F1}GB VRAM) - Execução acelerada disponível");
            }
            else if (availableVramGb.Value >= requirements.MinVramGb)
            {
                compatibility.Recommendations.Add($"? GPU disponível mas VRAM limitada ({availableVramGb.Value:F1}GB) - Pode usar offloading parcial");
            }
            else
            {
                compatibility.Recommendations.Add("? VRAM insuficiente para GPU - Executará em CPU");
            }
        }
        else
        {
            if (requirements.RequiresGpu)
            {
                compatibility.Warnings.Add("GPU não detectada - Modelo otimizado para GPU");
                compatibility.Level = CompatibilityLevel.Poor;
            }
            else
            {
                compatibility.Recommendations.Add("?? GPU não detectada - Executará em CPU (mais lento)");
            }
        }

        // Recomendações adicionais baseadas no quantization
        if (!string.IsNullOrEmpty(requirements.Quantization))
        {
            if (requirements.Quantization.Contains("Q4"))
            {
                compatibility.Recommendations.Add($"?? Quantização {requirements.Quantization} - Balanceado entre velocidade e qualidade");
            }
            else if (requirements.Quantization.Contains("Q8") || requirements.Quantization.Contains("F16"))
            {
                compatibility.Recommendations.Add($"?? Quantização {requirements.Quantization} - Alta qualidade, requer mais recursos");
            }
        }

        return compatibility;
    }

    private string ExtractQuantization(string filename)
    {
        // Padrões comuns: Q4_K_M, Q5_K_S, Q8_0, F16, etc.
        var patterns = new[] { "q4_k_m", "q4_k_s", "q5_k_m", "q5_k_s", "q8_0", "f16", "q4_0", "q5_0", "q6_k" };
        
        foreach (var pattern in patterns)
        {
            if (filename.Contains(pattern))
                return pattern.ToUpper();
        }
        
        return "Unknown";
    }

    private int ExtractParameterCount(string filename)
    {
        // Extrair número de parâmetros (ex: 7b, 13b, 70b)
        var match = System.Text.RegularExpressions.Regex.Match(filename, @"(\d+)b");
        if (match.Success && int.TryParse(match.Groups[1].Value, out var billions))
        {
            return billions;
        }
        return 0;
    }

    private string FormatSize(long bytes)
    {
        var gb = bytes / 1024.0 / 1024.0 / 1024.0;
        return gb >= 1 ? $"{gb:F2} GB" : $"{bytes / 1024.0 / 1024.0:F2} MB";
    }
}

public class DownloadProgress
{
    public long TotalBytes { get; set; }
    public long DownloadedBytes { get; set; }
    public double PercentComplete { get; set; }
    public string Filename { get; set; } = string.Empty;
    public double SpeedMBps { get; set; }
}
