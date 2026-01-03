import { useState, useEffect } from 'react'
import { Cpu, HardDrive, Gauge, Wifi, Activity } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { api } from '@/api/client'
import { PerformanceMetric } from '@/types'

export default function Analytics() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [timeRange, setTimeRange] = useState(60) // minutes
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      const data = await api.getPerformanceMetrics(timeRange)
      setMetrics(data)
      setLoading(false)
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 5000)
    return () => clearInterval(interval)
  }, [timeRange])

  const getAverage = (key: keyof PerformanceMetric) => {
    if (metrics.length === 0) return 0
    const sum = metrics.reduce((acc, m) => acc + (m[key] as number), 0)
    return sum / metrics.length
  }

  const getMax = (key: keyof PerformanceMetric) => {
    if (metrics.length === 0) return 0
    return Math.max(...metrics.map((m) => m[key] as number))
  }

  const renderChart = (data: number[], label: string, color: string) => {
    const max = Math.max(...data, 1)
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#666]">
          <span>{label}</span>
          <span className="font-mono">{data[data.length - 1]?.toFixed(1) || 0}</span>
        </div>
        <div className="h-24 flex items-end gap-0.5">
          {data.map((value, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${color} transition-all`}
              style={{ height: `${(value / max) * 100}%`, minHeight: '2px' }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
        </div>
      </Layout>
    )
  }

  const cpuData = metrics.map((m) => m.cpuUsage)
  const memoryData = metrics.map((m) => m.memoryUsage)
  const gpuData = metrics.map((m) => m.gpuUsage)
  const networkDownData = metrics.map((m) => m.networkDownload)
  const networkUpData = metrics.map((m) => m.networkUpload)

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Performance Analytics</h1>
            <p className="text-sm text-[#888]">Monitor system performance and resource usage over time.</p>
          </div>
          <div className="flex gap-2">
            {[15, 60, 240, 720].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setTimeRange(minutes)}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  timeRange === minutes
                    ? 'bg-foreground text-background'
                    : 'bg-[#111] text-[#888] border border-[#333] hover:border-[#666]'
                }`}
              >
                {minutes < 60 ? `${minutes}m` : `${minutes / 60}h`}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Avg CPU</CardTitle>
              <Cpu className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{getAverage('cpuUsage').toFixed(1)}%</div>
              <p className="text-xs text-[#666] mt-1">Peak: {getMax('cpuUsage').toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Avg Memory</CardTitle>
              <HardDrive className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{getAverage('memoryUsage').toFixed(1)} GB</div>
              <p className="text-xs text-[#666] mt-1">Peak: {getMax('memoryUsage').toFixed(1)} GB</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Avg GPU</CardTitle>
              <Gauge className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{getAverage('gpuUsage').toFixed(1)}%</div>
              <p className="text-xs text-[#666] mt-1">Peak: {getMax('gpuUsage').toFixed(1)}%</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Network</CardTitle>
              <Wifi className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{getAverage('networkDownload').toFixed(1)} Mbps</div>
              <p className="text-xs text-[#666] mt-1">Download average</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Cpu className="w-4 h-4 text-[#666]" />
                CPU Usage
              </CardTitle>
              <CardDescription>Processor utilization over time</CardDescription>
            </CardHeader>
            <CardContent>{renderChart(cpuData, 'CPU %', 'bg-blue-500')}</CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <HardDrive className="w-4 h-4 text-[#666]" />
                Memory Usage
              </CardTitle>
              <CardDescription>RAM consumption over time</CardDescription>
            </CardHeader>
            <CardContent>{renderChart(memoryData, 'Memory GB', 'bg-purple-500')}</CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Gauge className="w-4 h-4 text-[#666]" />
                GPU Usage
              </CardTitle>
              <CardDescription>Graphics processor utilization</CardDescription>
            </CardHeader>
            <CardContent>{renderChart(gpuData, 'GPU %', 'bg-orange-500')}</CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4 text-[#666]" />
                Network Activity
              </CardTitle>
              <CardDescription>Bandwidth usage over time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderChart(networkDownData, 'Download Mbps', 'bg-blue-500')}
              {renderChart(networkUpData, 'Upload Mbps', 'bg-green-500')}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
