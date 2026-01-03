import { useState, useEffect } from 'react'
import { Play, Terminal, Loader2 } from 'lucide-react'
import Layout from '@/components/Layout'
import { api } from '@/api/client'
import { Task } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showWizard, setShowWizard] = useState(false)
  const [formData, setFormData] = useState({ name: '', type: 'analysis', instruction: '' })

  useEffect(() => {
    api.getTasks().then(setTasks).finally(() => setLoading(false))
  }, [])

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault()
    const task = await api.createTask(formData.name, formData.type, formData.instruction)
    setTasks(prev => [...prev, task])
    setFormData({ name: '', type: 'analysis', instruction: '' })
    setShowWizard(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[10px] font-normal">Completed</Badge>
      case 'Running': return <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[10px] font-normal animate-pulse">Running</Badge>
      case 'Failed': return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[10px] font-normal">Failed</Badge>
      default: return <Badge variant="outline" className="bg-[#111] text-[#666] border-[#333] text-[10px] font-normal">Queued</Badge>
    }
  }

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Tasks</h1>
            <p className="text-sm text-[#888]">Monitor background processes and jobs.</p>
          </div>
          <Button onClick={() => setShowWizard(!showWizard)} size="sm" className="h-8 text-xs">
            <Play className="w-3 h-3 mr-2" />
            New Task
          </Button>
        </div>

        {showWizard && (
          <div className="rounded-lg border border-[#333] bg-[#0A0A0A] p-6 mb-6">
            <h3 className="text-sm font-medium mb-4">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#888]">Name</label>
                <Input
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Index Documentation"
                  className="bg-[#111] border-[#333] h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#888]">Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-[#111] border border-[#333] rounded-md h-9 px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#666]"
                >
                  <option value="analysis">Analysis</option>
                  <option value="indexing">Indexing</option>
                  <option value="extraction">Extraction</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <Button type="submit" size="sm" className="h-8 text-xs">Create Task</Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowWizard(false)} className="h-8 text-xs">Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-lg border border-[#333] overflow-hidden bg-[#0A0A0A]">
          <div className="grid grid-cols-12 gap-4 p-3 bg-[#111] border-b border-[#333] text-xs font-medium text-[#666] uppercase tracking-wider">
            <div className="col-span-4">Task</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3 text-right">Created</div>
          </div>
          
          <div className="divide-y divide-[#222]">
            {loading ? (
              <div className="p-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-[#444]" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="p-12 text-center">
                <Terminal className="w-8 h-8 text-[#333] mx-auto mb-3" />
                <p className="text-sm text-[#666]">No tasks running</p>
              </div>
            ) : (
              tasks.map(task => (
                <div key={task.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-[#111] transition-colors text-sm group">
                  <div className="col-span-4 font-medium text-foreground flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-[#222] flex items-center justify-center border border-[#333]">
                      <Terminal className="w-4 h-4 text-[#666]" />
                    </div>
                    <span className="truncate">{task.name}</span>
                  </div>
                  <div className="col-span-2 text-[#888] text-xs capitalize">{task.type}</div>
                  <div className="col-span-3">
                    {getStatusBadge(task.status)}
                  </div>
                  <div className="col-span-3 text-right text-xs text-[#666] font-mono">
                    {task.createdAt ? new Date(task.createdAt).toLocaleTimeString() : '-'}
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
