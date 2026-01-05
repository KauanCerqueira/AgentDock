namespace AgentDock.Backend.Services;

public class DownloadSettings
{
    public string DownloadPath { get; set; } = string.Empty;
    public bool NotifyOnComplete { get; set; } = true;
    public bool NotifyOnError { get; set; } = true;
    public int MaxConcurrentDownloads { get; set; } = 1;
    public bool AutoLoadAfterDownload { get; set; } = true;
}

public class DownloadSettingsService
{
    private readonly ILogger<DownloadSettingsService> _logger;
    private readonly string _settingsFile;
    private DownloadSettings _settings;

    public DownloadSettingsService(ILogger<DownloadSettingsService> logger)
    {
        _logger = logger;
        _settingsFile = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "AgentDock",
            "download-settings.json"
        );

        Directory.CreateDirectory(Path.GetDirectoryName(_settingsFile)!);
        _settings = LoadSettings();
    }

    public DownloadSettings GetSettings()
    {
        return _settings;
    }

    public void UpdateSettings(DownloadSettings settings)
    {
        _settings = settings;
        SaveSettings();
    }

    public string GetDownloadPath()
    {
        if (string.IsNullOrEmpty(_settings.DownloadPath))
        {
            // Default: AppData/AgentDock/models
            var defaultPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "AgentDock",
                "models"
            );
            Directory.CreateDirectory(defaultPath);
            return defaultPath;
        }

        Directory.CreateDirectory(_settings.DownloadPath);
        return _settings.DownloadPath;
    }

    private DownloadSettings LoadSettings()
    {
        try
        {
            if (File.Exists(_settingsFile))
            {
                var json = File.ReadAllText(_settingsFile);
                return System.Text.Json.JsonSerializer.Deserialize<DownloadSettings>(json) 
                    ?? new DownloadSettings();
            }
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to load download settings, using defaults");
        }

        return new DownloadSettings();
    }

    private void SaveSettings()
    {
        try
        {
            var json = System.Text.Json.JsonSerializer.Serialize(_settings, new System.Text.Json.JsonSerializerOptions 
            { 
                WriteIndented = true 
            });
            File.WriteAllText(_settingsFile, json);
            _logger.LogInformation("Download settings saved");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to save download settings");
        }
    }
}
