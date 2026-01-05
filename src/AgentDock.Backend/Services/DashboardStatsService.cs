using System.Text.Json;

namespace AgentDock.Backend.Services;

public class DashboardStats
{
    // Modelos
    public int TotalModels { get; set; }
    public int InstalledModels { get; set; }
    public string? ActiveModel { get; set; }
    public double ModelStorageGb { get; set; }
    
    // Chat/Conversas
    public int TotalConversations { get; set; }
    public int TotalMessages { get; set; }
    public long TotalTokensUsed { get; set; }
    public double AvgTokensPerMessage { get; set; }
    
    // Performance
    public int TotalRequests { get; set; }
    public int SuccessfulRequests { get; set; }
    public int FailedRequests { get; set; }
    public double AvgResponseTimeMs { get; set; }
    public double SuccessRate { get; set; }
    
    // Downloads
    public int TotalDownloads { get; set; }
    public int CompletedDownloads { get; set; }
    public int ActiveDownloads { get; set; }
    public double TotalDownloadedGb { get; set; }
    
    // Atividade recente
    public List<RecentActivity> RecentActivities { get; set; } = new();
    
    // Histórico de uso (últimas 24h)
    public List<UsageDataPoint> UsageHistory { get; set; } = new();
    
    // Datas
    public DateTime LastUpdated { get; set; }
    public DateTime FirstActivityDate { get; set; }
}

public class RecentActivity
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime Timestamp { get; set; }
    public string Type { get; set; } = "info"; // chat, download, model, system, error
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string? ModelName { get; set; }
    public int? TokensUsed { get; set; }
    public double? DurationMs { get; set; }
}

public class UsageDataPoint
{
    public DateTime Timestamp { get; set; }
    public int Requests { get; set; }
    public long TokensUsed { get; set; }
    public double AvgResponseTimeMs { get; set; }
}

public class DashboardStatsService
{
    private readonly string _dataPath;
    private readonly object _lock = new();
    private DashboardStats _stats;
    private readonly ILogger<DashboardStatsService> _logger;

    public DashboardStatsService(ILogger<DashboardStatsService> logger)
    {
        _logger = logger;
        _dataPath = Path.Combine(AppContext.BaseDirectory, "data", "dashboard-stats.json");
        
        // Garantir que o diretório existe
        var dir = Path.GetDirectoryName(_dataPath);
        if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
        {
            Directory.CreateDirectory(dir);
        }
        
        _stats = LoadStats();
    }

