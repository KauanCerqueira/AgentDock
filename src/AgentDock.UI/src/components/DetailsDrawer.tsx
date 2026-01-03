import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { api } from '@/api/client'
import { Model, Workspace } from '@/types'

interface DetailsDrawerProps {
  onClose: () => void
}

export default function DetailsDrawer({ onClose }: DetailsDrawerProps) {
  const [activeModel, setActiveModel] = useState<Model | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getModels().then(models => {
        const active = models.find(m => m.isActive)
        setActiveModel(active || null)
      }),
      api.getWorkspaces().then(setWorkspaces),
    ]).finally(() => setLoading(false))
  }, [])

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col">
      <div className="h-16 border-b border-border flex items-center justify-between px-6">
        <h3 className="font-semibold text-foreground">Details</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {loading ? (
          <div className="space-y-4">
            <div className="h-20 bg-muted/30 rounded-lg animate-pulse" />
          </div>
        ) : (
          <>
            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Active Model</h4>
              {activeModel ? (
                <div className="card-base p-4">
                  <p className="font-medium text-foreground">{activeModel.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activeModel.size}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No active model</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3">Workspaces</h4>
              <div className="space-y-2">
                {workspaces.length > 0 ? (
                  workspaces.map(ws => (
                    <div key={ws.id} className="card-base p-3 text-sm">
                      <p className="font-medium text-foreground">{ws.name}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">{ws.path}</p>
                      <p className="text-xs text-accent mt-2">{ws.status}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No workspaces</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
