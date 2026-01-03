# ?? AgentDock - Guia Rápido de Setup

## ? Pré-requisitos
- Windows 10/11
- GPU NVIDIA (opcional, mas recomendado)
- 8GB RAM mínimo (16GB recomendado)

## ?? Instalação

### 1. Baixar llama.cpp
Execute o script de setup:
```powershell
.\setup-llama.ps1
```

Isso irá:
- ? Baixar llama-server.exe e llama-cli.exe
- ? Instalar binários em `bin/llama/`
- ? Configurar CUDA (se disponível)

### 2. Baixar um Modelo
Baixe um modelo GGUF do HuggingFace:

**Recomendado para começar (3.8GB):**
```
https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf
```

Coloque o arquivo `.gguf` na pasta `models/`

### 3. Executar
```powershell
# Compilar e rodar
dotnet run --project src/AgentDock.DesktopHost
```

## ?? Estrutura Final

```
AgentDock/
??? bin/
?   ??? llama/
?       ??? llama-server.exe    ? Baixado pelo script
?       ??? ggml-cuda.dll       ? CUDA support
??? models/
?   ??? llama-2-7b-chat.Q4_K_M.gguf  ? Você baixa manualmente
??? src/
    ??? ...
```

## ?? Modelos Recomendados

| Modelo | Tamanho | Uso | Link |
|--------|---------|-----|------|
| **Llama 2 7B Chat** | 3.8GB | Chat geral | [Download](https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF) |
| **Mistral 7B Instruct** | 4.1GB | Instruções | [Download](https://huggingface.co/TheBloke/Mistral-7B-Instruct-v0.2-GGUF) |
| **CodeLlama 7B** | 3.8GB | Código | [Download](https://huggingface.co/TheBloke/CodeLlama-7B-Instruct-GGUF) |

**Dica:** Baixe os modelos com sufixo `Q4_K_M.gguf` (melhor custo-benefício)

## ?? Configuração (Opcional)

Edite `src/AgentDock.Backend/appsettings.json`:

```json
{
  "Llama": {
    "Port": 8080,                              // Porta do llama-server
    "DefaultModel": "llama-2-7b-chat.Q4_K_M.gguf",
    "ModelsPath": "models"
  }
}
```

## ?? Testar

1. Abra o AgentDock
2. Vá para **Chat**
3. Digite uma mensagem
4. Aguarde a resposta da IA local!

## ? Troubleshooting

### llama-server não inicia
- Verifique se há um modelo `.gguf` na pasta `models/`
- Veja os logs no console

### Resposta muito lenta
- Reduza o contexto (ctx-size) em `LlamaLifecycleService.cs`
- Use um modelo menor (3B em vez de 7B)

### GPU não está sendo usada
- Instale NVIDIA CUDA Toolkit 12.x
- Certifique-se de ter drivers atualizados

## ?? Pronto!

Agora você tem um **LM Studio caseiro** totalmente customizável!
