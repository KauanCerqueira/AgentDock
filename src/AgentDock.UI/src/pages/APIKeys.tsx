import { useState, useEffect } from 'react'
import { Key, Plus, Copy, Trash2, Check, Eye, EyeOff, Loader2 } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { api } from '@/api/client'
import { toast } from 'sonner'

interface APIKey {
  id: string
  key: string
  name: string
  createdAt: string
  lastUsed?: string
  requestCount: number
  isActive: boolean
}

export default function APIKeys() {
  const [keys, setKeys] = useState<APIKey[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchKeys()
  }, [])

  const fetchKeys = async () => {
    try {
      const data = await api.getAPIKeys()
      setKeys(data)
    } catch (error) {
      console.error('Failed to fetch API keys:', error)
      toast.error('Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    try {
      const newKey = await api.createAPIKey(newKeyName || 'Unnamed Key')
      setKeys([...keys, newKey])
      setNewKeyName('')
      setShowCreate(false)
      toast.success('API key created successfully')
    } catch (error) {
      console.error('Failed to create API key:', error)
      toast.error('Failed to create API key')
    }
  }

  const handleCopy = (key: APIKey) => {
    navigator.clipboard.writeText(key.key)
    setCopiedId(key.id)
    toast.success('Key copied to clipboard')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRevoke = async (id: string) => {
    try {
      await api.revokeAPIKey(id)
      setKeys(keys.map((k) => (k.id === id ? { ...k, isActive: false } : k)))
      toast.success('API key revoked')
    } catch (error) {
      console.error('Failed to revoke API key:', error)
      toast.error('Failed to revoke API key')
    }
  }

  const toggleVisibility = (id: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const maskKey = (key: string) => {
    return `${key.substring(0, 12)}${'�'.repeat(20)}${key.substring(key.length - 4)}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'just now'
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-foreground" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">API Keys</h1>
            <p className="text-sm text-[#888]">Manage authentication keys for API access.</p>
          </div>
          <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="h-8 text-xs">
            <Plus className="w-3 h-3 mr-2" />
            Create New Key
          </Button>
        </div>

        {showCreate && (
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="text-base">Create New API Key</CardTitle>
              <CardDescription>Give your API key a descriptive name</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Development Key, Production API"
                  className="bg-[#111] border-[#333] h-9"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <Button onClick={handleCreate} size="sm" className="h-9">
                  Create
                </Button>
                <Button onClick={() => setShowCreate(false)} variant="ghost" size="sm" className="h-9">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {keys.map((key) => (
            <Card
              key={key.id}
              className={`bg-[#0A0A0A] border-[#333] ${!key.isActive ? 'opacity-50' : ''}`}
            >
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Key className="w-4 h-4 text-[#666]" />
                        <h3 className="text-sm font-medium">{key.name}</h3>
                        {key.isActive ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 text-[9px]">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px]">
                            Revoked
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#666]">
                        <span>Created {formatDate(key.createdAt)}</span>
                        {key.lastUsed && (
                          <>
                            <span>�</span>
                            <span>Last used {formatDate(key.lastUsed)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {key.isActive && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(key)}
                          className="h-7 text-xs"
                        >
                          {copiedId === key.id ? (
                            <>
                              <Check className="w-3 h-3 mr-1.5 text-green-500" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 mr-1.5" />
                              Copy
                            </>
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRevoke(key.id)}
                          className="h-7 text-xs hover:text-red-500"
                        >
                          <Trash2 className="w-3 h-3 mr-1.5" />
                          Revoke
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-lg bg-[#111] border border-[#222]">
                    <code className="flex-1 font-mono text-xs text-[#888] select-all">
                      {visibleKeys.has(key.id) ? key.key : maskKey(key.key)}
                    </code>
                    <button
                      onClick={() => toggleVisibility(key.id)}
                      className="p-1 rounded hover:bg-[#222] transition-colors"
                    >
                      {visibleKeys.has(key.id) ? (
                        <EyeOff className="w-4 h-4 text-[#666]" />
                      ) : (
                        <Eye className="w-4 h-4 text-[#666]" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#666]">Total Requests</span>
                    <span className="font-mono text-foreground">{key.requestCount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {keys.length === 0 && (
          <div className="text-center py-12">
            <Key className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <p className="text-sm text-[#666]">No API keys created yet</p>
            <Button onClick={() => setShowCreate(true)} size="sm" className="mt-4 h-8 text-xs">
              Create Your First Key
            </Button>
          </div>
        )}
      </div>
    </Layout>
  )
}
