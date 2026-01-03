import { Activity, ArrowUpRight, Box, Cpu, GitCommit, Globe, Terminal, Zap, HardDrive, Clock, Gauge, Wifi } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { api } from '@/api/client'
import { Model, Task, SystemStats } from '@/types'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [models, setModels] = useState<Model[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)

  useEffect(() => {
    api.getModels().then(setModels)
    api.getTasks().then(setTasks)
    
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/system/stats')
        if (response.ok) {
          setSystemStats(await response.json())
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  const activeModel = models.find(m => m.isActive) || models[0]

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Real-time overview of your local AI infrastructure.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Globe className="w-3 h-3 mr-2" />
              Community
            </Button>
            <Button size="sm" className="h-8 text-xs bg-foreground text-background hover:bg-[#CCC]">
              <Terminal className="w-3 h-3 mr-2" />
              New Session
            </Button>
          </div>
        </div>

        {/* Metrics Grid - Expanded with GPU and Network */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Model Repository</CardTitle>
              <Box className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{models.length}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-[#111] border-[#333] text-[#888] text-[10px] h-5">
                  {models.filter(m => m.status === 'Installed').length} Installed
                </Badge>
                <span className="text-xs text-[#666]">Local storage</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Task Throughput</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {tasks.filter(t => t.status === 'Completed').length}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-green-500 flex items-center">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +12%
                </span>
                <span className="text-xs text-[#666]">vs last week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">System Resources</CardTitle>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {systemStats ? `${systemStats.cpuUsagePercent.toFixed(0)}%` : '...'}
              </div>
              <div className="w-full bg-[#222] h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-green-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${systemStats?.cpuUsagePercent || 0}%` }} 
                />
              </div>
              <p className="text-[10px] text-[#666] mt-1.5">
                {systemStats ? `${systemStats.usedMemoryGb.toFixed(1)}GB / ${systemStats.totalMemoryGb.toFixed(1)}GB RAM` : 'Loading...'}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Engine</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground truncate">
                {activeModel?.name || 'Ollama'}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-[#666]">Inference Ready</span>
              </div>
            </CardContent>
          </Card>

          {/* GPU Card */}
          {systemStats?.gpuInfo && (
            <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">GPU Accelerator</CardTitle>
                <Gauge className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {systemStats.gpuInfo.usagePercent.toFixed(0)}%
                </div>
                <div className="w-full bg-[#222] h-1.5 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${systemStats.gpuInfo.usagePercent}%` }} 
                  />
                </div>
                <p className="text-[10px] text-[#666] mt-1.5">
                  {systemStats.gpuInfo.memoryUsedGb.toFixed(1)}GB / {systemStats.gpuInfo.memoryTotalGb.toFixed(1)}GB VRAM • {systemStats.gpuInfo.temperatureCelsius.toFixed(0)}°C
                </p>
              </CardContent>
            </Card>
          )}

          {/* Network Card */}
          {systemStats?.networkInfo && (
            <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Network Activity</CardTitle>
                <Wifi className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {systemStats.networkInfo.downloadSpeedMbps.toFixed(1)} Mbps
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-[10px] text-[#666]">? {systemStats.networkInfo.downloadSpeedMbps.toFixed(1)} Mbps</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span className="text-[10px] text-[#666]">? {systemStats.networkInfo.uploadSpeedMbps.toFixed(1)} Mbps</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resource Usage Chart (Simulated) */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-base font-medium">Resource Usage History</CardTitle>
                <CardDescription>Real-time monitoring of local inference performance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] w-full flex items-end gap-1 pt-4 border-b border-[#222] pb-2">
                  {Array.from({ length: 40 }).map((_, i) => {
                    const height = Math.max(10, Math.random() * 100);
                    return (
                      <div 
                        key={i} 
                        className="flex-1 bg-[#222] hover:bg-[#444] transition-colors rounded-t-sm"
                        style={{ height: `${height}%` }}
                      />
                    )
                  })}
                </div>
                <div className="flex justify-between mt-2 text-[10px] text-[#666] font-mono">
                  <span>1 hour ago</span>
                  <span>Now</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Table */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-foreground">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-[#888]">View All</Button>
              </div>
              <div className="rounded-lg border border-[#333] bg-[#0A0A0A] overflow-hidden">
                {tasks.length === 0 ? (
                  <div className="p-12 text-center">
                    <Clock className="w-8 h-8 text-[#333] mx-auto mb-3" />
                    <p className="text-sm text-[#666]">No recent activity found.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#222]">
                    {tasks.slice(0, 5).map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 hover:bg-[#111] transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded flex items-center justify-center border border-[#333] bg-[#111]`}>
                            <Terminal className="w-4 h-4 text-[#666]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground group-hover:text-white transition-colors">{task.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-[#666] font-mono">{task.id.substring(0, 8)}</span>
                              <span className="text-[10px] text-[#444]">•</span>
                              <span className="text-[10px] text-[#666] capitalize">{task.type}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-[#666] font-mono">{new Date(task.createdAt).toLocaleTimeString()}</span>
                          <Badge variant="outline" className="bg-[#111] border-[#333] text-[#888] text-[10px] font-normal w-20 justify-center">
                            {task.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar / Quick Actions */}
          <div className="space-y-6">
            {/* Quick Start */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Quick Start</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start h-10 bg-[#111] border-[#333] hover:bg-[#222] text-[#888] hover:text-foreground transition-all">
                  <Terminal className="w-4 h-4 mr-3" />
                  Start Chat Session
                </Button>
                <Button variant="outline" className="w-full justify-start h-10 bg-[#111] border-[#333] hover:bg-[#222] text-[#888] hover:text-foreground transition-all">
                  <Box className="w-4 h-4 mr-3" />
                  Install New Model
                </Button>
                <Button variant="outline" className="w-full justify-start h-10 bg-[#111] border-[#333] hover:bg-[#222] text-[#888] hover:text-foreground transition-all">
                  <GitCommit className="w-4 h-4 mr-3" />
                  Index Repository
                </Button>
              </CardContent>
            </Card>

            {/* Storage Status */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium">Storage Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#888]">Models</span>
                      <span className="text-foreground">12.4 GB</span>
                    </div>
                    <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full w-[45%]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#888]">Vector Index</span>
                      <span className="text-foreground">2.1 GB</span>
                    </div>
                    <div className="w-full bg-[#222] h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full w-[15%]" />
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-[#222] flex items-center gap-2 text-xs text-[#666]">
                  <HardDrive className="w-3 h-3" />
                  <span>14.5 GB Total Used</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <div className="rounded-lg bg-gradient-to-br from-[#111] to-[#000] border border-[#333] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-foreground">Pro Tip</span>
              </div>
              <p className="text-xs text-[#888] leading-relaxed">
                Connect your local repositories in the Workspaces tab to enable context-aware coding assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
