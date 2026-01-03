#!/usr/bin/env pwsh
# Script para recompilar e reiniciar o backend do AgentDock

Write-Host "?? Parando Backend..." -ForegroundColor Yellow
Get-Process -Name "AgentDock.Backend" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "?? Recompilando Backend..." -ForegroundColor Cyan
dotnet build src\AgentDock.Backend\AgentDock.Backend.csproj

if ($LASTEXITCODE -eq 0) {
    Write-Host "? Backend recompilado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "?? Iniciando Backend..." -ForegroundColor Cyan
    
    # Inicia o backend em background
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "dotnet run --project src\AgentDock.Backend\AgentDock.Backend.csproj" -WindowStyle Normal
    
    Write-Host "? Aguardando backend iniciar..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    Write-Host "? Backend iniciado! Testando API..." -ForegroundColor Green
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:5000/api/system/stats" -Method Get -TimeoutSec 5
        Write-Host "? API respondendo corretamente!" -ForegroundColor Green
        
        if ($response.networkInfo) {
            Write-Host "? NetworkInfo presente na resposta!" -ForegroundColor Green
        } else {
            Write-Host "??  NetworkInfo NÃO presente (backend antigo?)" -ForegroundColor Yellow
        }
        
        if ($response.gpuInfo) {
            Write-Host "? GPUInfo detectada: $($response.gpuInfo.name)" -ForegroundColor Green
        } else {
            Write-Host "??  GPUInfo não detectada (GPU não suportada ou sem permissões admin)" -ForegroundColor Cyan
        }
    } catch {
        Write-Host "? Erro ao testar API: $_" -ForegroundColor Red
    }
} else {
    Write-Host "? Erro ao recompilar backend!" -ForegroundColor Red
}
