#!/usr/bin/env pwsh
# Script para criar release ZIP do AgentDock

param(
    [string]$Version = "1.0.0",
    [switch]$IncludeSource = $false
)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "AgentDock - Release Package Creator" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$releaseDir = "release"
$packageName = "AgentDock-v$Version"
$packageDir = Join-Path $releaseDir $packageName

# Limpar pasta de release anterior
if (Test-Path $releaseDir) {
    Write-Host "🗑️  Limpando releases anteriores..." -ForegroundColor Yellow
    Remove-Item -Path $releaseDir -Recurse -Force
}

# Criar diretórios
Write-Host "📁 Criando estrutura de release..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path $packageDir -Force | Out-Null

# 1. Build do projeto
Write-Host ""
Write-Host "🔨 Fazendo build do projeto..." -ForegroundColor Cyan
Write-Host "   Isso pode levar alguns minutos..." -ForegroundColor Gray

# Build backend
Write-Host ""
Write-Host "   📦 Backend (.NET)..." -ForegroundColor Yellow
Set-Location "src/AgentDock.Backend"
dotnet publish -c Release -o bin/Release/net8.0/publish --nologo
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar backend" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Set-Location ../..

# Build frontend
Write-Host ""
Write-Host "   🎨 Frontend (React)..." -ForegroundColor Yellow
Set-Location "src/AgentDock.UI"
npm run build --silent
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar frontend" -ForegroundColor Red
    Set-Location ../..
    exit 1
}
Set-Location ../..

Write-Host "   ✅ Build concluído!" -ForegroundColor Green

# 2. Copiar arquivos essenciais
Write-Host ""
Write-Host "📋 Copiando arquivos para o pacote..." -ForegroundColor Cyan

# Electron
Write-Host "   - Electron files" -ForegroundColor Gray
Copy-Item -Path "electron" -Destination $packageDir -Recurse

# Backend compilado
Write-Host "   - Backend (compiled)" -ForegroundColor Gray
$backendDest = Join-Path $packageDir "backend"
New-Item -ItemType Directory -Path $backendDest -Force | Out-Null
Copy-Item -Path "src/AgentDock.Backend/bin/Release/net8.0/publish/*" -Destination $backendDest -Recurse

# Frontend compilado (já está no wwwroot do backend após build)
# Não precisa copiar separadamente

# Node modules essenciais
Write-Host "   - Node dependencies" -ForegroundColor Gray
if (-not (Test-Path "node_modules")) {
    Write-Host "   ⚠️  Instalando dependências..." -ForegroundColor Yellow
    npm install --silent
}
Copy-Item -Path "node_modules" -Destination $packageDir -Recurse

# Package.json
Write-Host "   - Configuration files" -ForegroundColor Gray
Copy-Item -Path "package.json" -Destination $packageDir

# Scripts de setup
Write-Host "   - Setup scripts" -ForegroundColor Gray
Copy-Item -Path "setup.ps1" -Destination $packageDir
Copy-Item -Path "setup.sh" -Destination $packageDir

# Llama.cpp (apenas CPU variant para manter tamanho pequeno)
Write-Host "   - Llama.cpp (CPU variant)" -ForegroundColor Gray
if (Test-Path "llama.cpp/cpu") {
    $llamaDir = Join-Path $packageDir "llama.cpp"
    New-Item -ItemType Directory -Path $llamaDir -Force | Out-Null
    Copy-Item -Path "llama.cpp/cpu" -Destination $llamaDir -Recurse
    
    # Criar pasta models
    $modelsDir = Join-Path $llamaDir "models"
    New-Item -ItemType Directory -Path $modelsDir -Force | Out-Null
    
    # .gitkeep para manter pasta
    New-Item -ItemType File -Path (Join-Path $modelsDir ".gitkeep") -Force | Out-Null
} else {
    Write-Host "   ⚠️  Aviso: llama.cpp/cpu não encontrado. Execute setup.ps1 primeiro." -ForegroundColor Yellow
}

# Documentação
Write-Host "   - Documentation" -ForegroundColor Gray
Copy-Item -Path "README.md" -Destination $packageDir
Copy-Item -Path "LICENSE" -Destination $packageDir
Copy-Item -Path "CONTRIBUTING.md" -Destination $packageDir -ErrorAction SilentlyContinue
Copy-Item -Path "docs" -Destination $packageDir -Recurse -ErrorAction SilentlyContinue

# Script de inicialização rápida
$startScript = @"
@echo off
echo ================================
echo AgentDock - Starting...
echo ================================
echo.
echo Starting Electron application...
node electron/main.js
"@
Set-Content -Path (Join-Path $packageDir "start.bat") -Value $startScript

# Linux/Mac start script
$startScriptUnix = @"
#!/bin/bash
echo "================================"
echo "AgentDock - Starting..."
echo "================================"
echo ""
echo "Starting Electron application..."
node electron/main.js
"@
Set-Content -Path (Join-Path $packageDir "start.sh") -Value $startScriptUnix

# 3. Criar arquivo de instruções
$instructions = @"
# AgentDock v$Version - Release Package

## Quick Start

### Windows:
1. Run setup.ps1 to download llama.cpp for your GPU
2. Run start.bat to launch AgentDock

### Linux/macOS:
1. chmod +x setup.sh && ./setup.sh
2. chmod +x start.sh && ./start.sh

## Requirements
- Node.js v20+
- .NET 8 Runtime (for backend)

## Full Documentation
See README.md for complete installation and usage instructions.

## Support
- Issues: https://github.com/KauanCerqueira/AgentDock/issues
- Docs: https://github.com/KauanCerqueira/AgentDock

---
Made with ❤️ by the AgentDock community
"@
Set-Content -Path (Join-Path $packageDir "QUICK_START.txt") -Value $instructions

# 4. Incluir código fonte (opcional)
if ($IncludeSource) {
    Write-Host ""
    Write-Host "📦 Incluindo código fonte..." -ForegroundColor Yellow
    $srcDest = Join-Path $packageDir "src"
    Copy-Item -Path "src" -Destination $srcDest -Recurse -Exclude @("bin", "obj", "node_modules", "dist")
}

# 5. Criar ZIP
Write-Host ""
Write-Host "🗜️  Comprimindo pacote..." -ForegroundColor Cyan

$zipPath = Join-Path $releaseDir "$packageName.zip"
Compress-Archive -Path $packageDir -DestinationPath $zipPath -Force

if (Test-Path $zipPath) {
    $zipSize = (Get-Item $zipPath).Length / 1MB
    Write-Host "   ✅ ZIP criado: $zipPath" -ForegroundColor Green
    Write-Host "   📊 Tamanho: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Gray
} else {
    Write-Host "   ❌ Erro ao criar ZIP" -ForegroundColor Red
    exit 1
}

# 6. Resumo
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Release criado com sucesso!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Arquivo: $zipPath" -ForegroundColor White
Write-Host "📊 Tamanho: $([math]::Round($zipSize, 2)) MB" -ForegroundColor White
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Yellow
Write-Host "   1. Testar o pacote extraindo e executando" -ForegroundColor Gray
Write-Host "   2. Criar uma release no GitHub" -ForegroundColor Gray
Write-Host "   3. Fazer upload do arquivo $packageName.zip" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 Para criar instaladores (.exe, .dmg, etc):" -ForegroundColor Yellow
Write-Host "   Execute: npm run build" -ForegroundColor White
Write-Host ""
