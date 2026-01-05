import { useState, useEffect } from 'react'
import { Download, Pause, X, CheckCircle, AlertCircle, Clock, HardDrive, Trash2, RefreshCw } from 'lucide-react'
import Layout from '@/components/Layout'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface DownloadItem {
  id: string
  filename: string
  modelId: string
  status: 'Queued' | 'Downloading' | 'Completed' | 'Failed' | 'Cancelled' | 'Paused'
  percentComplete: number
  downloadedBytes: number
  totalBytes: number
  speedMBps: number
  errorMessage?: string
  isReadyToUse: boolean
  modelPath?: string
}

export default function DownloadManager() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [diskSpace, setDiskSpace] = useState<{ available: number; total: number } | null>(null)

  useEffect(() => {
    loadDownloads()
    loadDiskSpace()
    const interval = setInterval(loadDownloads, 2000)
    return () => clearInterval(interval)
  }, [])

  const loadDownloads = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/models/downloads/all')
      if (response.ok) {
        const data = await response.json()
        setDownloads(data)
      }
    } catch (error) {
      console.error('Failed to load downloads:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDiskSpace = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/models/disk-space')
      if (response.ok) {
        const data = await response.json()
        setDiskSpace(data)
      }
    } catch (error) {
      console.error('Failed to load disk space:', error)
    }
  }

  const cancelDownload = async (downloadId: string) => {
    try {
      await fetch(`http://localhost:5000/api/models/download/${downloadId}/cancel`, { method: 'POST' })
      toast.success('Download cancelado')
      loadDownloads()
    } catch (error) {
      toast.error('Erro ao cancelar download')
    }
  }

  const removeDownload = async (downloadId: string) => {
    try {
      await fetch(`http://localhost:5000/api/models/download/${downloadId}`, { method: 'DELETE' })
      toast.success('Download removido')
      loadDownloads()
    } catch (error) {
      toast.error('Erro ao remover download')
    }
  }

  const retryDownload = async (download: DownloadItem) => {
    try {
      await fetch('http://localhost:5000/api/models/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelId: download.modelId, filename: download.filename })
      })
      toast.success('Download reiniciado')
      loadDownloads()
    } catch (error) {
      toast.error('Erro ao reiniciar download')
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const formatSpeed = (mbps: number) => {
    if (mbps < 1) return `${(mbps * 1024).toFixed(0)} KB/s`
    return `${mbps.toFixed(1)} MB/s`
  }

  const formatETA = (download: DownloadItem) => {
    if (download.speedMBps <= 0 || download.status !== 'Downloading') return '--'
    const remainingBytes = download.totalBytes - download.downloadedBytes
    const remainingSeconds = remainingBytes / (download.speedMBps * 1024 * 1024)
    if (remainingSeconds < 60) return `${Math.ceil(remainingSeconds)}s`
    if (remainingSeconds < 3600) return `${Math.ceil(remainingSeconds / 60)}min`
    return `${(remainingSeconds / 3600).toFixed(1)}h`
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Downloading': return <Download className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'Completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'Failed': return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'Queued': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'Paused': return <Pause className="w-4 h-4 text-orange-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      'Downloading': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      'Completed': 'bg-green-500/10 text-green-500 border-green-500/20',
      'Failed': 'bg-red-500/10 text-red-500 border-red-500/20',
      'Queued': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    }
    return variants[status] || variants['Queued']
  }

  const activeDownloads = downloads.filter(d => d.status === 'Downloading' || d.status === 'Queued')
  const completedDownloads = downloads.filter(d => d.status === 'Completed')
  const failedDownloads = downloads.filter(d => d.status === 'Failed' || d.status === 'Cancelled')
  const totalSpeed = activeDownloads.reduce((acc, d) => acc + d.speedMBps, 0)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Downloads</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus downloads de modelos</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadDownloads}>
            <RefreshCw className="w-4 h-4 mr-2" />Atualizar
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Ativos</p>
                <p className="text-xl font-bold text-foreground">{activeDownloads.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Concluídos</p>
                <p className="text-xl font-bold text-foreground">{completedDownloads.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Espaço Livre</p>
                <p className="text-xl font-bold text-foreground">{diskSpace ? `${diskSpace.available.toFixed(1)} GB` : '--'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border-cyan-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                <Download className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Velocidade</p>
                <p className="text-xl font-bold text-foreground">{formatSpeed(totalSpeed)}</p>
              </div>
            </div>
          </Card>
        </div>

        {activeDownloads.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-500" />Downloads em Andamento
            </h2>
            <div className="space-y-2">
              {activeDownloads.map((d) => (
                <Card key={d.id} className="p-4 border-blue-500/20 bg-blue-500/5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(d.status)}
                      <div>
                        <h3 className="font-medium text-foreground">{d.filename}</h3>
                        <p className="text-xs text-muted-foreground">{d.modelId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusBadge(d.status)}>
                        {d.status === 'Downloading' ? 'Baixando' : 'Na Fila'}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => cancelDownload(d.id)}>
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <Progress value={d.percentComplete} className="h-2 mb-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatBytes(d.downloadedBytes)} / {formatBytes(d.totalBytes)}</span>
                    <span>{d.percentComplete.toFixed(1)}%</span>
                    <span>{formatSpeed(d.speedMBps)}</span>
                    <span>ETA: {formatETA(d)}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {completedDownloads.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />Concluídos
            </h2>
            <div className="space-y-2">
              {completedDownloads.map((d) => (
                <Card key={d.id} className="p-4 border-green-500/20 bg-green-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(d.status)}
                      <div>
                        <h3 className="font-medium text-foreground">{d.filename}</h3>
                        <p className="text-xs text-muted-foreground">{formatBytes(d.totalBytes)} • Pronto para usar</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeDownload(d.id)}>
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {failedDownloads.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />Falhas
            </h2>
            <div className="space-y-2">
              {failedDownloads.map((d) => (
                <Card key={d.id} className="p-4 border-red-500/20 bg-red-500/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(d.status)}
                      <div>
                        <h3 className="font-medium text-foreground">{d.filename}</h3>
                        <p className="text-xs text-red-500">{d.errorMessage || 'Download cancelado'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => retryDownload(d)}>
                        <RefreshCw className="w-4 h-4 mr-1" />Tentar Novamente
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => removeDownload(d.id)}>
                        <Trash2 className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {downloads.length === 0 && !loading && (
          <Card className="p-12 text-center">
            <Download className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Nenhum download</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Vá para Models para baixar um modelo</p>
            <Button onClick={() => window.location.href = '#/models'}>Explorar Modelos</Button>
          </Card>
        )}
      </div>
    </Layout>
  )
}
