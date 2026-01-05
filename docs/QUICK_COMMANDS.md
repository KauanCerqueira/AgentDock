# Comandos Rápidos - Publicação do AgentDock

## 🚀 Opção 1: Script Automatizado (Recomendado)

```powershell
# Execute o script de publicação
.\publish.ps1
```

O script irá:
- ✅ Adicionar todos os arquivos
- ✅ Criar commit otimizado
- ✅ Fazer push para master
- ✅ Criar tag v1.0.0
- ✅ Disparar GitHub Actions
- ✅ Gerar instaladores automaticamente

---

## 📝 Opção 2: Comandos Manuais

### Passo 1: Commit das Mudanças

```bash
# Ver o que mudou
git status

# Adicionar tudo
git add .

# Commit
git commit -m "feat: optimize repository for open source (95% size reduction)

- Remove 2,428 llama.cpp files from git history
- Enhance .gitignore with comprehensive patterns
- Add GPU auto-detection to setup scripts
- Optimize electron-builder for CPU-only
- Add GitHub Actions for automated releases
- Update README with download instructions
- Add MIT license and contributing guidelines

Repository size: ~2-3 GB → ~50-100 MB (95% reduction)"

# Push para master
git push origin master
```

### Passo 2: Criar Release

```bash
# Criar tag
git tag -a v1.0.0 -m "Release v1.0.0 - Initial Open Source Release

Features:
- OpenAI-compatible local API
- Multi-GPU support (CUDA, ROCm, SYCL, Vulkan)
- Auto-detection and download of optimal binaries
- Cross-platform (Windows, macOS, Linux)
- Real-time analytics and monitoring

Optimizations:
- 95% repository size reduction
- On-demand binary downloads
- Platform-specific installers"

# Push da tag (dispara GitHub Actions)
git push origin v1.0.0
```

### Passo 3: Aguardar Build

```
Acesse: https://github.com/KauanCerqueira/AgentDock/actions
Tempo: ~15-30 minutos
```

### Passo 4: Publicar Release

```
1. Acesse: https://github.com/KauanCerqueira/AgentDock/releases
2. Edite a release v1.0.0
3. Adicione descrição detalhada
4. Publique!
```

---

## 🔍 Verificar Tamanho do Repositório

```powershell
# Ver tamanho do .git
Get-ChildItem .git -Recurse | Measure-Object -Property Length -Sum | Select-Object @{Name="Size (MB)"; Expression={[math]::Round($_.Sum / 1MB, 2)}}

# Ver arquivos rastreados
git ls-tree -r HEAD --name-only | Measure-Object | Select-Object Count
```

---

## 🧹 Limpeza (Opcional)

Se quiser limpar ainda mais:

```powershell
# Limpar reflog
git reflog expire --expire=now --all

# Garbage collection agressivo
git gc --aggressive --prune=now

# Ver tamanho novamente
du -sh .git
```

---

## ⚠️ IMPORTANTE: Antes de Publicar

### Verificar arquivos que serão commitados

```bash
# Ver arquivos modificados
git status

# Ver diff
git diff

# Ver arquivos que serão adicionados
git ls-files --others --exclude-standard
```

### Verificar se llama.cpp foi removido do histórico

```bash
# Não deve retornar nada (ou apenas commits antigos antes do filter-branch)
git log --all --oneline --full-history -- "llama.cpp/*"

# Verificar arquivos atualmente rastreados
git ls-tree -r HEAD | grep llama.cpp
```

Esperado: Apenas `llama.cpp/config.json` e estrutura de pastas

### Verificar .gitignore

```bash
# Testar se llama.cpp está ignorado
git check-ignore -v llama.cpp/cpu/ggml.dll

# Deve retornar: .gitignore:X:llama.cpp/    llama.cpp/cpu/ggml.dll
```

---

## 📊 Estatísticas Esperadas

Depois da otimização:

```
Repository Size: ~50-100 MB
Total Files: ~300-500 (sem binários)
Clone Time: 10-30 segundos
Installer Size: ~150-200 MB
```

Antes da otimização:

```
Repository Size: ~2-3 GB
Total Files: ~2,800+ (com binários)
Clone Time: 5-15 minutos
Installer Size: ~2+ GB
```

**Redução: 95% ✅**

---

## 🎯 Checklist Final

Antes de publicar, confirme:

- [ ] Histórico Git limpo (llama.cpp removido)
- [ ] .gitignore atualizado
- [ ] setup.ps1 com auto-detecção GPU
- [ ] electron-builder otimizado
- [ ] GitHub Actions configurado
- [ ] README atualizado
- [ ] LICENSE adicionada
- [ ] CONTRIBUTING.md criado
- [ ] package.json com metadados corretos
- [ ] Versão atualizada (v1.0.0)

Se tudo ✅, prossiga com publicação!

---

## 🆘 Troubleshooting

### Git push rejeitado (histórico reescrito)

```bash
# Force push (cuidado! reescreve histórico remoto)
git push origin master --force

# Ou force with lease (mais seguro)
git push origin master --force-with-lease
```

**⚠️ ATENÇÃO:** Isso reescreve o histórico. Certifique-se de que ninguém mais tem trabalho não pushado.

### Tag já existe

```bash
# Deletar tag local
git tag -d v1.0.0

# Deletar tag remota
git push origin :refs/tags/v1.0.0

# Criar novamente
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

### GitHub Actions não dispara

Verifique:
1. Arquivo está em `.github/workflows/release.yml`
2. Tag foi criada corretamente: `git tag -l`
3. Tag foi pushed: `git ls-remote --tags origin`
4. Permissões do GitHub Actions estão habilitadas

---

## 📚 Documentação

Para mais detalhes:
- `docs/PUBLISHING_GUIDE.md` - Guia completo de publicação
- `docs/OPTIMIZATION_SUMMARY.md` - Resumo das otimizações
- `.github/RELEASE_CHECKLIST.md` - Checklist de release
- `CONTRIBUTING.md` - Como contribuir

---

## 🎉 Pronto!

Agora seu projeto está otimizado e pronto para o mundo open source!

**Próximos passos após publicação:**
1. Divulgar nas redes sociais
2. Postar em Reddit (r/LocalLLaMA)
3. Submeter ao Product Hunt
4. Engajar com a comunidade
5. Responder issues e PRs

Boa sorte! 🚀
