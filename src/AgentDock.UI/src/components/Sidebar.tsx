import { NavLink } from 'react-router-dom'
import { MessageSquare, CheckCircle, Folder, Settings, Command, Box, LayoutDashboard, Cpu, Activity, TrendingUp, Bot, Play, Key, BarChart3, HardDrive, ListOrdered, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { path: '/system-monitor', icon: Activity, label: 'System Monitor' },
    { path: '/process-manager', icon: Cpu, label: 'Process Manager' },
    { path: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { path: '/models', icon: Box, label: 'Browse Models' },
    { path: '/models/downloaded', icon: HardDrive, label: 'My Models' },
    { path: '/downloads', icon: ListOrdered, label: 'Downloads' },
    { path: '/chat', icon: MessageSquare, label: 'Chat' },
    { path: '/tasks', icon: CheckCircle, label: 'Tasks' },
    { path: '/workspaces', icon: Folder, label: 'Workspaces' },
    { path: '/agent-presets', icon: Bot, label: 'Agent Presets' },
    { path: '/instructions', icon: BookOpen, label: 'Instructions' },
    { path: '/api/playground', icon: Play, label: 'API Playground' },
    { path: '/api/analytics', icon: BarChart3, label: 'API Analytics' },
    { path: '/api/keys', icon: Key, label: 'API Keys' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <aside className="w-[240px] bg-[var(--sidebar-bg)] border-r border-border flex flex-col h-full">
      {/* Header Minimalista */}
      <div className="h-14 flex items-center px-4 border-b border-border">
        <div className="flex items-center gap-2 text-foreground font-medium">
          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-md flex items-center justify-center">
            <Command size={14} />
          </div>
          <span className="text-sm font-semibold tracking-tight">AgentDock</span>
          <span className="px-1.5 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground font-mono ml-auto border border-border">v1.0.0</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto no-scrollbar">
        <div className="px-2 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Platform
        </div>
        {navItems.slice(0, 4).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-all duration-200 group",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={16}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="px-2 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-4">
          Models & Chat
        </div>
        {navItems.slice(4, 8).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-all duration-200 group",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={16}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="px-2 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-4">
          Workspace
        </div>
        {navItems.slice(8, 12).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-all duration-200 group",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={16}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}

        <div className="px-2 py-2 text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-4">
          API
        </div>
        {navItems.slice(12, 16).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm transition-all duration-200 group",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  size={16}
                  className={cn(
                    "transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} 
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* System Status Footer */}
      <div className="p-2 border-t border-border">
        <div className="flex items-center gap-3 w-full px-2 py-2 rounded-md bg-card border border-border">
          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center border border-border">
            <Cpu size={14} className="text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-foreground">System Online</p>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            </div>
            <p className="text-[10px] text-muted-foreground truncate mt-0.5">Local Engine Ready</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
