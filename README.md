<div align="center">

# 🚀 AgentDock

### Your Personal AI Workstation

**Run powerful AI models locally with zero compromise on privacy. A beautiful desktop application that brings enterprise-grade language models to your machine with OpenAI-compatible APIs.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![.NET 8](https://img.shields.io/badge/.NET-8.0-512BD4?logo=.net)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Electron](https://img.shields.io/badge/Electron-Latest-47848F?logo=electron)](https://www.electronjs.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)](https://github.com/KauanCerqueira/AgentDock/releases)
[![GitHub Stars](https://img.shields.io/github/stars/KauanCerqueira/AgentDock?style=social)](https://github.com/KauanCerqueira/AgentDock/stargazers)

[**🎯 Features**](#-features) • [**📥 Installation**](#-installation) • [**🚀 Quick Start**](#-quick-start) • [**📚 Documentation**](#-documentation) • [**🤝 Contributing**](#-contributing)

![AgentDock Dashboard](https://via.placeholder.com/1200x600/0a0a0a/00ff88?text=AgentDock+Dashboard)

</div>

---

## 🌟 What is AgentDock?

**AgentDock** is not just another AI tool—it's your **complete AI infrastructure** running entirely on your machine. Imagine having the power of ChatGPT, but with **full control, zero costs, and complete privacy**. That's AgentDock.

### 🎯 The Problem We Solve

- 💸 **Tired of API costs?** Run unlimited AI requests without paying per token
- 🔒 **Privacy concerns?** Your data never leaves your machine
- 🌐 **Need offline AI?** Work anywhere, no internet required
- 🔧 **Want customization?** Fine-tune and switch models instantly
- 🚀 **Developer-friendly?** Drop-in replacement for OpenAI's API

### ✨ Why AgentDock?

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  "The easiest way to run local AI models with a           │
│   professional-grade API that works with all your          │
│   existing tools and code."                                │
│                                                             │
│  - Works with LangChain, AutoGPT, Continue.dev, and more  │
│  - Drop-in replacement for OpenAI's API                    │
│  - Beautiful UI + Powerful API                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Features

### 🤖 AI Model Management

<table>
<tr>
<td width="50%">

#### Smart Model Recommendations
- 🧠 **Hardware Detection**: Automatically detects your CPU, RAM, GPU (NVIDIA/AMD/Intel)
- 📊 **Compatibility Scoring**: Each model gets a compatibility score based on your hardware
- ⚡ **Performance Estimates**: See expected tokens/second before downloading
- 🎯 **Curated Selection**: Pre-filtered models that actually work well

</td>
<td width="50%">

#### One-Click Model Download
- 🔍 **HuggingFace Integration**: Search 100,000+ models
- 📦 **Smart Filtering**: Only shows GGUF models compatible with llama.cpp
- ⏬ **Download Queue**: Parallel downloads with progress tracking
- 💾 **Disk Space Checks**: Warns before downloading if space is low

</td>
</tr>
</table>

### 🔌 OpenAI-Compatible API

```python
# That's it. Your code doesn't change.
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:5000/v1",  # Point to AgentDock
    api_key="sk-agentdock-admin"
)

# Works exactly like OpenAI
response = client.chat.completions.create(
    model="llama-2-7b-chat",
    messages=[{"role": "user", "content": "Explain quantum computing"}],
    stream=True  # Streaming support!
)
```

**What You Get:**
- ✅ `/v1/chat/completions` - Chat completions with streaming
- ✅ `/v1/models` - List available models
- ✅ Bearer token authentication
- ✅ Works with **LangChain**, **LlamaIndex**, **AutoGPT**, **Continue.dev**
- ✅ Network accessible - use from other devices on your LAN

### 🎨 Beautiful Desktop Experience

<table>
<tr>
<td width="33%">

#### 💬 Chat Interface
- Real-time streaming responses
- Code syntax highlighting
- Copy/paste with formatting
- Export conversations

</td>
<td width="33%">

#### 📊 Dashboard
- Live system monitoring
- GPU/CPU/RAM usage
- API request metrics
- Model performance stats

</td>
<td width="33%">

#### ⚙️ Model Browser
- Search & filter models
- Hardware compatibility badges
- One-click downloads
- Automatic loading

</td>
</tr>
</table>

### 🔧 Developer Tools

- 🛠️ **Built-in Swagger UI** - Interactive API documentation at `/swagger`
- 📈 **Analytics Dashboard** - Track API usage, response times, token counts
- 🔑 **API Key Management** - Create, revoke, and manage multiple keys
- 📝 **Request Logging** - Full request/response logging for debugging
- 🧪 **API Playground** - Test endpoints with code examples in Python, Node.js, cURL

### ⚡ Performance & Optimization

| Feature | Description |
|---------|-------------|
| **GPU Acceleration** | CUDA (NVIDIA), ROCm (AMD), SYCL (Intel), Metal (Apple Silicon) |
| **CPU Optimization** | AVX, AVX2, AVX512 instruction sets |
| **Memory Management** | Automatic context size optimization |
| **Multi-Model Support** | Switch models without restart |
| **Streaming Responses** | Real-time token generation |

### 🔒 Privacy & Security

- 🏠 **100% Local** - No data ever leaves your machine
- 🔐 **API Authentication** - Bearer token security
- 🚫 **No Telemetry** - We don't track anything
- 🗃️ **Data Control** - All conversations stored locally
- 🔒 **Offline Capable** - Works without internet after setup

---

## 📥 Installation

### 🎯 For End Users (Recommended)

**Get started in 3 minutes:**

1. **Download the installer**
   - Visit [**Releases**](https://github.com/KauanCerqueira/AgentDock/releases/latest)
   - Choose your platform:
     - 🪟 **Windows**: `AgentDock-Setup-x.x.x.exe` (Installer) or `.exe` (Portable)
     - 🍎 **macOS**: `AgentDock-x.x.x.dmg` (Intel) or `.arm64.dmg` (Apple Silicon)
     - 🐧 **Linux**: `AgentDock-x.x.x.AppImage` (Universal) or `.deb` (Debian/Ubuntu)

2. **Install & Launch**
   - Run the installer
   - AgentDock starts automatically
   - **First launch**: App detects your GPU and downloads optimal llama.cpp binaries (~100-300MB)

3. **Download a Model**
   - Go to **Models** tab
   - Click **Recommended for You**
   - Download suggested model (or search for others)
   - Model auto-loads when download completes

4. **Start Using**
   - **Chat**: Test the model in the chat interface
   - **API**: Your OpenAI-compatible API is running at `http://localhost:5000/v1`
   - **Swagger**: Explore API docs at `http://localhost:5000/swagger`

### 💻 For Developers

**Prerequisites:**
- **Node.js** 20+ ([Download](https://nodejs.org/))
- **.NET 8 SDK** ([Download](https://dotnet.microsoft.com/download))
- **Git** ([Download](https://git-scm.com/))

**Quick Setup:**

```bash
# Clone the repository
git clone https://github.com/KauanCerqueira/AgentDock.git
cd AgentDock

# Automatic setup (detects GPU, downloads binaries, installs deps)
# Windows PowerShell:
.\setup.ps1

# macOS/Linux:
chmod +x setup.sh && ./setup.sh

# Start development server
npm run dev
```

**What the setup script does:**
1. Detects your GPU (NVIDIA → CUDA, AMD → ROCm, Intel → SYCL, None → CPU)
2. Downloads appropriate llama.cpp binaries from official releases
3. Installs all npm dependencies
4. Sets up the backend and frontend
5. You're ready to code!

---

## 🚀 Quick Start

### Starting the Application

**Option 1: Development Mode** (for contributors)
```bash
npm run dev
```
This starts:
- 🔧 Backend API: `http://localhost:5000`
- 🎨 Frontend UI: `http://localhost:5173`
- 🖥️ Electron app in development mode

**Option 2: Production Build**
```bash
npm run build
npm start
```

**Option 3: Backend Only** (if you just want the API)
```bash
cd src/AgentDock.Backend
dotnet run
```

### Using the API

**1. Python Example** (Most Popular)

```python
from openai import OpenAI

# Connect to AgentDock
client = OpenAI(
    base_url="http://localhost:5000/v1",
    api_key="sk-agentdock-admin"
)

# Simple completion
response = client.chat.completions.create(
    model="llama-2-7b-chat.Q2_K.gguf",
    messages=[
        {"role": "system", "content": "You are a helpful coding assistant."},
        {"role": "user", "content": "Write a Python function to calculate fibonacci numbers"}
    ],
    temperature=0.7,
    max_tokens=500
)

print(response.choices[0].message.content)

# Streaming example
stream = client.chat.completions.create(
    model="llama-2-7b-chat.Q2_K.gguf",
    messages=[{"role": "user", "content": "Tell me a story"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")
```

**2. Node.js / TypeScript**

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'http://localhost:5000/v1',
  apiKey: 'sk-agentdock-admin'
});

async function chat() {
  const response = await client.chat.completions.create({
    model: 'llama-2-7b-chat.Q2_K.gguf',
    messages: [
      { role: 'user', content: 'Explain async/await in JavaScript' }
    ]
  });
  
  console.log(response.choices[0].message.content);
}

chat();
```

**3. cURL (Terminal)**

```bash
curl http://localhost:5000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-agentdock-admin" \
  -d '{
    "model": "llama-2-7b-chat.Q2_K.gguf",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ],
    "temperature": 0.8,
    "max_tokens": 200
  }'
```

**4. LangChain Integration**

```python
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage

# Point to AgentDock
llm = ChatOpenAI(
    base_url="http://localhost:5000/v1",
    api_key="sk-agentdock-admin",
    model="llama-2-7b-chat.Q2_K.gguf"
)

# Use anywhere in LangChain
messages = [HumanMessage(content="Translate 'hello' to French")]
response = llm.invoke(messages)
print(response.content)
```

### Network Access (Use from Other Devices)

Your AgentDock API can be accessed from any device on your network:

1. **Find your machine's IP address**
   - Windows: `ipconfig` → look for IPv4 Address
   - macOS/Linux: `ifconfig` or `ip addr` → look for inet
   - Example: `192.168.1.100`

2. **Update your base URL**
   ```python
   client = OpenAI(
       base_url="http://192.168.1.100:5000/v1",  # Use your IP
       api_key="sk-agentdock-admin"
   )
   ```

3. **Firewall**: Ensure port 5000 is allowed through your firewall

**Use Cases:**
- 📱 Run AgentDock on a powerful desktop, access from laptop/tablet
- 🔬 Share with team members on the same network
- 🏠 Run on a home server, access from anywhere in your house

---

## 📚 Documentation

### 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         AgentDock                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐      ┌──────────────┐      ┌────────────────┐ │
│  │   Electron  │◄────►│  React UI    │◄────►│  .NET Backend  │ │
│  │   Desktop   │      │  (Frontend)  │      │     (API)      │ │
│  └─────────────┘      └──────────────┘      └────────┬───────┘ │
│                                                       │          │
│                                              ┌────────▼───────┐ │
│                                              │  llama.cpp     │ │
│                                              │  (Inference)   │ │
│                                              └────────┬───────┘ │
│                                                       │          │
│                                              ┌────────▼───────┐ │
│                                              │   AI Models    │ │
│                                              │   (.gguf)      │ │
│                                              └────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Technology Stack:**

| Layer | Technologies |
|-------|-------------|
| **Desktop** | Electron, Node.js |
| **Frontend** | React 18, TypeScript, TailwindCSS, Vite, React Router |
| **Backend** | .NET 8, ASP.NET Core, Swagger/OpenAPI |
| **AI Engine** | llama.cpp (CPU/CUDA/ROCm/Metal/Vulkan) |
| **Models** | GGUF format (Llama, Mistral, Phi, etc.) |

### 📂 Project Structure

```
AgentDock/
│
├── electron/                      # Electron desktop application
│   ├── main.js                    # Main process (app lifecycle)
│   ├── preload.js                 # Preload scripts (security bridge)
│   └── dev.js                     # Development launcher
│
├── src/
│   ├── AgentDock.Backend/         # .NET 8 Web API
│   │   ├── Controllers/           # API endpoints
│   │   │   ├── ChatController.cs         # Chat completions
│   │   │   ├── ModelsController.cs       # Model management
│   │   │   ├── OpenAIController.cs       # OpenAI-compatible routes
│   │   │   ├── AnalyticsController.cs    # Usage analytics
│   │   │   └── ...
│   │   │
│   │   ├── Services/              # Business logic
│   │   │   ├── SettingsService.cs
│   │   │   ├── SystemMonitorService.cs
│   │   │   ├── LogsService.cs
│   │   │   └── ...
│   │   │
│   │   ├── Infrastructure/        # External integrations
│   │   │   ├── Llama/
│   │   │   │   ├── LlamaCppService.cs        # llama.cpp HTTP client
│   │   │   │   └── LlamaLifecycleService.cs  # Process management
│   │   │   │
│   │   │   └── HuggingFace/
│   │   │       ├── HuggingFaceService.cs     # Model search & details
│   │   │       ├── ModelDownloadManager.cs   # Download queue
│   │   │       └── ModelRecommendationService.cs
│   │   │
│   │   ├── Core/                  # Domain models
│   │   │   ├── Interfaces/
│   │   │   └── Models/
│   │   │
│   │   ├── models/                # AI model files (.gguf)
│   │   ├── bin/llama/             # llama.cpp binaries
│   │   └── appsettings.json       # Configuration
│   │
│   └── AgentDock.UI/              # React frontend
│       ├── src/
│       │   ├── components/        # Reusable UI components
│       │   │   ├── Layout.tsx
│       │   │   ├── ModelBrowser.tsx
│       │   │   ├── ModelDetailsDrawer.tsx
│       │   │   └── ui/                # shadcn/ui components
│       │   │
│       │   ├── pages/             # Main application pages
│       │   │   ├── Dashboard.tsx
│       │   │   ├── Chat.tsx
│       │   │   ├── Models.tsx
│       │   │   ├── DownloadManager.tsx
│       │   │   ├── DownloadedModels.tsx
│       │   │   ├── APIPlayground.tsx
│       │   │   ├── Analytics.tsx
│       │   │   └── Settings.tsx
│       │   │
│       │   ├── api/               # API client
│       │   ├── hooks/             # Custom React hooks
│       │   ├── lib/               # Utilities
│       │   ├── locales/           # i18n translations
│       │   └── types/             # TypeScript types
│       │
│       └── public/                # Static assets
│
├── llama.cpp/                     # llama.cpp binaries (zips)
│   ├── llama-b7648-bin-win-cpu-x64.zip
│   ├── llama-b7648-bin-win-cuda-12.4-x64.zip
│   ├── llama-b7648-bin-win-vulkan-x64.zip
│   └── models/                    # Optional: model storage
│
├── package.json                   # npm dependencies & scripts
├── electron-builder.json          # Electron build configuration
├── setup.ps1                      # Windows setup script
├── setup.sh                       # Linux/macOS setup script
└── README.md                      # You are here!
```

### 🔑 API Endpoints

#### OpenAI-Compatible Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/chat/completions` | POST | Create chat completion (streaming supported) |
| `/v1/models` | GET | List available models |

#### Management Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/models` | GET | List local GGUF models |
| `/api/models/search` | GET | Search HuggingFace models |
| `/api/models/suggestions` | GET | Get hardware-based recommendations |
| `/api/models/download` | POST | Start model download |
| `/api/models/download/{id}` | GET | Check download progress |
| `/api/models/downloaded` | GET | List downloaded models |
| `/api/analytics` | GET | Get API usage analytics |
| `/api/engine/health` | GET | Check llama.cpp server health |
| `/swagger` | GET | Interactive API documentation |

### ⚙️ Configuration

**appsettings.json** (Backend Configuration)

```json
{
  "Llama": {
    "BaseUrl": "http://127.0.0.1:8080",
    "Port": 8080,
    "Host": "127.0.0.1",
    "DefaultModel": "llama-2-7b-chat.Q2_K.gguf",
    "ModelsPath": "models",
    "ExecutablePath": "bin/llama/llama-server.exe",
    "GpuLayers": 35,              // 0 for CPU-only, 35+ for GPU
    "ContextSize": 4096,          // Model context window
    "RequestTimeout": 300
  },
  "Security": {
    "ApiKey": "sk-agentdock-admin"  // Change this!
  }
}
```

**Environment Variables** (Optional)

```bash
# Override default configuration
LLAMA_PORT=8080
LLAMA_GPU_LAYERS=35
API_KEY=your-secure-key-here
```

---

## 💾 System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **OS** | Windows 10/11, macOS 11+, Ubuntu 20.04+ |
| **CPU** | x64 processor with AVX support |
| **RAM** | 8 GB (can run small models) |
| **Storage** | 10 GB + model sizes (2-40 GB per model) |
| **GPU** | Optional (CPU-only works fine) |

### Recommended for Best Performance

| Component | Recommendation |
|-----------|----------------|
| **RAM** | 16-32 GB (for 7B-13B models) |
| **GPU** | NVIDIA RTX 3060+ (12GB VRAM) or AMD RX 6800+ |
| **Storage** | SSD with 50+ GB free |

### GPU Acceleration Support

| GPU Vendor | Technology | Models Supported |
|------------|------------|------------------|
| **NVIDIA** | CUDA 12.4+ | GeForce GTX 1060+, RTX series, Tesla, A100 |
| **AMD** | ROCm 5.0+ | RX 6000+, Radeon VII, MI series |
| **Intel** | SYCL/oneAPI | Arc A-series, Iris Xe |
| **Apple** | Metal | M1, M2, M3 (all variants) |
| **Universal** | Vulkan | Any GPU with Vulkan 1.2+ |

---

## 🤝 Contributing

We love contributions! AgentDock is a community-driven project and we welcome developers of all skill levels.

### 🌟 Ways to Contribute

- 🐛 **Report Bugs**: Found an issue? [Open a bug report](https://github.com/KauanCerqueira/AgentDock/issues/new?template=bug_report.md)
- 💡 **Suggest Features**: Have an idea? [Request a feature](https://github.com/KauanCerqueira/AgentDock/issues/new?template=feature_request.md)
- 📝 **Improve Docs**: Documentation can always be better
- 🌍 **Translate**: Help us reach more users (i18n support built-in!)
- 🎨 **Design**: UI/UX improvements welcome
- 💻 **Code**: Implement features, fix bugs, optimize performance

### 🚀 Development Workflow

1. **Fork & Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AgentDock.git
   cd AgentDock
   ```

2. **Setup Development Environment**
   ```bash
   ./setup.ps1    # Windows
   ./setup.sh     # Linux/macOS
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-new-feature
   ```

4. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

5. **Test Your Changes**
   ```bash
   npm run dev        # Test in development mode
   npm run build      # Ensure production build works
   ```

6. **Commit with Conventional Commits**
   ```bash
   git commit -m "feat: add amazing new feature"
   ```

   **Commit Types:**
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `style:` Code formatting (no logic changes)
   - `refactor:` Code refactoring
   - `perf:` Performance improvements
   - `test:` Adding tests
   - `chore:` Build/tooling changes

7. **Push & Create PR**
   ```bash
   git push origin feature/amazing-new-feature
   ```
   Then open a Pull Request on GitHub with a clear description.

### 📋 Code Review Process

1. **Automated Checks**: CI/CD runs tests and builds
2. **Code Review**: Maintainers review your code
3. **Feedback**: We may request changes
4. **Approval**: Once approved, we merge!
5. **Release**: Your contribution ships in the next release

### 🎯 Good First Issues

New to the project? Look for issues labeled [`good first issue`](https://github.com/KauanCerqueira/AgentDock/labels/good%20first%20issue)

### 📜 Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/). Be respectful, inclusive, and constructive.

---

## ❓ FAQ

<details>
<summary><b>Q: Do I need to pay for anything?</b></summary>

**A:** No! AgentDock is 100% free and open-source. You only pay for the electricity to run it on your machine. No subscriptions, no API costs.
</details>

<details>
<summary><b>Q: Is my data private?</b></summary>

**A:** Absolutely. Everything runs locally on your machine. No data is ever sent to external servers (except when downloading models from HuggingFace, which is a one-time thing).
</details>

<details>
<summary><b>Q: Can I use this commercially?</b></summary>

**A:** Yes! AgentDock is MIT licensed. Use it however you want—personal, commercial, enterprise. Just keep the license file.
</details>

<details>
<summary><b>Q: What models can I use?</b></summary>

**A:** Any GGUF model from HuggingFace or elsewhere. Popular choices:
- **Llama 2** (7B, 13B, 70B)
- **Mistral** (7B)
- **Phi-2** (2.7B - great for low-end hardware)
- **Code Llama** (7B, 13B, 34B)
- **Mixtral** (8x7B)
</details>

<details>
<summary><b>Q: How much RAM do I need?</b></summary>

**A:** Depends on the model:
- **2-3B models**: 4-6 GB RAM
- **7B models**: 8-12 GB RAM
- **13B models**: 16-24 GB RAM
- **70B models**: 64+ GB RAM (or use smaller quantizations)

AgentDock shows you compatibility before downloading!
</details>

<details>
<summary><b>Q: Do I need a powerful GPU?</b></summary>

**A:** No! AgentDock works great on CPU-only. GPU just makes it faster. Even a GTX 1060 can give you 5-10x speedup.
</details>

<details>
<summary><b>Q: Can I use this with LangChain/AutoGPT/etc?</b></summary>

**A:** Yes! Just point the `base_url` to `http://localhost:5000/v1`. Any tool that supports OpenAI's API will work.
</details>

<details>
<summary><b>Q: How do I update models?</b></summary>

**A:** Just download a new one from the Models page. You can have multiple models and switch between them instantly.
</details>

---

## 🗺️ Roadmap

### 🚀 Coming Soon

- [ ] **Multi-Model Support** - Run multiple models simultaneously
- [ ] **Model Fine-Tuning** - UI for LoRA fine-tuning
- [ ] **Voice Input/Output** - TTS and STT integration
- [ ] **Plugins System** - Extend functionality with plugins
- [ ] **Cloud Sync** - Sync settings across devices (optional)
- [ ] **Docker Support** - Run AgentDock in containers
- [ ] **Function Calling** - OpenAI function calling API
- [ ] **Vision Models** - Support for LLaVA and other vision models
- [ ] **Model Merging** - Merge multiple models in the UI

### 💭 Under Consideration

- [ ] Collaborative workspaces
- [ ] Built-in RAG (Retrieval Augmented Generation)
- [ ] Model quantization tools
- [ ] Prompt template library
- [ ] Mobile companion app

**Vote on features**: [GitHub Discussions](https://github.com/KauanCerqueira/AgentDock/discussions)

---

## 📄 License

```
MIT License

Copyright (c) 2024-2026 AgentDock Contributors

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

See [LICENSE](LICENSE) file for full details.

---

## 🙏 Acknowledgments

AgentDock stands on the shoulders of giants:

- **[llama.cpp](https://github.com/ggerganov/llama.cpp)** - The incredible C++ inference engine that makes this all possible
- **[OpenAI](https://openai.com)** - For the API specification that became the industry standard
- **[HuggingFace](https://huggingface.co)** - For hosting and democratizing AI models
- **[Electron](https://www.electronjs.org/)** - For making cross-platform desktop apps easy
- **[React](https://react.dev/)** - For the amazing UI framework
- **[.NET](https://dotnet.microsoft.com/)** - For the powerful backend framework
- **[Tailwind CSS](https://tailwindcss.com/)** - For making styling actually enjoyable

And to all our **contributors** who make AgentDock better every day! 💖

---

## 📞 Community & Support

- 💬 **Discord**: [Join our community](https://discord.gg/agentdock) (coming soon!)
- 🐛 **Issues**: [Report bugs](https://github.com/KauanCerqueira/AgentDock/issues)
- 💡 **Discussions**: [Feature requests & ideas](https://github.com/KauanCerqueira/AgentDock/discussions)
- 📧 **Email**: support@agentdock.dev
- 🐦 **Twitter**: [@AgentDock](https://twitter.com/agentdock) (coming soon!)

---

<div align="center">

### ⭐ Star Us on GitHub!

If AgentDock helps you, please consider giving us a star. It helps others discover the project!

[![Star History Chart](https://api.star-history.com/svg?repos=KauanCerqueira/AgentDock&type=Date)](https://star-history.com/#KauanCerqueira/AgentDock&Date)

---

**Made with ❤️ by developers, for developers**

*Privacy-first • Open-source • Community-driven*

[⬆ Back to Top](#-agentdock)

</div>
