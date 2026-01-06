# AgentDock

> Open-source desktop app to run local LLMs with an OpenAI-compatible API. Electron + React + .NET 8 + llama.cpp.

Badges: beta • MIT • Windows/macOS/Linux • .NET 8 • React 18

Sections: [English](#english) | [Português](#português)

---

## English

### What it does
- Local inference with llama.cpp (CPU/GPU) and OpenAI-compatible endpoints (`/v1/chat/completions`, `/v1/models`).
- Model lifecycle: download from Hugging Face, hardware-aware recommendations, compatibility checks, auto-load into llama.cpp.
- Desktop UI: chat, API playground, models browser, download manager, analytics, logs, system monitor, presets, tasks, workspaces.
- Security & ops: API key middleware, streaming responses, Swagger UI, health checks, performance metrics, logging.
- Extensible backends: llama.cpp first-class; hooks for Ollama/HF service integration.

### Feature list
- OpenAI-compatible API (chat completions + streaming, models list).
- Local llama.cpp server orchestration (start/stop, health wait, configurable host/port/context, GPU layers).
- Model management: Hugging Face search, file listing, download queue, disk checks, cancel/resume, delete, auto-load after download.
- Recommendations: hardware detection (RAM/VRAM), score-based suggestions, compatibility badges, warnings for heavy models.
- UI modules: dashboard, chat, API Playground, models (browse/recommended), downloads, downloaded models, settings, analytics, logs.
- API keys: bearer token enforcement (default `sk-agentdock-admin`).
- System monitor: CPU/RAM/GPU/network stats with periodic logging.
- Swagger UI bundled at `/swagger`.

### Install (end users)
1) Download the latest release: https://github.com/KauanCerqueira/AgentDock/releases/latest
2) Run the installer for your OS (Windows/macOS/Linux). The app downloads the right llama.cpp build on first run.
3) Put at least one GGUF model in `src/AgentDock.Backend/models/` (or use the Models page downloader).

Minimum: Win10/macOS11/Ubuntu20.04, 8 GB RAM (16 GB recommended), AVX CPU, ~10 GB free + space for models.

### Build from source (devs)
Prereqs: Node.js 20+, .NET 8 SDK, Git.

```bash
git clone https://github.com/KauanCerqueira/AgentDock.git
cd AgentDock
# Windows
./setup.ps1
# Linux/macOS
chmod +x setup.sh && ./setup.sh
```

What setup does: detect GPU, pull suitable llama.cpp binary, install npm deps, prepare UI and backend.

Dev run:
```bash
npm run dev
# backend at http://localhost:5000, frontend at http://localhost:5173, Electron dev
```

Production build:
```bash
npm run build
```

Backend only:
```bash
cd src/AgentDock.Backend
dotnet run
```

### Using the API
Base URL: `http://localhost:5000/v1` • Auth: `Authorization: Bearer sk-agentdock-admin`

Python:
```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:5000/v1", api_key="sk-agentdock-admin")
resp = client.chat.completions.create(model="llama-2-7b-chat.Q2_K.gguf", messages=[{"role":"user","content":"Hi"}])
print(resp.choices[0].message.content)
```

Node.js:
```javascript
import OpenAI from 'openai';
const client = new OpenAI({ baseURL: 'http://localhost:5000/v1', apiKey: 'sk-agentdock-admin' });
const resp = await client.chat.completions.create({ model: 'llama-2-7b-chat.Q2_K.gguf', messages: [{ role:'user', content:'Hi' }] });
console.log(resp.choices[0].message.content);
```

cURL:
```bash
curl http://localhost:5000/v1/chat/completions \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer sk-agentdock-admin" \
   -d '{"model":"llama-2-7b-chat.Q2_K.gguf","messages":[{"role":"user","content":"Hi"}]}'
```

Swagger: `http://localhost:5000/swagger`
Health: `http://localhost:5000/api/engine/health`

### How to collaborate
- Issues: https://github.com/KauanCerqueira/AgentDock/issues
- Pull requests: fork, branch (`feat/*`), tests, PR with context.
- Conventional commits: feat/fix/docs/style/refactor/test/chore.
- Keep docs updated when adding features.

### Project structure (short)
```
electron/              # main & preload
src/AgentDock.Backend/ # ASP.NET Core API, llama.cpp lifecycle, HuggingFace integration
src/AgentDock.UI/      # React + Vite + Tailwind UI
llama.cpp/             # packaged binaries & zips
```

### License
MIT. See LICENSE.

---

## Português

