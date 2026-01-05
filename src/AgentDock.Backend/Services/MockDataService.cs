namespace AgentDock.Backend.Services;

using System.Threading.Tasks;

public class ModelItem
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Size { get; set; } = "";
    public string Status { get; set; } = "Available";
    public bool IsActive { get; set; }
}

public class ChatMessage
{
    public string Role { get; set; } = "";
    public string Content { get; set; } = "";
}

public class TaskItem
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Status { get; set; } = "Inactive";
    public string Type { get; set; } = "automation";
    public DateTime CreatedAt { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Trigger
    public string? FolderPath { get; set; }
    public string? FileExtensions { get; set; } // "pdf,txt" or null for all
    
    // Action
    public string? Prompt { get; set; }
    public string? OutputFolder { get; set; }
    
    // History
    public List<ExecutionLog> ExecutionHistory { get; set; } = new();
    public DateTime? LastExecution { get; set; }
}

public class ExecutionLog
{
    public string Id { get; set; } = "";
    public string FileName { get; set; } = "";
    public DateTime ExecutedAt { get; set; }
    public string Status { get; set; } = "Success"; // Success, Failed
    public string? Result { get; set; }
}

public class Workspace
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Path { get; set; } = "";
    public string Status { get; set; } = "Ready";
    public DateTime CreatedAt { get; set; }
    public int FileCount { get; set; }
    public long SizeBytes { get; set; }
    public List<string> Tags { get; set; } = new();
    public string? GroupId { get; set; }
    public List<WorkspaceFile> Files { get; set; } = new();
}

public class WorkspaceFile
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Path { get; set; } = "";
    public string Extension { get; set; } = "";
    public long SizeBytes { get; set; }
    public DateTime ModifiedAt { get; set; }
    public bool IsDirectory { get; set; }
    public List<string> Tags { get; set; } = new();
    public string? PreviewUrl { get; set; }
    public string? IndexedContent { get; set; } // For full-text search
}

public class SystemInstruction
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Content { get; set; } = ""; // Markdown content
    public int Order { get; set; } = 0; // Para ordenação de carregamento
    public bool IsEnabled { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Category { get; set; } = "general"; // general, coding, analysis, custom
}

public class WorkspaceGroup
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public List<string> WorkspaceIds { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}


public class MockDataService
{
    private List<ModelItem> _models = new()
    {
        new ModelItem { Id = "llama2", Name = "Llama 2", Size = "7B", Status = "Installed", IsActive = true },
        new ModelItem { Id = "mistral", Name = "Mistral", Size = "7B", Status = "Available" },
        new ModelItem { Id = "neural-chat", Name = "Neural Chat", Size = "7B", Status = "Available" },
        new ModelItem { Id = "codellama", Name = "Code Llama", Size = "34B", Status = "Available" }
    };

    private List<ChatMessage> _chatHistory = new()
    {
        new ChatMessage { Role = "assistant", Content = "Olá! Sou seu assistente AgentDock. Como posso ajudá-lo?" }
    };

    private List<TaskItem> _tasks = new();
    private List<Workspace> _workspaces = new();
    private List<WorkspaceGroup> _workspaceGroups = new();
    private List<SystemInstruction> _instructions = new();

