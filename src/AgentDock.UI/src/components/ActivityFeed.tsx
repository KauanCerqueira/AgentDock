import { useEffect, useState } from 'react'
import { Activity, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { api } from '@/api/client'
import { ActivityLog } from '@/types'

const iconMap = {
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
}

const colorMap = {
  info: 'text-blue-500',
  success: 'text-green-500',
  warning: 'text-yellow-500',
  error: 'text-red-500',
}

export default function ActivityFeed() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [filter, setFilter] = useState<string>('')

  useEffect(() => {
    const fetchLogs = async () => {
      const data = await api.getActivityLogs(20)
      setLogs(data)
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredLogs = filter ? logs.filter((log) => log.category === filter) : logs

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (seconds < 60) return `${seconds}s ago`
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <Card className="bg-[#0A0A0A] border-[#333]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity className="w-4 h-4 text-[#666]" />
            Recent Activity
          </CardTitle>
          <div className="flex gap-1">
            {['all', 'system', 'model', 'task', 'user'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat === 'all' ? '' : cat)}
                className={`px-2 py-0.5 rounded text-[10px] capitalize transition-colors ${
                  (cat === 'all' && !filter) || filter === cat
                    ? 'bg-[#222] text-foreground'
                    : 'bg-[#111] text-[#666] hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-sm text-[#666]">No recent activity</div>
          ) : (
            filteredLogs.map((log) => {
              const Icon = iconMap[log.type]
              return (
                <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-[#111] border border-[#222] hover:border-[#333] transition-colors">
                  <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${colorMap[log.type]}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-foreground leading-snug">{log.message}</p>
                      <span className="text-[10px] text-[#666] whitespace-nowrap">{formatTime(log.timestamp)}</span>
                    </div>
                    {log.details && (
                      <p className="text-xs text-[#666] mt-1 line-clamp-2">{log.details}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-[#0A0A0A] border-[#333] text-[9px] font-normal capitalize">
                        {log.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}
