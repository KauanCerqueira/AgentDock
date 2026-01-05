import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Eye, EyeOff, GripVertical, ChevronDown, BookOpen } from 'lucide-react'
import Layout from '@/components/Layout'
import { api } from '@/api/client'
import { SystemInstruction } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function Instructions() {
  const [instructions, setInstructions] = useState<SystemInstruction[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const [formData, setFormData] = useState<{
    name: string
    description: string
    content: string
    category: 'general' | 'coding' | 'analysis' | 'custom'
  }>({
    name: '',
    description: '',
    content: '',
    category: 'general',
  })

  const categories = [
    { value: 'general', label: '📋 General' },
    { value: 'coding', label: '💻 Coding' },
    { value: 'analysis', label: '📊 Analysis' },
    { value: 'custom', label: '✨ Custom' },
  ]

  useEffect(() => {
    loadInstructions()
  }, [])

  const loadInstructions = async () => {
    try {
      setLoading(true)
      const data = await api.getInstructions()
      setInstructions(data)
    } catch (error) {
      console.error('Erro ao carregar instruções:', error)
      toast.error('Falha ao carregar instruções')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.content.trim()) {
      toast.error('Nome e conteúdo são obrigatórios')
      return
    }

    try {
      if (editingId) {
        const instruction = instructions.find(i => i.id === editingId)
        if (instruction) {
          await api.updateInstruction(editingId, {
            ...formData,
            isEnabled: instruction.isEnabled,
          })
          toast.success('Instrução atualizada')
        }
      } else {
        await api.createInstruction(formData)
        toast.success('Instrução criada')
      }
      setFormData({ name: '', description: '', content: '', category: 'general' })
      setEditingId(null)
      setShowCreateModal(false)
      loadInstructions()
    } catch (error) {
      toast.error('Erro ao salvar instrução')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta instrução?')) return

    try {
      await api.deleteInstruction(id)
      toast.success('Instrução deletada')
      loadInstructions()
    } catch (error) {
      toast.error('Erro ao deletar instrução')
    }
  }

  const handleToggle = async (id: string) => {
    try {
      await api.toggleInstruction(id)
      loadInstructions()
    } catch (error) {
      toast.error('Erro ao alternar instrução')
    }
  }

  const handleEdit = (instruction: SystemInstruction) => {
    setEditingId(instruction.id)
    setFormData({
      name: instruction.name,
      description: instruction.description,
      content: instruction.content,
      category: instruction.category,
    })
    setShowCreateModal(true)
  }

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) return

    const draggedIndex = instructions.findIndex(i => i.id === draggedId)
    const targetIndex = instructions.findIndex(i => i.id === targetId)

    const newInstructions = [...instructions]
    ;[newInstructions[draggedIndex], newInstructions[targetIndex]] = [newInstructions[targetIndex], newInstructions[draggedIndex]]

    setInstructions(newInstructions)
    setDraggedId(null)

    try {
      await api.reorderInstructions(newInstructions.map(i => i.id))
      toast.success('Ordem atualizada')
    } catch (error) {
      toast.error('Erro ao reordenar')
      loadInstructions()
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando instruções...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="h-full flex flex-col gap-6 animate-in fade-in duration-500">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">System Instructions</h1>
            <p className="text-muted-foreground">Manage system instructions for your agents.</p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null)
              setFormData({ name: '', description: '', content: '', category: 'general' })
              setShowCreateModal(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Instruction
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {instructions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No instructions yet</h3>
              <p className="text-muted-foreground mb-4">Create your first system instruction to get started.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ name: '', description: '', content: '', category: 'general' })
                  setShowCreateModal(true)
                }}
              >
                Create Instruction
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {instructions.map((instruction) => (
                <Card
                  key={instruction.id}
                  draggable
                  onDragStart={() => handleDragStart(instruction.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(instruction.id)}
                  className={`p-4 transition-all ${
                    draggedId === instruction.id ? 'opacity-50 bg-accent' : 'hover:bg-accent/50'
                  } ${!instruction.isEnabled ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Drag Handle */}
                    <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                      <GripVertical size={18} className="text-muted-foreground cursor-grab" />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">{instruction.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {categories.find(c => c.value === instruction.category)?.label}
                        </Badge>
                        {!instruction.isEnabled && (
                          <Badge variant="outline" className="text-xs">Disabled</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{instruction.description}</p>
                      
                      {expandedId === instruction.id && (
                        <div className="mt-4 p-3 bg-muted rounded-md text-sm font-mono whitespace-pre-wrap">
                          {instruction.content}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setExpandedId(expandedId === instruction.id ? null : instruction.id)}
                        title={expandedId === instruction.id ? "Collapse" : "Expand"}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedId === instruction.id ? 'rotate-180' : ''}`} />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggle(instruction.id)}
                        title={instruction.isEnabled ? "Disable" : "Enable"}
                      >
                        {instruction.isEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-muted-foreground" />}
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(instruction)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(instruction.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingId ? 'Edit Instruction' : 'New Instruction'}
              </h2>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Python Expert"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  >
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Input
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what this instruction does"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Instruction Content</label>
                <textarea
                  className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="You are a helpful AI assistant..."
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                {editingId ? 'Save Changes' : 'Create Instruction'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}