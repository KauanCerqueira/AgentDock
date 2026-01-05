import { useState, useEffect, useMemo } from 'react'
import { FolderPlus, Trash2, Loader2, Search, Tag, Plus, X, BarChart3, FolderOpen, Upload } from 'lucide-react'
import Layout from '@/components/Layout'
import { api } from '@/api/client'
import { Workspace, WorkspaceFile, WorkspaceGroup } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface WorkspaceStats {
  totalFiles: number
  totalSize: number
  filesByType: Record<string, number>
  taggedFiles: number
  lastModified: string
}

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [groups, setGroups] = useState<WorkspaceGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [showConnect, setShowConnect] = useState(false)
  const [path, setPath] = useState('')
  
  // Selected workspace state
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null)
  const [workspaceFiles, setWorkspaceFiles] = useState<WorkspaceFile[]>([])
  const [workspaceStats, setWorkspaceStats] = useState<WorkspaceStats | null>(null)
  const [filesLoading, setFilesLoading] = useState(false)
  
  // Search & filter
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  // Group management
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  
  // Tag management
  const [showTagModal, setShowTagModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<WorkspaceFile | null>(null)
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [workspacesData, groupsData] = await Promise.all([
        api.getWorkspaces(),
        api.getWorkspaceGroups?.() ?? Promise.resolve([])
      ])
      setWorkspaces(workspacesData)
      setGroups(groupsData)
    } finally {
      setLoading(false)
    }
  }

  const loadWorkspaceDetails = async (workspaceId: string) => {
    try {
      setFilesLoading(true)
      const [files, stats] = await Promise.all([
        api.getWorkspaceFiles?.(workspaceId) ?? Promise.resolve([]),
        api.getWorkspaceStats?.(workspaceId) ?? Promise.resolve(null)
      ])
      setWorkspaceFiles(files)
      setWorkspaceStats(stats)
    } finally {
      setFilesLoading(false)
    }
  }

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const workspace = await api.connectWorkspace(path)
      setWorkspaces(prev => [...prev, workspace])
      setPath('')
      setShowConnect(false)
      toast.success('Workspace conectado com sucesso!')
    } catch {
      toast.error('Erro ao conectar workspace')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este workspace?')) return
    try {
      await api.deleteWorkspace?.(id)
      setWorkspaces(prev => prev.filter(w => w.id !== id))
      if (selectedWorkspace === id) setSelectedWorkspace(null)
      toast.success('Workspace deletado')
    } catch {
      toast.error('Erro ao deletar workspace')
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const group = await api.createWorkspaceGroup?.({ name: newGroupName, description: newGroupDesc })
      if (group) {
        setGroups(prev => [...prev, group])
        setNewGroupName('')
        setNewGroupDesc('')
        setShowGroupModal(false)
        toast.success('Grupo criado com sucesso!')
      }
    } catch {
      toast.error('Erro ao criar grupo')
    }
  }

  const handleAddTag = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedWorkspace || !selectedFile) return
    try {
      await api.addFileTag?.(selectedWorkspace, selectedFile.id, newTag)
      setWorkspaceFiles(prev => prev.map(f => 
        f.id === selectedFile.id 
          ? { ...f, tags: [...f.tags, newTag] }
          : f
      ))
      setNewTag('')
      setShowTagModal(false)
      toast.success('Tag adicionada!')
    } catch {
      toast.error('Erro ao adicionar tag')
    }
  }

  const handleRemoveTag = async (fileId: string, tag: string) => {
    if (!selectedWorkspace) return
    try {
      await api.removeFileTag?.(selectedWorkspace, fileId, tag)
      setWorkspaceFiles(prev => prev.map(f =>
        f.id === fileId
          ? { ...f, tags: f.tags.filter(t => t !== tag) }
          : f
      ))
      toast.success('Tag removida')
    } catch {
      toast.error('Erro ao remover tag')
    }
  }

  const filteredFiles = useMemo(() => {
    return workspaceFiles.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = !selectedTag || f.tags.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [workspaceFiles, searchQuery, selectedTag])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    workspaceFiles.forEach(f => f.tags.forEach(t => tags.add(t)))
    return Array.from(tags)
  }, [workspaceFiles])

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Layout>
      <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>
            <p className="text-sm text-muted-foreground">Gerenciar pastas, arquivos e sincronização em nuvem</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowGroupModal(true)} size="sm" variant="outline" className="h-8 text-xs">
              <Plus className="w-3 h-3 mr-2" />
              Novo Grupo
            </Button>
            <Button onClick={() => setShowConnect(!showConnect)} size="sm" className="h-8 text-xs">
              <FolderPlus className="w-3 h-3 mr-2" />
              Conectar Pasta
            </Button>
          </div>
        </div>

        {/* Connect Form */}
        {showConnect && (
          <div className="rounded-lg border border-border bg-card p-6 mb-6">
            <h3 className="text-sm font-medium mb-4">Conectar Nova Pasta</h3>
            <form onSubmit={handleConnect} className="flex gap-2">
              <Input
                value={path}
                onChange={e => setPath(e.target.value)}
                placeholder="C:\Projetos\MeuProjeto"
                className="bg-background h-9 text-sm font-mono flex-1"
                required
              />
              <Button type="submit" size="sm" className="h-9 text-xs">Conectar</Button>
            </form>
          </div>
        )}

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Left: Workspaces List */}
          <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto">
            {/* Groups */}
            {groups.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3">Grupos</h3>
                {groups.map(group => (
                  <div key={group.id} className="rounded border border-border bg-card/50 p-3 hover:bg-card transition-colors">
                    <p className="text-xs font-medium">{group.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{group.workspaceIds?.length || 0} workspace(s)</p>
                  </div>
                ))}
              </div>
            )}

            {/* Workspaces */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest px-3">Workspaces</h3>
              <div className="space-y-1">
                {loading ? (
                  <div className="flex justify-center py-6">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                ) : workspaces.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">Nenhum workspace</p>
                ) : (
                  workspaces.map(ws => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setSelectedWorkspace(ws.id)
                        loadWorkspaceDetails(ws.id)
                      }}
                      className={`w-full text-left rounded-lg border transition-all p-3 text-xs ${
                        selectedWorkspace === ws.id
                          ? 'border-primary bg-primary/5 ring-1 ring-primary'
                          : 'border-border bg-card hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{ws.name}</p>
                          <p className="text-muted-foreground truncate mt-0.5">{ws.fileCount} arquivos</p>
                        </div>
                        <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1 ${ws.status === 'Indexed' ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`} />
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right: Details Panel */}
          {selectedWorkspace ? (
            <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
              {/* Stats */}
              {workspaceStats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <StatCard
                    icon={<Upload className="w-4 h-4" />}
                    label="Arquivos"
                    value={workspaceStats.totalFiles}
                  />
                  <StatCard
                    icon={<BarChart3 className="w-4 h-4" />}
                    label="Tamanho"
                    value={formatSize(workspaceStats.totalSize)}
                  />
                  <StatCard
                    icon={<Tag className="w-4 h-4" />}
                    label="Tags"
                    value={workspaceStats.taggedFiles}
                  />
                </div>
              )}

              {/* Actions & Search */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Buscar arquivos..."
                      className="pl-9 h-9 text-sm"
                    />
                  </div>
                  <Button onClick={() => handleDelete(selectedWorkspace)} size="sm" variant="outline" className="h-9 text-red-500 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Tags Filter */}
                {allTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {allTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? 'default' : 'outline'}
                        className="cursor-pointer text-xs"
                        onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Files List */}
              <Card className="flex-1 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-border">
                  <h3 className="font-semibold text-sm">Arquivos ({filteredFiles.length})</h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filesLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : filteredFiles.length === 0 ? (
                    <div className="flex justify-center items-center h-full text-muted-foreground text-xs">
                      Nenhum arquivo
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {filteredFiles.map(file => (
                        <div key={file.id} className="p-3 hover:bg-accent/50 transition-colors group">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{formatSize(file.sizeBytes)}</p>
                            </div>
                            <Button
                              onClick={() => {
                                setSelectedFile(file)
                                setShowTagModal(true)
                              }}
                              size="icon"
                              variant="ghost"
                              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          {file.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {file.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                  <button
                                    onClick={() => handleRemoveTag(file.id, tag)}
                                    className="ml-1 hover:text-destructive"
                                  >
                                    ×
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <div className="lg:col-span-2 flex items-center justify-center">
              <div className="text-center">
                <FolderOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Selecione um workspace para ver detalhes</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold">Criar Novo Grupo</h2>
              <button onClick={() => setShowGroupModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="p-4 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  placeholder="Projeto A"
                  className="h-9"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  value={newGroupDesc}
                  onChange={e => setNewGroupDesc(e.target.value)}
                  placeholder="Descrição..."
                  className="h-9"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button onClick={() => setShowGroupModal(false)} size="sm" variant="outline">Cancelar</Button>
                <Button type="submit" size="sm">Criar</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Sync Modal - REMOVED */}

      {/* Tag Modal */}
      {showTagModal && selectedFile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-semibold text-sm">Adicionar Tag</h2>
              <button onClick={() => setShowTagModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddTag} className="p-4 space-y-4">
              <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
              <Input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="Nova tag..."
                className="h-9 text-sm"
                required
              />
              <div className="flex gap-2 justify-end">
                <Button onClick={() => setShowTagModal(false)} size="sm" variant="outline">Cancelar</Button>
                <Button type="submit" size="sm">Adicionar</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </Layout>
  )
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <Card className="p-3 flex flex-col items-center justify-center gap-1 bg-card/50 border-border">
      <div className="text-muted-foreground">{icon}</div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </Card>
  )
}
