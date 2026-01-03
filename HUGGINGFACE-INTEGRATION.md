# HuggingFace Integration - Hardware Compatibility System

## ?? Visão Geral

O AgentDock agora possui um sistema completo de integração com HuggingFace que:

1. **Busca modelos GGUF** diretamente do HuggingFace Hub
2. **Calcula requisitos de sistema** automaticamente baseado no tamanho e tipo de modelo
3. **Compara com seu hardware** e mostra compatibilidade em tempo real
4. **Fornece recomendações** personalizadas para otimizar performance

## ?? Funcionalidades

### 1. Busca Inteligente de Modelos

```typescript
// Buscar modelos no HuggingFace
GET /api/models/search?query=llama&limit=10
```

### 2. Análise de Compatibilidade Automática

Quando você visualiza os arquivos de um modelo, o sistema:

- ? Detecta automaticamente seu hardware (RAM, VRAM, GPU)
- ? Calcula requisitos mínimos e recomendados do modelo
- ? Compara e gera score de compatibilidade
- ? Fornece avisos e recomendações específicas

### 3. Níveis de Compatibilidade

| Nível | Descrição | Cor |
|-------|-----------|-----|
| **Excellent** | Hardware bem acima dos requisitos | ?? Verde |
| **Good** | Atende requisitos recomendados | ?? Azul |
| **Adequate** | Atende mínimos, pode ter lentidão | ?? Amarelo |
| **Poor** | No limite, desempenho limitado | ?? Laranja |
| **Incompatible** | Não pode executar | ?? Vermelho |

## ?? Cálculo de Requisitos

### Como funciona

O sistema analisa o arquivo GGUF e extrai:

1. **Tamanho do arquivo** ? Estima RAM/VRAM necessária
2. **Quantização** (Q4, Q5, Q8, F16) ? Ajusta requisitos
3. **Parâmetros** (7B, 13B, 70B) ? Identifica complexidade

### Exemplo de Cálculo

```
Arquivo: llama-2-7b-chat.Q4_K_M.gguf (4.1GB)

Requisitos calculados:
- RAM Mínima: 5GB (4.1GB × 1.2)
- RAM Recomendada: 6GB (4.1GB × 1.5)
- VRAM Mínima: 5GB (para GPU)
- VRAM Recomendada: 6GB
- Quantização: Q4_K_M (balanceada)
```

## ??? Detecção de Hardware

### Informações Coletadas

```csharp
SystemStats {
    AvailableMemoryGb: 12.5,
    TotalMemoryGb: 16.0,
    GpuInfo: {
        Name: "NVIDIA RTX 3060",
        MemoryTotalGb: 12.0,
        MemoryUsedGb: 2.3
    }
}
```

## ?? Interface do Usuário

### ModelBrowser.tsx

O componente agora exibe:

1. **Badge de Compatibilidade** com cor dinâmica
2. **Requisitos de Sistema**
   - RAM mínima/recomendada
   - VRAM mínima/recomendada
   - Tipo de quantização
3. **Avisos e Alertas**
   - RAM insuficiente
   - GPU não detectada
   - Recomendações de otimização
4. **Estimativa de Performance**
   - "Excelente - Hardware bem acima dos requisitos"
   - "Adequado - Pode haver lentidão"

### Exemplo Visual

```
???????????????????????????????????????
? llama-2-7b-chat.Q4_K_M.gguf         ?
? 4.1 GB                    [Download]?
???????????????????????????????????????
? ?? RAM: 5GB - 6GB  ??? VRAM: 5-6GB  ?
? Quantization: Q4_K_M                ?
???????????????????????????????????????
? ? Good                    RAM: 38% ?
? Bom - Atende requisitos recomendados?
???????????????????????????????????????
? ? GPU detectada (12GB VRAM)         ?
? ?? Quantização Q4_K_M - Balanceado  ?
???????????????????????????????????????
```

## ?? API Endpoints

### 1. Buscar Modelos

```bash
GET /api/models/search?query=llama&limit=10
```

**Response:**
```json
[
  {
    "id": "meta-llama/Llama-2-7b-chat-hf",
    "modelId": "meta-llama/Llama-2-7b-chat-hf",
    "downloads": 1500000,
    "likes": 8500,
    "tags": ["llama", "chat", "7b"]
  }
]
```

### 2. Listar Arquivos com Compatibilidade

```bash
GET /api/models/huggingface/{modelId}/files
```

