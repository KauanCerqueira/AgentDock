import { useState, useEffect } from 'react'
import { Bell, Sun, Moon } from 'lucide-react'
import { api } from '@/api/client'
import { EngineHealth } from '@/types'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TopbarProps {
  onDrawerToggle: () => void
}

export default function Topbar({ }: TopbarProps) {
  const [health, setHealth] = useState<EngineHealth | null>(null)
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    api.getEngineHealth().then(setHealth).catch(console.error)
    
    // Initialize theme
    if (document.documentElement.classList.contains('dark')) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [])

  const isOnline = health?.status === 'online'

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    toast.success(`Theme changed to ${newTheme} mode`)
  }

  return (
    <header className="h-14 bg-card/50 backdrop-blur-sm border-b border-border flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="text-primary text-lg font-semibold">
            Workspace
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Badge 
          variant={isOnline ? "success" : "destructive"}
          className="gap-1.5"
        >
          <div className={cn(
            "w-1.5 h-1.5 rounded-full",
            isOnline ? "bg-green-500 animate-pulse" : "bg-red-500"
          )} />
          <span className="text-xs font-medium">
            {health?.status || 'Checking...'}
          </span>
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
          {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        
        <Button variant="ghost" size="icon" className="h-9 w-9 relative" onClick={() => toast.info('No new notifications')}>
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
        </Button>
      </div>
    </header>
  )
}
