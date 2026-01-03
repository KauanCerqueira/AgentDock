import { useState, useEffect } from 'react'
import { Download, Sparkles, Award, Cpu, HardDrive, Search, Zap, Heart, Calendar, ArrowRight } from 'lucide-react'
import Layout from '@/components/Layout'
import ModelDetailsDrawer from '@/components/ModelDetailsDrawer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
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

interface SearchResult {
  id: string
  author: string
  modelId: string
  downloads?: number
  likes?: number
  tags?: string[]
  lastModified?: string
  pipeline_tag?: string
  library_name?: string
  estimatedSize?: string
  canRunOnHardware?: boolean
}

interface ModelDetails {
  id: string
  author: string
  modelName: string
  description?: string
  downloads: number
  likes: number
  tags: string[]
  license?: string
  lastModified: string
  pipeline_tag?: string
  library_name?: string
}

export default function Models() {
  const [view, setView] = useState<'recommended' | 'browse'>('recommended')
  const [suggestions, setSuggestions] = useState<ModelSuggestion[]>([])
  const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState<Record<string, number>>({})
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [modelFiles, setModelFiles] = useState<any[]>([])
  const [showDetailsDrawer, setShowDetailsDrawer] = useState(false)
  const [selectedModelDetails, setSelectedModelDetails] = useState<ModelDetails | null>(null)

  useEffect(() => {
    loadSuggestions()
  }, [])

  const loadSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/models/suggestions?limit=6')
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setSuggestions(data.suggestions || [])
      setHardwareInfo(data.hardwareInfo || null)
    } catch (error) {
      console.error('Failed to load suggestions:', error)
      toast.error('Não foi possível carregar recomendações')
    } finally {
      setLoading(false)
    }
  }

  const searchHuggingFace = async (query: string) => {
    setLoading(true)
    setSearchResults([])
    setSelectedModel(null)
    setModelFiles([])
    
    try {
      const response = await fetch(`http://localhost:5000/api/models/search?query=${encodeURIComponent(query)}&limit=20`)
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setSearchResults(data)
      
      if (data.length === 0) {
        toast.info('Nenhum modelo encontrado', {
          description: `Tente buscar por: llama, mistral, phi, qwen`
        })
      } else {
        toast.success(`${data.length} modelos encontrados`)
      }
    } catch (error) {
      console.error('Search failed:', error)
      toast.error('Erro ao buscar modelos')
    } finally {
      setLoading(false)
    }
  }

  const viewModelDetails = async (modelId: string) => {
    setSelectedModel(modelId)
    setLoading(true)
    
    try {
      // Fetch model details and files in parallel
      const [detailsResponse, filesResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/models/huggingface-details?modelId=${encodeURIComponent(modelId)}`),
        fetch(`http://localhost:5000/api/models/huggingface-files?modelId=${encodeURIComponent(modelId)}`)
      ])
      
      if (!detailsResponse.ok || !filesResponse.ok) {
        throw new Error('Failed to fetch model data')
      }
      
      const details = await detailsResponse.json()
      const files = await filesResponse.json()
      
      setSelectedModelDetails(details)
      setModelFiles(files)
      setShowDetailsDrawer(true)
      
      if (files.length === 0) {
        toast.warning('Nenhum arquivo GGUF encontrado neste modelo')
      }
    } catch (error) {
      console.error('Failed to fetch model details:', error)
      toast.error('Erro ao carregar detalhes do modelo')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (filename: string) => {
    if (!selectedModel) {
      toast.error('Modelo não selecionado')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId: selectedModel, filename })
      })

      if (!response.ok) throw new Error('Download failed')
      
      const { downloadId } = await response.json()
      toast.success('Download iniciado!', {
        description: filename
      })

      // Poll for progress
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`http://localhost:5000/api/models/download/${downloadId}`)
          if (!statusResponse.ok) {
            clearInterval(pollInterval)
            return
          }
          
          const status = await statusResponse.json()

          setDownloading(prev => ({
            ...prev,
            [filename]: status.percentComplete
          }))

          if (status.status === 'Completed') {
            clearInterval(pollInterval)
            setDownloading(prev => {
              const updated = { ...prev }
              delete updated[filename]
              return updated
            })
            toast.success('Modelo pronto para usar!', {
              description: `${filename} foi baixado e está disponível`
            })
          } else if (status.status === 'Failed' || status.status === 'Cancelled') {
            clearInterval(pollInterval)
            setDownloading(prev => {
              const updated = { ...prev }
              delete updated[filename]
              return updated
            })
            if (status.status === 'Failed') {
              toast.error('Download falhou', {
                description: status.errorMessage
              })
            }
          }
        } catch (err) {
          clearInterval(pollInterval)
        }
      }, 1000)
    } catch (error) {
      toast.error('Erro ao iniciar download')
    }
  }

  const estimateModelSize = (modelId: string): string => {
    const lower = modelId.toLowerCase()
    if (lower.includes('70b') || lower.includes('65b')) return '~40GB+'
    if (lower.includes('30b') || lower.includes('34b')) return '~20GB'
    if (lower.includes('13b') || lower.includes('14b')) return '~8GB'
    if (lower.includes('7b') || lower.includes('8b')) return '~4GB'
    if (lower.includes('3b') || lower.includes('2b')) return '~2GB'
    if (lower.includes('1b')) return '~1GB'
    return '~?GB'
  }

  const canRunModel = (sizeEstimate: string): boolean => {
    if (!hardwareInfo) return false
    const sizeGb = parseFloat(sizeEstimate.replace(/[^0-9.]/g, ''))
    if (isNaN(sizeGb)) return false
    return hardwareInfo.availableRamGb >= sizeGb * 1.5 // Modelo + overhead
  }

  const formatNumber = (num?: number) => {
    if (!num) return '0'
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500 bg-green-500/10 border-green-500/20'
    if (score >= 75) return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
    if (score >= 60) return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
    return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
  }

  const getCompatibilityColor = (level: string) => {
    switch (level) {
      case 'Excellent': return 'text-green-500 bg-green-500/10 border-green-500/20'
      case 'Good': return 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      case 'Adequate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
      case 'Poor': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
      case 'Incompatible': return 'text-red-500 bg-red-500/10 border-red-500/20'
      default: return 'text-muted-foreground bg-muted border-border'
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">AI Models</h1>
            <p className="text-sm text-muted-foreground">
              Modelos de IA otimizados para seu hardware
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === 'recommended' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('recommended')}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Recomendados
            </Button>
            <Button
              variant={view === 'browse' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setView('browse')}
            >
              <Search className="w-4 h-4 mr-2" />
              Explorar
            </Button>
          </div>
        </div>

        {/* Hardware Info Banner */}
        {hardwareInfo && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">Seu Hardware</h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3" />
                      {hardwareInfo.availableRamGb.toFixed(1)}GB RAM
                    </span>
                    {hardwareInfo.gpuName && (
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {hardwareInfo.gpuName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="bg-background/50">
                {hardwareInfo.category}
              </Badge>
            </div>
          </Card>
        )}

        {/* Recommended View */}
        {view === 'recommended' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Modelos Recomendados para Você
              </h2>
              <Button variant="ghost" size="sm" onClick={loadSuggestions}>
                Atualizar
              </Button>
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map(i => (
                  <Card key={i} className="p-6 animate-pulse">
                    <div className="h-24 bg-muted rounded" />
                  </Card>
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              <Card className="p-12 text-center border-yellow-500/20 bg-yellow-500/5">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Cpu className="w-8 h-8 text-yellow-500" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Nenhum modelo recomendado para seu hardware
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground max-w-md mx-auto mb-6">
                  <p>
                    Seu hardware: <strong className="text-foreground">{hardwareInfo?.availableRamGb.toFixed(1)}GB RAM disponível</strong>
                  </p>
                  <p className="text-yellow-500">
                    ?? Modelos de IA geralmente precisam de pelo menos 8GB de RAM livre
                  </p>
                  <div className="mt-4 p-4 bg-background/50 rounded-lg text-left">
                    <div className="font-medium text-foreground mb-2">Sugestões:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Feche outros programas para liberar RAM</li>
                      <li>• Considere modelos menores (Q4 ou Q5)</li>
                      <li>• Verifique se tem GPU com VRAM disponível</li>
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={loadSuggestions} variant="outline">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Atualizar
                  </Button>
                  <Button onClick={() => setView('browse')}>
                    <Search className="w-4 h-4 mr-2" />
                    Explorar Todos os Modelos
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {suggestions.map((suggestion, index) => (
                  <Card key={`${suggestion.modelId}-${suggestion.filename}`} className="p-6 hover:border-primary/50 transition-all relative group">
                    {index === 0 && (
                      <Badge className="absolute top-4 right-4 bg-primary">
                        <Award className="w-3 h-3 mr-1" />
                        Top Pick
                      </Badge>
                    )}

                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">
                            {suggestion.modelId.split('/').pop()?.replace(/-/g, ' ')}
                          </h3>
                          <Badge variant="outline" className={`text-xs ${getScoreColor(suggestion.score)}`}>
                            {suggestion.score}/100
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
                        {suggestion.useCase && (
                          <p className="text-xs text-primary mt-1">?? {suggestion.useCase}</p>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 p-3 rounded-lg bg-muted/50">
                        <div>
                          <div className="text-xs text-muted-foreground">Tamanho</div>
                          <div className="text-sm font-semibold">{suggestion.requirements.modelSize}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">RAM</div>
                          <div className="text-sm font-semibold">{suggestion.requirements.recommendedRamGb}GB</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Tipo</div>
                          <div className="text-xs font-mono">{suggestion.requirements.quantization}</div>
                        </div>
                      </div>

                      {/* Performance */}
                      <div className={`p-3 rounded-lg border ${getCompatibilityColor(suggestion.compatibility.level)}`}>
                        <div className="text-sm font-medium mb-1">{suggestion.compatibility.level}</div>
                        <div className="text-xs opacity-80">{suggestion.compatibility.performanceEstimate}</div>
                      </div>

                      {/* Action */}
                      {downloading[suggestion.filename] !== undefined ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Baixando...</span>
                            <span>{downloading[suggestion.filename].toFixed(0)}%</span>
                          </div>
                          <Progress value={downloading[suggestion.filename]} className="h-2" />
                        </div>
                      ) : (
                        <Button 
                          className="w-full" 
                          onClick={() => {
                            setSelectedModel(suggestion.modelId)
                            handleDownload(suggestion.filename)
                          }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Modelo
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Browse View */}
        {view === 'browse' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Buscar Modelos no HuggingFace</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Digite o nome do modelo (ex: llama, mistral, phi)..."
                  className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const query = (e.target as HTMLInputElement).value
                      if (query.trim()) {
                        searchHuggingFace(query.trim())
                      }
                    }
                  }}
                />
                <Button onClick={() => {
                  const input = document.querySelector('input[type="text"]') as HTMLInputElement
                  if (input?.value.trim()) {
                    searchHuggingFace(input.value.trim())
                  }
                }}>
                  <Search className="w-4 h-4 mr-2" />
                  Buscar
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Procure por modelos GGUF compatíveis com seu hardware
              </p>
            </Card>

            {searchResults.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Resultados da Busca</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((result) => {
                    const sizeEstimate = estimateModelSize(result.id)
                    const canRun = canRunModel(sizeEstimate)
                    
                    return (
                      <Card 
                        key={result.id} 
                        className="p-6 hover:border-primary/50 transition-all cursor-pointer group"
                        onClick={() => viewModelDetails(result.id)}
                      >
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {result.id.split('/').pop()?.replace(/-/g, ' ')}
                              </h4>
                              <Badge 
                                variant="outline" 
                                className={`text-[10px] ${canRun ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'}`}
                              >
                                {canRun ? '? Compatível' : '? Verificar'}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              por {result.id.split('/')[0]}
                            </p>
                          </div>
                          
                          {/* Hardware Info */}
                          {hardwareInfo && (
                            <div className="p-2 bg-muted/50 rounded-lg">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-muted-foreground">Tamanho estimado:</span>
                                <span className="font-mono font-semibold">{sizeEstimate}</span>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-1">
                                <span className="text-muted-foreground">RAM necessária:</span>
                                <span className="font-mono font-semibold">~{(parseFloat(sizeEstimate.replace(/[^0-9.]/g, '')) * 1.5).toFixed(1)}GB</span>
                              </div>
                              <div className="flex items-center justify-between text-xs mt-1">
                                <span className="text-muted-foreground">Sua RAM livre:</span>
                                <span className={`font-mono font-semibold ${canRun ? 'text-green-500' : 'text-yellow-500'}`}>
                                  {hardwareInfo.availableRamGb.toFixed(1)}GB
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              <span>{formatNumber(result.downloads)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              <span>{result.likes || 0}</span>
                            </div>
                            {result.lastModified && (
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(result.lastModified).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}</span>
                              </div>
                            )}
                          </div>

                          {result.tags && result.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {result.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                                  {tag}
                                </Badge>
                              ))}
                              {result.tags.length > 3 && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                                  +{result.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-primary group-hover:translate-x-1 transition-transform">
                            <span>Ver detalhes e arquivos</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Model Details Drawer */}
      {showDetailsDrawer && selectedModel && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
            onClick={() => setShowDetailsDrawer(false)}
          />
          <ModelDetailsDrawer
            modelId={selectedModel}
            modelDetails={selectedModelDetails}
            files={modelFiles}
            downloading={downloading}
            onClose={() => setShowDetailsDrawer(false)}
            onDownload={handleDownload}
          />
        </>
      )}
    </Layout>
  )
}
