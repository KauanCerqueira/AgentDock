# ?? AgentDock - Guia de Empacotamento (Bundled Distribution)

## ?? Objetivo
Criar um instalador **completo** do AgentDock que já vem com Ollama e modelos embutidos, funcionando offline desde o primeiro uso.

## ?? Estrutura do Pacote Final

```
AgentDock/
??? AgentDock.exe                 # Desktop Host (WPF)
??? AgentDock.Backend.exe         # Backend API
??? wwwroot/                      # Frontend React (já compilado)
??? bin/
?   ??? ollama/
?       ??? ollama.exe            # Ollama binário (Windows)
?       ??? lib/                  # Bibliotecas necessárias
??? data/
    ??? ollama/
        ??? models/
            ??? llama2/           # Modelo pré-baixado
            ??? mistral/          # Modelo pré-baixado
            ??? codellama/        # Modelo pré-baixado
```

## ?? Passos para Criar o Pacote

### 1. **Baixar Ollama**
```powershell
# Baixar Ollama oficial
Invoke-WebRequest -Uri "https://ollama.ai/download/ollama-windows-amd64.exe" -OutFile "ollama.exe"

# Criar estrutura de diretórios
New-Item -ItemType Directory -Force -Path "dist/AgentDock/bin/ollama"
New-Item -ItemType Directory -Force -Path "dist/AgentDock/data/ollama/models"

# Copiar Ollama para o pacote
Copy-Item "ollama.exe" -Destination "dist/AgentDock/bin/ollama/"
```

### 2. **Baixar Modelos (Pré-instalação)**
```powershell
# Configurar Ollama para usar diretório local
$env:OLLAMA_MODELS = "dist/AgentDock/data/ollama/models"

# Baixar modelos essenciais
ollama pull llama2
ollama pull mistral
ollama pull codellama

# Modelos serão salvos em dist/AgentDock/data/ollama/models/
```

### 3. **Compilar Backend**
```powershell
dotnet publish src/AgentDock.Backend/AgentDock.Backend.csproj `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -o dist/AgentDock/backend
```

### 4. **Compilar Frontend**
```powershell
cd src/AgentDock.UI
npm install
npm run build
# Saída será copiada para ../AgentDock.Backend/wwwroot/ automaticamente
```

### 5. **Compilar Desktop Host**
```powershell
dotnet publish src/AgentDock.DesktopHost/AgentDock.DesktopHost.csproj `
    -c Release `
    -r win-x64 `
    --self-contained true `
    -o dist/AgentDock
```

### 6. **Organizar Estrutura Final**
```powershell
# Copiar backend compilado
Copy-Item "dist/AgentDock/backend/*" -Destination "dist/AgentDock/" -Recurse

# Remover duplicatas
Remove-Item "dist/AgentDock/backend" -Recurse -Force
```

## ?? Criar Instalador (Opcional)

### Usando Inno Setup
```iss
[Setup]
AppName=AgentDock
AppVersion=1.0.0
DefaultDirName={pf}\AgentDock
DefaultGroupName=AgentDock
OutputDir=dist
OutputBaseFilename=AgentDock-Setup

[Files]
Source: "dist\AgentDock\*"; DestDir: "{app}"; Flags: recursesubdirs

[Icons]
Name: "{group}\AgentDock"; Filename: "{app}\AgentDock.exe"
Name: "{commondesktop}\AgentDock"; Filename: "{app}\AgentDock.exe"

[Run]
Filename: "{app}\AgentDock.exe"; Description: "Launch AgentDock"; Flags: postinstall nowait
```

## ?? Configuração Automática

O `OllamaLifecycleService` no backend irá:
1. ? Detectar se Ollama já está rodando
2. ? Iniciar o Ollama embutido automaticamente
3. ? Configurar porta e caminhos corretos
4. ? Aguardar Ollama ficar "healthy"
5. ? Parar Ollama quando fechar o app

## ?? Teste de Empacotamento

```powershell
# Executar do diretório dist
cd dist/AgentDock
./AgentDock.exe

# O app deve:
# 1. Iniciar o Ollama embutido automaticamente
# 2. Carregar modelos pré-instalados
# 3. Abrir a interface do usuário
# 4. Funcionar 100% offline
```

## ?? Tamanho Estimado do Pacote

| Componente | Tamanho |
|------------|---------|
| AgentDock (Backend + Frontend) | ~100 MB |
| Ollama binário | ~500 MB |
| Llama 2 7B | ~3.8 GB |
| Mistral 7B | ~4.1 GB |
| CodeLlama 7B | ~3.8 GB |
| **TOTAL** | **~12.3 GB** |

## ?? Otimizações Possíveis

1. **Compressão**: Usar 7zip para reduzir tamanho (~50% redução)
2. **Modelos Menores**: Usar versões quantizadas (Q4_0) em vez de completas
3. **Download Sob Demanda**: Permitir baixar modelos extras depois
4. **Instalador Inteligente**: Detectar se já tem Ollama instalado no sistema

## ?? Notas Importantes

- ? Ollama será iniciado na porta `11434` por padrão
- ? Todos os dados ficam em `data/ollama/`
- ? Modelos são isolados do Ollama do sistema (se existir)
- ? Funciona 100% offline após instalação
- ? Não requer permissões de administrador
