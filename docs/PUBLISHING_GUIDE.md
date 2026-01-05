# 🚀 Guia de Publicação do AgentDock no GitHub

Este guia mostra como publicar o AgentDock como projeto open source otimizado.

## ✅ Pré-requisitos Completos

Todas as otimizações já foram aplicadas:
- ✅ Histórico Git limpo (2.428 arquivos llama.cpp removidos)
- ✅ .gitignore aprimorado com padrões robustos
- ✅ Setup scripts com auto-detecção de GPU
- ✅ Electron builder otimizado (apenas CPU no instalador)
- ✅ GitHub Actions configurado para builds automatizados
- ✅ README.md atualizado com instruções de download
- ✅ LICENSE MIT adicionada
- ✅ CONTRIBUTING.md criado

## 📊 Redução de Tamanho Alcançada

**Antes:** ~2-3 GB (com todos os binários llama.cpp)
**Depois:** ~50-100 MB (apenas código-fonte)
**Redução:** ~95% 🎉

## 🔧 Próximos Passos

### 1. Limpar arquivos locais (se necessário)

```powershell
# Remover pasta llama.cpp local (será baixada pelo setup)
Remove-Item -Recurse -Force llama.cpp -ErrorAction SilentlyContinue

# Limpar builds antigos
npm run clean:all
```

### 2. Fazer commit das mudanças

```bash
# Ver mudanças
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: optimize repository for open source (95% size reduction)

- Remove llama.cpp binaries from git history
- Enhance .gitignore with comprehensive patterns
- Add GPU auto-detection to setup scripts
- Optimize electron-builder to package CPU-only
- Add GitHub Actions for automated releases
- Update README with download instructions
- Add MIT license and contributing guidelines"

# Push para master
git push origin master
```

### 3. Criar primeira release

```bash
# Criar tag v1.0.0
git tag -a v1.0.0 -m "Release v1.0.0 - Initial Open Source Release

Features:
- OpenAI-compatible local API
- Multi-GPU support (CUDA, ROCm, SYCL, Vulkan)
- Auto-detection and download of optimal binaries
- Cross-platform (Windows, macOS, Linux)
- Real-time analytics and monitoring
- Swagger API documentation

Optimizations:
- 95% repository size reduction
- On-demand binary downloads
- Platform-specific installers"

# Push tag (isso dispara GitHub Actions)
git push origin v1.0.0
```

### 4. Aguardar build automático

O GitHub Actions vai automaticamente:
1. Buildar para Windows, macOS e Linux
2. Criar instaladores otimizados
3. Criar GitHub Release
4. Fazer upload dos instaladores

Acompanhe em: https://github.com/KauanCerqueira/AgentDock/actions

### 5. Finalizar release no GitHub

Após o build completar:

1. Acesse: https://github.com/KauanCerqueira/AgentDock/releases
2. Edite a release v1.0.0
3. Adicione descrição detalhada (pode usar o template abaixo)
4. Publique a release

**Template de Release Notes:**

```markdown
# 🚀 AgentDock v1.0.0 - Initial Release

Run powerful AI models locally with an OpenAI-compatible API! 

## 🎉 Highlights

- **Lightweight**: 95% smaller repository - binaries downloaded on-demand
- **Smart Setup**: Auto-detects your GPU and downloads optimal binaries
- **Cross-Platform**: Windows, macOS, and Linux support
- **OpenAI Compatible**: Drop-in replacement for OpenAI API
- **Multiple GPUs**: NVIDIA CUDA, AMD ROCm, Intel SYCL, Vulkan

## 📦 Downloads

### Windows
- **Installer**: `AgentDock-Setup-1.0.0.exe` (recommended)
- **Portable**: `AgentDock-1.0.0-portable.exe`

### macOS
- **DMG**: `AgentDock-1.0.0.dmg`

### Linux
- **AppImage**: `AgentDock-1.0.0.AppImage` (universal)
- **DEB**: `AgentDock-1.0.0.deb` (Debian/Ubuntu)

## 🚀 Quick Start

1. Download and install
2. Run AgentDock
3. App auto-downloads optimal GPU binaries (~80-300 MB)
4. Start using local AI!

## 📖 Documentation

- [Installation Guide](https://github.com/KauanCerqueira/AgentDock#-installation)
- [API Documentation](https://github.com/KauanCerqueira/AgentDock#-api-documentation)
- [Contributing](https://github.com/KauanCerqueira/AgentDock/blob/master/CONTRIBUTING.md)

## 🐛 Known Issues

- First run may take longer due to binary downloads
- Models must be downloaded separately (not included)

## 🙏 Credits

Built with llama.cpp, .NET, React, and Electron.

**Full Changelog**: https://github.com/KauanCerqueira/AgentDock/commits/v1.0.0
```