    public MockDataService()
    {
        // Initialize workspaces with realistic data
        var mainProject = new Workspace 
        { 
            Id = "ws1", 
            Name = "Projeto Principal", 
            Path = "C:\\Projetos\\Main", 
            Status = "Indexed",
            CreatedAt = DateTime.UtcNow.AddDays(-30),
            FileCount = 248,
            SizeBytes = 2147483648, // 2GB
            Tags = new List<string> { "ativo", "importante" },
            GroupId = "grp1",
            Files = GenerateMockFiles(10, "C:\\Projetos\\Main")
        };

        var dataProject = new Workspace
        {
            Id = "ws2",
            Name = "Arquivos de Dados",
            Path = "C:\\Data\\Storage",
            Status = "Indexed",
            CreatedAt = DateTime.UtcNow.AddDays(-15),
            FileCount = 512,
            SizeBytes = 5368709120, // 5GB
            Tags = new List<string> { "dados", "backup" },
            GroupId = "grp1",
            Files = GenerateMockFiles(8, "C:\\Data\\Storage")
        };

        var personal = new Workspace
        {
            Id = "ws3",
            Name = "Pessoal",
            Path = "C:\\Users\\User\\Documents",
            Status = "Ready",
            CreatedAt = DateTime.UtcNow.AddDays(-5),
            FileCount = 156,
            SizeBytes = 1073741824, // 1GB
            Tags = new List<string> { "pessoal" },
            Files = GenerateMockFiles(6, "C:\\Users\\User\\Documents")
        };

        _workspaces.Add(mainProject);
        _workspaces.Add(dataProject);
        _workspaces.Add(personal);

        // Initialize workspace groups
        _workspaceGroups.Add(new WorkspaceGroup
        {
            Id = "grp1",
            Name = "Projeto A",
            Description = "Workspaces relacionados ao projeto A",
            WorkspaceIds = new List<string> { "ws1", "ws2" },
            CreatedAt = DateTime.UtcNow.AddDays(-30)
        });

        // Initialize system instructions with defaults
        _instructions.Add(new SystemInstruction
        {
            Id = Guid.NewGuid().ToString(),
            Name = "Padrão de Código",
            Description = "Instruções para manter consistência no código",
            Content = """
# Padrão de Código

## Nomenclatura
- Use camelCase para variáveis
- Use PascalCase para classes e métodos
- Use UPPER_SNAKE_CASE para constantes

## Documentação
- Sempre documente funções públicas
- Use comentários explicativos para lógica complexa

## Testes
- Escreva testes unitários
- Mantenha cobertura acima de 80%
""",
            Order = 1,
            IsEnabled = true,
            Category = "coding",
            CreatedAt = DateTime.UtcNow.AddDays(-7),
            UpdatedAt = DateTime.UtcNow.AddDays(-7)
        });

        _instructions.Add(new SystemInstruction
        {
            Id = Guid.NewGuid().ToString(),
            Name = "Análise de Dados",
            Description = "Guidelines para análise de dados",
            Content = """
# Análise de Dados

## Validação
- Sempre valide os dados antes de processar
- Verifique valores nulos e vazios

## Documentação
- Documente fontes de dados
- Explique transformações aplicadas
""",
            Order = 2,
            IsEnabled = true,
            Category = "analysis",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        });
        
        // Add sample task data to test the UI
        _tasks.Add(new TaskItem
        {
            Id = Guid.NewGuid().ToString(),
            Name = "Processar PDFs",
            Type = "automation",
            Status = "Active",
            CreatedAt = DateTime.UtcNow.AddDays(-5),
            IsActive = true,
            FolderPath = "C:\\uploads\\pdfs",
            FileExtensions = "pdf",
            Prompt = "Extrair texto e metadados de arquivos PDF",
            OutputFolder = "C:\\resultados\\pdfs",
            LastExecution = DateTime.UtcNow.AddHours(-2),
            ExecutionHistory = new List<ExecutionLog>
            {
                new ExecutionLog { Id = Guid.NewGuid().ToString(), FileName = "documento1.pdf", ExecutedAt = DateTime.UtcNow.AddHours(-2), Status = "Success" },
                new ExecutionLog { Id = Guid.NewGuid().ToString(), FileName = "documento2.pdf", ExecutedAt = DateTime.UtcNow.AddHours(-3), Status = "Success" },
                new ExecutionLog { Id = Guid.NewGuid().ToString(), FileName = "documento3.pdf", ExecutedAt = DateTime.UtcNow.AddHours(-4), Status = "Failed", Result = "Arquivo corrompido" }
            }
        });
        
        _tasks.Add(new TaskItem
        {
            Id = Guid.NewGuid().ToString(),
            Name = "Converter Imagens",
            Type = "automation",
            Status = "Active",
            CreatedAt = DateTime.UtcNow.AddDays(-10),
            IsActive = true,
            FolderPath = "C:\\uploads\\images",
            FileExtensions = "jpg,png,webp",
            Prompt = "Converter imagens para formato otimizado e gerar thumbnails",
            OutputFolder = "C:\\resultados\\images",
            LastExecution = DateTime.UtcNow.AddMinutes(-30),
            ExecutionHistory = new List<ExecutionLog>
            {
                new ExecutionLog { Id = Guid.NewGuid().ToString(), FileName = "photo1.jpg", ExecutedAt = DateTime.UtcNow.AddMinutes(-30), Status = "Success" },
                new ExecutionLog { Id = Guid.NewGuid().ToString(), FileName = "photo2.png", ExecutedAt = DateTime.UtcNow.AddMinutes(-45), Status = "Success" }
            }
        });
        
        _tasks.Add(new TaskItem
        {
            Id = Guid.NewGuid().ToString(),
            Name = "Análise de Documentos",
            Type = "automation",
            Status = "Inactive",
            CreatedAt = DateTime.UtcNow.AddDays(-15),
            IsActive = false,
            FolderPath = "C:\\uploads\\docs",
            FileExtensions = "docx,txt",
            Prompt = "Analisar documentos e extrair informações-chave",
            OutputFolder = "C:\\resultados\\docs",
            ExecutionHistory = new List<ExecutionLog>()
        });
    }

