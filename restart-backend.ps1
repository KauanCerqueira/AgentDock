#!/usr/bin/env pwsh
# Script para reiniciar o backend do AgentDock

Write-Host "?? Parando processo do Backend..." -ForegroundColor Yellow

# Para todos os processos AgentDock.Backend
Get-Process -Name "AgentDock.Backend" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host "? Backend parado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "?? Para iniciar o backend novamente:" -ForegroundColor Cyan
Write-Host "   1. Pressione F5 no Visual Studio, ou" -ForegroundColor White
Write-Host "   2. Execute: dotnet run --project src/AgentDock.Backend" -ForegroundColor White
Write-Host ""
Write-Host "?? Após iniciar, teste a API:" -ForegroundColor Cyan
Write-Host "   curl http://localhost:5000/api/system/stats" -ForegroundColor White
