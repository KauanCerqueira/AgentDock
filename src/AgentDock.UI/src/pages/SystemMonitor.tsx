import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SystemStats } from '@/types'
import { Activity, Cpu, HardDrive, Server, AlertCircle, Database, Terminal, Gauge, Wifi, Thermometer } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function SystemMonitor() {
  const [stats, setStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/system/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setError(null)
      } else {
        const errorText = await response.text()
        setError(`Server returned ${response.status}: ${errorText}`)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 2000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading system stats...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !stats) {
    return (
      <Layout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">System Monitor</h1>
          <Card className="border-red-500/50 bg-red-950/10">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div>
                  <h3 className="text-lg font-semibold text-red-500">Failed to load system stats</h3>
                  <p className="text-sm text-muted-foreground mt-1">{error || 'Unable to connect to the backend API'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">System Monitor</h1>
            <p className="text-sm text-[#888]">Real-time performance metrics and resource usage.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#666] font-mono bg-[#111] px-3 py-1 rounded border border-[#333]">
            <Server className="w-3 h-3" />
            {stats.osDescription}
          </div>
        </div>
        
        {/* Main Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">CPU Usage</CardTitle>
              <Cpu className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.cpuUsagePercent.toFixed(1)}%</div>
              <Progress value={stats.cpuUsagePercent} className="h-1.5 mt-3 bg-[#222]" indicatorClassName="bg-blue-500" />
              <p className="text-xs text-[#666] mt-2">
                {stats.processCount} active processes
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Memory Usage</CardTitle>
              <Activity className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.usedMemoryGb.toFixed(1)} GB</div>
              <Progress value={(stats.usedMemoryGb / stats.totalMemoryGb) * 100} className="h-1.5 mt-3 bg-[#222]" indicatorClassName="bg-purple-500" />
              <p className="text-xs text-[#666] mt-2">
                of {stats.totalMemoryGb.toFixed(1)} GB Total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Available RAM</CardTitle>
              <HardDrive className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.availableMemoryGb.toFixed(1)} GB</div>
              <Progress value={(stats.availableMemoryGb / stats.totalMemoryGb) * 100} className="h-1.5 mt-3 bg-[#222]" indicatorClassName="bg-green-500" />
              <p className="text-xs text-[#666] mt-2">
                Free memory
              </p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">System Uptime</CardTitle>
              <Server className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground truncate text-sm pt-1">{stats.upTime}</div>
              <div className="h-1.5 mt-3 w-full bg-[#222] rounded-full overflow-hidden">
                 <div className="h-full bg-yellow-500 w-full animate-pulse" />
              </div>
              <p className="text-xs text-[#666] mt-2">
                {stats.architecture} Architecture
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* GPU Info */}
          {stats.gpuInfo && (
            <Card className="bg-[#0A0A0A] border-[#333]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="w-5 h-5 text-[#666]" />
                  GPU Accelerator
                </CardTitle>
                <CardDescription>{stats.gpuInfo.name}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#888]">GPU Core Load</span>
                    <span className="font-medium">{stats.gpuInfo.usagePercent.toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.gpuInfo.usagePercent} className="h-2 bg-[#222]" indicatorClassName="bg-orange-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#888]">VRAM Usage</span>
                    <span className="font-medium">{stats.gpuInfo.memoryUsedGb.toFixed(1)} GB / {stats.gpuInfo.memoryTotalGb.toFixed(1)} GB</span>
                  </div>
                  <Progress value={stats.gpuInfo.memoryUsagePercent} className="h-2 bg-[#222]" indicatorClassName={stats.gpuInfo.memoryUsagePercent > 90 ? "bg-red-500" : "bg-blue-500"} />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-[#111] border border-[#222]">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-[#666]" />
                    <span className="text-sm text-[#888]">Temperature</span>
                  </div>
                  <span className="font-mono text-sm font-medium">{stats.gpuInfo.temperatureCelsius.toFixed(0)}°C</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Network Activity */}
          {stats.networkInfo && (
            <Card className="bg-[#0A0A0A] border-[#333]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5 text-[#666]" />
                  Network Activity
                </CardTitle>
                <CardDescription>Real-time bandwidth monitoring.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-[#888]">Download Speed</span>
                    </div>
                    <span className="font-medium">{stats.networkInfo.downloadSpeedMbps.toFixed(2)} Mbps</span>
                  </div>
                  <Progress value={Math.min(stats.networkInfo.downloadSpeedMbps / 10, 100)} className="h-2 bg-[#222]" indicatorClassName="bg-blue-500" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span className="text-[#888]">Upload Speed</span>
                    </div>
                    <span className="font-medium">{stats.networkInfo.uploadSpeedMbps.toFixed(2)} Mbps</span>
                  </div>
                  <Progress value={Math.min(stats.networkInfo.uploadSpeedMbps / 10, 100)} className="h-2 bg-[#222]" indicatorClassName="bg-purple-500" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-[#111] border border-[#222]">
                    <div className="text-xs text-[#666] mb-1">Total Downloaded</div>
                    <div className="font-mono text-sm font-medium">{stats.networkInfo.totalDownloadedGb.toFixed(2)} GB</div>
                  </div>
                  <div className="p-3 rounded-lg bg-[#111] border border-[#222]">
                    <div className="text-xs text-[#666] mb-1">Total Uploaded</div>
                    <div className="font-mono text-sm font-medium">{stats.networkInfo.totalUploadedGb.toFixed(2)} GB</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disk Usage */}
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#666]" />
                Storage Status
              </CardTitle>
              <CardDescription>Local disk usage and capacity.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {stats.disks.map((disk) => (
                <div key={disk.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <HardDrive className="w-4 h-4 text-[#666]" />
                      <span className="font-medium">{disk.name}</span>
                    </div>
                    <span className="text-[#888]">{disk.usedSpaceGb.toFixed(1)} GB / {disk.totalSizeGb.toFixed(1)} GB</span>
                  </div>
                  <Progress value={disk.usagePercent} className="h-2 bg-[#222]" indicatorClassName={disk.usagePercent > 90 ? "bg-red-500" : "bg-blue-500"} />
                  <div className="flex justify-between text-xs text-[#666]">
                    <span>{disk.usagePercent.toFixed(1)}% Used</span>
                    <span>{disk.freeSpaceGb.toFixed(1)} GB Free</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Processes */}
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#666]" />
                Top Memory Processes
              </CardTitle>
              <CardDescription>Processes consuming the most RAM.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topProcesses.map((proc) => (
                  <div key={proc.id} className="flex items-center justify-between p-3 rounded-lg bg-[#111] border border-[#222]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#222] flex items-center justify-center text-xs font-mono text-[#888]">
                        {proc.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">{proc.name}</div>
                        <div className="text-xs text-[#666]">PID: {proc.id}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-foreground">{proc.memoryMb.toFixed(0)} MB</div>
                      <div className="text-xs text-[#666]">RAM</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
