// Type definitions for Electron API exposed via preload
export interface ElectronAPI {
  clearCache: () => Promise<{ success: boolean; error?: string }>
  reload: () => void
  toggleDevTools: () => void
  getAppInfo: () => Promise<AppInfo>
  getBackendHealth: () => Promise<{ status: 'healthy' | 'unhealthy' | 'offline' | 'timeout' | 'error'; message?: string }>
  minimize: () => Promise<void>
  toggleMaximize: () => Promise<void>
  close: () => Promise<void>
  platform: string
  versions: {
    electron: string
    chrome: string
    node: string
  }
}

export interface AppInfo {
  version: string
  isDev: boolean
  platform: string
  electron: string
  chrome: string
  node: string
  backendUrl?: string
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI
  }
}

// Detector se está rodando no Electron
export const isElectron = (): boolean => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined
}

// Obter informações do app
export const getAppInfo = async (): Promise<AppInfo | null> => {
  if (isElectron() && window.electronAPI) {
    return await window.electronAPI.getAppInfo()
  }
  return null
}

// Limpar cache
export const clearCache = async (): Promise<void> => {
  if (isElectron() && window.electronAPI) {
    await window.electronAPI.clearCache()
    window.electronAPI.reload()
  } else {
    window.location.reload()
  }
}

// Window controls (Electron only)
export const minimizeWindow = async (): Promise<void> => {
  if (isElectron() && window.electronAPI) {
    await window.electronAPI.minimize()
  }
}

export const toggleMaximizeWindow = async (): Promise<void> => {
  if (isElectron() && window.electronAPI) {
    await window.electronAPI.toggleMaximize()
  }
}

export const closeWindow = async (): Promise<void> => {
  if (isElectron() && window.electronAPI) {
    await window.electronAPI.close()
  }
}

// Verificar saúde do backend
export const checkBackendHealth = async (): Promise<boolean> => {
  if (isElectron() && window.electronAPI) {
    const health = await window.electronAPI.getBackendHealth()
    return health.status === 'healthy'
  }
  
  try {
    const response = await fetch('/api/system/health')
    return response.ok
  } catch {
    return false
  }
}

// API Client para requisições HTTP
export class APIClient {
  private baseURL: string

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    headers: HeadersInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      }

      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(url, options)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentLength = response.headers.get('content-length')
      if (contentLength === '0' || !contentLength) {
        return {} as T
      }

      return response.json() as Promise<T>
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error)
      throw error
    }
  }

  get<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, headers)
  }

  post<T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> {
    return this.request<T>('POST', endpoint, body, headers)
  }

  put<T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> {
    return this.request<T>('PUT', endpoint, body, headers)
  }

  delete<T>(endpoint: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, headers)
  }

  patch<T>(endpoint: string, body?: any, headers?: HeadersInit): Promise<T> {
    return this.request<T>('PATCH', endpoint, body, headers)
  }
}

export const apiClient = new APIClient('/api')