    private DashboardStats LoadStats()
    {
        try
        {
            if (File.Exists(_dataPath))
            {
                var json = File.ReadAllText(_dataPath);
                var stats = JsonSerializer.Deserialize<DashboardStats>(json, new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });
                
                if (stats != null)
                {
                    _logger.LogInformation("Dashboard stats loaded: {Requests} requests, {Tokens} tokens", 
                        stats.TotalRequests, stats.TotalTokensUsed);
                    return stats;
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to load dashboard stats, using defaults");
        }
        
        // Retornar estatísticas padrão
        return new DashboardStats
        {
            FirstActivityDate = DateTime.UtcNow,
            LastUpdated = DateTime.UtcNow
        };
    }

    private void SaveStats()
    {
        try
        {
            var json = JsonSerializer.Serialize(_stats, new JsonSerializerOptions
            {
                WriteIndented = true
            });
            File.WriteAllText(_dataPath, json);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save dashboard stats");
        }
    }

    public DashboardStats GetStats()
    {
        lock (_lock)
        {
            _stats.LastUpdated = DateTime.UtcNow;
            return _stats;
        }
    }

    public void RecordChatRequest(string? modelName, int inputTokens, int outputTokens, double responseTimeMs, bool success)
    {
        lock (_lock)
        {
            _stats.TotalRequests++;
            
            if (success)
            {
                _stats.SuccessfulRequests++;
                _stats.TotalTokensUsed += inputTokens + outputTokens;
                _stats.TotalMessages++;
                
                // Atualizar média de response time
                _stats.AvgResponseTimeMs = (_stats.AvgResponseTimeMs * (_stats.SuccessfulRequests - 1) + responseTimeMs) / _stats.SuccessfulRequests;
                
                // Atualizar média de tokens por mensagem
                if (_stats.TotalMessages > 0)
                {
                    _stats.AvgTokensPerMessage = (double)_stats.TotalTokensUsed / _stats.TotalMessages;
                }
            }
            else
            {
                _stats.FailedRequests++;
            }
            
            // Calcular taxa de sucesso
            _stats.SuccessRate = _stats.TotalRequests > 0 
                ? (double)_stats.SuccessfulRequests / _stats.TotalRequests * 100 
                : 0;
            
            // Adicionar atividade recente
            AddRecentActivity(new RecentActivity
            {
                Type = success ? "chat" : "error",
                Title = success ? "Chat Request" : "Chat Error",
                Description = success 
                    ? $"Response generated in {responseTimeMs:F0}ms"
                    : "Failed to generate response",
                ModelName = modelName,
                TokensUsed = inputTokens + outputTokens,
                DurationMs = responseTimeMs
            });
            
            // Atualizar histórico de uso
            UpdateUsageHistory(1, inputTokens + outputTokens, responseTimeMs);
            
            SaveStats();
        }
    }

    public void RecordConversationStart(string? modelName)
    {
        lock (_lock)
        {
            _stats.TotalConversations++;
            _stats.ActiveModel = modelName;
            
            AddRecentActivity(new RecentActivity
            {
                Type = "chat",
                Title = "Conversation Started",
                Description = $"New chat session with {modelName ?? "AI"}",
                ModelName = modelName
            });
            
            SaveStats();
        }
    }

    public void RecordDownloadStart(string filename, long sizeBytes)
    {
        lock (_lock)
        {
            _stats.TotalDownloads++;
            _stats.ActiveDownloads++;
            
            AddRecentActivity(new RecentActivity
            {
                Type = "download",
                Title = "Download Started",
                Description = $"Downloading {filename} ({sizeBytes / 1024.0 / 1024.0 / 1024.0:F2} GB)"
            });
            
            SaveStats();
        }
    }

    public void RecordDownloadComplete(string filename, long sizeBytes, bool success)
    {
        lock (_lock)
        {
            _stats.ActiveDownloads = Math.Max(0, _stats.ActiveDownloads - 1);
            
            if (success)
            {
                _stats.CompletedDownloads++;
                _stats.TotalDownloadedGb += sizeBytes / 1024.0 / 1024.0 / 1024.0;
            }
            
            AddRecentActivity(new RecentActivity
            {
                Type = success ? "download" : "error",
                Title = success ? "Download Complete" : "Download Failed",
                Description = success 
                    ? $"{filename} downloaded successfully"
                    : $"Failed to download {filename}"
            });
            
            SaveStats();
        }
    }

    public void RecordModelLoaded(string modelName, double sizeGb)
    {
        lock (_lock)
        {
            _stats.ActiveModel = modelName;
            _stats.InstalledModels++;
            _stats.ModelStorageGb += sizeGb;
            
            AddRecentActivity(new RecentActivity
            {
                Type = "model",
                Title = "Model Loaded",
                Description = $"{modelName} is now active",
                ModelName = modelName
            });
            
            SaveStats();
        }
    }

    public void UpdateModelStats(int totalModels, int installedModels, double storageGb)
    {
        lock (_lock)
        {
            _stats.TotalModels = totalModels;
            _stats.InstalledModels = installedModels;
            _stats.ModelStorageGb = storageGb;
            SaveStats();
        }
    }

    private void AddRecentActivity(RecentActivity activity)
    {
        activity.Timestamp = DateTime.UtcNow;
        _stats.RecentActivities.Insert(0, activity);
        
        // Manter apenas as últimas 100 atividades
        if (_stats.RecentActivities.Count > 100)
        {
            _stats.RecentActivities = _stats.RecentActivities.Take(100).ToList();
        }
    }

    private void UpdateUsageHistory(int requests, long tokens, double responseTimeMs)
    {
        var now = DateTime.UtcNow;
        var currentHour = new DateTime(now.Year, now.Month, now.Day, now.Hour, 0, 0, DateTimeKind.Utc);
        
        var existing = _stats.UsageHistory.FirstOrDefault(u => u.Timestamp == currentHour);
        if (existing != null)
        {
            existing.Requests += requests;
            existing.TokensUsed += tokens;
            existing.AvgResponseTimeMs = (existing.AvgResponseTimeMs * (existing.Requests - 1) + responseTimeMs) / existing.Requests;
        }
        else
        {
            _stats.UsageHistory.Add(new UsageDataPoint
            {
                Timestamp = currentHour,
                Requests = requests,
                TokensUsed = tokens,
                AvgResponseTimeMs = responseTimeMs
            });
        }
        
        // Manter apenas as últimas 24 horas
        var cutoff = DateTime.UtcNow.AddHours(-24);
        _stats.UsageHistory = _stats.UsageHistory.Where(u => u.Timestamp >= cutoff).ToList();
    }

    public void RecordSystemEvent(string title, string description, string type = "system")
    {
        lock (_lock)
        {
            AddRecentActivity(new RecentActivity
            {
                Type = type,
                Title = title,
                Description = description
            });
            SaveStats();
        }
    }
}
