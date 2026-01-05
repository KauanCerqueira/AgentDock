#!/usr/bin/env node

/**
 * Script para desenvolvimento com Electron
 * Inicia backend .NET, frontend React (Vite) e Electron simultaneamente
 */

const { spawn } = require('child_process')
const path = require('path')

const isDev = true
const rootDir = path.join(__dirname, '..')

console.log('?? Starting AgentDock in development mode...\n')

// 1. Iniciar Backend .NET
console.log('1??  Starting .NET Backend...')
const backend = spawn('dotnet', ['watch', 'run'], {
  cwd: path.join(rootDir, 'src', 'AgentDock.Backend'),
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, ASPNETCORE_ENVIRONMENT: 'Development' }
})

// 2. Iniciar Frontend React (Vite)
console.log('2??  Starting React Frontend (Vite)...')
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(rootDir, 'src', 'AgentDock.UI'),
  stdio: 'inherit',
  shell: true
})

// 3. Aguardar e iniciar Electron
setTimeout(() => {
  console.log('3??  Starting Electron...')
  const electron = spawn('npx', ['electron', '.', '--no-cache'], {
    cwd: rootDir,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, NODE_ENV: 'development' }
  })

  electron.on('exit', () => {
    console.log('\n?? Electron closed, stopping all processes...')
    backend.kill()
    frontend.kill()
    process.exit(0)
  })
}, 5000) // Aguarda 5s para backend/frontend iniciarem

// Tratamento de sinais
process.on('SIGINT', () => {
  console.log('\n?? Stopping all processes...')
  backend.kill()
  frontend.kill()
  process.exit(0)
})

process.on('SIGTERM', () => {
  backend.kill()
  frontend.kill()
  process.exit(0)
})
