import { X, Download, Info, Calendar, Heart, HardDrive, Cpu, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ModelFile {
  filename: string
  sizeFormatted: string
  sizeBytes: number
  requirements?: {
    recommendedRamGb: number
    minRamGb: number
    modelSize: string
    quantization: string
  }
  compatibility?: {
    level: string
    canRun: boolean
    performanceEstimate: string
  }
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

interface ModelDetailsDrawerProps {
  modelId: string
  modelDetails: ModelDetails | null
  files: ModelFile[]
  downloading: Record<string, number>
  onClose: () => void
  onDownload: (filename: string) => void
}

export default function ModelDetailsDrawer({
  modelId,
  modelDetails,
  files,
  downloading,
  onClose,
  onDownload
}: ModelDetailsDrawerProps) {
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

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  return (
    <div className="fixed inset-y-0 right-0 w-[600px] bg-background border-l border-border shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-foreground mb-1">
              {modelDetails?.modelName || modelId.split('/').pop()}
            </h2>
            <p className="text-sm text-muted-foreground">
              por <span className="text-primary">{modelDetails?.author || modelId.split('/')[0]}</span>
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Download className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{formatNumber(modelDetails?.downloads || 0)}</span>
            <span className="text-muted-foreground">downloads</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Heart className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{modelDetails?.likes || 0}</span>
            <span className="text-muted-foreground">likes</span>
          </div>
          {modelDetails?.lastModified && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">
                {new Date(modelDetails.lastModified).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-6">
        {/* Description */}
        {modelDetails?.description && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Descrição
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {modelDetails.description}
            </p>
          </div>
        )}

        {/* Tags */}
        {modelDetails?.tags && modelDetails.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {modelDetails.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Technical Info */}
        {(modelDetails?.pipeline_tag || modelDetails?.library_name || modelDetails?.license) && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-semibold mb-3">Informações Técnicas</h3>
            <div className="space-y-2 text-sm">
              {modelDetails.pipeline_tag && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">{modelDetails.pipeline_tag}</span>
                </div>
              )}
              {modelDetails.library_name && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Framework:</span>
                  <span className="font-medium">{modelDetails.library_name}</span>
                </div>
              )}
              {modelDetails.license && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Licença:</span>
                  <span className="font-medium">{modelDetails.license}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* GGUF Files */}
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            Arquivos GGUF Disponíveis ({files.length})
          </h3>
          
          {files.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <HardDrive className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum arquivo GGUF encontrado</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div 
                  key={file.filename}
                  className="p-4 bg-background border border-border rounded-lg hover:border-primary/50 transition-all"
                >
                  {/* File Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-sm mb-1 truncate" title={file.filename}>
                        {file.filename}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{file.sizeFormatted}</span>
                        {file.requirements && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Cpu className="w-3 h-3" />
                              {file.requirements.recommendedRamGb}GB RAM
                            </span>
                            <span>•</span>
                            <span className="font-mono">{file.requirements.quantization}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Badge */}
                  {file.compatibility && (
                    <div className="mb-3">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getCompatibilityColor(file.compatibility.level)}`}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {file.compatibility.level} - {file.compatibility.performanceEstimate}
                      </Badge>
                    </div>
                  )}

                  {/* Download Button/Progress */}
                  {downloading[file.filename] !== undefined ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Baixando...</span>
                        <span className="font-mono">{downloading[file.filename].toFixed(0)}%</span>
                      </div>
                      <Progress value={downloading[file.filename]} className="h-2" />
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => onDownload(file.filename)}
                      disabled={!file.compatibility?.canRun}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {file.compatibility?.canRun ? 'Baixar Modelo' : 'Hardware Incompatível'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
