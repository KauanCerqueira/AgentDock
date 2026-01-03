import { useState } from 'react'
import { BarChart3, TrendingUp, Zap, Clock, Hash, Activity } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface APIStats {
  totalRequests: number
  totalTokens: number
  avgResponseTime: number
  successRate: number
  topModels: Array<{ model: string; count: number; percentage: number }>
  topEndpoints: Array<{ endpoint: string; count: number; percentage: number }>
  requestsByHour: number[]
}

export default function APIAnalytics() {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h')
  const [stats] = useState<APIStats>({
    totalRequests: 15432,
    totalTokens: 2450000,
    avgResponseTime: 1.8,
    successRate: 99.2,
    topModels: [
      { model: 'llama2', count: 9876, percentage: 64 },
      { model: 'codellama', count: 3456, percentage: 22 },
      { model: 'mistral', count: 1543, percentage: 10 },
      { model: 'neural-chat', count: 557, percentage: 4 },
    ],
    topEndpoints: [
      { endpoint: '/api/v1/chat', count: 12345, percentage: 80 },
      { endpoint: '/api/v1/completions', count: 2468, percentage: 16 },
      { endpoint: '/api/v1/context', count: 619, percentage: 4 },
    ],
    requestsByHour: [45, 52, 38, 65, 78, 92, 105, 120, 135, 142, 138, 125, 110, 95, 88, 102, 115, 128, 140, 135, 120, 95, 75, 58],
  })

  const renderMiniChart = (data: number[], color: string) => {
    const max = Math.max(...data)
    return (
      <div className="h-16 flex items-end gap-0.5">
        {data.map((value, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm ${color} transition-all`}
            style={{ height: `${(value / max) * 100}%`, minHeight: '2px' }}
          />
        ))}
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">API Analytics</h1>
            <p className="text-sm text-[#888]">Monitor API usage, performance, and trends.</p>
          </div>
          <div className="flex gap-2">
            {(['24h', '7d', '30d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded text-xs transition-all ${
                  timeRange === range
                    ? 'bg-foreground text-background'
                    : 'bg-[#111] text-[#888] border border-[#333] hover:border-[#666]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Total Requests</CardTitle>
              <BarChart3 className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.totalRequests.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-500">+12.5%</span>
                <span className="text-xs text-[#666]">vs previous {timeRange}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Tokens Used</CardTitle>
              <Hash className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {(stats.totalTokens / 1000000).toFixed(1)}M
              </div>
              <p className="text-xs text-[#666] mt-1">Across all models</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Avg Response Time</CardTitle>
              <Clock className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.avgResponseTime}s</div>
              <p className="text-xs text-[#666] mt-1">Average latency</p>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#888]">Success Rate</CardTitle>
              <Zap className="h-4 w-4 text-[#666]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.successRate}%</div>
              <p className="text-xs text-[#666] mt-1">Successful responses</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4 text-[#666]" />
                Request Volume
              </CardTitle>
              <CardDescription>API requests over time</CardDescription>
            </CardHeader>
            <CardContent>
              {renderMiniChart(stats.requestsByHour, 'bg-blue-500')}
              <div className="flex justify-between mt-2 text-[10px] text-[#666] font-mono">
                <span>24h ago</span>
                <span>Now</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4 text-[#666]" />
                Top Models
              </CardTitle>
              <CardDescription>Most used AI models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.topModels.map((model) => (
                <div key={model.model} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground capitalize">{model.model}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#666] font-mono">{model.count.toLocaleString()}</span>
                      <Badge variant="outline" className="bg-[#111] border-[#333] text-[9px] font-mono">
                        {model.percentage}%+
                      </Badge>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${model.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Zap className="w-4 h-4 text-[#666]" />
                Top Endpoints
              </CardTitle>
              <CardDescription>Most frequently called endpoints</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.topEndpoints.map((endpoint) => (
                <div key={endpoint.endpoint} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-mono text-xs">{endpoint.endpoint}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#666] font-mono">{endpoint.count.toLocaleString()}</span>
                      <Badge variant="outline" className="bg-[#111] border-[#333] text-[9px] font-mono">
                        {endpoint.percentage}%+
                      </Badge>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#222] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${endpoint.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="w-4 h-4 text-[#666]" />
                Performance Metrics
              </CardTitle>
              <CardDescription>Response time distribution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">P50 (Median)</span>
                  <span className="text-foreground font-mono">1.2s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">P95</span>
                  <span className="text-foreground font-mono">3.4s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">P99</span>
                  <span className="text-foreground font-mono">5.1s</span>
                </div>
              </div>
              <div className="pt-3 border-t border-[#222] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">Fastest</span>
                  <span className="text-green-500 font-mono">0.3s</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#888]">Slowest</span>
                  <span className="text-red-500 font-mono">12.7s</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
