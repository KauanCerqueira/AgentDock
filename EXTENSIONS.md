# Extension Guide - AgentDock

This guide shows how to extend AgentDock with new features.

## Adding a New Page

### Step 1: Create Page Component
`src/AgentDock.UI/src/pages/Analytics.tsx`

```tsx
import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import LoadingPlaceholder from '@/components/LoadingPlaceholder'

export default function Analytics() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch data here
    setTimeout(() => setLoading(false), 500)
  }, [])

  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-2">View usage statistics</p>
        </div>

        {loading ? (
          <LoadingPlaceholder />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cards here */}
          </div>
        )}
      </div>
    </Layout>
  )
}
```

### Step 2: Add Route
`src/AgentDock.UI/src/App.tsx`

```tsx
import Analytics from './pages/Analytics'

export default function App() {
  return (
    <Routes>
      {/* ... existing routes ... */}
      <Route path="/analytics" element={<Analytics />} />
    </Routes>
  )
}
```

### Step 3: Add Navigation Item
`src/AgentDock.UI/src/components/Sidebar.tsx`

```tsx
import { BarChart3 } from 'lucide-react'

const navItems = [
  // ... existing items ...
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
]
```

---

## Adding a Backend API Endpoint

### Step 1: Add to MockDataService
`src/AgentDock.Backend/Services/MockDataService.cs`

```csharp
public class AnalyticsData
{
    public int TotalTasks { get; set; }
    public int CompletedTasks { get; set; }
    public int AverageExecutionTime { get; set; }
}

public AnalyticsData GetAnalytics()
{
    return new AnalyticsData
    {
        TotalTasks = _tasks.Count,
        CompletedTasks = _tasks.Count(t => t.Status == "Completed"),
        AverageExecutionTime = 1250
    };
}
```

### Step 2: Create Controller
`src/AgentDock.Backend/Controllers/AnalyticsController.cs`

```csharp
using AgentDock.Backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace AgentDock.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController(MockDataService mockData) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAnalytics()
    {
        var data = mockData.GetAnalytics();
        return Ok(data);
    }
}
```

### Step 3: Add to API Client
`src/AgentDock.UI/src/api/client.ts`

```typescript
async getAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${API_BASE}/analytics`)
  return res.json()
}
```

### Step 4: Use in Component
`src/AgentDock.UI/src/pages/Analytics.tsx`

```typescript
import { api } from '@/api/client'

useEffect(() => {
  api.getAnalytics()
    .then(data => {
      // Use data
    })
    .finally(() => setLoading(false))
}, [])
```

---

## Integrating Real AI Backend

### Replace Mock Data with Ollama API

**1. Create Ollama Service**
`src/AgentDock.Backend/Services/OllamaService.cs`

```csharp
using System.Net.Http.Json;

namespace AgentDock.Backend.Services;

public class OllamaService
{
    private readonly HttpClient _http = new();
    private const string BaseUrl = "http://localhost:11434/api";

    public async Task<List<string>> GetModels()
    {
        try
        {
            var response = await _http.GetFromJsonAsync<OllamaTagsResponse>($"{BaseUrl}/tags");
            return response?.Models.Select(m => m.Name).ToList() ?? new();
        }
        catch
        {
            return new();
        }
    }

    public async Task<string> Chat(string prompt, string model = "llama2")
    {
        var request = new { model, prompt };
        var response = await _http.PostAsJsonAsync($"{BaseUrl}/generate", request);
        // Parse streaming response...
        return "response";
    }
}

public class OllamaTagsResponse
{
    public List<OllamaModel> Models { get; set; } = new();
}

public class OllamaModel
{
    public string Name { get; set; } = "";
}
```

**2. Update Controllers**
```csharp
[HttpGet]
public async Task<IActionResult> GetModels()
{
    var models = await _ollamaService.GetModels();
    return Ok(models);
}
```

---

## Adding Database Persistence

### Option 1: Entity Framework Core + SQLite

**1. Install NuGet packages**
```bash
cd src/AgentDock.Backend
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

**2. Create DbContext**
`src/AgentDock.Backend/Data/AgentDockContext.cs`

