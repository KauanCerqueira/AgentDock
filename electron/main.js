const { app, BrowserWindow, ipcMain, session, Menu } = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const net = require('net')
const log = require('electron-log')
const fs = require('fs')

log.transports.file.level = 'info'
log.transports.console.level = 'debug'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged
const BACKEND_PORT = 5000
const VITE_PORT = 5173

let mainWindow = null
let backendProcess = null

// Desabilitar aceleração de hardware para evitar tela preta
app.disableHardwareAcceleration()

// Configurações adicionais para compatibilidade
app.commandLine.appendSwitch('disable-gpu')
app.commandLine.appendSwitch('disable-gpu-compositing')
app.commandLine.appendSwitch('disable-software-rasterizer')

const isMac = process.platform === 'darwin'
const isWindows = process.platform === 'win32'

// Caminho do backend
function getBackendPath() {
  if (isDev) {
    return path.join(__dirname, '..', 'src', 'AgentDock.Backend')
  }
  return path.join(process.resourcesPath, 'backend')
}

// Verificar se backend está rodando em uma porta
function checkBackendReady(port, maxAttempts = 30) {
  return new Promise((resolve) => {
    let attempts = 0
    
    const check = () => {
      const socket = net.createConnection(port, 'localhost')
      
      socket.on('connect', () => {
        socket.destroy()
        log.info('✓ Backend is ready and listening on port', port)
        resolve(true)
      })
      
      socket.on('error', () => {
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(check, 500)
        } else {
          log.warn('Backend not responding after', maxAttempts * 500, 'ms')
          resolve(false)
        }
      })
    }
    
    check()
  })
}

// Iniciar processo .NET Backend
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendPath = getBackendPath()
    log.info('Starting backend from:', backendPath)

    let command, args, options;
    
    if (isDev) {
      command = 'dotnet'
      args = ['run']
      options = {
        cwd: backendPath,
        stdio: ['inherit'],
        shell: true
      }
    } else {
      // Produção: usar executável .NET
      const exeName = isWindows ? 'AgentDock.Backend.exe' : 'AgentDock.Backend'
      command = path.join(backendPath, exeName)
      args = []
      options = {
        cwd: backendPath,
        stdio: ['inherit'],
        shell: false,
        env: {
          ...process.env,
          ASPNETCORE_URLS: `http://localhost:${BACKEND_PORT}`,
          ASPNETCORE_ENVIRONMENT: 'Production'
        }
      }
    }

    log.info('Backend command:', command, args.join(' '))
    log.info('Backend cwd:', backendPath)

    try {
      backendProcess = spawn(command, args, options)

      backendProcess.on('error', (error) => {
        log.error('Failed to start backend:', error)
        reject(error)
      })

      backendProcess.on('exit', (code) => {
        log.warn('Backend process exited with code:', code)
        if (code !== 0 && code !== null) {
          backendProcess = null
          reject(new Error(`Backend exited with code ${code}`))
        }
      })

      // Aguardar backend estar pronto verificando a porta
      setTimeout(async () => {
        const isReady = await checkBackendReady(BACKEND_PORT)
        if (isReady) {
          resolve()
        } else {
          log.warn('Backend started but not responding. Attempting anyway...')
          resolve()
        }
      }, 2000)

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
    
    if (isWindows) {
      spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t'])
    } else {
      backendProcess.kill('SIGTERM')
    }
    
    backendProcess = null
  }
}

