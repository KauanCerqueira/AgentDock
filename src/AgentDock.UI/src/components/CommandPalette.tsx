import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface CommandItem {
  id: string
  label: string
  description?: string
  action: () => void
  category: string
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const commands: CommandItem[] = [
    // Navigation
    { id: 'nav-dashboard', label: 'Go to Dashboard', category: 'Navigation', action: () => navigate('/') },
    { id: 'nav-system', label: 'Go to System Monitor', category: 'Navigation', action: () => navigate('/system') },
    { id: 'nav-analytics', label: 'Go to Analytics', category: 'Navigation', action: () => navigate('/analytics') },
    { id: 'nav-models', label: 'Go to Models', category: 'Navigation', action: () => navigate('/models') },
    { id: 'nav-chat', label: 'Go to Chat', category: 'Navigation', action: () => navigate('/chat') },
    { id: 'nav-tasks', label: 'Go to Tasks', category: 'Navigation', action: () => navigate('/tasks') },
    { id: 'nav-workspaces', label: 'Go to Workspaces', category: 'Navigation', action: () => navigate('/workspaces') },
    { id: 'nav-presets', label: 'Go to Agent Presets', category: 'Navigation', action: () => navigate('/presets') },
    { id: 'nav-snippets', label: 'Go to Snippets', category: 'Navigation', action: () => navigate('/snippets') },
    { id: 'nav-settings', label: 'Go to Settings', category: 'Navigation', action: () => navigate('/settings') },
  ]

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  )

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  const handleSelect = (action: () => void) => {
    action()
    setIsOpen(false)
    setSearch('')
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] pointer-events-none">
        <div className="w-full max-w-2xl mx-4 bg-[#0A0A0A] border border-[#333] rounded-lg shadow-2xl pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-200">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-[#222]">
            <Search className="w-5 h-5 text-[#666]" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-[#666] outline-none"
              autoFocus
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-[#222] transition-colors"
            >
              <X className="w-4 h-4 text-[#666]" />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {Object.keys(groupedCommands).length === 0 ? (
              <div className="p-8 text-center text-sm text-[#666]">No results found for "{search}"</div>
            ) : (
              Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <div className="px-2 py-1.5 text-[10px] font-medium text-[#666] uppercase tracking-wider">
                    {category}
                  </div>
                  <div className="space-y-0.5">
                    {items.map((cmd) => (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd.action)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-left hover:bg-[#111] transition-colors group"
                      >
                        <span className="text-foreground group-hover:text-white transition-colors">
                          {cmd.label}
                        </span>
                        {cmd.description && (
                          <span className="text-xs text-[#666]">{cmd.description}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-[#222] text-[10px] text-[#666]">
            <div className="flex items-center gap-4">
              <span>?? to navigate</span>
              <span>? to select</span>
              <span>esc to close</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#111] border border-[#333] font-mono">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[#111] border border-[#333] font-mono">K</kbd>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