```csharp
using Microsoft.EntityFrameworkCore;

public class AgentDockContext : DbContext
{
    public DbSet<TaskEntity> Tasks { get; set; }
    public DbSet<WorkspaceEntity> Workspaces { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder options)
    {
        options.UseSqlite("Data Source=agentdock.db");
    }
}
```

**3. Create migrations**
```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

**4. Replace MockDataService with database calls**

---

## Adding Real-Time Updates with WebSocket

### Use SignalR

**1. Install package**
```bash
dotnet add package Microsoft.AspNetCore.SignalR
```

**2. Create Hub**
`src/AgentDock.Backend/Hubs/ChatHub.cs`

```csharp
using Microsoft.AspNetCore.SignalR;

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}
```

**3. Configure in Program.cs**
```csharp
builder.Services.AddSignalR();
app.MapHub<ChatHub>("/chatHub");
```

**4. Connect from React**
```typescript
import * as signalR from "@microsoft/signalr"

const connection = new signalR.HubConnectionBuilder()
  .withUrl("/chatHub")
  .withAutomaticReconnect()
  .build()

connection.on("ReceiveMessage", (user, message) => {
  // Update UI
})

await connection.start()
```

---

## Adding Authentication

### Simple JWT Auth

**1. Add package**
```bash
dotnet add package System.IdentityModel.Tokens.Jwt
```

**2. Create auth service**
```csharp
public class AuthService
{
    public string GenerateToken(string userId)
    {
        var key = Encoding.ASCII.GetBytes("your-secret-key-min-32-chars");
        var handler = new JwtSecurityTokenHandler();
        var token = handler.CreateToken(new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[] {
                new Claim(ClaimTypes.NameIdentifier, userId)
            }),
            Expires = DateTime.UtcNow.AddHours(24),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        });
        return handler.WriteToken(token);
    }
}
```

**3. Add to controllers**
```csharp
[Authorize]
[HttpGet("secure")]
public IActionResult SecureEndpoint()
{
    return Ok("Authenticated!");
}
```

---

## Adding Tests

### Frontend Tests (Jest + React Testing Library)

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

`src/AgentDock.UI/src/components/__tests__/Sidebar.test.tsx`

```typescript
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Sidebar from '../Sidebar'

test('renders navigation items', () => {
  render(
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>
  )
  expect(screen.getByText('Chat')).toBeInTheDocument()
})
```

### Backend Tests (xUnit)

```bash
dotnet add package xunit
dotnet add package Moq
```

`src/AgentDock.Backend.Tests/ModelsControllerTests.cs`

```csharp
public class ModelsControllerTests
{
    [Fact]
    public async Task GetModels_ReturnsOkResult()
    {
        var mockService = new Mock<MockDataService>();
        var controller = new ModelsController(mockService.Object);
        
        var result = controller.GetModels();
        
        Assert.IsType<OkObjectResult>(result);
    }
}
```

---

## Deploying to Production

### Create Windows Installer (MSIX)

1. In Visual Studio: Right-click **AgentDock.DesktopHost** → **Package**
2. Sign with certificate
3. Create store listing

### Docker Deployment

`Dockerfile`
```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY src/AgentDock.Backend/publish .
EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "AgentDock.Backend.dll"]
```

Build and run:
```bash
docker build -t agentdock:latest .
docker run -p 5000:5000 agentdock:latest
```

---

## Performance Optimization

### Frontend
```typescript
// Lazy load routes
const Chat = lazy(() => import('./pages/Chat'))

// Memoize expensive components
export default memo(function MyComponent(props) {
  return <div>{props.children}</div>
})

// Debounce API calls
import { debounce } from 'lodash-es'
const handleSearch = debounce((query) => {
  api.search(query)
}, 300)
```

### Backend
```csharp
// Add caching
services.AddMemoryCache();

[HttpGet]
[ResponseCache(Duration = 60)]
public IActionResult GetModels()
{
    return Ok(_service.GetModels());
}

// Use async/await properly
public async Task<List<Model>> GetModelsAsync()
{
    return await _db.Models.ToListAsync();
}
```

---

For more examples, see **DEVELOPMENT.md** and **README.md**.
