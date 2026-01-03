import { useState, useEffect } from 'react'
import { Clipboard, Star, Plus, Trash2, Copy, Check } from 'lucide-react'
import Layout from '@/components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { api } from '@/api/client'
import { PromptSnippet } from '@/types'

export default function Snippets() {
  const [snippets, setSnippets] = useState<PromptSnippet[]>([])
  const [filter, setFilter] = useState<'all' | 'favorites'>('all')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [newSnippet, setNewSnippet] = useState({ name: '', content: '', category: 'general', tags: '' })

  useEffect(() => {
    loadSnippets()
  }, [filter])

  const loadSnippets = async () => {
    const data = await api.getSnippets(undefined, filter === 'favorites' ? true : undefined)
    setSnippets(data)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await api.createSnippet({
      ...newSnippet,
      tags: newSnippet.tags.split(',').map((t) => t.trim()).filter(Boolean),
      isFavorite: false,
    })
    setNewSnippet({ name: '', content: '', category: 'general', tags: '' })
    setShowCreate(false)
    loadSnippets()
  }

  const handleCopy = async (snippet: PromptSnippet) => {
    await navigator.clipboard.writeText(snippet.content)
    await api.useSnippet(snippet.id)
    setCopiedId(snippet.id)
    setTimeout(() => setCopiedId(null), 2000)
    loadSnippets()
  }

  const handleDelete = async (id: string) => {
    await api.deleteSnippet(id)
    loadSnippets()
  }

  const filteredSnippets = snippets.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-end justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Prompt Snippets</h1>
            <p className="text-sm text-[#888]">Save and reuse your favorite prompts.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setFilter('all')} className={`h-8 ${filter === 'all' ? 'bg-[#222] border-[#666]' : 'bg-[#0A0A0A] border-[#333]'}`}>
              All
            </Button>
            <Button variant="outline" size="sm" onClick={() => setFilter('favorites')} className={`h-8 ${filter === 'favorites' ? 'bg-[#222] border-[#666]' : 'bg-[#0A0A0A] border-[#333]'}`}>
              <Star className="w-3 h-3 mr-1.5" />
              Favorites
            </Button>
            <Button onClick={() => setShowCreate(!showCreate)} size="sm" className="h-8 text-xs">
              <Plus className="w-3 h-3 mr-2" />
              New Snippet
            </Button>
          </div>
        </div>

        <Input
          placeholder="Search snippets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0A0A0A] border-[#333] h-9"
        />

        {showCreate && (
          <Card className="bg-[#0A0A0A] border-[#333]">
            <CardHeader>
              <CardTitle className="text-base">Create New Snippet</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#888]">Name</label>
                    <Input
                      value={newSnippet.name}
                      onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
                      placeholder="e.g. Code Review Template"
                      className="bg-[#111] border-[#333] h-9"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#888]">Category</label>
                    <select
                      value={newSnippet.category}
                      onChange={(e) => setNewSnippet({ ...newSnippet, category: e.target.value })}
                      className="w-full bg-[#111] border border-[#333] rounded-md h-9 px-3 text-sm"
                    >
                      <option value="general">General</option>
                      <option value="code">Code</option>
                      <option value="documentation">Documentation</option>
                      <option value="debugging">Debugging</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#888]">Content</label>
                  <textarea
                    value={newSnippet.content}
                    onChange={(e) => setNewSnippet({ ...newSnippet, content: e.target.value })}
                    placeholder="Enter your prompt template..."
                    className="w-full bg-[#111] border border-[#333] rounded-md p-3 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-1 focus:ring-[#666]"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#888]">Tags (comma separated)</label>
                  <Input
                    value={newSnippet.tags}
                    onChange={(e) => setNewSnippet({ ...newSnippet, tags: e.target.value })}
                    placeholder="e.g. review, quality, best-practices"
                    className="bg-[#111] border-[#333] h-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" size="sm" className="h-8 text-xs">
                    Create Snippet
                  </Button>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowCreate(false)} className="h-8 text-xs">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {filteredSnippets.map((snippet) => (
            <Card key={snippet.id} className="bg-[#0A0A0A] border-[#333] hover:border-[#444] transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-sm">{snippet.name}</CardTitle>
                      {snippet.isFavorite && <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-[#111] border-[#333] text-[10px] font-normal capitalize">
                        {snippet.category}
                      </Badge>
                      <span className="text-[10px] text-[#666]">Used {snippet.useCount} times</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopy(snippet)}
                      className="h-7 w-7 p-0"
                    >
                      {copiedId === snippet.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(snippet.id)}
                      className="h-7 w-7 p-0 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-[#111] border border-[#222] rounded-md p-3 text-xs text-[#888] font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                  {snippet.content}
                </div>
                {snippet.tags.length > 0 && (
                  <div className="flex gap-1 mt-3">
                    {snippet.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-[#111] border-[#333] text-[9px] font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSnippets.length === 0 && (
          <div className="text-center py-12">
            <Clipboard className="w-12 h-12 text-[#333] mx-auto mb-4" />
            <p className="text-sm text-[#666]">No snippets found matching "{search}"</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
