# Development Guide

## Environment Setup

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- ESLint

### Visual Studio 2022/2024 Extensions
- Vite Extension (optional)
- Web Essentials
- Code Cleanup

## Running the Project

### Full Stack (Recommended)
1. Open `AgentDock.sln` in Visual Studio
2. Set `AgentDock.DesktopHost` as startup project
3. Press `F5`

The WPF app will automatically:
- Start the backend (ASP.NET Core)
- Wait for it to be ready
- Launch WebView2 pointing to localhost:5000

### Development Workflow

**Terminal 1: Backend**
```bash
cd src/AgentDock.Backend
dotnet watch run
```

**Terminal 2: Frontend**
```bash
cd src/AgentDock.UI
npm run dev
```

Then visit http://localhost:5173 in your browser.

## Debugging

### Debug Backend
In Visual Studio:
- Set breakpoints in controllers or services
- Press F5 (runs DesktopHost which starts backend)
- Or run backend directly with `dotnet run`

### Debug Frontend
In browser (WebView2 or Vite dev server):
- Press F12 to open dev tools
- Set breakpoints in Sources tab
- Inspect elements and network requests

### Debug WPF Host
- Set breakpoints in MainWindow.xaml.cs or BackendService.cs
- Press F5 from Visual Studio
- View WPF-specific properties in Debug window

## Common Tasks

### Add a New API Endpoint

**1. Backend (Controller)**
```csharp
[HttpPost("custom")]
public async Task<IActionResult> CustomEndpoint([FromBody] CustomRequest request)
{
    // Your logic here
    return Ok(new { result = "success" });
}
```

**2. Backend (Service)**
Add method to `MockDataService` to handle business logic

**3. Frontend (API Client)**
```typescript
async customMethod(param: string): Promise<any> {
  const res = await fetch(`${API_BASE}/controller/custom`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ param }),
  })
  return res.json()
}
```

**4. React (Component)**
```typescript
const result = await api.customMethod('value')
```

### Add a New Page

**1. Create page component** `src/AgentDock.UI/src/pages/NewPage.tsx`
```tsx
import Layout from '@/components/Layout'

export default function NewPage() {
  return (
    <Layout>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">New Page</h1>
      </div>
    </Layout>
  )
}
```

**2. Add route** in `App.tsx`
```tsx
<Route path="/newpage" element={<NewPage />} />
```

**3. Add sidebar link** in `Sidebar.tsx`
```tsx
{ path: '/newpage', icon: IconName, label: 'New Page' }
```

### Styling Best Practices

- Use Tailwind utilities: `className="px-4 py-2 rounded-lg"`
- For reusable styles, add to `@layer components` in `index.css`
- Use theme colors via CSS variables: `bg-primary`, `text-foreground`
- No hardcoded hex colors in components
- All responsive via Tailwind breakpoints

### State Management

Currently using React hooks (useState, useContext). For larger apps:
- Consider Zustand (already in dependencies)
- Or Redux if needed

Simple example with Zustand:
```tsx
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

## Build & Deployment

### Build UI for Production
```bash
cd src/AgentDock.UI
npm run build
# Output: ../AgentDock.Backend/wwwroot/
```

### Build Backend Release
```bash
cd src/AgentDock.Backend
dotnet publish -c Release -o ./publish
```

### Build Desktop App Installer
1. In Visual Studio, right-click `AgentDock.DesktopHost`
2. Select **Publish...**
3. Create new profile or use existing
4. Configure to create self-contained or installer package

## Troubleshooting

### Port 5000 Already in Use
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### WebView2 Initialization Error
- Install WebView2 Runtime
- Check Windows version (should work on Windows 10+)
- Verify `http://localhost:5000` is accessible

### npm Dependencies Error
```bash
cd src/AgentDock.UI
rm -r node_modules package-lock.json
npm install
```

### .NET Version Mismatch
Ensure you have .NET 8 SDK installed:
```bash
dotnet --version
```

## Performance Tips

### Frontend
- Use React.memo() for expensive components
- Lazy load routes with React.lazy()
- Debounce API calls if needed
- Monitor bundle size with `npm run build`

### Backend
- Use async/await properly
- Pagination for large lists
- Cache if needed (currently in-memory)
- Consider adding logging

## Next Steps

1. **Real AI Backend**: Replace mock data with actual Ollama/LLM calls
2. **Database**: Add PostgreSQL/SQLite for persistence
3. **Auth**: Add user authentication if needed
4. **WebSocket**: Implement for real-time updates
5. **Tests**: Add Jest (frontend) and xUnit (backend) tests
6. **CI/CD**: GitHub Actions for automated builds
7. **Containerization**: Docker for easier deployment

---

Happy coding! 🚀
