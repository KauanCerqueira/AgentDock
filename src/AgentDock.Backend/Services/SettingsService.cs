namespace AgentDock.Backend.Services;

public class UserSettings
{
    public string Theme { get; set; } = "dark";
    public string Language { get; set; } = "en";
    public bool AutoUpdate { get; set; } = true;
    public bool DesktopNotifications { get; set; } = true;
    public Dictionary<string, bool> NotificationPreferences { get; set; } = new()
    {
        ["taskComplete"] = true,
        ["modelDownloaded"] = true,
        ["errorOccurred"] = true,
        ["systemWarning"] = true
    };
    public ModelPreferences ModelSettings { get; set; } = new();
    public Dictionary<string, string> KeyBindings { get; set; } = new()
    {
        ["commandPalette"] = "Ctrl+K",
        ["newChat"] = "Ctrl+N",
        ["search"] = "Ctrl+F"
    };
}

public class ModelPreferences
{
    public double Temperature { get; set; } = 0.7;
    public int MaxTokens { get; set; } = 2048;
    public double TopP { get; set; } = 0.9;
    public int TopK { get; set; } = 40;
}

public class PromptSnippet
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = "";
    public string Content { get; set; } = "";
    public string Category { get; set; } = "general";
    public List<string> Tags { get; set; } = new();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime LastUsed { get; set; } = DateTime.UtcNow;
    public int UseCount { get; set; } = 0;
    public bool IsFavorite { get; set; } = false;
}

public class SettingsService
{
    private UserSettings _settings = new();
    private readonly List<PromptSnippet> _snippets = new();

    public SettingsService()
    {
        // Seed with example snippets
        _snippets.Add(new PromptSnippet
        {
            Name = "Code Review",
            Content = "Please review this code for:\n1. Bugs and errors\n2. Performance issues\n3. Best practices\n4. Security concerns\n\n[Paste code here]",
            Category = "code",
            Tags = new List<string> { "review", "quality" },
            IsFavorite = true
        });

        _snippets.Add(new PromptSnippet
        {
            Name = "Documentation Generator",
            Content = "Generate comprehensive documentation for the following code:\n- Include parameter descriptions\n- Add usage examples\n- Document return values\n\n[Paste code here]",
            Category = "documentation",
            Tags = new List<string> { "docs", "comments" }
        });

        _snippets.Add(new PromptSnippet
        {
            Name = "Bug Analysis",
            Content = "Analyze this error and provide:\n1. Root cause\n2. Suggested fix\n3. Prevention strategies\n\nError: [Paste error here]",
            Category = "debugging",
            Tags = new List<string> { "debug", "fix" },
            IsFavorite = true
        });
    }

    public UserSettings GetSettings() => _settings;

    public void UpdateSettings(UserSettings settings)
    {
        _settings = settings;
    }

    public List<PromptSnippet> GetSnippets(string? category = null, bool? favoriteOnly = null)
    {
        var query = _snippets.AsEnumerable();

        if (!string.IsNullOrEmpty(category))
            query = query.Where(s => s.Category == category);

        if (favoriteOnly == true)
            query = query.Where(s => s.IsFavorite);

        return query.OrderByDescending(s => s.IsFavorite)
                    .ThenByDescending(s => s.LastUsed)
                    .ToList();
    }

    public PromptSnippet? GetSnippet(string id)
    {
        return _snippets.FirstOrDefault(s => s.Id == id);
    }

    public PromptSnippet AddSnippet(PromptSnippet snippet)
    {
        snippet.Id = Guid.NewGuid().ToString();
        snippet.CreatedAt = DateTime.UtcNow;
        _snippets.Add(snippet);
        return snippet;
    }

    public bool UpdateSnippet(string id, PromptSnippet updatedSnippet)
    {
        var index = _snippets.FindIndex(s => s.Id == id);
        if (index >= 0)
        {
            updatedSnippet.Id = id;
            _snippets[index] = updatedSnippet;
            return true;
        }
        return false;
    }

    public bool DeleteSnippet(string id)
    {
        return _snippets.RemoveAll(s => s.Id == id) > 0;
    }

    public void UseSnippet(string id)
    {
        var snippet = _snippets.FirstOrDefault(s => s.Id == id);
        if (snippet != null)
        {
            snippet.UseCount++;
            snippet.LastUsed = DateTime.UtcNow;
        }
    }
}
