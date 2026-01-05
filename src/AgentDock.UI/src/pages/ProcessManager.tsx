import { useState, useEffect } from 'react'
import { Activity, Cpu, HardDrive, X, AlertTriangle, RefreshCw } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'

interface ProcessInfo {
  id: number
  name: string
  memoryMb: number
  memoryPercent: number
  cpuPercent: number
  isSystemProcess: boolean
  canKill: boolean
}

interface SystemStats {
  totalMemoryGb: number
  usedMemoryGb: number
  availableMemoryGb: number
  memoryUsagePercent: number
  cpuUsagePercent: number
}

export default function ProcessManager() {
  const [processes, setProcesses] = useState<ProcessInfo[]>([])
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'memory' | 'cpu' | 'name'>('memory')
  const [autoRefresh, setAutoRefresh] = useState(true)

  useEffect(() => {
    loadProcesses()
    
    if (autoRefresh) {
      const interval = setInterval(loadProcesses, 3000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const loadProcesses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/system/processes')
      if (!response.ok) throw new Error('Failed to fetch')
      
      const data = await response.json()
      setProcesses(data.processes || [])
      setSystemStats(data.systemStats || null)
    } catch (error) {
      console.error('Failed to load processes:', error)
      toast.error('Erro ao carregar processos')
    } finally {
      setLoading(false)
    }
  }

  const killProcess = async (processId: number, processName: string) => {
    const confirmed = window.confirm(
      `?? ATENÇÃO!\n\n` +
      `Deseja FORÇAR o encerramento do processo?\n\n` +
      `Processo: ${processName} (PID: ${processId})\n\n` +
      `?? Isso pode causar:\n` +
      `• Perda de dados não salvos\n` +
      `• Instabilidade do sistema\n` +
      `• Encerramento de tarefas em andamento\n\n` +
      `Tem certeza?`
    )

    if (!confirmed) return

    try {
      const response = await fetch(`http://localhost:5000/api/system/processes/${processId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to kill process')
      }

      toast.success('Processo encerrado', {
        description: `${processName} foi finalizado com sucesso`
      })

      // Recarregar lista
      setTimeout(loadProcesses, 500)
    } catch (error: any) {
      console.error('Failed to kill process:', error)
      toast.error('Erro ao encerrar processo', {
        description: error.message || 'Permissões insuficientes ou processo protegido'
      })
    }
  }

  const getSortedProcesses = () => {
    const sorted = [...processes]
    
    switch (sortBy) {
      case 'memory':
        return sorted.sort((a, b) => b.memoryMb - a.memoryMb)
      case 'cpu':
        return sorted.sort((a, b) => b.cpuPercent - a.cpuPercent)
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return sorted
    }
  }

  const getMemoryColor = (percent: number) => {
    if (percent >= 80) return 'text-red-500'
    if (percent >= 50) return 'text-yellow-500'
    return 'text-green-500'
  }

  const formatMemory = (mb: number) => {
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)}GB`
    return `${mb.toFixed(0)}MB`
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Gerenciador de Processos
            </h1>
            <p className="text-sm text-muted-foreground">
              Monitore e finalize processos que consomem muita RAM
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Auto' : 'Manual'}
            </Button>
            <Button variant="outline" size="sm" onClick={loadProcesses}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        {/* System Stats */}
        {systemStats && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Uso de RAM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className={`text-2xl font-bold ${getMemoryColor(systemStats.memoryUsagePercent)}`}>
                      {systemStats.memoryUsagePercent.toFixed(1)}%
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {systemStats.usedMemoryGb.toFixed(1)}GB / {systemStats.totalMemoryGb.toFixed(1)}GB
                    </span>
                  </div>
                  <Progress value={systemStats.memoryUsagePercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Disponível: {systemStats.availableMemoryGb.toFixed(1)}GB
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Uso de CPU
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-end justify-between">
                    <span className={`text-2xl font-bold ${getMemoryColor(systemStats.cpuUsagePercent)}`}>
                      {systemStats.cpuUsagePercent.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={systemStats.cpuUsagePercent} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total de Processos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span className="text-2xl font-bold text-foreground">
                    {processes.length}
                  </span>
                  <span className="text-sm text-muted-foreground">ativos</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sort Controls */}
        <div className="flex gap-2">
          <span className="text-sm text-muted-foreground my-auto">Ordenar por:</span>
          <Button
            variant={sortBy === 'memory' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('memory')}
          >
            <HardDrive className="w-4 h-4 mr-2" />
            Memória
          </Button>
          <Button
            variant={sortBy === 'cpu' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('cpu')}
          >
            <Cpu className="w-4 h-4 mr-2" />
            CPU
          </Button>
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('name')}
          >
            Nome
          </Button>
        </div>

        {/* Process List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Processos em Execução</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 animate-spin" />
                <p>Carregando processos...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-muted/50 rounded-lg text-xs font-semibold text-muted-foreground">
                  <div className="col-span-5">Processo</div>
                  <div className="col-span-2 text-right">Memória</div>
                  <div className="col-span-2 text-right">RAM %</div>
                  <div className="col-span-2 text-right">CPU %</div>
                  <div className="col-span-1 text-right">Ação</div>
                </div>

                {/* Processes */}
                <div className="max-h-[500px] overflow-y-auto space-y-1">
                  {getSortedProcesses().map((process) => (
                    <div
                      key={process.id}
                      className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-muted/50 transition-colors ${
                        process.memoryPercent > 20 ? 'border-l-2 border-l-red-500' : ''
                      }`}
                    >
                      <div className="col-span-5 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {process.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            PID: {process.id}
                            {process.isSystemProcess && (
                              <Badge variant="outline" className="ml-2 text-[9px]">
                                Sistema
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-right my-auto">
                        <span className={`font-mono font-semibold ${process.memoryPercent > 20 ? 'text-red-500' : ''}`}>
                          {formatMemory(process.memoryMb)}
                        </span>
                      </div>

                      <div className="col-span-2 text-right my-auto">
                        <span className={`font-mono ${getMemoryColor(process.memoryPercent)}`}>
                          {process.memoryPercent.toFixed(1)}%
                        </span>
                      </div>

                      <div className="col-span-2 text-right my-auto">
                        <span className="font-mono text-muted-foreground">
                          {process.cpuPercent.toFixed(1)}%
                        </span>
                      </div>

                      <div className="col-span-1 text-right my-auto">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => killProcess(process.id, process.name)}
                          disabled={!process.canKill}
                          className={`h-8 w-8 p-0 ${
                            process.canKill 
                              ? 'hover:bg-red-500/20 hover:text-red-500' 
                              : 'opacity-50 cursor-not-allowed'
                          }`}
                          title={process.canKill ? 'Finalizar processo' : 'Processo protegido'}
                        >
                          {process.canKill ? (
                            <X className="w-4 h-4" />
                          ) : (
                            <AlertTriangle className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {processes.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Nenhum processo em execução</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Warning */}
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-foreground">?? Atenção ao Finalizar Processos</p>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Finalizar processos pode causar perda de dados não salvos</li>
                  <li>• Processos do sistema estão protegidos e não podem ser finalizados</li>
                  <li>• Use apenas para processos travados ou que consomem muita RAM</li>
                  <li>• Se seu PC está lento, considere fechar programas normalmente primeiro</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