    private List<WorkspaceFile> GenerateMockFiles(int count, string basePath)
    {
        var files = new List<WorkspaceFile>();
        var extensions = new[] { ".txt", ".pdf", ".docx", ".xlsx", ".jpg", ".png", ".mp4", ".json" };
        var names = new[] { "documento", "relatório", "imagem", "vídeo", "dados", "apresentação", "projeto", "configuração" };
        
        for (int i = 1; i <= count; i++)
        {
            var ext = extensions[i % extensions.Length];
            var name = names[i % names.Length];
            files.Add(new WorkspaceFile
            {
                Id = Guid.NewGuid().ToString(),
                Name = $"{name}_{i}{ext}",
                Path = $"{basePath}\\{name}_{i}{ext}",
                Extension = ext,
                SizeBytes = 1024 * (100 + i * 50),
                ModifiedAt = DateTime.UtcNow.AddDays(-(count - i)),
                IsDirectory = false,
                Tags = new List<string> { i % 3 == 0 ? "importante" : "normal" }
            });
        }
        return files;
    }

    public List<ModelItem> GetModels() => _models;

    public ModelItem? GetModel(string id) => _models.FirstOrDefault(m => m.Id == id);

    public void PullModel(string id)
    {
        var model = _models.FirstOrDefault(m => m.Id == id);
        if (model != null)
        {
            model.Status = "Downloading";
            _ = System.Threading.Tasks.Task.Delay(2000).ContinueWith(_ =>
            {
                model.Status = "Installed";
            });
        }
    }

    public void RemoveModel(string id)
    {
        var model = _models.FirstOrDefault(m => m.Id == id);
        if (model != null)
            model.Status = "Available";
    }

    public List<ChatMessage> GetChatHistory() => _chatHistory;

    public void AddChatMessage(string role, string content)
    {
        _chatHistory.Add(new ChatMessage { Role = role, Content = content });
    }

    public List<TaskItem> GetTasks() => _tasks;

    public TaskItem CreateTask(string name, string type, string instruction)
    {
        var task = new TaskItem
        {
            Id = Guid.NewGuid().ToString(),
            Name = name,
            Type = type,
            Status = "Queued",
            CreatedAt = DateTime.UtcNow
        };
        _tasks.Add(task);
        return task;
    }

    public List<Workspace> GetWorkspaces() => _workspaces;

    public Workspace? GetWorkspace(string id) => _workspaces.FirstOrDefault(w => w.Id == id);

    public Workspace ConnectWorkspace(string path)
    {
        var workspace = new Workspace
        {
            Id = Guid.NewGuid().ToString(),
            Name = Path.GetFileName(path),
            Path = path,
            Status = "Indexing",
            CreatedAt = DateTime.UtcNow,
            FileCount = 0,
            SizeBytes = 0,
            Files = new List<WorkspaceFile>()
        };
        _workspaces.Add(workspace);
        _ = System.Threading.Tasks.Task.Delay(1500).ContinueWith(_ =>
        {
            workspace.Status = "Indexed";
            workspace.FileCount = 156;
            workspace.SizeBytes = 1073741824;
            workspace.Files = GenerateMockFiles(8, path);
        });
        return workspace;
    }

    public List<WorkspaceFile> SearchFiles(string workspaceId, string query)
    {
        var workspace = GetWorkspace(workspaceId);
        if (workspace == null) return new List<WorkspaceFile>();
        
        return workspace.Files
            .Where(f => f.Name.Contains(query, StringComparison.OrdinalIgnoreCase) || 
                        f.Tags.Any(t => t.Contains(query, StringComparison.OrdinalIgnoreCase)))
            .ToList();
    }

    public List<WorkspaceFile> GetWorkspaceFiles(string workspaceId)
    {
        var workspace = GetWorkspace(workspaceId);
        return workspace?.Files ?? new List<WorkspaceFile>();
    }

    public void AddTagToFile(string workspaceId, string fileId, string tag)
    {
        var workspace = GetWorkspace(workspaceId);
        if (workspace == null) return;
        
        var file = workspace.Files.FirstOrDefault(f => f.Id == fileId);
        if (file != null && !file.Tags.Contains(tag))
        {
            file.Tags.Add(tag);
        }
    }

