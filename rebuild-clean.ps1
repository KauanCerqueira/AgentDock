#!/usr/bin/env pwsh
# Script para rebuild limpo do AgentDock

Write-Host "================================" -ForegroundColor Cyan
Write-Host "AgentDock - Rebuild Limpo" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. Fechar processos
Write-Host "1. Fechando processos do AgentDock..." -ForegroundColor Yellow
Get-Process | Where-Object {
    $_.Name -like "*AgentDock*" -or 
    $_.Name -like "*electron*" -or
    $_.ProcessName -like "*dotnet*" -and $_.MainWindowTitle -like "*AgentDock*"
} | Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2
Write-Host "   ✓ Processos fechados" -ForegroundColor Green

# 2. Limpar pasta dist
Write-Host ""
Write-Host "2. Limpando pasta dist..." -ForegroundColor Yellow
$maxRetries = 3
$retryCount = 0
$cleaned = $false

while (-not $cleaned -and $retryCount -lt $maxRetries) {
    try {
        if (Test-Path "dist") {
            Remove-Item -Path "dist" -Recurse -Force -ErrorAction Stop
        }
        $cleaned = $true
        Write-Host "   ✓ Pasta dist limpa" -ForegroundColor Green
    }
    catch {
        $retryCount++
        Write-Host "   ⚠ Tentativa $retryCount falhou, aguardando..." -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

if (-not $cleaned) {
    Write-Host "   ✗ Não foi possível limpar dist. Fechando tudo manualmente..." -ForegroundColor Red
    Write-Host "   Por favor, feche o Gerenciador de Tarefas e mate os processos:" -ForegroundColor Yellow
    Write-Host "   - AgentDock.exe" -ForegroundColor White
    Write-Host "   - electron.exe" -ForegroundColor White
    Write-Host "   - AgentDock.Backend.exe" -ForegroundColor White
    Write-Host ""
    Write-Host "   Depois execute este script novamente." -ForegroundColor Yellow
    exit 1
}

# 3. Rebuild backend (se necessário)
$rebuildBackend = Read-Host "`n3. Rebuild backend? (s/n) [n]"
if ($rebuildBackend -eq "s" -or $rebuildBackend -eq "S") {
    Write-Host "   Compilando backend .NET..." -ForegroundColor Yellow
    Set-Location "src\AgentDock.Backend"
    dotnet publish -c Release -o bin/Release/net8.0/publish --nologo
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ✗ Erro ao compilar backend" -ForegroundColor Red
        Set-Location ..\..
        exit 1
    }
    Set-Location ..\..
    Write-Host "   ✓ Backend compilado" -ForegroundColor Green
}

# 4. Rebuild frontend
$rebuildFrontend = Read-Host "`n4. Rebuild frontend? (s/n) [n]"
if ($rebuildFrontend -eq "s" -or $rebuildFrontend -eq "S") {
    Write-Host "   Compilando frontend React..." -ForegroundColor Yellow
    Set-Location "src\AgentDock.UI"
    npm run build --silent
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ✗ Erro ao compilar frontend" -ForegroundColor Red
        Set-Location ..\..
        exit 1
    }
    Set-Location ..\..
    Write-Host "   ✓ Frontend compilado" -ForegroundColor Green
}

# 5. Pack com electron-builder
Write-Host ""
Write-Host "5. Empacotando com electron-builder..." -ForegroundColor Yellow
npx electron-builder --publish never

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Erro ao empacotar" -ForegroundColor Red
    exit 1
}

# 6. Resumo
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✅ Build Concluído!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Arquivos gerados:" -ForegroundColor Yellow
Get-ChildItem dist\*.exe | Select-Object Name, @{Name="Tamanho";Expression={"{0:N2} MB" -f ($_.Length/1MB)}}, LastWriteTime | Format-Table -AutoSize

Write-Host ""
Write-Host "🧪 Teste:" -ForegroundColor Green
Write-Host "   dist\AgentDock-1.0.0-portable.exe" -ForegroundColor White
Write-Host ""
