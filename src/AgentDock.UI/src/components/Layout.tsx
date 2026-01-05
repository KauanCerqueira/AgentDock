import { ReactNode, useEffect } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import CommandPalette from './CommandPalette'
import { isElectron } from '@/utils/electron'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Log platform info se estiver no Electron
    if (isElectron() && window.electronAPI) {
      window.electronAPI.getAppInfo().then(info => {
        console.log('?? Running on Electron:', info)
      })
    }
  }, [])

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden bg-background">
        <Topbar onDrawerToggle={() => {}} />
        <main className="flex-1 overflow-y-auto no-scrollbar p-6 bg-background">
          {children}
        </main>
      </div>
      <CommandPalette />
    </div>
  )
}
