namespace AgentDock.Backend.Services;

public class AgentPreset
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Icon { get; set; } = "bot";
    public string Category { get; set; } = "general";
    public string SystemPrompt { get; set; } = "";
    public ModelPreferences ModelSettings { get; set; } = new();
    public List<string> Tags { get; set; } = new();
    public bool IsBuiltIn { get; set; } = false;
    public int UseCount { get; set; } = 0;
}

public class AgentPresetsService
{
    private readonly List<AgentPreset> _presets = new();

    public AgentPresetsService()
    {
        // Built-in presets
        _presets.Add(new AgentPreset
        {
            Name = "Code Reviewer",
            Description = "Analyzes code for bugs, performance issues, and best practices",
            Icon = "code",
            Category = "development",
            SystemPrompt = "You are an expert code reviewer. Analyze code for bugs, performance, security issues, and adherence to best practices. Provide actionable feedback.",
            ModelSettings = new ModelPreferences { Temperature = 0.3, MaxTokens = 4096 },
            Tags = new List<string> { "code", "review", "quality" },
            IsBuiltIn = true
        });

        _presets.Add(new AgentPreset
        {
            Name = "Documentation Writer",
            Description = "Generates comprehensive documentation for code and APIs",
            Icon = "file-text",
            Category = "development",
            SystemPrompt = "You are a technical documentation specialist. Create clear, comprehensive documentation with examples, parameter descriptions, and usage guidelines.",
            ModelSettings = new ModelPreferences { Temperature = 0.5, MaxTokens = 3072 },
            Tags = new List<string> { "docs", "writing", "technical" },
            IsBuiltIn = true
        });

        _presets.Add(new AgentPreset
        {
            Name = "Bug Hunter",
            Description = "Identifies and diagnoses bugs in code",
            Icon = "bug",
            Category = "debugging",
            SystemPrompt = "You are a debugging expert. Analyze error messages, stack traces, and code to identify root causes and suggest fixes.",
            ModelSettings = new ModelPreferences { Temperature = 0.2, MaxTokens = 2048 },
            Tags = new List<string> { "debug", "fix", "error" },
            IsBuiltIn = true
        });

        _presets.Add(new AgentPreset
        {
            Name = "Test Generator",
            Description = "Creates comprehensive unit and integration tests",
            Icon = "test-tube",
            Category = "testing",
            SystemPrompt = "You are a test automation expert. Generate comprehensive unit tests, integration tests, and test scenarios with edge cases.",
            ModelSettings = new ModelPreferences { Temperature = 0.4, MaxTokens = 2048 },
            Tags = new List<string> { "testing", "quality", "automation" },
            IsBuiltIn = true
        });

        _presets.Add(new AgentPreset
        {
            Name = "Refactoring Assistant",
            Description = "Suggests code improvements and refactoring strategies",
            Icon = "wand",
            Category = "development",
            SystemPrompt = "You are a code refactoring specialist. Suggest improvements for code structure, readability, maintainability, and performance.",
            ModelSettings = new ModelPreferences { Temperature = 0.6, MaxTokens = 3072 },
            Tags = new List<string> { "refactor", "improvement", "clean-code" },
            IsBuiltIn = true
        });

        _presets.Add(new AgentPreset
        {
            Name = "Security Auditor",
            Description = "Scans for security vulnerabilities and suggests fixes",
            Icon = "shield",
            Category = "security",
            SystemPrompt = "You are a security expert. Identify security vulnerabilities, suggest fixes, and recommend security best practices.",
            ModelSettings = new ModelPreferences { Temperature = 0.2, MaxTokens = 2048 },
            Tags = new List<string> { "security", "audit", "vulnerability" },
            IsBuiltIn = true
        });

        _presets.Add(new AgentPreset
        {
            Name = "API Designer",
            Description = "Designs RESTful APIs and suggests best practices",
            Icon = "network",
            Category = "architecture",
            SystemPrompt = "You are an API design expert. Design RESTful APIs following best practices, suggest endpoints, data models, and error handling.",
            ModelSettings = new ModelPreferences { Temperature = 0.5, MaxTokens = 3072 },
            Tags = new List<string> { "api", "design", "rest" },
            IsBuiltIn = true
        });

        _presets.Add(new AgentPreset
        {
            Name = "Performance Optimizer",
            Description = "Analyzes and optimizes code performance",
            Icon = "zap",
            Category = "optimization",
            SystemPrompt = "You are a performance optimization specialist. Analyze code for bottlenecks, suggest optimizations, and provide benchmarking strategies.",
            ModelSettings = new ModelPreferences { Temperature = 0.4, MaxTokens = 2048 },
            Tags = new List<string> { "performance", "optimization", "speed" },
            IsBuiltIn = true
        });
    }

    public List<AgentPreset> GetPresets(string? category = null)
    {
        if (string.IsNullOrEmpty(category))
            return _presets.OrderByDescending(p => p.IsBuiltIn).ThenByDescending(p => p.UseCount).ToList();

        return _presets.Where(p => p.Category == category)
                      .OrderByDescending(p => p.IsBuiltIn)
                      .ThenByDescending(p => p.UseCount)
                      .ToList();
    }

    public AgentPreset? GetPreset(string id)
    {
        return _presets.FirstOrDefault(p => p.Id == id);
    }

    public AgentPreset AddPreset(AgentPreset preset)
    {
        preset.Id = Guid.NewGuid().ToString();
        preset.IsBuiltIn = false;
        _presets.Add(preset);
        return preset;
    }

    public void UsePreset(string id)
    {
        var preset = _presets.FirstOrDefault(p => p.Id == id);
        if (preset != null)
        {
            preset.UseCount++;
        }
    }

    public bool DeletePreset(string id)
    {
        var preset = _presets.FirstOrDefault(p => p.Id == id);
        if (preset != null && !preset.IsBuiltIn)
        {
            _presets.Remove(preset);
            return true;
        }
        return false;
    }
}
