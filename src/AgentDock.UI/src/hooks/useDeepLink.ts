import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface DeepLinkData {
  path: string
  query: Record<string, string>
  url: string
}

export function useDeepLink() {
  const navigate = useNavigate()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const electronAPI = (window as any).electronAPI

    if (!electronAPI) return

    const handleDeepLink = (data: DeepLinkData) => {
      console.log('Deep link navigated:', data)

      const path = data.path.startsWith('/') ? data.path : `/${data.path}`
      const query = new URLSearchParams(data.query).toString()
      const fullPath = query ? `${path}?${query}` : path

      navigate(fullPath)
    }

    // Se estiver em Electron com suporte a IPC, listar para deep links
    const ipcRenderer = (window as any).__electron_ipcRenderer || null

    if (ipcRenderer?.on) {
      ipcRenderer.on('deep-link', handleDeepLink)

      return () => {
        ipcRenderer.removeListener('deep-link', handleDeepLink)
      }
    }
  }, [navigate])
}

// Exporte para uso em componentes