**Response:**
```json
[
  {
    "filename": "llama-2-7b-chat.Q4_K_M.gguf",
    "size": 4404896768,
    "requirements": {
      "minRamGb": 5,
      "recommendedRamGb": 6,
      "minVramGb": 5,
      "recommendedVramGb": 6,
      "requiresGpu": false,
      "modelSize": "4.10 GB",
      "parameterCount": 7,
      "quantization": "Q4_K_M",
      "supportedPlatforms": ["Windows", "Linux", "macOS"]
    },
    "compatibility": {
      "canRun": true,
      "level": "Good",
      "warnings": [],
      "recommendations": [
        "? GPU detectada (12.0GB VRAM) - Execução acelerada disponível",
        "?? Quantização Q4_K_M - Balanceado entre velocidade e qualidade"
      ],
      "ramUtilizationPercent": 38.4,
      "vramUtilizationPercent": 50.0,
      "performanceEstimate": "Bom - Atende requisitos recomendados"
    }
  }
]
```

### 3. Verificar Compatibilidade Específica

```bash
POST /api/models/check-compatibility
Content-Type: application/json

{
  "filename": "llama-2-7b-chat.Q4_K_M.gguf",
  "sizeBytes": 4404896768
}
```

**Response:**
```json
{
  "requirements": { /* ... */ },
  "compatibility": { /* ... */ },
  "systemInfo": {
    "availableRamGb": 12.5,
    "totalRamGb": 16.0,
    "gpuName": "NVIDIA RTX 3060",
    "gpuVramGb": 12.0
  }
}
```

## ?? Exemplos de Uso

### Frontend - TypeScript

```typescript
// Buscar modelos
const response = await fetch('/api/models/search?query=llama')
const models = await response.json()

// Carregar arquivos com compatibilidade
const filesResponse = await fetch(`/api/models/huggingface/${modelId}/files`)
const files = await filesResponse.json()

// Verificar compatibilidade
files.forEach(file => {
  if (file.compatibility.canRun) {
    console.log(`? ${file.filename} - ${file.compatibility.level}`)
  } else {
    console.log(`? ${file.filename} - Incompatível`)
  }
})
```

### Backend - C#

```csharp
// Calcular requisitos
var requirements = _huggingFaceService.CalculateRequirements(
    "llama-2-7b.Q4_K_M.gguf", 
    4404896768
);

// Verificar compatibilidade
var systemStats = _systemMonitor.GetSystemStats();
var compatibility = _huggingFaceService.CheckCompatibility(
    requirements,
    systemStats.AvailableMemoryGb,
    systemStats.GpuInfo?.MemoryTotalGb
);

if (compatibility.CanRun) {
    Console.WriteLine($"Compatibilidade: {compatibility.Level}");
    Console.WriteLine($"Performance: {compatibility.PerformanceEstimate}");
}
```

## ?? Entendendo Quantizações

| Quantização | Tamanho | Qualidade | Velocidade | Uso Recomendado |
|-------------|---------|-----------|------------|------------------|
| **F16** | Grande | Máxima | Lenta | Pesquisa, máxima precisão |
| **Q8_0** | Grande | Alta | Média | Produção, alta qualidade |
| **Q5_K_M** | Médio | Boa | Rápida | Balanceado |
| **Q4_K_M** | Pequeno | Boa | Rápida | Uso geral, recomendado |
| **Q4_0** | Pequeno | Aceitável | Muito rápida | Hardware limitado |

## ?? Troubleshooting

### "RAM insuficiente"

**Solução:**
1. Feche outros aplicativos
2. Escolha modelo menor (7B ao invés de 13B)
3. Use quantização mais leve (Q4 ao invés de Q8)

### "GPU não detectada"

**Verificar:**
1. Drivers de GPU atualizados
2. LibreHardwareMonitor tem permissões
3. GPU suportada (NVIDIA/AMD/Intel)

### Download lento

**Otimizar:**
1. HuggingFace pode ter rate limiting
2. Use horários de menor tráfego
3. Considere download via CLI do HF

## ?? Próximos Passos

- [ ] Cache de informações de compatibilidade
- [ ] Suporte a modelos multi-arquivo
- [ ] Estimativa de tempo de inferência
- [ ] Recomendação automática de melhor modelo
- [ ] Integração com Ollama para conversão

## ?? Notas Técnicas

### Overhead de RAM

O sistema adiciona 20-50% de overhead ao tamanho do modelo:
- **Mínimo:** +20% (modelo + estruturas de dados)
- **Recomendado:** +50% (confortável para operações)

### GPU Offloading

Se VRAM < Requisito:
- Offloading parcial para CPU
- Performance intermediária
- Usa RAM + VRAM combinadas

### Plataformas Suportadas

- ? Windows (completo)
- ? Linux (completo)
- ? macOS (sem GPU monitor)

## ?? Referências

- [HuggingFace API Docs](https://huggingface.co/docs/api-inference)
- [GGUF Format Spec](https://github.com/ggerganov/ggml)
- [llama.cpp Hardware Requirements](https://github.com/ggerganov/llama.cpp)

---

**Desenvolvido com ?? para AgentDock**
