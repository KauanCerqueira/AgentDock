#!/bin/bash

# AgentDock Setup Script for Unix (Linux/macOS)
# This script automates the setup process for Unix-based systems

echo "================================"
echo "AgentDock Setup - Unix/Linux/macOS"
echo "================================"
echo ""

# Check if llama.cpp already exists
if [ -d "llama.cpp" ]; then
    echo "✓ llama.cpp directory already exists"
else
    echo "Downloading llama.cpp binaries..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if [[ $(uname -m) == "arm64" ]]; then
            DOWNLOAD_URL="https://github.com/KauanCerqueira/AgentDock/releases/download/v1.0.0/llama.cpp-macos-arm64.tar.gz"
        else
            DOWNLOAD_URL="https://github.com/KauanCerqueira/AgentDock/releases/download/v1.0.0/llama.cpp-macos-x64.tar.gz"
        fi
    else
        # Linux
        DOWNLOAD_URL="https://github.com/KauanCerqueira/AgentDock/releases/download/v1.0.0/llama.cpp-linux-x64.tar.gz"
    fi
    
    # Try wget first, then curl
    if command -v wget &> /dev/null; then
        if ! wget -q "$DOWNLOAD_URL" -O llama.cpp.tar.gz; then
            echo "✗ Error downloading llama.cpp"
            echo "Please download manually from: https://github.com/KauanCerqueira/AgentDock/releases"
            exit 1
        fi
    elif command -v curl &> /dev/null; then
        if ! curl -L -o llama.cpp.tar.gz "$DOWNLOAD_URL"; then
            echo "✗ Error downloading llama.cpp"
            echo "Please download manually from: https://github.com/KauanCerqueira/AgentDock/releases"
            exit 1
        fi
    else
        echo "✗ Neither wget nor curl found. Please install one of them."
        exit 1
    fi
    
    echo "✓ Download completed"
    
    echo "Extracting llama.cpp..."
    tar -xzf llama.cpp.tar.gz
    rm llama.cpp.tar.gz
    echo "✓ Extraction completed"
fi

echo ""
echo "Installing dependencies..."

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    echo "✗ Node.js is not installed. Please install from: https://nodejs.org/"
    exit 1
fi

# Install npm dependencies
npm install

if [ $? -ne 0 ]; then
    echo "✗ npm install failed"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Download an AI model (GGUF format)"
echo "2. Place it in: llama.cpp/models/"
echo "3. Run: npm start"
echo ""
echo "For more information, see README.md"
