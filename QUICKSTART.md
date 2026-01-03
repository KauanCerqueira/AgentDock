# Getting Started with AgentDock

Welcome! This guide will have you up and running in **5 minutes**.

## Prerequisites Check

Open PowerShell or Command Prompt and run:

```powershell
# Check Node.js (need 18+)
node --version

# Check .NET 8
dotnet --version

# Check WebView2 (Windows 11 has it by default)
# For Windows 10, install from: https://developer.microsoft.com/en-us/microsoft-edge/webview2/
```

If any are missing, install them first.

## Installation (One-time)

### Method 1: Automatic (Recommended)

```bash
cd c:\Reps\DockAI
setup.bat
```

This will:
1. ✓ Verify Node.js and .NET 8
2. ✓ Install npm dependencies
3. ✓ Build the React UI

**Done!** Skip to "Running the App"

### Method 2: Manual

```bash
# 1. Go to UI folder
cd c:\Reps\DockAI\src\AgentDock.UI

# 2. Install npm packages
npm install

# 3. Build the UI (compiles React to wwwroot)
npm run build

# 4. Done!
cd ..\..
```

## Running the App

### 🎯 Easiest Way: Desktop App

1. Open `AgentDock.sln` in **Visual Studio 2022/2024**
2. Right-click **AgentDock.DesktopHost** → **Set as Startup Project**
3. Press **F5** or click **▶ Run**

That's it! The app will:
- Start the backend automatically
- Launch a window with your app
- Be ready to use in ~3 seconds

### 🔧 Development Mode: Hot Reload

**Terminal 1 (Backend with auto-reload):**
```bash
cd src\AgentDock.Backend
dotnet watch run
# Waits on http://localhost:5000
```

**Terminal 2 (Frontend with hot reload):**
```bash
cd src\AgentDock.UI
npm run dev
# Open http://localhost:5173
```

### 🖥️ Backend Only

```bash
cd src\AgentDock.Backend
dotnet run
# Open http://localhost:5000
```

## What You'll See

### 📱 5 Pages
1. **Setup** - Onboarding, engine status, download models
2. **Models** - Manage AI models (install/remove)
3. **Chat** - Chat interface with mock AI
4. **Tasks** - Create and track processing tasks
5. **Workspaces** - Connect project folders

### 🎨 Dark Mode UI
- Premium dark theme
- Smooth animations
- Professional components
- Responsive layout

### 📡 Working Backend
- 10+ API endpoints
- Mock data (in-memory)
- Ready for real AI integration
- CORS enabled for frontend

## Useful Commands

```bash
# Watch mode (auto-rebuild on file change)
cd src\AgentDock.Backend
dotnet watch run

# Clean and rebuild
cd src\AgentDock.Backend
dotnet clean
dotnet build

# Build for production
cd src\AgentDock.UI
npm run build

# Check for errors
cd src\AgentDock.UI
npm run type-check

# Kill process on port 5000 (if stuck)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## Troubleshooting

### "Node modules not found"
```bash
cd src\AgentDock.UI
npm install
```

### "Port 5000 already in use"
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "WebView2 not initializing"
- Make sure backend is running on `http://localhost:5000`
- On Windows 10, install WebView2 Runtime: https://bit.ly/webview2

### "Can't connect to backend"
- Check that `dotnet run` is actually running
- Check firewall isn't blocking localhost:5000
- Look for error messages in terminal

### ".NET version mismatch"
```bash
dotnet --version
# Should be 8.0.x
```

## Next Steps

- 📖 Read [README.md](./README.md) for complete documentation
- 🚀 See [DEVELOPMENT.md](./DEVELOPMENT.md) for architecture details
- 🔌 Check [EXTENSIONS.md](./EXTENSIONS.md) for how to add features
- 📁 Review [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for file organization

## Common Questions

**Q: Can I use a different port?**
A: Yes! Edit `Program.cs` in Backend, change the `.Run()` URL, and update the proxy in `vite.config.ts` and MainWindow.xaml.cs.

**Q: How do I add new pages?**
A: Create a .tsx file in `src/pages/`, add a route to `App.tsx`, and add a nav item to `Sidebar.tsx`. See EXTENSIONS.md for example.

**Q: Can I build an installer?**
A: Yes! Right-click DesktopHost in Visual Studio → Publish. See EXTENSIONS.md for details.

**Q: Is the AI actually working?**
A: Currently it's mocked (simulated). To connect to real Ollama or another LLM, see EXTENSIONS.md.

**Q: Can I deploy this?**
A: Absolutely! Build the backend, build the UI, create an MSIX installer. See EXTENSIONS.md.

## Quick Reference

| What | Command | URL |
|------|---------|-----|
| Desktop App | `F5` in VS | N/A |
| Backend | `dotnet run` | http://localhost:5000 |
| Frontend Dev | `npm run dev` | http://localhost:5173 |
| API Docs | Auto-generated | http://localhost:5000/swagger |

## Support

- 📚 [README.md](./README.md) - Full documentation
- 💻 [DEVELOPMENT.md](./DEVELOPMENT.md) - Architecture & setup
- 🔧 [EXTENSIONS.md](./EXTENSIONS.md) - Feature examples
- 📁 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - File layout

---

**Happy coding!** 🚀

Questions? Check the docs above, and feel free to explore the code!
