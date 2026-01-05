const { app, BrowserWindow, ipcMain, session, Menu } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const net = require('net')
const log = require('electron-log')

log.transports.file.level = 'info'
log.transports.console.level = 'debug'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
const BACKEND_PORT = 5000
const VITE_PORT = 5173

let mainWindow = null
let backendProcess = null

// Caminho do backend
function getBackendPath() {
  if (isDev) {
    return path.join(__dirname, '..', 'src', 'AgentDock.Backend')
  }
  return path.join(process.resourcesPath, 'backend')
}

// Iniciar processo .NET Backend
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = getBackendPath()
    log.info('Starting backend from:', backendPath)

    const command = isDev ? 'dotnet' : './AgentDock.Backend'
    const args = isDev ? ['run'] : []
    const cwd = backendPath

    try {
      backendProcess = spawn(command, args, {
        cwd,
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: isDev
      })

      backendProcess.stdout.on('data', (data) => {
        log.info('[Backend]', data.toString())
        
        // Detectar quando backend estiver pronto
        if (data.toString().includes('Application started')) {
          log.info('? Backend ready!')
          resolve()
        }
      })

      backendProcess.stderr.on('data', (data) => {
        log.error('[Backend Error]', data.toString())
      })

      backendProcess.on('error', (error) => {
        log.error('Failed to start backend:', error)
        reject(error)
      })

      backendProcess.on('exit', (code) => {
        log.warn('Backend process exited with code:', code)
        backendProcess = null
      })

      // Timeout de 10s caso n�o detecte "Application started"
      setTimeout(() => {
        if (!backendProcess || backendProcess.exitCode !== null) {
          reject(new Error('Backend failed to start'))
        } else {
          log.info('Backend started (timeout fallback)')
          resolve()
        }
      }, 10000)

    } catch (error) {
      log.error('Error spawning backend:', error)
      reject(error)
    }
  })
}

// Parar processo backend
function stopBackend() {
  if (backendProcess && !backendProcess.killed) {
    log.info('Stopping backend process...')
    
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t'])
    } else {
      backendProcess.kill('SIGTERM')
    }
    
    backendProcess = null
  }
}

const isMac = process.platform === 'darwin'
const isWindows = process.platform === 'win32'

// Criar janela principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0A0A0A',
    show: false, // Mostrar apenas quando pronto
    frame: false,
    titleBarStyle: isMac ? 'hiddenInset' : 'hidden',
    titleBarOverlay: isMac
      ? {
          color: '#0A0A0A',
          symbolColor: '#FFFFFF',
          height: 38
        }
      : undefined,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
      cache: !isDev // Desabilitar cache em dev
    },
    icon: path.join(__dirname, 'assets', 'icon.png')
  })

  // Configurar sess�o (cache control)
  if (isDev) {
    // Limpar cache em desenvolvimento
    session.defaultSession.clearCache().then(() => {
      log.info('? Cache cleared (dev mode)')
    })

    // Desabilitar cache HTTP
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
      details.requestHeaders['Cache-Control'] = 'no-cache, no-store, must-revalidate'
      details.requestHeaders['Pragma'] = 'no-cache'
      details.requestHeaders['Expires'] = '0'
      callback({ requestHeaders: details.requestHeaders })
    })

    session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
      if (details.responseHeaders) {
        details.responseHeaders['Cache-Control'] = ['no-cache, no-store, must-revalidate']
        details.responseHeaders['Pragma'] = ['no-cache']
        details.responseHeaders['Expires'] = ['0']
      }
      callback({ responseHeaders: details.responseHeaders })
    })
  }

  // Carregar aplica��o
  const url = isDev 
    ? 'http://localhost:5173' // Vite dev server
    : `file://${path.join(__dirname, '../src/AgentDock.Backend/wwwroot/index.html')}`

  log.info('Loading URL:', url)
  mainWindow.loadURL(url)
  mainWindow.setMenuBarVisibility(false)

  // Mostrar janela quando pronto
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  // Recarregar em caso de erro de carregamento
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    log.error('Failed to load:', errorCode, errorDescription)
    
    if (isDev && errorCode === -102) { // ERR_CONNECTION_REFUSED
      setTimeout(() => {
        log.info('Retrying to load...')
        mainWindow.reload()
      }, 2000)
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// IPC Handlers
ipcMain.handle('clear-cache', async () => {
  await session.defaultSession.clearCache()
  log.info('Cache cleared by user')
  return 'Cache cleared successfully'
})

ipcMain.handle('reload', () => {
  if (mainWindow) {
    mainWindow.reload()
  }
})

ipcMain.handle('toggle-devtools', () => {
  if (mainWindow) {
    mainWindow.webContents.toggleDevTools()
  }
})

ipcMain.handle('window-minimize', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.minimize()
  }
})

ipcMain.handle('window-toggle-maximize', () => {
  if (!mainWindow || mainWindow.isDestroyed()) return
  if (mainWindow.isMaximized()) {
    mainWindow.restore()
  } else {
    mainWindow.maximize()
  }
})

ipcMain.handle('window-close', () => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.close()
  }
})

ipcMain.handle('get-app-info', () => {
  return {
    version: app.getVersion(),
    isDev,
    platform: process.platform,
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
  }
})

// App lifecycle
app.on('ready', async () => {
  log.info('App ready, starting backend...')
  Menu.setApplicationMenu(null)
  
  try {
    await startBackend()
    log.info('Backend started successfully')
    
    // Aguardar um pouco mais para garantir que o backend est� 100% pronto
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    createWindow()
  } catch (error) {
    log.error('Failed to start backend:', error)
    app.quit()
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null && backendProcess !== null) {
    createWindow()
  }
})

app.on('before-quit', () => {
  log.info('App quitting, stopping backend...')
  stopBackend()
})

app.on('will-quit', (event) => {
  if (backendProcess && !backendProcess.killed) {
    event.preventDefault()
    stopBackend()
    setTimeout(() => app.quit(), 1000)
  }
})

// Tratamento de erros globais
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error)
})

process.on('unhandledRejection', (reason) => {
  log.error('Unhandled rejection:', reason)
})
