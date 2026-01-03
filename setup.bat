@echo off
REM AgentDock Setup Script for Windows

echo.
echo ================================================
echo AgentDock - Full Stack Setup
echo ================================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Check .NET
echo Checking .NET 8 SDK...
dotnet --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: .NET SDK is not installed or not in PATH
    echo Please install .NET 8 SDK from https://dotnet.microsoft.com
    pause
    exit /b 1
)

echo.
echo ✓ Prerequisites found
echo.

REM Install UI Dependencies
echo Installing UI dependencies...
cd src\AgentDock.UI
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install UI dependencies
    pause
    exit /b 1
)

echo.
echo ✓ UI dependencies installed
echo.

REM Build UI
echo Building UI...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to build UI
    pause
    exit /b 1
)

cd ..\..

echo.
echo ✓ UI built successfully
echo.

echo ================================================
echo Setup Complete!
echo ================================================
echo.
echo Next steps:
echo.
echo Option 1 - Run Desktop App:
echo   1. Open AgentDock.sln in Visual Studio
echo   2. Set AgentDock.DesktopHost as startup project
echo   3. Press F5
echo.
echo Option 2 - Run Backend Only:
echo   cd src\AgentDock.Backend
echo   dotnet run
echo   Then visit http://localhost:5000
echo.
echo Option 3 - Development Mode:
echo   Terminal 1: cd src\AgentDock.Backend ^& dotnet watch run
echo   Terminal 2: cd src\AgentDock.UI ^& npm run dev
echo   Then visit http://localhost:5173
echo.
pause
