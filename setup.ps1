# AgentDock Setup Script for Windows
# This script automates the setup process for Windows users

Write-Host "================================" -ForegroundColor Cyan
Write-Host "AgentDock Setup - Windows" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if llama.cpp already exists
if (Test-Path "llama.cpp\config.json") {
    Write-Host "✓ llama.cpp directory already exists" -ForegroundColor Green
} else {
    Write-Host "Downloading llama.cpp binaries..." -ForegroundColor Yellow
    
    # Detect GPU type and architecture
    Write-Host "Detecting system configuration..." -ForegroundColor Cyan
    
    # Detect architecture
    $arch = (Get-WmiObject Win32_Processor).Architecture
    $isArm64 = $arch -eq 12  # ARM64
    
    # Detect GPU
    $gpuInfo = Get-WmiObject Win32_VideoController | Select-Object -First 1
    $gpuName = $gpuInfo.Name.ToLower()
    
    $variant = "cpu"
    if ($gpuName -match "nvidia|geforce|rtx|gtx") {
        Write-Host "✓ NVIDIA GPU detected" -ForegroundColor Green
        $cudaVersion = "12.4"  # Default to latest CUDA
        if ($gpuName -match "rtx 40|rtx 50") {
            $cudaVersion = "12.4"
        }
        $variant = "cuda-$cudaVersion"
    }
    elseif ($gpuName -match "amd|radeon|rx") {
        Write-Host "✓ AMD GPU detected" -ForegroundColor Green
        $variant = "hip"
    }
    elseif ($gpuName -match "intel|arc|iris") {
        Write-Host "✓ Intel GPU detected" -ForegroundColor Green
        $variant = "sycl"
    }
    else {
        Write-Host "ℹ No dedicated GPU detected, using CPU variant" -ForegroundColor Yellow
        # Check for Vulkan support as fallback
        if (Get-Command vulkaninfo -ErrorAction SilentlyContinue) {
            Write-Host "ℹ Vulkan support detected, using Vulkan variant" -ForegroundColor Cyan
            $variant = "vulkan"
        }
    }
    
    Write-Host "Selected variant: $variant" -ForegroundColor Cyan
    
    # Build download URL
    $archSuffix = if ($isArm64) { "arm64" } else { "x64" }
    $downloadUrl = "https://github.com/KauanCerqueira/AgentDock/releases/download/v1.0.0/llama.cpp-$variant-win-$archSuffix.zip"
    
    Write-Host "Downloading from: $downloadUrl" -ForegroundColor Gray
    
    try {
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $downloadUrl -OutFile "llama.cpp.zip" -ErrorAction Stop
        Write-Host "✓ Download completed" -ForegroundColor Green
        
        Write-Host "Extracting llama.cpp..." -ForegroundColor Yellow
        Expand-Archive -Path "llama.cpp.zip" -DestinationPath "." -Force
        Remove-Item "llama.cpp.zip"
        Write-Host "✓ Extraction completed" -ForegroundColor Green
    } catch {
        Write-Host "✗ Error downloading llama.cpp: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please download manually:" -ForegroundColor Yellow
        Write-Host "1. Visit: https://github.com/KauanCerqueira/AgentDock/releases" -ForegroundColor White
        Write-Host "2. Download the appropriate variant for your system:" -ForegroundColor White
        Write-Host "   - llama.cpp-$variant-win-$archSuffix.zip" -ForegroundColor Cyan
        Write-Host "3. Extract to the project root directory" -ForegroundColor White
        exit 1
    }
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow

# Check if Node.js is installed
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "✗ Node.js is not installed. Please install from: https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Install npm dependencies
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ npm install failed" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Dependencies installed" -ForegroundColor Green
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Download an AI model (GGUF format)" -ForegroundColor White
Write-Host "2. Place it in: llama.cpp/models/" -ForegroundColor White
Write-Host "3. Run: npm start" -ForegroundColor White
Write-Host ""
Write-Host "For more information, see README.md" -ForegroundColor Cyan
