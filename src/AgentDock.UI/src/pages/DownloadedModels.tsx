import { useState, useEffect } from 'react'
import { HardDrive, Trash2, CheckCircle, AlertCircle, Info, RefreshCw, Download, Sparkles } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface DownloadedModel {
  filename: string
  path: string
  sizeGb: number
  downloadedAt: string
  requirements: {
    minRamGb: number
    recommendedRamGb: number
    modelSize: string
    quantization: string
    parameterCount: number
  }
  compatibility: {
    canRun: boolean
    level: string
    performanceEstimate: string
  }
  isReadyToUse: boolean
}

export default function DownloadedModels() {
  const [models, setModels] = useState<DownloadedModel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadModels()
  }, [])

  const loadModels = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/models/downloaded')
      const data = await response.json()
      setModels(data || [])
    } catch (error) {
      toast.error('Falha ao carregar modelos')
    } finally {
      setLoading(false)
    }
  }

  const getCompatibilityColor = (level: string) => {
    switch (level) {
      case 'Excellent': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'Good': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'Adequate': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'Poor': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      default: return 'bg-muted text-muted-foreground border-border'
    }
  }

  const getCompatibilityIcon = (level: string) => {
    switch (level) {
      case 'Excellent':
      case 'Good': return <CheckCircle className="w-4 h-4" />
      case 'Adequate': return <Info className="w-4 h-4" />
      case 'Poor': return <AlertCircle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutos atrás`
    if (diffHours < 24) return `${diffHours} horas atrás`
    if (diffDays < 7) return `${diffDays} dias atrás`
    
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date)
  }

  const totalSize = models.reduce((acc, m) => acc + m.sizeGb, 0)
  const readyModels = models.filter(m => m.isReadyToUse).length

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Meus Modelos
            </h1>
            <p className="text-sm text-muted-foreground">
              Modelos baixados e prontos para usar
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadModels}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <HardDrive className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{models.length}</div>
                <div className="text-xs text-muted-foreground">Total de Modelos</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{readyModels}</div>
                <div className="text-xs text-muted-foreground">Prontos para Usar</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Download className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalSize.toFixed(1)} GB</div>
                <div className="text-xs text-muted-foreground">Espaço Usado</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Models List */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-32 bg-muted rounded" />
              </Card>
            ))}
          </div>
        ) : models.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhum modelo baixado ainda</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Explore os modelos recomendados e baixe o ideal para você
            </p>
            <Button asChild>
              <a href="/models">
                <Download className="w-4 h-4 mr-2" />
                Explorar Modelos
              </a>
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {models.map((model) => (
              <Card key={model.path} className="p-6 hover:border-primary/50 transition-all group">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {model.filename.replace('.gguf', '').replace(/-/g, ' ')}
                        </h3>
                        {model.isReadyToUse && (
                          <Badge className="bg-green-500/10 text-green-500 border-green-500/20 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Pronto
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Baixado {formatDate(model.downloadedAt)}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50">
                    <div>
                      <div className="text-xs text-muted-foreground">Tamanho</div>
                      <div className="text-sm font-semibold">{model.sizeGb.toFixed(1)} GB</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">RAM</div>
                      <div className="text-sm font-semibold">{model.requirements.recommendedRamGb} GB</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Tipo</div>
                      <Badge variant="outline" className="text-xs">
                        {model.requirements.quantization}
                      </Badge>
                    </div>
                  </div>

                  {/* Compatibility */}
                  <div className={`flex items-center gap-3 p-3 rounded-lg border ${getCompatibilityColor(model.compatibility.level)}`}>
                    {getCompatibilityIcon(model.compatibility.level)}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{model.compatibility.level}</div>
                      <div className="text-xs opacity-80 truncate">{model.compatibility.performanceEstimate}</div>
                    </div>
                  </div>

                  {/* Path */}
                  <div className="pt-3 border-t border-border">
                    <div className="text-xs text-muted-foreground font-mono truncate" title={model.path}>
                      ?? {model.path}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
