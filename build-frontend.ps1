# Script para compilar o frontend React
$ErrorActionPreference = "Stop"

Write-Host "?? Compilando AgentDock UI..." -ForegroundColor Cyan

$UIPath = Join-Path $PSScriptRoot "src\AgentDock.UI"

if (-not (Test-Path $UIPath)) {
    Write-Host "? Diretório AgentDock.UI não encontrado: $UIPath" -ForegroundColor Red
    exit 1
}

Push-Location $UIPath

try {
    # Verifica se node_modules existe
    if (-not (Test-Path "node_modules")) {
        Write-Host "?? Instalando dependências npm..." -ForegroundColor Yellow
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "Falha ao instalar dependências npm"
        }
    }

    # Build do Vite
    Write-Host "?? Compilando com Vite..." -ForegroundColor Yellow
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao compilar o frontend"
    }

    Write-Host "? Frontend compilado com sucesso!" -ForegroundColor Green
    Write-Host "?? Output: src\AgentDock.Backend\wwwroot" -ForegroundColor Green
}
catch {
    Write-Host "? Erro: $_" -ForegroundColor Red
    Pop-Location
    exit 1
}
finally {
    Pop-Location
}
