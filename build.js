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

class BuildManager {
  constructor() {
    this.steps = [
      { name: 'Clean', fn: () => this.clean() },
      { name: 'Build Backend', fn: () => this.buildBackend() },
      { name: 'Build UI', fn: () => this.buildUI() },
      { name: 'Package Electron', fn: () => this.packageElectron() }
    ]
  }

  async clean() {
    console.log('\n📦 Cleaning build artifacts...')
    return this.runCommand('npm', ['run', 'clean'], rootDir)
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
