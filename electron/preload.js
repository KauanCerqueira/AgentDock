const { contextBridge, ipcRenderer } = require('electron')

// Expor API segura para o frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Cache management
  clearCache: () => ipcRenderer.invoke('clear-cache'),
  
  // Window controls
  reload: () => ipcRenderer.invoke('reload'),
  toggleDevTools: () => ipcRenderer.invoke('toggle-devtools'),
  minimize: () => ipcRenderer.invoke('window-minimize'),
  toggleMaximize: () => ipcRenderer.invoke('window-toggle-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // App info
  getAppInfo: () => ipcRenderer.invoke('get-app-info'),
  getBackendHealth: () => ipcRenderer.invoke('get-backend-health'),
  
  // Platform info
  platform: process.platform,
  
  // Versions
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  }
})

console.log('Electron preload script loaded')
console.log('Platform:', process.platform)
console.log('Electron:', process.versions.electron)
