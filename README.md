# 🚀 AgentDock

<div align="center">

![AgentDock Logo](docs/images/logo.png)

**An open-source, lightweight desktop application for running local AI models with OpenAI-compatible API**

🎉 **Optimized for Git**: Repository size reduced by 90%+ - binaries downloaded on-demand during setup!

[![Beta](https://img.shields.io/badge/status-beta-yellow.svg)](https://github.com/KauanCerqueira/AgentDock)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![GitHub Release](https://img.shields.io/github/v/release/KauanCerqueira/AgentDock)](https://github.com/KauanCerqueira/AgentDock/releases/latest)
[![GitHub Downloads](https://img.shields.io/github/downloads/KauanCerqueira/AgentDock/total)](https://github.com/KauanCerqueira/AgentDock/releases)
[![.NET](https://img.shields.io/badge/.NET-8.0-purple.svg)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://react.dev/)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/KauanCerqueira/AgentDock/releases)

[Features](#-features) • [Screenshots](#-screenshots) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## ⚠️ Beta Notice

**AgentDock is currently in beta.** While the core functionality is stable, you may encounter bugs or incomplete features. We appreciate your patience and feedback as we continue development.

- **Expect Changes:** APIs and features may change without notice
- **Report Issues:** Please report bugs via [GitHub Issues](https://github.com/KauanCerqueira/AgentDock/issues)
- **Backup Your Data:** Always keep backups of important configurations

---

## 📋 Overview

**AgentDock** is a cross-platform desktop application that allows you to run AI models locally on your machine and interact with them through an **OpenAI-compatible API**. Built with Electron, React, and .NET, AgentDock provides a user-friendly interface for managing models, workspaces, and AI agents while exposing a network-accessible API that works seamlessly with existing OpenAI client libraries.

### 🎯 Key Features

- **🤖 Local AI Models**: Run powerful language models (llama.cpp) directly on your machine
- **🔌 OpenAI-Compatible API**: Drop-in replacement for OpenAI's API - works with existing tools and libraries
- **🌐 Network Access**: API accessible on your local network for integration with other applications
- **📊 Real-time Analytics**: Monitor API usage, request metrics, and model performance
- **🔑 API Key Management**: Secure your API with bearer token authentication
- **📦 Model Management**: Download, configure, and switch between different AI models
- **⚡ Multiple Backends**: Support for llama.cpp (CPU/GPU), Ollama, and HuggingFace
- **🎨 Modern UI**: Clean, responsive interface built with React and TailwindCSS
- **📖 Interactive Documentation**: Built-in Swagger UI for API exploration
- **🔄 Streaming Support**: Real-time streaming responses for chat completions

---

## 📸 Screenshots

### Dashboard
![Dashboard](docs/images/dashboard.png)
*Monitor system resources, active models, and real-time statistics*

### Chat Interface
![Chat](docs/images/chat.png)
*Interact with AI models through an intuitive chat interface*

### API Playground
![API Playground](docs/images/api-playground.png)
*Test the API with code examples and connection details*

### Model Management
![Models](docs/images/models.png)
*Download, configure, and manage your AI models*

### API Analytics
![Analytics](docs/images/analytics.png)
*Track API usage, request metrics, and performance over time*

### Swagger Documentation
![Swagger](docs/images/swagger.png)
*Interactive API documentation with dark theme*

---

## 🚀 Installation

### 📦 Download Pre-built Installer (Recommended)

The easiest way to get started is downloading the latest release:

1. Visit [**Releases**](https://github.com/KauanCerqueira/AgentDock/releases/latest)
2. Download the installer for your platform:
   - **Windows**: `AgentDock-Setup-x.x.x.exe` or `AgentDock-x.x.x-portable.exe`
   - **macOS**: `AgentDock-x.x.x.dmg`
   - **Linux**: `AgentDock-x.x.x.AppImage` or `AgentDock-x.x.x.deb`
3. Run the installer
4. Launch AgentDock
5. The app will automatically download the optimal llama.cpp variant for your GPU

> 💡 **Note**: The installer includes only the CPU variant to keep download size small (~100MB).
> GPU-specific binaries (CUDA, ROCm, SYCL, Vulkan) are downloaded automatically on first run based on your hardware.

### 💾 System Requirements

**Minimum:**
- **OS**: Windows 10/11, macOS 11+, Ubuntu 20.04+
- **RAM**: 8 GB (16 GB recommended)
- **Storage**: 10 GB free space (models require additional space)
- **CPU**: x64 processor with AVX support

**Recommended for GPU Acceleration:**
- **NVIDIA GPU**: GTX 1060+ with CUDA 12.4+
- **AMD GPU**: RX 6000+ with ROCm 5.0+
- **Intel GPU**: Arc A-Series with oneAPI

---

### 🛠️ Building from Source

For developers or those who want to customize AgentDock:

#### Prerequisites

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **.NET 8 SDK** - [Download](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Git** - [Download](https://git-scm.com/)

#### Clone the Repository

```bash
git clone https://github.com/KauanCerqueira/AgentDock.git
cd AgentDock
```

#### Automated Setup

**Windows (PowerShell):**
```powershell
.\setup.ps1
```

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

The setup script will:
- Detect your GPU (NVIDIA/AMD/Intel/CPU)
- Download the optimal llama.cpp binaries automatically
- Install all npm dependencies
- Prepare the project for development

#### What Gets Downloaded

The setup script downloads llama.cpp binaries from official releases (~80-300 MB depending on variant):

| GPU Type | Variant | Size | Features |
|----------|---------|------|----------|
| None/Unknown | CPU | ~80 MB | AVX, AVX2, AVX512 optimizations |
| NVIDIA | CUDA 12.4 | ~200 MB | cuBLAS acceleration |
| AMD | ROCm/HIP | ~250 MB | rocBLAS, hipBLAS acceleration |
| Intel Arc | SYCL | ~300 MB | oneMKL, oneDNN acceleration |
| Universal | Vulkan | ~100 MB | Cross-vendor GPU support |
| Apple Silicon | Metal | ~90 MB | Native Metal acceleration |

#### Manual Setup (Advanced)

If you prefer manual installation or need a specific variant:

```bash
# Install dependencies
npm install

# Download specific llama.cpp variant manually
# Visit: https://github.com/ggerganov/llama.cpp/releases/latest
# Extract to ./llama.cpp/[variant-name]/
# Example: ./llama.cpp/cuda-12.4/ for NVIDIA GPUs
```

### Download AI Models

Place your GGUF model files in `src/AgentDock.Backend/models/` or use the built-in model downloader from the UI.

Example models:
- [TinyLlama 1.1B](https://huggingface.co/TheBloke/TinyLlama-1.1B-Chat-v1.0-GGUF)
- [Llama 2 7B](https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF)
- [Mistral 7B](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF)

### Build and Run

#### Development Mode

```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:5000`
- Frontend dev server on `http://localhost:5173`
- Electron app in development mode

#### Production Build

```bash
npm run build
```

The built application will be in the `dist/` folder.

---

## 💻 Usage

### Starting the Application

1. **Launch AgentDock**: Run `npm run dev` or launch the built application
2. **Select a Model**: Go to the Models page and download or select an AI model
3. **Start Chatting**: Use the Chat interface to interact with the model
4. **Access the API**: The API is available at `http://localhost:5000` (or your machine's IP on port 5000)

### Using the OpenAI-Compatible API

AgentDock exposes an OpenAI-compatible API that can be used with any OpenAI client library:

#### Python Example

```python
from openai import OpenAI

# Point to AgentDock instead of OpenAI
client = OpenAI(
    base_url="http://localhost:5000/v1",
    api_key="sk-agentdock-admin"  # Default API key
)

# Use exactly like OpenAI's API
response = client.chat.completions.create(
    model="default",
    messages=[
        {"role": "user", "content": "Hello! How are you?"}
    ]
)

print(response.choices[0].message.content)
```

#### Node.js Example

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:5000/v1',
  apiKey: 'sk-agentdock-admin'
});

const response = await client.chat.completions.create({
  model: 'default',
  messages: [
    { role: 'user', content: 'Hello! How are you?' }
  ]
});

console.log(response.choices[0].message.content);
```

#### cURL Example

```bash
curl http://localhost:5000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-agentdock-admin" \
  -d '{
    "model": "default",
    "messages": [
      {"role": "user", "content": "Hello!"}
    ]
  }'
```

### Network Access

To access the API from other devices on your network:

1. Get your machine's local IP address (e.g., `192.168.1.100`)
2. Use this IP in the base URL: `http://192.168.1.100:5000/v1`
3. Ensure your firewall allows connections on port 5000

---

## 📚 API Documentation

### Interactive Swagger UI

AgentDock includes a built-in Swagger UI for interactive API documentation:

**Access at:** `http://localhost:5000/swagger`

### Available Endpoints

#### Chat Completions

```
POST /v1/chat/completions
```

Create a chat completion with streaming or non-streaming responses.

#### List Models

```
GET /v1/models
```

Get a list of available AI models.

#### Analytics

```
GET /api/analytics?timeRange={24h|7d|30d}
```

Retrieve API usage analytics and metrics.

#### API Keys

```
GET    /api/apikeys          # List all API keys
POST   /api/apikeys          # Create a new API key
DELETE /api/apikeys/{id}     # Revoke an API key
```

### Authentication

All `/v1/*` endpoints require Bearer token authentication:

```
Authorization: Bearer sk-agentdock-admin
```

Default API key: `sk-agentdock-admin` (can be changed in settings)

---

## 🏗️ Architecture

```
AgentDock/
├── electron/               # Electron main process
│   ├── main.js            # App entry point
│   ├── preload.js         # Preload scripts
│   └── dev.js             # Development launcher
├── src/
│   ├── AgentDock.Backend/ # .NET 8 Web API
│   │   ├── Controllers/   # API endpoints
│   │   ├── Services/      # Business logic
│   │   ├── Infrastructure/# llama.cpp, Ollama integration
│   │   └── Core/          # Models, interfaces
│   └── AgentDock.UI/      # React frontend
│       ├── src/
│       │   ├── components/# Reusable components
│       │   ├── pages/     # Main pages
│       │   └── api/       # API client
│       └── public/        # Static assets
└── llama.cpp/             # Pre-built llama.cpp binaries
```

### Tech Stack

**Frontend:**
- React 18
- TypeScript
- TailwindCSS
- Vite
- React Router
- i18next (internationalization)

**Backend:**
- .NET 8
- ASP.NET Core Web API
- Swagger/OpenAPI
- llama.cpp bindings

**Desktop:**
- Electron
- Node.js

---

## 🤝 Contributing

We welcome contributions! AgentDock is an open-source project and we appreciate your help in making it better.

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/yourusername/agentdock.git
   cd agentdock
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Use conventional commit messages:
   - `feat:` New features
   - `fix:` Bug fixes
   - `docs:` Documentation changes
   - `style:` Code style changes (formatting, etc.)
   - `refactor:` Code refactoring
   - `test:` Adding or updating tests
   - `chore:` Maintenance tasks

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your feature branch
   - Describe your changes in detail
   - Submit the PR for review

### Contribution Guidelines

- **Code Quality**: Ensure your code is clean, well-documented, and follows the project's style
- **Testing**: Test your changes locally before submitting
- **Documentation**: Update documentation if you're adding new features
- **Issue First**: For major changes, open an issue first to discuss your proposal
- **Be Respectful**: Follow our [Code of Conduct](CODE_OF_CONDUCT.md)

### Development Setup

See the [Installation](#-installation) section for setting up your development environment.

### Areas We Need Help

- 🐛 Bug fixes and testing
- 📝 Documentation improvements
- 🌍 Translations (i18n)
- ✨ New features and enhancements
- 🎨 UI/UX improvements
- ⚡ Performance optimizations
- 🔧 Backend model integrations

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 AgentDock Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **llama.cpp** - For the excellent C++ implementation of LLaMA inference
- **OpenAI** - For the API specification that inspired this project
- **Electron** - For making cross-platform desktop apps possible
- **React & .NET Community** - For amazing frameworks and tools

---

## 📞 Support & Community

- **Issues**: [GitHub Issues](https://github.com/yourusername/agentdock/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/agentdock/discussions)
- **Wiki**: [Documentation Wiki](https://github.com/yourusername/agentdock/wiki)

---

## 🗺️ Roadmap

- [ ] Multi-model support (run multiple models simultaneously)
- [ ] Cloud sync for configurations
- [ ] Plugin system for custom integrations
- [ ] Advanced prompt engineering tools
- [ ] Voice input/output support
- [ ] Docker deployment option
- [ ] Model fine-tuning interface
- [ ] Collaborative workspaces

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by the AgentDock community

</div>