### O que o app faz
- Inferência local com llama.cpp (CPU/GPU) e endpoints compatíveis com OpenAI (`/v1/chat/completions`, `/v1/models`).
- Ciclo completo de modelos: busca no Hugging Face, recomendações pelo hardware, checagem de compatibilidade, auto-load no llama.cpp.
- UI desktop: chat, playground de API, navegador de modelos, gerenciador de downloads, analytics, logs, monitor de sistema, presets, tasks, workspaces.
- Segurança e operações: middleware de API key, respostas em streaming, Swagger UI, health check, métricas de performance, logging.
- Backends extensíveis: foco em llama.cpp; ganchos para Ollama/serviços HF.

### Lista de features
- API compatível com OpenAI (chat + streaming, lista de modelos).
- Orquestração do servidor llama.cpp (start/stop, espera de saúde, host/porta/contexto configuráveis, camadas de GPU).
- Gestão de modelos: busca HF, listagem de arquivos, fila de download, checagem de disco, cancelar, remover, auto-carregar após download.
- Recomendações: detecção de hardware (RAM/VRAM), pontuação, badges de compatibilidade, alertas para modelos pesados.
- Módulos UI: dashboard, chat, API Playground, modelos (recomendados e busca), downloads, modelos baixados, configurações, analytics, logs.
- Chaves de API: bearer obrigatório (padrão `sk-agentdock-admin`).
- Monitor de sistema: CPU/RAM/GPU/rede com logging periódico.
- Swagger UI em `/swagger`.

### Instalação (usuário final)
1) Baixe a última release: https://github.com/KauanCerqueira/AgentDock/releases/latest
2) Rode o instalador para seu sistema. Na primeira execução o app baixa o binário correto do llama.cpp.
3) Coloque ao menos um GGUF em `src/AgentDock.Backend/models/` (ou use a aba de Modelos para baixar).

Requisitos mínimos: Win10/macOS11/Ubuntu20.04, 8 GB RAM (16 GB recomendado), CPU AVX, ~10 GB livres + espaço para modelos.

### Build a partir do código (dev)
Pré-requisitos: Node.js 20+, .NET 8 SDK, Git.

```bash
git clone https://github.com/KauanCerqueira/AgentDock.git
cd AgentDock
# Windows
./setup.ps1
# Linux/macOS
chmod +x setup.sh && ./setup.sh
```

O script detecta GPU, baixa o binário correto do llama.cpp, instala deps e prepara UI/backend.

Execução em desenvolvimento:
```bash
npm run dev
# backend em http://localhost:5000, frontend em http://localhost:5173, Electron dev
```

Build de produção:
```bash
npm run build
```

Só backend:
```bash
cd src/AgentDock.Backend
dotnet run
```

### Usando a API
Base: `http://localhost:5000/v1` • Auth: `Authorization: Bearer sk-agentdock-admin`

Python:
```python
from openai import OpenAI
client = OpenAI(base_url="http://localhost:5000/v1", api_key="sk-agentdock-admin")
resp = client.chat.completions.create(model="llama-2-7b-chat.Q2_K.gguf", messages=[{"role":"user","content":"Oi"}])
print(resp.choices[0].message.content)
```

Node.js:
```javascript
import OpenAI from 'openai';
const client = new OpenAI({ baseURL: 'http://localhost:5000/v1', apiKey: 'sk-agentdock-admin' });
const resp = await client.chat.completions.create({ model: 'llama-2-7b-chat.Q2_K.gguf', messages: [{ role:'user', content:'Oi' }] });
console.log(resp.choices[0].message.content);
```

cURL:
```bash
curl http://localhost:5000/v1/chat/completions \
   -H "Content-Type: application/json" \
   -H "Authorization: Bearer sk-agentdock-admin" \
   -d '{"model":"llama-2-7b-chat.Q2_K.gguf","messages":[{"role":"user","content":"Oi"}]}'
```

Swagger: `http://localhost:5000/swagger`
Health: `http://localhost:5000/api/engine/health`

### Como colaborar
- Issues: https://github.com/KauanCerqueira/AgentDock/issues
- Pull requests: fork, branch (`feat/*`), testes, PR com contexto.
- Commits convencionais: feat/fix/docs/style/refactor/test/chore.
- Atualize docs ao adicionar features.

### Estrutura do projeto (resumo)
```
electron/              # main e preload
src/AgentDock.Backend/ # API ASP.NET Core, ciclo do llama.cpp, integração Hugging Face
src/AgentDock.UI/      # React + Vite + Tailwind
llama.cpp/             # binários e zips empacotados
```

### Licença
MIT. Veja LICENSE.