    public void RemoveTagFromFile(string workspaceId, string fileId, string tag)
    {
        var workspace = GetWorkspace(workspaceId);
        if (workspace == null) return;
        
        var file = workspace.Files.FirstOrDefault(f => f.Id == fileId);
        if (file != null)
        {
            file.Tags.Remove(tag);
        }
    }

    public List<WorkspaceGroup> GetWorkspaceGroups() => _workspaceGroups;

    public WorkspaceGroup CreateWorkspaceGroup(string name, string description)
    {
        var group = new WorkspaceGroup
        {
            Id = Guid.NewGuid().ToString(),
            Name = name,
            Description = description,
            CreatedAt = DateTime.UtcNow
        };
        _workspaceGroups.Add(group);
        return group;
    }

    public void AddWorkspaceToGroup(string groupId, string workspaceId)
    {
        var group = _workspaceGroups.FirstOrDefault(g => g.Id == groupId);
        if (group != null && !group.WorkspaceIds.Contains(workspaceId))
        {
            group.WorkspaceIds.Add(workspaceId);
        }
        
        var workspace = GetWorkspace(workspaceId);
        if (workspace != null)
        {
            workspace.GroupId = groupId;
        }
    }

    public WorkspaceStats GetWorkspaceStats(string workspaceId)
    {
        var workspace = GetWorkspace(workspaceId);
        if (workspace == null) return new WorkspaceStats();
        
        var stats = new WorkspaceStats
        {
            TotalFiles = workspace.FileCount,
            TotalSize = workspace.SizeBytes,
            FilesByType = workspace.Files
                .GroupBy(f => f.Extension)
                .ToDictionary(g => g.Key, g => g.Count()),
            TaggedFiles = workspace.Files.Count(f => f.Tags.Count > 0),
            LastModified = workspace.Files.MaxBy(f => f.ModifiedAt)?.ModifiedAt ?? DateTime.UtcNow
        };
        
        return stats;
    }

    public void DeleteWorkspace(string workspaceId)
    {
        var workspace = _workspaces.FirstOrDefault(w => w.Id == workspaceId);
        if (workspace != null)
        {
            _workspaces.Remove(workspace);
            
            // Remove from groups
            foreach (var group in _workspaceGroups)
            {
                group.WorkspaceIds.Remove(workspaceId);
            }
        }
    }

    // System Instructions CRUD
    public List<SystemInstruction> GetInstructions() => _instructions.OrderBy(i => i.Order).ToList();

    public SystemInstruction? GetInstruction(string id) => _instructions.FirstOrDefault(i => i.Id == id);

    public SystemInstruction CreateInstruction(string name, string description, string content, string category)
    {
        var instruction = new SystemInstruction
        {
            Id = Guid.NewGuid().ToString(),
            Name = name,
            Description = description,
            Content = content,
            Category = category,
            Order = _instructions.Count,
            IsEnabled = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        _instructions.Add(instruction);
        return instruction;
    }

    public SystemInstruction UpdateInstruction(string id, string name, string description, string content, string category, bool isEnabled)
    {
        var instruction = GetInstruction(id);
        if (instruction != null)
        {
            instruction.Name = name;
            instruction.Description = description;
            instruction.Content = content;
            instruction.Category = category;
            instruction.IsEnabled = isEnabled;
            instruction.UpdatedAt = DateTime.UtcNow;
        }
        return instruction!;
    }

    public void DeleteInstruction(string id)
    {
        var instruction = _instructions.FirstOrDefault(i => i.Id == id);
        if (instruction != null)
        {
            _instructions.Remove(instruction);
            // Reorder remaining instructions
            for (int i = 0; i < _instructions.Count; i++)
            {
                _instructions[i].Order = i;
            }
        }
    }

    public void ReorderInstructions(List<string> instructionIds)
    {
        for (int i = 0; i < instructionIds.Count; i++)
        {
            var instruction = _instructions.FirstOrDefault(x => x.Id == instructionIds[i]);
            if (instruction != null)
            {
                instruction.Order = i;
            }
        }
    }

    public void ToggleInstruction(string id)
    {
        var instruction = GetInstruction(id);
        if (instruction != null)
        {
            instruction.IsEnabled = !instruction.IsEnabled;
            instruction.UpdatedAt = DateTime.UtcNow;
        }
    }
}

public class WorkspaceStats
{
    public int TotalFiles { get; set; }
    public long TotalSize { get; set; }
    public Dictionary<string, int> FilesByType { get; set; } = new();
    public int TaggedFiles { get; set; }
    public DateTime LastModified { get; set; }
}
