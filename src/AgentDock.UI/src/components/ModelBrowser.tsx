import { useState } from 'react'
import { Search, Download, X, ExternalLink, Star, TrendingUp, AlertCircle, CheckCircle, Info, Cpu, HardDrive, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { HFFile } from '@/types'
import ModelSuggestions from '@/components/ModelSuggestions'

interface HFModel {
  id: string
  modelId: string
  downloads: number
  likes: number
  tags: string[]
}

interface Download {
  id: string
  filename: string
  status: string
  percentComplete: number
  speedMBps: number
  totalBytes: number
  downloadedBytes: number
}

export default function ModelBrowser({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'search'>('suggestions')
  const [query, setQuery] = useState('llama')
  const [models, setModels] = useState<HFModel[]>([])
  const [selectedModel, setSelectedModel] = useState<HFModel | null>(null)
  const [files, setFiles] = useState<HFFile[]>([])
  const [loading, setLoading] = useState(false)
  const [downloads, setDownloads] = useState<Download[]>([])

  const searchModels = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/models/search?query=${encodeURIComponent(query)}&limit=10`)
      const data = await response.json()
      setModels(data)
      toast.success(`Found ${data.length} models`)
    } catch (error) {
      toast.error('Failed to search models')
    } finally {
      setLoading(false)
    }
  }

  const loadModelFiles = async (modelId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/models/huggingface-files?modelId=${encodeURIComponent(modelId)}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const data = await response.json()
      // Corrigir campo filename que vem como 'path' da API
      const filesWithFilename = data.map((file: any) => ({
        ...file,
        filename: file.filename || file.path,
        size: file.size || file.lfs?.size || 0
      }))
      setFiles(filesWithFilename)
    } catch (error) {
      console.error('Error loading model files:', error)
      toast.error('Failed to load model files')
    }
  }

  const startDownload = async (filename: string) => {
    if (!selectedModel) return

    try {
      const response = await fetch('http://localhost:5000/api/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelId: selectedModel.modelId,
          filename: filename
        })
      })

      const { downloadId } = await response.json()
      toast.success(`Download started: ${filename}`)

      // Polling de progresso
      const pollInterval = setInterval(async () => {
        const statusResponse = await fetch(`http://localhost:5000/api/models/download/${downloadId}`)
        const status = await statusResponse.json()

        setDownloads(prev => {
          const existing = prev.findIndex(d => d.id === downloadId)
          if (existing >= 0) {
            const updated = [...prev]
            updated[existing] = status
            return updated
          }
          return [...prev, status]
        })

        if (status.status === 'Completed' || status.status === 'Failed' || status.status === 'Cancelled') {
          clearInterval(pollInterval)
          if (status.status === 'Completed') {
            toast.success(`Download completed: ${filename}`)
          }
        }
      }, 1000)
    } catch (error) {
      toast.error('Failed to start download')
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
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

  const getCompatibilityIcon = (level: string) => {
    switch (level) {
      case 'Excellent':
      case 'Good': return <CheckCircle className="w-4 h-4" />
      case 'Adequate': return <Info className="w-4 h-4" />
      case 'Poor':
      case 'Incompatible': return <AlertCircle className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl bg-background border-border max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">HuggingFace Model Browser</h2>
            <p className="text-sm text-muted-foreground">Search and download GGUF models with hardware compatibility check</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'suggestions'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="w-4 h-4 inline-block mr-2" />
            Recomendados
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Search className="w-4 h-4 inline-block mr-2" />
            Buscar
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'suggestions' ? (
            <div className="h-full overflow-y-auto p-6">
              <ModelSuggestions />
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="p-6 border-b border-border">
                <div className="flex gap-2">
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchModels()}
                    placeholder="Search models (e.g., llama, mistral, codellama)"
                    className="flex-1 bg-muted"
                  />
                  <Button onClick={searchModels} disabled={loading}>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-hidden flex">
                {/* Models List */}
                <div className="w-1/3 border-r border-border overflow-y-auto p-4 space-y-2">
                  {loading && (
                    <div className="text-center text-muted-foreground py-8">Searching...</div>
                  )}
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model)
                        loadModelFiles(model.modelId)
                      }}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedModel?.id === model.id
                          ? 'bg-accent border-primary'
                          : 'bg-card border-border hover:border-muted-foreground'
                      }`}
                    >
                      <div className="font-medium text-sm text-foreground mb-1">{model.modelId}</div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {model.downloads.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          {model.likes.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {model.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px]">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Files List with Compatibility */}
                <div className="w-2/3 overflow-y-auto p-4 space-y-4">
                  {selectedModel && (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm font-medium text-foreground">Available Files</div>
                        <a
                          href={`https://huggingface.co/${selectedModel.modelId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View on HF <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      {files.map((file) => (
                        <div key={file.filename} className="p-4 rounded-lg bg-muted border border-border space-y-3">
                          {/* File Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-foreground truncate">{file.filename}</div>
                              <div className="text-xs text-muted-foreground">{formatBytes(file.size)}</div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => startDownload(file.filename)}
                              disabled={!file.compatibility?.canRun}
                              className="ml-2"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </Button>
                          </div>

                          {/* Requirements */}
                          {file.requirements && (
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                              <div className="flex items-center gap-2 text-xs">
                                <HardDrive className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">RAM:</span>
                                <span className="font-mono text-foreground">
                                  {file.requirements.minRamGb}GB - {file.requirements.recommendedRamGb}GB
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <Cpu className="w-3 h-3 text-muted-foreground" />
                                <span className="text-muted-foreground">VRAM:</span>
                                <span className="font-mono text-foreground">
                                  {file.requirements.minVramGb}GB - {file.requirements.recommendedVramGb}GB
                                </span>
                              </div>
                              {file.requirements.quantization !== 'Unknown' && (
                                <div className="flex items-center gap-2 text-xs col-span-2">
                                  <span className="text-muted-foreground">Quantization:</span>
                                  <Badge variant="outline" className="text-[10px]">
                                    {file.requirements.quantization}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Compatibility Status */}
                          {file.compatibility && (
                            <div className="space-y-2 pt-2 border-t border-border">
                              <div className={`flex items-center gap-2 px-3 py-2 rounded-md border ${getCompatibilityColor(file.compatibility.level)}`}>
                                {getCompatibilityIcon(file.compatibility.level)}
                                <div className="flex-1">
                                  <div className="text-xs font-medium">{file.compatibility.level}</div>
                                  <div className="text-[10px] opacity-80">{file.compatibility.performanceEstimate}</div>
                                </div>
                                {file.compatibility.canRun && (
                                  <div className="text-[10px] font-mono">
                                    RAM: {file.compatibility.ramUtilizationPercent.toFixed(0)}%
                                  </div>
                                )}
                              </div>

                              {/* Warnings */}
                              {file.compatibility.warnings.length > 0 && (
                                <div className="space-y-1">
                                  {file.compatibility.warnings.map((warning, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-orange-500">
                                      <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                      <span>{warning}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Recommendations */}
                              {file.compatibility.recommendations.length > 0 && (
                                <div className="space-y-1">
                                  {file.compatibility.recommendations.map((rec, idx) => (
                                    <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                                      <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                      <span>{rec}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}

                  {!selectedModel && (
                    <div className="text-center text-muted-foreground py-8">
                      Select a model to view files and compatibility
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Downloads Footer */}
        {downloads.length > 0 && (
          <div className="border-t border-border p-4 max-h-48 overflow-y-auto">
            <div className="text-sm font-medium text-foreground mb-3">Active Downloads</div>
            <div className="space-y-3">
              {downloads.map((download) => (
                <div key={download.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{download.filename}</span>
                    <span className="text-muted-foreground">
                      {download.percentComplete.toFixed(1)}% • {download.speedMBps.toFixed(1)} MB/s
                    </span>
                  </div>
                  <Progress value={download.percentComplete} className="h-2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
