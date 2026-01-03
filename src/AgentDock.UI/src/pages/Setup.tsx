import { useState, useEffect } from 'react'
import { Download, Check, Zap, Brain, Terminal } from 'lucide-react'
import Layout from '@/components/Layout'
import { api } from '@/api/client'
import { Model } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function Setup() {
  const [models, setModels] = useState<Model[]>([])

  useEffect(() => {
    api.getModels().then(setModels)
  }, [])

  const handleDownload = async (id: string) => {
    await api.pullModel(id)
    setModels(models.map(m => m.id === id ? { ...m, status: 'Downloading' } : m))
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header Section */}
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Overview</h1>
            <p className="text-sm text-[#888]">Manage your local AI infrastructure and models.</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-[#111] text-[#888] border-[#333] font-mono text-[10px]">
              v1.0.0
            </Badge>
            <Badge variant="success" className="bg-green-500/10 text-green-500 border-green-500/20">
              System Online
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Active Engine</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-foreground" />
                <span className="text-2xl font-bold text-foreground">Ollama</span>
              </div>
              <p className="text-xs text-[#666] mt-1">Local inference server running</p>
            </CardContent>
          </Card>
          
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Installed Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-foreground" />
                <span className="text-2xl font-bold text-foreground">
                  {models.filter(m => m.status === 'Installed').length}
                </span>
              </div>
              <p className="text-xs text-[#666] mt-1">Ready for inference</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-foreground" />
                <span className="text-2xl font-bold text-foreground">Optimal</span>
              </div>
              <p className="text-xs text-[#666] mt-1">GPU acceleration enabled</p>
            </CardContent>
          </Card>
        </div>

        {/* Models List - Table Style */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-foreground">Available Models</h2>
          
          <div className="rounded-lg border border-[#333] overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-3 bg-[#111] border-b border-[#333] text-xs font-medium text-[#888] uppercase tracking-wider">
              <div className="col-span-5">Model Name</div>
              <div className="col-span-2">Size</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2 text-right">Action</div>
            </div>
            
            <div className="divide-y divide-[#222]">
              {models.map(model => (
                <div key={model.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#0A0A0A] transition-colors text-sm">
                  <div className="col-span-5 font-medium text-foreground flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#333]" />
                    {model.name}
                  </div>
                  <div className="col-span-2 text-[#888] font-mono text-xs">{model.size}</div>
                  <div className="col-span-3">
                    {model.status === 'Installed' && (
                      <Badge variant="outline" className="bg-[#111] text-foreground border-[#333] text-[10px]">Installed</Badge>
                    )}
                    {model.status === 'Downloading' && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] animate-pulse">Downloading</Badge>
                    )}
                    {model.status === 'Available' && (
                      <span className="text-[#666] text-xs">Not installed</span>
                    )}
                  </div>
                  <div className="col-span-2 text-right">
                    {model.status === 'Available' && (
                      <Button 
                        onClick={() => handleDownload(model.id)}
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs bg-transparent border-[#333] hover:bg-[#222] hover:text-foreground"
                      >
                        <Download className="w-3 h-3 mr-1.5" />
                        Get
                      </Button>
                    )}
                    {model.status === 'Installed' && (
                      <Button variant="ghost" size="sm" disabled className="h-7 text-xs text-[#444]">
                        <Check className="w-3 h-3 mr-1.5" />
                        Ready
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
