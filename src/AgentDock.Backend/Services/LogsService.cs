namespace AgentDock.Backend.Services;

public class ActivityLog
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string Type { get; set; } = "info"; // info, success, warning, error
    public string Category { get; set; } = "system"; // system, model, task, workspace, user
    public string Message { get; set; } = "";
    public string? Details { get; set; }
    public Dictionary<string, object>? Metadata { get; set; }
}

public class PerformanceMetric
{
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public double CpuUsage { get; set; }
    public double MemoryUsage { get; set; }
    public double GpuUsage { get; set; }
    public double NetworkDownload { get; set; }
    public double NetworkUpload { get; set; }
    public int ActiveTasks { get; set; }
}

public class LogsService
{
    private readonly List<ActivityLog> _activityLogs = new();
    private readonly List<PerformanceMetric> _performanceMetrics = new();
    private readonly int _maxLogs = 1000;
    private readonly int _maxMetrics = 500;
    private readonly object _lock = new();

    public LogsService()
    {
        // Seed with some initial logs
        AddLog("system", "info", "AgentDock initialized successfully");
        AddLog("system", "success", "Backend server started on port 5000");
        AddLog("model", "info", "Llama 2 7B is now active");
    }

    public void AddLog(string category, string type, string message, string? details = null, Dictionary<string, object>? metadata = null)
    {
        lock (_lock)
        {
            _activityLogs.Insert(0, new ActivityLog
            {
                Category = category,
                Type = type,
                Message = message,
                Details = details,
                Metadata = metadata
            });

            // Keep only the most recent logs
            if (_activityLogs.Count > _maxLogs)
            {
                _activityLogs.RemoveRange(_maxLogs, _activityLogs.Count - _maxLogs);
            }
        }
    }

    public List<ActivityLog> GetLogs(int limit = 100, string? category = null, string? type = null)
    {
        lock (_lock)
        {
            var query = _activityLogs.AsEnumerable();

            if (!string.IsNullOrEmpty(category))
                query = query.Where(l => l.Category == category);

            if (!string.IsNullOrEmpty(type))
                query = query.Where(l => l.Type == type);

            return query.Take(limit).ToList();
        }
    }

    public void AddPerformanceMetric(PerformanceMetric metric)
    {
        lock (_lock)
        {
            _performanceMetrics.Add(metric);

            // Keep only recent metrics
            if (_performanceMetrics.Count > _maxMetrics)
            {
                _performanceMetrics.RemoveAt(0);
            }
        }
    }

    public List<PerformanceMetric> GetPerformanceMetrics(int minutes = 60)
    {
        lock (_lock)
        {
            var cutoff = DateTime.UtcNow.AddMinutes(-minutes);
            return _performanceMetrics.Where(m => m.Timestamp >= cutoff).ToList();
        }
    }

    public Dictionary<string, int> GetLogStatistics()
    {
        lock (_lock)
        {
            return new Dictionary<string, int>
            {
                ["total"] = _activityLogs.Count,
                ["errors"] = _activityLogs.Count(l => l.Type == "error"),
                ["warnings"] = _activityLogs.Count(l => l.Type == "warning"),
                ["success"] = _activityLogs.Count(l => l.Type == "success"),
                ["info"] = _activityLogs.Count(l => l.Type == "info")
            };
        }
    }
}
