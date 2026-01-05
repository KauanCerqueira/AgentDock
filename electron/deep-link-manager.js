const { app, ipcMain } = require('electron')
const log = require('electron-log')

class DeepLinkManager {
  constructor(mainWindow = null) {
    this.mainWindow = mainWindow
    this.pendingUrl = null
    this.protocol = 'agentdock'
    
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(this.protocol, process.execPath, [process.argv[1]])
      }
    } else {
      app.setAsDefaultProtocolClient(this.protocol)
    }
  }

  setMainWindow(mainWindow) {
    this.mainWindow = mainWindow
    if (this.pendingUrl) {
      this.handleDeepLink(this.pendingUrl)
      this.pendingUrl = null
    }
  }

  handleDeepLink(url) {
    log.info('Deep link received:', url)
    
    if (!this.mainWindow) {
      this.pendingUrl = url
      return
    }

    if (!this.mainWindow.isDestroyed()) {
      this.mainWindow.show()
      this.mainWindow.focus()
    }

    const parsedUrl = new URL(url)
    const path = parsedUrl.pathname
    const query = Object.fromEntries(parsedUrl.searchParams)

    ipcMain.emit('deep-link', {
      path,
      query,
      url
    })

    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('deep-link', {
        path,
        query,
        url
      })
    }
  }

  registerHandlers() {
    if (process.platform === 'win32') {
      app.on('second-instance', (event, commandLine) => {
        const url = commandLine.find(arg => arg.startsWith(this.protocol + '://'))
        if (url) {
          this.handleDeepLink(url)
        }
      })
    }

    app.on('open-url', (event, url) => {
      event.preventDefault()
      this.handleDeepLink(url)
    })

    ipcMain.handle('get-pending-deep-link', () => {
      return this.pendingUrl
    })
  }

  getDeepLinkRoute(url) {
    const parsed = new URL(url)
    const path = parsed.pathname.replace(/^\/+/, '')
    const segments = path.split('/').filter(Boolean)
    
    return {
      segments,
      query: Object.fromEntries(parsed.searchParams)
    }
  }
}

module.exports = { DeepLinkManager }
