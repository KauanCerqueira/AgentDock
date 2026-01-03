# AgentDock

A modern desktop AI application built with WPF, ASP.NET Core, React, and TypeScript.

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org))
- **.NET 8 SDK** ([Download](https://dotnet.microsoft.com/en-us/download/dotnet/8.0))
- **WebView2 Runtime** (usually pre-installed on Windows 11, [Download for Windows 10](https://developer.microsoft.com/en-us/microsoft-edge/webview2))

### Setup (First Time)

1. **Clone the repository**
   ```bash
   git clone <repo-url>
   cd AgentDock
   ```

2. **Install UI dependencies**
   ```bash
   cd src/AgentDock.UI
   npm install
   cd ../..
   ```

3. **Build the UI**
   ```bash
   cd src/AgentDock.UI
   npm run build
   cd ../..
   ```

### Running in Development Mode

#### Option 1: Full Integration (WPF + Backend + UI)

```bash
# Open the solution in Visual Studio 2022/2024
# Right-click on AgentDock.DesktopHost → Set as Startup Project
# Press F5 to run

# The WPF app will:
# 1. Start the backend (ASP.NET Core on http://localhost:5000)
# 2. Launch WebView2 pointing to localhost:5000
```

#### Option 2: Backend + UI (Dev Server)

```bash
# Terminal 1: Start the backend
cd src/AgentDock.Backend
dotnet run

# Terminal 2: Start the React dev server
cd src/AgentDock.UI
npm run dev

# Open http://localhost:5173
```

#### Option 3: Backend Only (for testing)

```bash
cd src/AgentDock.Backend
dotnet run

# Access API at http://localhost:5000
# UI is served from ./wwwroot (contains the built React app)
```

## 📁 Project Structure

```
AgentDock/
├── AgentDock.sln                          # Solution file
├── src/
│   ├── AgentDock.Backend/                 # ASP.NET Core backend
│   │   ├── Program.cs                     # App startup
│   │   ├── Controllers/                   # API endpoints
│   │   │   ├── EngineController.cs        # Health check
│   │   │   ├── ModelsController.cs        # Model management
│   │   │   ├── ChatController.cs          # Chat API
│   │   │   ├── TasksController.cs         # Task management
│   │   │   └── WorkspacesController.cs    # Workspace management
│   │   ├── Services/
│   │   │   └── MockDataService.cs         # Mock data (in-memory)
│   │   ├── wwwroot/                       # Static files (built React app)
│   │   ├── appsettings.json
│   │   └── AgentDock.Backend.csproj
│   │
│   ├── AgentDock.DesktopHost/             # WPF desktop application
│   │   ├── MainWindow.xaml                # UI layout
│   │   ├── MainWindow.xaml.cs             # Code-behind
│   │   ├── App.xaml                       # App resources
│   │   ├── App.xaml.cs                    # App startup
│   │   ├── Services/
│   │   │   └── BackendService.cs          # Launches backend process
│   │   ├── Program.cs                     # Entry point
│   │   └── AgentDock.DesktopHost.csproj
│   │
│   └── AgentDock.UI/                      # React + Vite frontend
│       ├── src/
│       │   ├── main.tsx                   # React entry point
│       │   ├── App.tsx                    # Main app component
│       │   ├── index.css                  # Global styles (Tailwind)
│       │   ├── pages/                     # Page components
│       │   │   ├── Setup.tsx              # Onboarding page
│       │   │   ├── Models.tsx             # Model management
│       │   │   ├── Chat.tsx               # Chat interface
│       │   │   ├── Tasks.tsx              # Task management
│       │   │   └── Workspaces.tsx         # Workspace management
│       │   ├── components/                # Reusable components
│       │   │   ├── Layout.tsx             # Main layout
│       │   │   ├── Sidebar.tsx            # Navigation sidebar
│       │   │   ├── Topbar.tsx             # Header bar
│       │   │   ├── DetailsDrawer.tsx      # Right panel
│       │   │   └── LoadingPlaceholder.tsx # Loading skeleton
│       │   ├── api/
│       │   │   └── client.ts              # API client
│       │   ├── types/
│       │   │   └── index.ts               # TypeScript types
│       │   └── lib/
│       │       └── utils.ts               # Utility functions
│       ├── public/                        # Static assets
│       ├── package.json
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       └── index.html
│
├── docs/                                  # Documentation
└── README.md                              # This file
```

## 🔧 API Endpoints

All endpoints are on `http://localhost:5000/api`

### Engine
- `GET /api/engine/health` - Check backend status

### Models
- `GET /api/models` - List all models
- `POST /api/models/pull` - Download a model
- `POST /api/models/remove` - Remove a model

### Chat
- `GET /api/chat/history` - Get chat history
- `POST /api/chat/send` - Send a message (returns response)

### Tasks
- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create a new task

### Workspaces
- `GET /api/workspaces` - List connected workspaces
- `POST /api/workspaces/connect` - Connect a new folder

## 🎨 UI Features

### Design System
- **Dark Mode**: Premium dark theme (Tailwind + custom tokens)
- **Typography**: Clean hierarchy, readable fonts
- **Components**: Cards, buttons, forms, tables with hover/focus states
- **Animations**: Smooth transitions (no distracting effects)
- **Responsiveness**: Mobile-friendly layout

### Pages

#### Setup (Onboarding)
- Engine status indicator
- Recommended profiles (Fast, Balanced, Quality)
- Model list with download buttons
- Progress mock on downloads

#### Models
- Filterable table (All / Installed / Available)
- Status badges
- Quick actions (Select, Pull, Remove)
- Active model highlight

#### Chat
- Premium chat interface
- Streaming-like messages (incremental display)
- Input with send button
- Auto-scroll to latest message

#### Tasks
- Task creation wizard
- Status tracking (Queued, Running, Completed, Failed)
- Task list with delete action

#### Workspaces
- Connect folders
- Display indexed workspaces
- Index/cleanup actions

## 🛠️ Development Tips

### Adding a New Page

1. Create `src/AgentDock.UI/src/pages/NewPage.tsx`:
   ```tsx
   import Layout from '@/components/Layout'
   
   export default function NewPage() {
     return (
       <Layout>
         <div className="p-8">
           <h1 className="text-3xl font-bold text-foreground">New Page</h1>
         </div>
       </Layout>
     )
   }
   ```

2. Add route in `src/AgentDock.UI/src/App.tsx`:
   ```tsx
   <Route path="/newpage" element={<NewPage />} />
   ```

3. Add nav item in `src/AgentDock.UI/src/components/Sidebar.tsx`:
   ```tsx
   { path: '/newpage', icon: IconName, label: 'New Page' }
   ```

### Adding an API Endpoint

1. Create controller in `src/AgentDock.Backend/Controllers/YourController.cs`
2. Add methods to `MockDataService.cs`
3. Add client method in `src/AgentDock.UI/src/api/client.ts`
4. Call from React component: `await api.yourMethod()`

### Styling

- Use Tailwind CSS utility classes
- Custom colors via CSS variables in `src/index.css`
- Component classes in `@layer components`
- No hardcoded colors—use theme tokens

## 📦 Build & Deploy

### Build UI for Backend

```bash
cd src/AgentDock.UI
npm run build
# Output goes to ../AgentDock.Backend/wwwroot
```

### Build & Run Backend Only

```bash
cd src/AgentDock.Backend
dotnet publish -c Release -o ./publish
# Run: dotnet AgentDock.Backend.dll
```

### Build WPF App

In Visual Studio:
- Right-click **AgentDock.DesktopHost** → **Publish...**
- Configure publish profile
- Build and create installer (or standalone executable)

## 🐛 Troubleshooting

### WebView2 Not Loading
- Ensure WebView2 Runtime is installed
- Check that backend is running on `http://localhost:5000`
- Check browser console (F12 in WebView2) for errors

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000
# Kill it (replace PID)
taskkill /PID <PID> /F
```

### API Connection Errors
- Ensure backend is running: `dotnet run` in `src/AgentDock.Backend`
- Check CORS policy in `Program.cs`
- Verify API routes match between Backend and frontend client

### npm Install Issues
```bash
cd src/AgentDock.UI
rm -r node_modules package-lock.json
npm install
```

## 📝 Notes

- **Backend** stores data in memory—restarts clear everything
- **UI** is fully mocked—no real AI backend yet
- **WPF** host automatically starts/stops the backend process

## 🚀 Next Steps

1. **Connect real Ollama**: Replace mock models with actual Ollama API
2. **Persistence**: Add SQLite or Postgres for data storage
3. **Streaming**: Implement WebSocket/Server-Sent Events for live responses
4. **Installer**: Create MSIX or WiX installer for distribution
5. **Tests**: Add unit/integration tests (backend + frontend)

## 📄 License

MIT

---

**Built with ❤️ using WPF, ASP.NET Core, React, and Tailwind CSS**
