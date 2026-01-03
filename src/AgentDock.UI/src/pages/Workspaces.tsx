import { useState, useEffect } from 'react'
import { FolderPlus, RefreshCw, Trash2, Folder, Loader2 } from 'lucide-react'
import Layout from '@/components/Layout'
import { api } from '@/api/client'
import { Workspace } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [showConnect, setShowConnect] = useState(false)
  const [path, setPath] = useState('')

  useEffect(() => {
    api.getWorkspaces().then(setWorkspaces).finally(() => setLoading(false))
  }, [])

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    const workspace = await api.connectWorkspace(path)
    setWorkspaces(prev => [...prev, workspace])
    setPath('')
    setShowConnect(false)
  }

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Workspaces</h1>
            <p className="text-sm text-[#888]">Connect local directories for indexing.</p>
          </div>
          <Button onClick={() => setShowConnect(!showConnect)} size="sm" className="h-8 text-xs">
            <FolderPlus className="w-3 h-3 mr-2" />
            Connect Folder
          </Button>
        </div>

        {showConnect && (
          <div className="rounded-lg border border-[#333] bg-[#0A0A0A] p-6 mb-6">
            <h3 className="text-sm font-medium mb-4">Connect Local Folder</h3>
            <form onSubmit={handleConnect} className="flex gap-2">
              <Input
                value={path}
                onChange={e => setPath(e.target.value)}
                placeholder="C:\Projects\MyProject"
                className="bg-[#111] border-[#333] h-9 text-sm font-mono flex-1"
              />
              <Button type="submit" size="sm" className="h-9 text-xs">Connect</Button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-[#444]" />
            </div>
          ) : workspaces.length === 0 ? (
            <div className="col-span-full p-12 text-center border border-dashed border-[#333] rounded-lg">
              <Folder className="w-8 h-8 text-[#333] mx-auto mb-3" />
              <p className="text-sm text-[#666]">No workspaces connected</p>
            </div>
          ) : (
            workspaces.map(ws => (
              <div key={ws.id} className="group rounded-lg border border-[#333] bg-[#0A0A0A] p-4 hover:border-[#666] transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded bg-[#111] border border-[#333] flex items-center justify-center">
                    <Folder className="w-5 h-5 text-[#666] group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#222]">
                      <RefreshCw size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-[#222] hover:text-red-500">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-medium text-sm text-foreground truncate">{ws.name}</h3>
                <p className="text-xs text-[#666] font-mono truncate mt-1 mb-4">{ws.path}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-[#222]">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${ws.status === 'Indexed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                    <span className="text-xs text-[#888]">{ws.status}</span>
                  </div>
                  <span className="text-xs text-[#666]">{ws.fileCount || 0} files</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  )
}
