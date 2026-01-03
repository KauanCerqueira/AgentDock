import { useState, useEffect } from 'react'
import { Download, Check, Loader2, Box, Filter } from 'lucide-react'
import Layout from '@/components/Layout'
import { api } from '@/api/client'
import { Model } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function Models() {
  const [models, setModels] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.getModels().then(setModels).finally(() => setLoading(false))
  }, [])

  const handleDownload = async (id: string) => {
    await api.pullModel(id)
    setModels(models.map(m => m.id === id ? { ...m, status: 'Downloading' } : m))
  }

  const filteredModels = models.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Models</h1>
            <p className="text-sm text-[#888]">Manage and deploy your local AI models.</p>
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Search models..." 
              className="h-8 w-[200px] bg-[#0A0A0A] border-[#333] text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="outline" size="sm" className="h-8 bg-[#0A0A0A] border-[#333] text-[#888]">
              <Filter className="w-3 h-3 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-[#333] overflow-hidden bg-[#0A0A0A]">
          <div className="grid grid-cols-12 gap-4 p-3 bg-[#111] border-b border-[#333] text-xs font-medium text-[#666] uppercase tracking-wider">
            <div className="col-span-5">Model Name</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-2 text-right">Action</div>
          </div>
          
          <div className="divide-y divide-[#222]">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#444]" />
              </div>
            ) : filteredModels.length === 0 ? (
              <div className="p-8 text-center text-[#666] text-sm">
                No models found matching "{search}"
              </div>
            ) : (
              filteredModels.map(model => (
                <div key={model.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#111] transition-colors text-sm group">
                  <div className="col-span-5 font-medium text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#222] flex items-center justify-center border border-[#333]">
                      <Box className="w-4 h-4 text-[#666]" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{model.name}</div>
                      <div className="text-[10px] text-[#666] font-mono">{model.id}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-[#888] font-mono text-xs">{model.size}</div>
                  <div className="col-span-3">
                    {model.status === 'Installed' && (
                      <Badge variant="outline" className="bg-[#111] text-foreground border-[#333] text-[10px] font-normal">Installed</Badge>
                    )}
                    {model.status === 'Downloading' && (
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-normal animate-pulse">Downloading</Badge>
                    )}
                    {model.status === 'Available' && (
                      <span className="text-[#666] text-xs">Not installed</span>
                    )}
                  </div>
                  <div className="col-span-2 text-right opacity-0 group-hover:opacity-100 transition-opacity">
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
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
