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
    public string Status { get; set; } = "";
    public string Type { get; set; } = "";
    public DateTime CreatedAt { get; set; }
}

public class Workspace
{
    public string Id { get; set; } = "";
    public string Name { get; set; } = "";
    public string Path { get; set; } = "";
    public string Status { get; set; } = "Ready";
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

    public MockDataService()
    {
        _workspaces.Add(new Workspace { Id = "1", Name = "Projeto Principal", Path = "C:\\Projetos\\Main", Status = "Indexed" });
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

    public Workspace ConnectWorkspace(string path)
    {
        var workspace = new Workspace
        {
            Id = Guid.NewGuid().ToString(),
            Name = Path.GetFileName(path),
            Path = path,
            Status = "Indexing"
        };
        _workspaces.Add(workspace);
        _ = System.Threading.Tasks.Task.Delay(1500).ContinueWith(_ =>
        {
            workspace.Status = "Indexed";
        });
        return workspace;
    }
}
