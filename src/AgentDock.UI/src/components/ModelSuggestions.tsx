import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Zap, Award, Download, CheckCircle, Info, Cpu, HardDrive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface ModelSuggestion {
  modelId: string
  filename: string
  reason: string
  score: number
  requirements: {
    minRamGb: number
    recommendedRamGb: number
    minVramGb: number
    recommendedVramGb: number
    modelSize: string
    parameterCount: number
    quantization: string
  }
  compatibility: {
    canRun: boolean
    level: string
    performanceEstimate: string
    ramUtilizationPercent: number
  }
  pros: string[]
  cons: string[]
  useCase: string
}

interface HardwareInfo {
  availableRamGb: number
  totalRamGb: number
  gpuName?: string
  gpuVramGb?: number
  category: string
}

export default function ModelSuggestions() {
  const [suggestions, setSuggestions] = useState<ModelSuggestion[]>([])
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<Record<string, number>>({})

  useEffect(() => {
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/models/suggestions?limit=5')
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setHardwareInfo(data.hardwareInfo || null)
    } catch (error) {
      toast.error('Falha ao carregar sugestões')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (suggestion: ModelSuggestion) => {
    try {
      const response = await fetch('http://localhost:5000/api/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: suggestion.modelId,
          filename: suggestion.filename
        })
      })

      const { downloadId } = await response.json()
      toast.success(`Download iniciado: ${suggestion.filename}`)

      // Polling de progresso
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`http://localhost:5000/api/models/download/${downloadId}`)
        const status = await statusResponse.json()

        setDownloading(prev => ({
          ...prev,
          [suggestion.filename]: status.percentComplete
        }))

        if (status.status === 'Completed') {
          clearInterval(pollInterval)
          setDownloading(prev => {
            const updated = { ...prev }
            delete updated[suggestion.filename]
            return updated
          })
          toast.success(`? Modelo pronto para usar: ${suggestion.filename}`, {
            description: 'O modelo foi baixado e está disponível no llama.cpp'
          })
        } else if (status.status === 'Failed' || status.status === 'Cancelled') {
          clearInterval(pollInterval)
          setDownloading(prev => {
            const updated = { ...prev }
            delete updated[suggestion.filename]
            return updated
          })
          if (status.status === 'Failed') {
            toast.error(`Erro no download: ${status.errorMessage}`)
          }
        }
      }, 1000)
    } catch (error) {
      toast.error('Falha ao iniciar download')
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500 bg-green-500/10 border-green-500/20'
    if (score >= 75) return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    if (score >= 60) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Award className="w-4 h-4" />
    if (score >= 75) return <TrendingUp className="w-4 h-4" />
    if (score >= 60) return <Zap className="w-4 h-4" />
    return <Info className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Hardware Info Card */}
      {hardwareInfo && (
        <Card className="bg-muted border-border p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Seu Hardware
              </h3>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-3 h-3" />
                  <span>{hardwareInfo.availableRamGb.toFixed(1)}GB RAM disponível / {hardwareInfo.totalRamGb.toFixed(1)}GB total</span>
                </div>
                {hardwareInfo.gpuName && (
                  <div className="flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    <span>{hardwareInfo.gpuName} ({hardwareInfo.gpuVramGb?.toFixed(1)}GB VRAM)</span>
                  </div>
                )}
              </div>
            </div>
            <Badge variant="outline" className="bg-background">
              {hardwareInfo.category}
            </Badge>
          </div>
        </Card>
      )}

      {/* Suggestions Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Modelos Recomendados para Você
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Baseado no seu hardware e casos de uso comuns
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={loadSuggestions}>
          Atualizar
        </Button>
      </div>

      {/* Suggestions List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-4 bg-card border-border animate-pulse">
              <div className="h-20 bg-muted rounded" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <Card key={`${suggestion.modelId}-${suggestion.filename}`} className="p-4 bg-card border-border hover:border-primary/50 transition-colors relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-medium text-foreground">
                      {suggestion.modelId.split('/').pop()}
                    </h3>
                    <Badge variant="outline" className={`text-[10px] ${getScoreColor(suggestion.score)}`}>
                      {getScoreIcon(suggestion.score)}
                      <span className="ml-1">{suggestion.score}/100</span>
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                  {suggestion.useCase && (
                    <p className="text-[10px] text-muted-foreground mt-1">
                      ?? {suggestion.useCase}
                    </p>
                  )}
                </div>
                {downloading[suggestion.filename] !== undefined ? (
                  <div className="ml-4 space-y-1 min-w-[120px]">
                    <div className="text-xs text-muted-foreground text-right">
                      {downloading[suggestion.filename].toFixed(0)}%
                    </div>
                    <Progress value={downloading[suggestion.filename]} className="h-2" />
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleDownload(suggestion)}
                    className="ml-4"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Baixar
                  </Button>
                )}
              </div>

              {/* Requirements */}
              <div className="grid grid-cols-3 gap-2 mb-3 py-2 border-t border-border">
                <div className="text-xs">
                  <div className="text-muted-foreground">Tamanho</div>
                  <div className="font-mono text-foreground">{suggestion.requirements.modelSize}</div>
                </div>
                <div className="text-xs">
                  <div className="text-muted-foreground">RAM Necessária</div>
                  <div className="font-mono text-foreground">{suggestion.requirements.recommendedRamGb}GB</div>
                </div>
                <div className="text-xs">
                  <div className="text-muted-foreground">Quantização</div>
                  <div className="font-mono text-foreground">{suggestion.requirements.quantization}</div>
                </div>
              </div>

              {/* Performance */}
              <div className="mb-3 p-2 rounded bg-muted">
                <div className="text-xs text-muted-foreground mb-1">Performance Estimada</div>
                <div className="text-xs text-foreground">{suggestion.compatibility.performanceEstimate}</div>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Uso de RAM: {suggestion.compatibility.ramUtilizationPercent.toFixed(0)}%
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {suggestion.pros.length > 0 && (
                  <div>
                    <div className="text-muted-foreground mb-1 font-medium">Vantagens</div>
                    <ul className="space-y-0.5">
                      {suggestion.pros.slice(0, 2).map((pro, idx) => (
                        <li key={idx} className="text-green-500 flex items-start gap-1">
                          <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {suggestion.cons.length > 0 && (
                  <div>
                    <div className="text-muted-foreground mb-1 font-medium">Considerações</div>
                    <ul className="space-y-0.5">
                      {suggestion.cons.slice(0, 2).map((con, idx) => (
                        <li key={idx} className="text-orange-500 flex items-start gap-1">
                          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Rank Badge */}
              {index === 0 && (
                <div className="absolute top-2 right-2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Award className="w-3 h-3 mr-1" />
                    Top Pick
                  </Badge>
                </div>
              )}
            </Card>
          ))}

          {suggestions.length === 0 && (
            <Card className="p-8 text-center bg-muted border-border">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-foreground mb-1">Nenhuma sugestão disponível</p>
              <p className="text-xs text-muted-foreground">
                Verifique sua conexão ou tente novamente
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
