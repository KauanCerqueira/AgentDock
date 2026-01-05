import { useState, useEffect, useMemo } from 'react'
import { 
  Zap, Plus, Folder, FileText, Play, Pause, Trash2, 
  Activity, Clock, CheckCircle2, XCircle, 
  ArrowRight, Search
} from 'lucide-react'
import Layout from '@/components/Layout'
import { api } from '@/api/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

// --- Types ---

interface ExecutionLog {
  id: string
  fileName: string
  executedAt: Date
  status: 'Success' | 'Failed'
  result?: string
  automationName?: string
}

interface Automation {
  id: string
  name: string
  folderPath?: string
  fileExtensions?: string
  prompt?: string
  outputFolder?: string
  isActive: boolean
  createdAt: Date
  lastExecution?: Date
  executionHistory: ExecutionLog[]
}

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend, trendUp }: any) => (
  <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-foreground tracking-tight">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${trendUp ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        <Icon className="w-4 h-4" />
      </div>
    </div>
    {trend && (
      <div className="mt-3 flex items-center gap-1 text-xs">
        <span className={trendUp ? 'text-green-500' : 'text-red-500'}>{trend}</span>
        <span className="text-muted-foreground/60">vs last month</span>
      </div>
    )}
  </Card>
)

const ActivityItem = ({ log }: { log: ExecutionLog }) => (
  <div className="flex gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group">
    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
      log.status === 'Success' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
    }`} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between mb-0.5">
        <p className="text-xs font-medium text-foreground truncate">{log.fileName}</p>
        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
          {new Date(log.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
        <span className="opacity-70">{log.automationName}</span>
        {log.status === 'Failed' && <span className="text-red-400 ml-1">- Error processing file</span>}
      </p>
    </div>
  </div>
)

export default function Tasks() {
  // --- State ---
  const [automations, setAutomations] = useState<Automation[]>([])
  const [showNewModal, setShowNewModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    folderPath: '',
    fileExtensions: '',
    prompt: '',
    outputFolder: ''
  })

  // --- Effects ---
  useEffect(() => {
    loadAutomations()
  }, [])

  // --- Actions ---
  const loadAutomations = async () => {
    try {
      const data = await api.getTasks()
      setAutomations(data.map((t: any) => ({
        id: t.id,
        name: t.name,
        folderPath: t.folderPath,
        fileExtensions: t.fileExtensions,
        prompt: t.prompt,
        outputFolder: t.outputFolder,
        isActive: t.isActive ?? true,
        createdAt: new Date(t.createdAt),
        lastExecution: t.lastExecution ? new Date(t.lastExecution) : undefined,
        executionHistory: t.executionHistory ?? []
      })))
    } catch (error) {
      console.error('Failed to load automations', error)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.folderPath || !formData.prompt) {
      toast.error('Missing required fields')
      return
    }

    try {
      const newAuto = await api.createTask(formData.name, 'automation', formData.prompt)
      // Optimistic update
      const automation: Automation = {
        id: newAuto.id,
        name: newAuto.name,
        folderPath: formData.folderPath,
        fileExtensions: formData.fileExtensions || undefined,
        prompt: formData.prompt,
        outputFolder: formData.outputFolder || undefined,
        isActive: true,
        createdAt: new Date(),
        executionHistory: []
      }
      setAutomations(prev => [...prev, automation])
      setFormData({ name: '', folderPath: '', fileExtensions: '', prompt: '', outputFolder: '' })
      setShowNewModal(false)
      toast.success('Workflow created successfully')
    } catch (error: any) {
      toast.error('Failed to create workflow')
    }
  }

  const toggleStatus = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a))
    toast.success('Status updated')
  }

  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id))
    toast.success('Workflow deleted')
  }

  // --- Computed ---
  const stats = useMemo(() => {
    const total = automations.length
    const active = automations.filter(a => a.isActive).length
    const allExecutions = automations.flatMap(a => a.executionHistory)
    const processed = allExecutions.length
    const success = allExecutions.filter(e => e.status === 'Success').length
    const rate = processed > 0 ? Math.round((success / processed) * 100) : 100

    return { total, active, processed, rate }
  }, [automations])

  const recentActivity = useMemo(() => {
    return automations
      .flatMap(a => a.executionHistory.map(e => ({ ...e, automationName: a.name })))
      .sort((a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime())
      .slice(0, 10)
  }, [automations])

  const filteredAutomations = automations.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.folderPath?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Layout>
      <div className="flex flex-col h-full gap-6 p-2">
        
        {/* Header Section */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Workflow Automations</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your file watchers and automated processing tasks.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search workflows..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 w-64 bg-card/50 border-border/50"
              />
            </div>
            <Button onClick={() => setShowNewModal(true)} className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 flex-shrink-0">
          <StatCard title="Total Workflows" value={stats.total} icon={Zap} trend="+2" trendUp={true} />
          <StatCard title="Active Watchers" value={stats.active} icon={Activity} trend="Stable" trendUp={true} />
          <StatCard title="Files Processed" value={stats.processed} icon={FileText} trend="+124" trendUp={true} />
          <StatCard title="Success Rate" value={`${stats.rate}%`} icon={CheckCircle2} trend="-1%" trendUp={false} />
        </div>

        {/* Main Content Split */}
        <div className="flex-1 flex gap-6 min-h-0">
          
          {/* Left: Workflow Grid */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            <div className="grid grid-cols-2 gap-4 pb-6">
              {filteredAutomations.map(auto => (
                <Card key={auto.id} className="group relative overflow-hidden border-border/50 bg-card/30 hover:bg-card/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20">
                  {/* Status Stripe */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${auto.isActive ? 'bg-primary' : 'bg-muted'}`} />
                  
                  <div className="p-5 pl-6">
                    {/* Card Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${auto.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          <Folder className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground leading-none mb-1.5">{auto.name}</h3>
                          <Badge variant="outline" className={`text-[10px] h-5 ${auto.isActive ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-muted-foreground'}`}>
                            {auto.isActive ? 'Monitoring' : 'Paused'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleStatus(auto.id)}>
                          {auto.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteAutomation(auto.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="space-y-3">
                      <div className="bg-muted/30 rounded-lg p-2.5 border border-border/50">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <Folder className="w-3.5 h-3.5" />
                          <span className="font-medium">Source</span>
                        </div>
                        <p className="text-xs font-mono text-foreground truncate" title={auto.folderPath}>{auto.folderPath}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-[10px] text-muted-foreground font-medium mb-1">EXTENSIONS</p>
                          <div className="flex gap-1">
                            {(auto.fileExtensions || 'all').split(',').map((ext, i) => (
                              <Badge key={i} variant="secondary" className="text-[10px] px-1.5 h-5 font-mono bg-muted/50">
                                {ext.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground font-medium mb-1">LAST RUN</p>
                          <p className="text-xs text-foreground">
                            {auto.lastExecution ? new Date(auto.lastExecution).toLocaleDateString() : 'Never'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {/* Add New Card Placeholder */}
              <button 
                onClick={() => setShowNewModal(true)}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group h-full min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-full bg-muted/50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Create New Workflow</p>
                  <p className="text-xs text-muted-foreground mt-1">Set up a new folder watcher</p>
                </div>
              </button>
            </div>
          </div>

          {/* Right: Activity Feed */}
          <div className="w-80 flex-shrink-0 flex flex-col gap-4">
            <Card className="flex-1 flex flex-col bg-card/30 border-border/50 backdrop-blur-sm overflow-hidden">
              <div className="p-4 border-b border-border/50 flex items-center justify-between bg-muted/10">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm">Live Activity</h3>
                </div>
                <Badge variant="outline" className="text-[10px] bg-background/50">Real-time</Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {recentActivity.length > 0 ? (
                  recentActivity.map((log, i) => (
                    <ActivityItem key={i} log={log} />
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                    <Activity className="w-8 h-8 mb-2 opacity-20" />
                    <p className="text-xs">No recent activity recorded</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

        </div>

        {/* Create Modal Overlay */}
        {showNewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <Card className="w-full max-w-lg bg-card border-border shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">New Automation Workflow</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowNewModal(false)}>
                    <XCircle className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Configure a folder watcher to process files automatically.</p>
              </div>
              
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Workflow Name</label>
                  <Input 
                    placeholder="e.g., Invoice Processor" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="bg-muted/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Watch Folder</label>
                    <div className="relative">
                      <Folder className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="C:\Inputs" 
                        value={formData.folderPath}
                        onChange={e => setFormData({...formData, folderPath: e.target.value})}
                        className="pl-9 bg-muted/30"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-foreground">Output Folder (Optional)</label>
                    <div className="relative">
                      <ArrowRight className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="C:\Outputs" 
                        value={formData.outputFolder}
                        onChange={e => setFormData({...formData, outputFolder: e.target.value})}
                        className="pl-9 bg-muted/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">File Extensions</label>
                  <Input 
                    placeholder="pdf, txt, docx (leave empty for all)" 
                    value={formData.fileExtensions}
                    onChange={e => setFormData({...formData, fileExtensions: e.target.value})}
                    className="bg-muted/30"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">AI Instruction Prompt</label>
                  <textarea 
                    className="w-full h-32 px-3 py-2 text-sm rounded-md border border-input bg-muted/30 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Describe what the AI should do with each file..."
                    value={formData.prompt}
                    onChange={e => setFormData({...formData, prompt: e.target.value})}
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowNewModal(false)}>Cancel</Button>
                  <Button type="submit" className="flex-1">Create Workflow</Button>
                </div>
              </form>
            </Card>
          </div>
        )}

      </div>
    </Layout>
  )
}
