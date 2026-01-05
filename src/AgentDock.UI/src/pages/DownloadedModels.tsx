import { useState, useEffect } from 'react'
import { HardDrive, Trash2, CheckCircle, RefreshCw, Download, Sparkles, Play, MessageSquare } from 'lucide-react'
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
  }
  compatibility: {
    canRun: boolean
    level: string | number
    performanceEstimate: string
  }
  isReadyToUse: boolean
}

export default function DownloadedModels() {
  const [models, setModels] = useState<DownloadedModel[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { loadModels() }, [])

  const loadModels = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:5000/api/models/downloaded')
      setModels(await res.json() || [])
    } catch { toast.error('Falha ao carregar modelos') }
    finally { setLoading(false) }
  }

  const deleteModel = async (filename: string) => {
    if (!confirm(`Excluir "${filename}"?\n\nEssa ação não pode ser desfeita.`)) return
    setDeleting(filename)
    try {
      const res = await fetch(`http://localhost:5000/api/models/delete/${encodeURIComponent(filename)}`, { method: 'DELETE' })
      if (res.ok) { toast.success('Modelo excluído'); loadModels() }
      else { const e = await res.json(); toast.error('Erro', { description: e.details }) }
    } catch { toast.error('Erro ao conectar') }
    finally { setDeleting(null) }
  }

  const getColor = (level: string | number) => {
    const l = String(level)
    if (l === '0' || l === 'Excellent') return 'bg-green-500/10 text-green-500 border-green-500/20'
    if (l === '1' || l === 'Good') return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    if (l === '2' || l === 'Adequate') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
  }

  const getLabel = (level: string | number) => {
    const l = String(level)
    if (l === '0' || l === 'Excellent') return 'Excelente'
    if (l === '1' || l === 'Good') return 'Bom'
    if (l === '2' || l === 'Adequate') return 'Adequado'
    return 'Limitado'
  }

  const totalSize = models.reduce((a, m) => a + m.sizeGb, 0)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div><h1 className="text-2xl font-semibold">Meus Modelos</h1><p className="text-sm text-muted-foreground">Modelos baixados e prontos</p></div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadModels}><RefreshCw className="w-4 h-4 mr-2" />Atualizar</Button>
            <Button size="sm" onClick={() => window.location.hash = '/chat'}><MessageSquare className="w-4 h-4 mr-2" />Chat</Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><HardDrive className="w-6 h-6 text-primary" /></div><div><div className="text-2xl font-bold">{models.length}</div><div className="text-xs text-muted-foreground">Modelos</div></div></div></Card>
          <Card className="p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-500" /></div><div><div className="text-2xl font-bold text-green-500">{models.filter(m => m.isReadyToUse).length}</div><div className="text-xs text-muted-foreground">Prontos</div></div></div></Card>
          <Card className="p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center"><Download className="w-6 h-6 text-blue-500" /></div><div><div className="text-2xl font-bold">{totalSize.toFixed(1)} GB</div><div className="text-xs text-muted-foreground">Usado</div></div></div></Card>
        </div>

        {loading ? <div className="text-center py-12">Carregando...</div> : models.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhum modelo baixado</h3>
            <Button onClick={() => window.location.hash = '/models'}><Download className="w-4 h-4 mr-2" />Explorar</Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {models.map(m => (
              <Card key={m.path} className="p-6 hover:border-primary/50 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{m.filename.replace('.gguf', '')}</h3>
                    <Badge className="bg-green-500/10 text-green-500 text-xs mt-1"><CheckCircle className="w-3 h-3 mr-1" />Pronto</Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteModel(m.filename)} disabled={deleting === m.filename}>
                    {deleting === m.filename ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-muted/50 mb-4">
                  <div><div className="text-xs text-muted-foreground">Tamanho</div><div className="text-sm font-semibold">{m.sizeGb.toFixed(2)} GB</div></div>
                  <div><div className="text-xs text-muted-foreground">RAM</div><div className="text-sm font-semibold">{m.requirements.recommendedRamGb} GB</div></div>
                </div>
                <div className={`flex items-center gap-3 p-3 rounded-lg border mb-4 ${getColor(m.compatibility.level)}`}>
                  <CheckCircle className="w-4 h-4" />
                  <div><div className="text-sm font-medium">{getLabel(m.compatibility.level)}</div><div className="text-xs opacity-80">{m.compatibility.performanceEstimate}</div></div>
                </div>
                <Button className="w-full" onClick={() => window.location.hash = '/chat'}><Play className="w-4 h-4 mr-2" />Usar no Chat</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