### 6. Hospedar variantes do llama.cpp (Opcional)

Se você quiser hospedar os binários llama.cpp no seu próprio release:

```powershell
# Baixar todas as variantes oficiais
$variants = @(
    "llama-b4370-bin-win-cpu-x64.zip",
    "llama-b4370-bin-win-cuda-cu12.4.1-x64.zip",
    "llama-b4370-bin-win-hip-x64.zip",
    "llama-b4370-bin-win-sycl-x64.zip",
    "llama-b4370-bin-win-vulkan-x64.zip"
)

foreach ($variant in $variants) {
    $url = "https://github.com/ggerganov/llama.cpp/releases/latest/download/$variant"
    Invoke-WebRequest -Uri $url -OutFile $variant
}

# Fazer upload manual na release do GitHub
```

## 🎯 Pós-Publicação

### Configurar GitHub Repository Settings

1. **About**: Adicione descrição e topics
   - Description: "Open-source local AI platform with OpenAI-compatible API"
   - Topics: `ai`, `llama-cpp`, `openai`, `electron`, `dotnet`, `react`, `local-ai`, `gpu-acceleration`

2. **Features**: Habilite
   - ✅ Issues
   - ✅ Discussions
   - ✅ Sponsorships (opcional)
   - ✅ Wikis (opcional)

3. **Security**: Configure
   - Vulnerability reporting
   - Code scanning
   - Dependabot alerts

### Divulgar o Projeto

- Reddit: r/LocalLLaMA, r/MachineLearning, r/dotnet
- Twitter/X: @hashtags #LocalAI #OpenSource #LlamaCpp
- Hacker News: https://news.ycombinator.com/submit
- Product Hunt: https://www.producthunt.com/
- LinkedIn: Seu perfil profissional

### Monitorar

- GitHub Insights: Tráfego, clones, stars
- Issues: Responder rapidamente
- Pull Requests: Revisar contribuições
- Discussions: Engajar com comunidade

## 📈 Próximas Releases

Para releases futuras:

```bash
# Atualizar versão
npm version minor  # ou major/patch

# Criar tag
git tag -a v1.1.0 -m "Release v1.1.0"

# Push
git push origin master --tags
```

O GitHub Actions fará o resto automaticamente!

## ❓ Troubleshooting

### Build falha no GitHub Actions

- Verifique os logs em Actions tab
- Certifique-se que .NET 8 SDK está configurado
- Verifique se node_modules está no .gitignore

### Binários não baixam no setup

- Atualize URLs no setup.ps1/setup.sh
- Verifique conectividade de rede
- Tente download manual como fallback

### Instalador muito grande

- Verifique electron-builder config
- Certifique-se que apenas CPU variant está incluído
- Remova arquivos desnecessários via `files` filter

## 🎊 Parabéns!

Seu projeto está agora open source e otimizado! 🚀

**Tamanho do repo:** ~50-100 MB
**Instalador:** ~150-200 MB (apenas CPU)
**Downloads adicionais:** 80-300 MB (específico por GPU)

Total de economia para colaboradores: **~2 GB de downloads desnecessários!**
