import { useState, useEffect } from 'react'
import { Download, FolderOpen, Bell, Loader, CheckCircle, XCircle, Settings } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface DownloadSettings {
  notifyOnComplete: boolean
  notifyOnError: boolean
  maxConcurrentDownloads: number
  autoLoadAfterDownload: boolean
  downloadPath: string
  customPath: boolean
}

export default function DownloadSettings() {
  const [settings, setSettings] = useState<DownloadSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [customFolder, setCustomFolder] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/downloadsettings')
      const data = await response.json()
      setSettings(data)
      setCustomFolder(data.downloadPath)
    } catch (error) {
      toast.error('Falha ao carregar configurações')
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    if (!settings) return

    setSaving(true)
    try {
      await fetch('http://localhost:5000/api/downloadsettings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          downloadPath: customFolder
        })
      })

      toast.success('? Configurações salvas com sucesso!')
      await loadSettings()
    } catch (error) {
      toast.error('? Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handleChooseFolder = async () => {
    // Mostrar instruções ao usuário
    toast.info('?? Cole o caminho da pasta no campo abaixo', {
      description: 'Exemplo: C:\\Users\\SeuNome\\Documents\\Models'
    })
  }

  const applyCustomFolder = async () => {
    if (!customFolder) {
      toast.error('Digite um caminho válido')
      return
    }

    try {
      const response = await fetch('http://localhost:5000/api/downloadsettings/choose-folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: customFolder })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('? Pasta de download atualizada!')
        await loadSettings()
      } else {
        toast.error(data.error || 'Erro ao atualizar pasta')
      }
    } catch (error) {
      toast.error('? Erro ao atualizar pasta')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    )
  }

  if (!settings) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Erro ao carregar configurações</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground flex items-center gap-2">
              <Download className="w-6 h-6" />
              Configurações de Download
            </h1>
            <p className="text-sm text-muted-foreground">
              Personalize como os modelos são baixados e gerenciados
            </p>
          </div>
        </div>

        {/* Download Path */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Pasta de Download
            </CardTitle>
            <CardDescription>
              Local onde os modelos GGUF serão salvos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Input
                value={customFolder}
                onChange={(e) => setCustomFolder(e.target.value)}
                placeholder="C:\Users\SeuNome\Documents\Models"
                className="flex-1 bg-background border-border text-foreground"
              />
              <Button onClick={handleChooseFolder} variant="outline" size="sm">
                <FolderOpen className="w-4 h-4 mr-1" />
                Ajuda
              </Button>
              <Button onClick={applyCustomFolder} size="sm">
                Aplicar
              </Button>
            </div>

            {settings.customPath && (
              <div className="p-3 bg-muted rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">Pasta atual:</p>
                <p className="text-sm font-mono text-foreground">{settings.downloadPath}</p>
              </div>
            )}

            {!settings.customPath && (
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-xs text-blue-400">
                  ?? Usando pasta padrão do sistema
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificações
            </CardTitle>
            <CardDescription>
              Controle quando você quer ser notificado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Download Completo
                </div>
                <div className="text-xs text-muted-foreground">
                  Notificar quando um modelo terminar de baixar
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notifyOnComplete: !settings.notifyOnComplete })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifyOnComplete ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    settings.notifyOnComplete ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Erro no Download
                </div>
                <div className="text-xs text-muted-foreground">
                  Notificar quando houver um erro
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, notifyOnError: !settings.notifyOnError })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.notifyOnError ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    settings.notifyOnError ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Advanced Options */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Opções Avançadas
            </CardTitle>
            <CardDescription>
              Configurações para usuários avançados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Carregar Automaticamente</div>
                <div className="text-xs text-muted-foreground">
                  Tentar carregar o modelo no llama.cpp após o download
                </div>
              </div>
              <button
                onClick={() => setSettings({ ...settings, autoLoadAfterDownload: !settings.autoLoadAfterDownload })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoLoadAfterDownload ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                    settings.autoLoadAfterDownload ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Downloads Simultâneos</div>
                <div className="text-xs text-muted-foreground">
                  Quantidade máxima de downloads paralelos
                </div>
              </div>
              <Badge variant="outline" className="bg-background">
                {settings.maxConcurrentDownloads}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={saving} size="lg">
            {saving ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Salvar Configurações
              </>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  )
}
