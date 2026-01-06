#!/usr/bin/env node

/**
 * Build script para AgentDock
 * Compila .NET backend, React frontend e cria executável Electron
 */

const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const rootDir = process.cwd()
const isDev = process.env.BUILD_ENV === 'dev'

// Função para copiar arquivos recursivamente
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }
  
  const files = fs.readdirSync(src)
  files.forEach(file => {
    const srcFile = path.join(src, file)
    const destFile = path.join(dest, file)
    const stat = fs.statSync(srcFile)
    
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
    }
  })
}

class BuildManager {
  constructor() {
    this.steps = [
      { name: 'Clean', fn: () => this.clean() },
      { name: 'Build Backend', fn: () => this.buildBackend() },
      { name: 'Build UI', fn: () => this.buildUI() },
      { name: 'Copy UI to Backend', fn: () => this.copyUIToBackend() },
      { name: 'Package Electron', fn: () => this.packageElectron() }
    ]
  }

  async clean() {
    console.log('\n📦 Cleaning build artifacts...')
    const backendPath = path.join(rootDir, 'src', 'AgentDock.Backend')
    const uiPath = path.join(rootDir, 'src', 'AgentDock.UI')
    
    // Limpar backend
    const backendBinPath = path.join(backendPath, 'bin')
    const backendObjPath = path.join(backendPath, 'obj')
    
    if (fs.existsSync(backendBinPath)) {
      fs.rmSync(backendBinPath, { recursive: true, force: true })
      console.log('  ✓ Cleaned backend bin/')
    }
    
    if (fs.existsSync(backendObjPath)) {
      fs.rmSync(backendObjPath, { recursive: true, force: true })
      console.log('  ✓ Cleaned backend obj/')
    }
    
    // Limpar UI
    const uiDistPath = path.join(uiPath, 'dist')
    const uiNodeModulesPath = path.join(uiPath, 'node_modules', '.vite')
    
    if (fs.existsSync(uiDistPath)) {
      fs.rmSync(uiDistPath, { recursive: true, force: true })
      console.log('  ✓ Cleaned UI dist/')
    }
  }

  async buildBackend() {
    console.log('\n🔨 Building .NET Backend...')
    const backendPath = path.join(rootDir, 'src', 'AgentDock.Backend')
    
    if (!fs.existsSync(backendPath)) {
      throw new Error('Backend path not found')
    }

    const buildConfig = isDev ? 'Debug' : 'Release'
    return this.runCommand(
      'dotnet',
      ['publish', '-c', buildConfig, '-o', `bin/${buildConfig}/net8.0/publish`],
      backendPath
    )
  }

  async buildUI() {
    console.log('\n🎨 Building React UI...')
    const uiPath = path.join(rootDir, 'src', 'AgentDock.UI')
    
    if (!fs.existsSync(uiPath)) {
      throw new Error('UI path not found')
    }

    return this.runCommand('npm', ['run', 'build'], uiPath)
  }

  async copyUIToBackend() {
    console.log('\n📋 Copying UI files to Backend wwwroot...')
    const uiDistPath = path.join(rootDir, 'src', 'AgentDock.UI', 'dist')
    const wwwrootPath = path.join(rootDir, 'src', 'AgentDock.Backend', 'wwwroot')
    
    if (!fs.existsSync(uiDistPath)) {
      throw new Error(`UI dist path not found: ${uiDistPath}`)
    }
    
    // Limpar wwwroot se existir
    if (fs.existsSync(wwwrootPath)) {
      console.log('  Cleaning existing wwwroot...')
      fs.rmSync(wwwrootPath, { recursive: true, force: true })
    }
    
    // Copiar arquivos
    console.log(`  Copying from ${uiDistPath} to ${wwwrootPath}`)
    copyDir(uiDistPath, wwwrootPath)
    
    // Verificar se foi copiado
    if (fs.existsSync(wwwrootPath)) {
      const files = fs.readdirSync(wwwrootPath)
      console.log(`  ✓ Copied ${files.length} items to wwwroot`)
      
      if (fs.existsSync(path.join(wwwrootPath, 'index.html'))) {
        console.log('  ✓ index.html found in wwwroot')
      } else {
        throw new Error('index.html not found in wwwroot after copy!')
      }
    }
    
    // Também copiar para a pasta publish se existir (para desenvolvimento)
    const publishWwwrootPath = path.join(rootDir, 'src', 'AgentDock.Backend', 'bin', 'Release', 'net8.0', 'publish', 'wwwroot')
    if (fs.existsSync(publishWwwrootPath)) {
      console.log(`  Also updating publish wwwroot...`)
      fs.rmSync(publishWwwrootPath, { recursive: true, force: true })
      copyDir(wwwrootPath, publishWwwrootPath)
      console.log(`  ✓ Updated publish wwwroot`)
    }
  }

  async packageElectron() {
    console.log('\n📦 Packaging Electron app...')
    return this.runCommand('npx', ['electron-builder', '--publish', 'never'], rootDir)
  }

  async runCommand(command, args, cwd = rootDir) {
    return new Promise((resolve, reject) => {
      console.log(`  Running: ${command} ${args.join(' ')}`)
      
      const process = spawn(command, args, {
        cwd,
        stdio: 'inherit',
        shell: true,
        windowsHide: true
      })

      process.on('error', (error) => {
        reject(new Error(`Command failed: ${error.message}`))
      })

      process.on('exit', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`Command exited with code ${code}`))
        }
      })
    })
  }

  async run() {
    console.log('🚀 AgentDock Build Process Started')
    console.log(`Build Configuration: ${isDev ? 'Development' : 'Release'}`)
    console.log('━'.repeat(50))

    try {
      for (const step of this.steps) {
        console.log(`\n[${step.name}]`)
        await step.fn()
        console.log(`✓ ${step.name} completed`)
      }

      console.log('\n' + '━'.repeat(50))
      console.log('✅ Build completed successfully!')
      console.log('📁 Output: ./dist/')
    } catch (error) {
      console.error('\n❌ Build failed:')
      console.error(`   ${error.message}`)
      process.exit(1)
    }
  }
}

const build = new BuildManager()
build.run()
