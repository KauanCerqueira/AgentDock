# Build and Run Instructions

## Quick Start

### Windows
```bash
setup.bat
```

This will:
1. Check for Node.js and .NET 8
2. Install npm dependencies
3. Build the React UI to `src/AgentDock.Backend/wwwroot`

### macOS/Linux
```bash
bash setup.sh
```

## Manual Setup

### 1. Install Dependencies
```bash
cd src/AgentDock.UI
npm install
cd ../..
```

### 2. Build UI
```bash
cd src/AgentDock.UI
npm run build
cd ../..
```

The built files will be in `src/AgentDock.Backend/wwwroot/`

## Running the Application

### Option A: Full Desktop App (Recommended)
```
Open AgentDock.sln in Visual Studio 2022+
Set AgentDock.DesktopHost as startup project
Press F5
```

### Option B: Backend + Dev Server
```
Terminal 1: cd src/AgentDock.Backend && dotnet run
Terminal 2: cd src/AgentDock.UI && npm run dev
Visit: http://localhost:5173
```

### Option C: Backend Only (Production-like)
```
cd src/AgentDock.Backend
dotnet run
Visit: http://localhost:5000
```

## Troubleshooting

See README.md for detailed troubleshooting guide.

### Quick Fixes

**Clear npm cache**
```bash
cd src/AgentDock.UI
npm cache clean --force
rm -r node_modules package-lock.json
npm install
```

**Rebuild solution**
```bash
dotnet clean
dotnet build
```

**Kill process on port 5000**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```