// Criar janela principal
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    backgroundColor: '#0A0A0A',
    show: true, // Mostrar imediatamente para dar feedback
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
      cache: !isDev, // Desabilitar cache em dev
      webSecurity: !isDev // Permitir CORS em dev
    },
    icon: path.join(__dirname, '..', 'resources', 'icon.ico')
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

  // Carregar aplicação
  let url;
  if (isDev) {
    url = 'http://localhost:5173' // Vite dev server
    log.info('Loading dev URL:', url)
    mainWindow.loadURL(url).catch(err => {
      log.error('Error loading URL:', err)
    })
  } else {
    // Em produção, tenta carregar via HTTP do backend
    // Se falhar, carrega os arquivos localmente
    url = `http://localhost:${BACKEND_PORT}`
    log.info('Loading production URL:', url)
    
    mainWindow.loadURL(url).catch(err => {
      log.error('Error loading from backend, trying local files...')
      // Fallback: carregar arquivo local diretamente
      const wwwrootPath = path.join(process.resourcesPath, 'backend', 'wwwroot', 'index.html')
      if (fs.existsSync(wwwrootPath)) {
        const fileUrl = `file://${wwwrootPath}`
        log.info('Loading local file:', fileUrl)
        mainWindow.loadURL(fileUrl).catch(err2 => {
          log.error('Error loading local file:', err2)
        })
      } else {
        log.error('Local index.html not found at:', wwwrootPath)
      }
    })
  }
  
  mainWindow.setMenuBarVisibility(false)

  // Mostrar janela quando pronto
  mainWindow.once('ready-to-show', () => {
    log.info('Window ready to show')
    mainWindow.show()
    mainWindow.focus()
  })
  
  // Log quando a página terminar de carregar
  mainWindow.webContents.on('did-finish-load', () => {
    log.info('✓ Page loaded successfully')
  })

  // Recarregar em caso de erro de carregamento
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    log.error('Failed to load:', errorCode, errorDescription, validatedURL)
    
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
  log.info('App ready, platform:', process.platform)
  log.info('Is packaged:', app.isPackaged)
  log.info('Resources path:', process.resourcesPath)
  
  Menu.setApplicationMenu(null)
  
  // Criar janela primeiro para dar feedback visual
  createWindow()
  
  // Em produção, tentar iniciar backend em background (não bloqueia)
  if (!isDev) {
    try {
      log.info('Starting backend...')
      // Inicia sem await - deixa rodando em background
      startBackend().then(() => {
        log.info('✓ Backend started successfully')
      }).catch((error) => {
        log.error('Failed to start backend:', error)
        log.error('Error details:', error.message, error.stack)
        
        // Não fechar o app, mostrar erro na janela
        if (mainWindow && !mainWindow.isDestroyed()) {
          const errorHtml = `
            <!DOCTYPE html>
            <html>
            <head>
              <style>
                body { 
                  background: #0A0A0A; 
                  color: #FFF; 
                  font-family: system-ui; 
                  padding: 40px; 
                  text-align: center;
                }
                .error { 
                  max-width: 600px; 
                  margin: 0 auto; 
                  background: #1A1A1A; 
                  padding: 30px; 
                  border-radius: 10px;
                  border: 1px solid #EF4444;
                }
                h1 { color: #EF4444; }
                .details { 
                  text-align: left; 
                  background: #000; 
                  padding: 15px; 
                  border-radius: 5px; 
                  margin-top: 20px;
                  font-family: monospace;
                  font-size: 12px;
                  overflow-x: auto;
                }
                .suggestion {
                  margin-top: 20px;
                  padding: 15px;
                  background: #1E3A8A;
                  border-radius: 5px;
                }
              </style>
            </head>
            <body>
              <div class="error">
                <h1>❌ Falha ao Iniciar Backend</h1>
                <p>O servidor .NET não pôde ser iniciado.</p>
                <div class="details">
                  <strong>Erro:</strong> ${error.message}
                  <br><br>
                  <strong>Logs:</strong> %APPDATA%\\AgentDock\\logs\\main.log
                </div>
                <div class="suggestion">
                  <strong>💡 Solução:</strong>
                  <br>
                  1. Instale o .NET 8 Runtime:
                  <br>
                  <a href="https://dotnet.microsoft.com/download/dotnet/8.0/runtime" style="color: #60A5FA">
                    https://dotnet.microsoft.com/download/dotnet/8.0/runtime
                  </a>
                  <br><br>
                  2. Reinicie o AgentDock
                </div>
              </div>
            </body>
            </html>
          `
          mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`)
        }
      })
    } catch (error) {
      log.error('Error in startup:', error)
    }
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
