# Script para baixar llama.cpp binários

Write-Host "?? AgentDock - llama.cpp Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$LLAMA_VERSION = "b3634"
$LLAMA_URL = "https://github.com/ggerganov/llama.cpp/releases/download/$LLAMA_VERSION/llama-$LLAMA_VERSION-bin-win-cuda-cu12.2.0-x64.zip"
$DOWNLOAD_DIR = "downloads"
$BIN_DIR = "bin/llama"

# Criar diretórios
New-Item -ItemType Directory -Force -Path $DOWNLOAD_DIR | Out-Null
New-Item -ItemType Directory -Force -Path $BIN_DIR | Out-Null

Write-Host "?? Baixando llama.cpp ($LLAMA_VERSION)..." -ForegroundColor Yellow
$zipFile = "$DOWNLOAD_DIR/llama.zip"

try {
    Invoke-WebRequest -Uri $LLAMA_URL -OutFile $zipFile -UseBasicParsing
    Write-Host "? Download completo!" -ForegroundColor Green
    
    Write-Host "?? Extraindo arquivos..." -ForegroundColor Yellow
    Expand-Archive -Path $zipFile -DestinationPath $DOWNLOAD_DIR -Force
    
    # Copiar apenas os executáveis necessários
    $extractedFolder = Get-ChildItem -Path $DOWNLOAD_DIR -Filter "llama-*" -Directory | Select-Object -First 1
    
    if ($extractedFolder) {
        Write-Host "?? Copiando binários para $BIN_DIR..." -ForegroundColor Yellow
        
        Copy-Item "$($extractedFolder.FullName)/llama-server.exe" -Destination $BIN_DIR -Force
        Copy-Item "$($extractedFolder.FullName)/llama-cli.exe" -Destination $BIN_DIR -Force
        
        # Copiar DLLs CUDA se existirem
        if (Test-Path "$($extractedFolder.FullName)/*.dll") {
            Copy-Item "$($extractedFolder.FullName)/*.dll" -Destination $BIN_DIR -Force
        }
        
        Write-Host "? Binários instalados com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "? Erro: Pasta extraída não encontrada" -ForegroundColor Red
        exit 1
    }
    
    # Limpar arquivos temporários
    Write-Host "?? Limpando arquivos temporários..." -ForegroundColor Yellow
    Remove-Item $zipFile -Force
    Remove-Item $extractedFolder.FullName -Recurse -Force
    
    Write-Host ""
    Write-Host "? SETUP COMPLETO!" -ForegroundColor Green
    Write-Host ""
    Write-Host "?? Próximos passos:" -ForegroundColor Cyan
    Write-Host "  1. Baixe um modelo GGUF (ex: llama-2-7b-chat.Q4_K_M.gguf)"
    Write-Host "  2. Coloque o modelo na pasta 'models/'"
    Write-Host "  3. Execute o AgentDock"
    Write-Host ""
    Write-Host "?? Sugestões de modelos:" -ForegroundColor Yellow
    Write-Host "  - https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF"
    Write-Host "  - https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF"
    Write-Host "  - https://huggingface.co/TheBloke/CodeLlama-7B-Instruct-GGUF"
    Write-Host ""
    
} catch {
    Write-Host "? Erro durante o download/instalação:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "?? Download manual:" -ForegroundColor Yellow
    Write-Host "  $LLAMA_URL"
    Write-Host ""
    exit 1
}
