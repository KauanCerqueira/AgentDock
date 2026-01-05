import { Activity, Box, Terminal, Clock, Gauge, MessageSquare, Hash, CheckCircle, XCircle, Download, Server, Database, BarChart3 } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Progress } from '@/components/ui/progress'

interface DashboardData {
  usage: {
    totalConversations: number
    totalMessages: number
    totalTokensUsed: number
    avgTokensPerMessage: number
    totalRequests: number
    successfulRequests: number
    failedRequests: number
    avgResponseTimeMs: number
    successRate: number
  }
  models: {
    total: number
    installed: number
    activeModel: string | null
    storageGb: number
  }
  downloads: {
    total: number
    completed: number
    active: number
    totalDownloadedGb: number
  }
  system: {
    cpuUsagePercent: number
    totalMemoryGb: number
    usedMemoryGb: number
    availableMemoryGb: number
    memoryUsagePercent: number
    gpu: { name: string; usagePercent: number; memoryUsedGb: number; memoryTotalGb: number; temperatureCelsius: number } | null
    network: { downloadSpeedMbps: number; uploadSpeedMbps: number } | null
  }
  recentActivities: Array<{ id: string; timestamp: string; type: string; title: string; description: string; tokensUsed?: number }>
  usageHistory: Array<{ timestamp: string; requests: number; tokensUsed: number }>
  meta: { uptimeHours: number; modelsPath?: string }
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/dashboard/stats')
        if (response.ok) setData(await response.json())
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchData()
    const interval = setInterval(fetchData, 2000) // Atualizar mais rápido (2s)
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number) => num >= 1000000 ? `${(num / 1000000).toFixed(1)}M` : num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString()
  const formatBytes = (gb: number) => gb >= 1 ? `${gb.toFixed(1)} GB` : `${(gb * 1024).toFixed(0)} MB`
  const formatTime = (ts: string) => {
    const diff = (Date.now() - new Date(ts).getTime()) / 1000
    if (diff < 60) return `${Math.floor(diff)}s ago`
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`
    return `${Math.floor(diff/3600)}h ago`
  }

  if (loading) return <Layout><div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div></Layout>

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500 p-6 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Overview of your local AI infrastructure.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border">
              <div className={`w-2 h-2 rounded-full ${data?.models.activeModel ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {data?.models.activeModel ? 'Engine Active' : 'Engine Idle'}
              </span>
            </div>
            <Button onClick={() => navigate('/chat')} className="gap-2">
              <MessageSquare className="w-4 h-4" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Engine Card */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Engine</CardTitle>
              <Server className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">llama.cpp</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={data?.models.activeModel ? "default" : "secondary"} className="text-[10px] h-5">
                  {data?.models.activeModel || 'No model loaded'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Models Repository Card */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors cursor-pointer" onClick={() => navigate('/models')}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Model Repository</CardTitle>
              <Database className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data?.models.installed ?? 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {formatBytes(data?.models.storageGb ?? 0)} used storage
              </p>
            </CardContent>
          </Card>

          {/* Total Tokens Card */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tokens</CardTitle>
              <Hash className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(data?.usage.totalTokensUsed ?? 0)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                ~{data?.usage.avgTokensPerMessage?.toFixed(0) ?? 0} tokens/msg
              </p>
            </CardContent>
          </Card>

          {/* System Health Card */}
          <Card className="bg-card/50 backdrop-blur border-border hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Load</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">CPU</span>
                    <span className="font-mono">{data?.system.cpuUsagePercent?.toFixed(0)}%</span>
                  </div>
                  <Progress value={data?.system.cpuUsagePercent} className="h-1.5" />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">RAM</span>
                    <span className="font-mono">{data?.system.memoryUsagePercent?.toFixed(0)}%</span>
                  </div>
                  <Progress value={data?.system.memoryUsagePercent} className="h-1.5 bg-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity & History Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Usage Graph */}
            <Card className="border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Inference Activity</CardTitle>
                    <CardDescription>Requests volume over the last 24 hours</CardDescription>
                  </div>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-end gap-1 border-b border-border/50 pb-2 px-2">
                  {(data?.usageHistory.length ?? 0) > 0 ? (
                    data?.usageHistory.map((p, i) => {
                      const max = Math.max(...(data?.usageHistory.map(x => x.tokensUsed) ?? [1]), 1);
                      const height = Math.max(5, (p.tokensUsed / max) * 100);
                      return (
                        <div key={i} className="group relative flex-1 flex items-end h-full">
                          <div 
                            className="w-full bg-primary/20 hover:bg-primary/50 transition-all rounded-t-sm" 
                            style={{ height: `${height}%` }} 
                          />
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10 bg-popover text-popover-foreground text-xs p-2 rounded border shadow-lg whitespace-nowrap">
                            {p.requests} reqs | {formatNumber(p.tokensUsed)} toks
                            <div className="text-[10px] text-muted-foreground">{new Date(p.timestamp).toLocaleTimeString()}</div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No activity recorded yet
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono px-2">
                  <span>24h ago</span>
                  <span>Now</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity List */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-base">Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(data?.recentActivities.length ?? 0) === 0 ? (
                    <div className="text-center py-8 text-muted-foreground text-sm">No recent events</div>
                  ) : (
                    data?.recentActivities.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                        <div className={`mt-1 p-2 rounded-full border ${
                          activity.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
                          activity.type === 'download' ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' :
                          'bg-primary/10 border-primary/20 text-primary'
                        }`}>
                          {activity.type === 'download' ? <Download className="w-3 h-3" /> :
                           activity.type === 'error' ? <XCircle className="w-3 h-3" /> :
                           <Terminal className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-muted-foreground font-mono block">{formatTime(activity.timestamp)}</span>
                          {activity.tokensUsed && (
                            <Badge variant="outline" className="mt-1 text-[10px] h-4 px-1">
                              {formatNumber(activity.tokensUsed)} toks
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Button variant="outline" className="justify-start" onClick={() => navigate('/chat')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Conversation
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/models')}>
                  <Box className="mr-2 h-4 w-4" />
                  Manage Models
                </Button>
                <Button variant="outline" className="justify-start" onClick={() => navigate('/downloads')}>
                  <Download className="mr-2 h-4 w-4" />
                  Download New Models
                </Button>
              </CardContent>
            </Card>

            {/* Detailed Stats */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Avg Response</span>
                  </div>
                  <span className="font-mono font-medium">
                    {data?.usage.avgResponseTimeMs ? `${(data.usage.avgResponseTimeMs/1000).toFixed(2)}s` : '-'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Success Rate</span>
                  </div>
                  <span className={`font-mono font-medium ${
                    (data?.usage.successRate ?? 100) > 90 ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    {data?.usage.successRate?.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Total Messages</span>
                  </div>
                  <span className="font-mono font-medium">{formatNumber(data?.usage.totalMessages ?? 0)}</span>
                </div>
                
                <div className="pt-4 border-t border-border mt-4">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Uptime</span>
                    <span className="font-mono">{data?.meta.uptimeHours?.toFixed(1)}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* GPU Info (if available) */}
            {data?.system.gpu && (
              <Card className="border-border bg-card/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Gauge className="w-4 h-4" />
                    GPU Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium truncate max-w-[150px]">{data.system.gpu.name}</span>
                      <Badge variant="outline" className="text-[10px]">{data.system.gpu.temperatureCelsius}°C</Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Usage</span>
                        <span>{data.system.gpu.usagePercent}%</span>
                      </div>
                      <Progress value={data.system.gpu.usagePercent} className="h-1.5 bg-secondary" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>VRAM</span>
                        <span>{data.system.gpu.memoryUsedGb.toFixed(1)} / {data.system.gpu.memoryTotalGb.toFixed(1)} GB</span>
                      </div>
                      <Progress value={(data.system.gpu.memoryUsedGb / data.system.gpu.memoryTotalGb) * 100} className="h-1.5 bg-secondary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
