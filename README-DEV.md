# ?? AgentDock - Guia de Desenvolvimento

## ?? Visão Geral

AgentDock é uma plataforma de assistente IA local com interface moderna em React (shadcn/ui) hospedada em WPF.

## ??? Arquitetura

```
AgentDock/
??? src/
?   ??? AgentDock.UI/           # Frontend React + Vite + Tailwind + shadcn/ui
?   ??? AgentDock.Backend/      # ASP.NET Core API + Static Files
?   ??? AgentDock.DesktopHost/  # WPF App com WebView2
??? build-frontend.ps1          # Script de build do React
```

## ? Início Rápido

### 1?? Executar a Aplicação

**Método 1: Via Visual Studio (Recomendado)**
```
1. Abra AgentDock.sln no Visual Studio
2. Defina AgentDock.DesktopHost como projeto de inicialização
3. Pressione F5
```

**Método 2: Via Linha de Comando**
```powershell
# Compilar frontend
.\build-frontend.ps1

# Executar aplicação
dotnet run --project src\AgentDock.DesktopHost
```

### 2?? Desenvolvimento do Frontend React

#### Editar Componentes React no Visual Studio

Todos os arquivos `.tsx` e `.ts` estão em `src\AgentDock.UI\src\`:

```
src\AgentDock.UI\src\
??? components/
?   ??? ui/                     # Componentes shadcn/ui
?   ?   ??? button.tsx
?   ?   ??? card.tsx
?   ?   ??? input.tsx
?   ?   ??? badge.tsx
?   ?   ??? ...
?   ??? Layout.tsx              # Layout principal
?   ??? Sidebar.tsx             # Menu lateral
?   ??? Topbar.tsx              # Barra superior
??? pages/
?   ??? Setup.tsx               # Página de configuração
?   ??? Models.tsx              # Gerenciar modelos
?   ??? Chat.tsx                # Chat com IA
?   ??? Tasks.tsx               # Tarefas
?   ??? Workspaces.tsx          # Espaços de trabalho
??? App.tsx                     # Roteamento
??? main.tsx                    # Entry point
??? index.css                   # Estilos globais (Tailwind + shadcn)
```

#### Workflow de Desenvolvimento

**Opção 1: Build Manual (Padrão)**
```powershell
# 1. Edite arquivos React no VS
# 2. Compile o frontend
cd src\AgentDock.UI
npm run build

# 3. Execute a aplicação WPF
# O build vai para: src\AgentDock.Backend\wwwroot\
```

**Opção 2: Vite Dev Server (Hot Reload)**
```powershell
# Terminal 1: Iniciar Vite dev server
cd src\AgentDock.UI
npm run dev
# Vite roda em http://localhost:5173

# Terminal 2: Iniciar backend
cd src\AgentDock.Backend
dotnet run
# Backend roda em http://localhost:5000

# Abra navegador em http://localhost:5173
# Mudanças em arquivos React aparecem instantaneamente!
```

## ?? Design System (shadcn/ui)

### Componentes Disponíveis

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
```

### Variantes de Botões

```tsx
<Button variant="default">Padrão</Button>
<Button variant="destructive">Destrutivo</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

<Button size="default">Padrão</Button>
<Button size="sm">Pequeno</Button>
<Button size="lg">Grande</Button>
<Button size="icon">Ícone</Button>
```

### Variantes de Badges

```tsx
<Badge variant="default">Padrão</Badge>
<Badge variant="secondary">Secundário</Badge>
<Badge variant="destructive">Destrutivo</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="success">Sucesso</Badge>
<Badge variant="warning">Aviso</Badge>
```

### Cores e Temas

Todas as cores estão definidas em `src\AgentDock.UI\src\index.css`:

```css
:root {
  --background: 224 71% 4%;        /* Fundo escuro */
  --foreground: 213 31% 91%;       /* Texto claro */
  --primary: 210 40% 98%;          /* Primária (branco) */
  --secondary: 222.2 47.4% 11.2%;  /* Secundária (escuro) */
  --accent: 216 34% 17%;           /* Accent */
  --muted: 223 47% 11%;            /* Muted */
  --border: 216 34% 17%;           /* Bordas */
  --card: 224 71% 4%;              /* Cards */
  --destructive: 0 63% 31%;        /* Destrutivo (vermelho) */
}
```

## ?? Estrutura de Build

### Frontend React
```
Vite Build ? src\AgentDock.Backend\wwwroot\
  ??? index.html
  ??? assets/
      ??? index-[hash].js
      ??? index-[hash].css
```

### Cache Inteligente
- Frontend é recompilado automaticamente se tiver **mais de 24 horas**
- Para forçar rebuild: execute `.\build-frontend.ps1`

## ?? Comandos Úteis

```powershell
# Instalar dependências npm
cd src\AgentDock.UI
npm install

# Build de produção
npm run build

# Dev server com hot reload
npm run dev

# Verificar tipos TypeScript
npm run type-check

# Limpar build
Remove-Item src\AgentDock.Backend\wwwroot\* -Recurse -Force

# Rebuild completo
.\build-frontend.ps1
dotnet build
```

## ?? Troubleshooting

### Problema: Tela branca ao abrir aplicação
**Solução:**
```powershell
# 1. Verificar se wwwroot tem arquivos
dir src\AgentDock.Backend\wwwroot

# 2. Se vazio, compilar frontend
.\build-frontend.ps1

# 3. Verificar logs
Get-Content src\AgentDock.DesktopHost\bin\Debug\net8.0-windows\startup-error.log
```

### Problema: Mudanças React não aparecem
**Solução:**
```powershell
# 1. Forçar rebuild
.\build-frontend.ps1

# 2. Limpar cache do WebView2
Remove-Item "$env:LOCALAPPDATA\AgentDock.DesktopHost.exe.WebView2" -Recurse -Force

# 3. Recompilar e executar
dotnet build
dotnet run --project src\AgentDock.DesktopHost
```

### Problema: Erro "npm não encontrado"
**Solução:**
```powershell
# Instalar Node.js
winget install OpenJS.NodeJS

# Verificar instalação
node --version
npm --version
```

## ?? Fluxo de Trabalho Recomendado

### Para desenvolvimento do Frontend:
1. Abra Visual Studio
2. Edite arquivos em `src\AgentDock.UI\src\`
3. Execute `.\build-frontend.ps1` no terminal
4. Pressione F5 para testar no WPF

### Para desenvolvimento do Backend:
1. Edite controllers em `src\AgentDock.Backend\Controllers\`
2. Modifique services em `src\AgentDock.Backend\Services\`
3. Pressione F5 - hot reload ativo!

## ?? Recursos

- **shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Lucide Icons**: https://lucide.dev/
- **React Router**: https://reactrouter.com/

## ? Features Implementadas

- ? Interface moderna shadcn/ui
- ? Dark theme profissional
- ? Componentes reutilizáveis
- ? Animações suaves
- ? Build automático
- ? Hot reload (opcional)
- ? TypeScript
- ? Tailwind CSS
- ? WebView2 integrado
- ? DevTools habilitado

---

**Versão:** 1.0.0  
**Data:** 2026-01-03
