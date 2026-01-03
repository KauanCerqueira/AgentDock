import React, { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

// Lazy load pages to catch errors per component
const Setup = lazy(() => import('@/pages/Setup'))
const Models = lazy(() => import('@/pages/Models'))
const Chat = lazy(() => import('@/pages/Chat'))
const Tasks = lazy(() => import('@/pages/Tasks'))
const Workspaces = lazy(() => import('@/pages/Workspaces'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Settings = lazy(() => import('@/pages/Settings'))
const Snippets = lazy(() => import('@/pages/Snippets'))
const AgentPresets = lazy(() => import('@/pages/AgentPresets'))
const Analytics = lazy(() => import('@/pages/Analytics'))
const APIKeys = lazy(() => import('@/pages/APIKeys'))
const APIPlayground = lazy(() => import('@/pages/APIPlayground'))
const APIAnalytics = lazy(() => import('@/pages/APIAnalytics'))
const SystemMonitor = lazy(() => import('@/pages/SystemMonitor'))
const DownloadedModels = lazy(() => import('@/pages/DownloadedModels'))

// Simple loading fallback
function LoadingFallback() {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      background: '#0A0A0A',
      color: '#888',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div>Carregando página...</div>
    </div>
  )
}

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('?? React Error Boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#0A0A0A',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
          padding: '2rem'
        }}>
          <div style={{ maxWidth: '600px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>??</div>
            <h1 style={{ marginBottom: '1rem' }}>Erro na Aplicação</h1>
            <div style={{ 
              color: '#888', 
              fontSize: '14px',
              background: '#111',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              textAlign: 'left',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              <pre>{this.state.error?.toString()}</pre>
              <pre>{this.state.error?.stack}</pre>
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#fff',
                color: '#000',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Recarregar Aplicação
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/setup" element={<Setup />} />
              <Route path="/models" element={<Models />} />
              <Route path="/models/downloaded" element={<DownloadedModels />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat-new" element={<Chat />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/workspaces" element={<Workspaces />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/snippets" element={<Snippets />} />
              <Route path="/agent-presets" element={<AgentPresets />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/api/keys" element={<APIKeys />} />
              <Route path="/api/playground" element={<APIPlayground />} />
              <Route path="/api/analytics" element={<APIAnalytics />} />
              <Route path="/system-monitor" element={<SystemMonitor />} />
            </Routes>
          </Suspense>
          <Toaster 
            position="bottom-right" 
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
        </div>
      </HashRouter>
    </ErrorBoundary>
  )
}

export default App
