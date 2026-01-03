import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Setup from './pages/Setup'
import Models from './pages/Models'
import Chat from './pages/Chat'
import Tasks from './pages/Tasks'
import Workspaces from './pages/Workspaces'
import SystemMonitor from './pages/SystemMonitor'
import Settings from './pages/Settings'
import Analytics from './pages/Analytics'
import Snippets from './pages/Snippets'
import AgentPresets from './pages/AgentPresets'
import APIPlayground from './pages/APIPlayground'
import APIKeys from './pages/APIKeys'
import APIAnalytics from './pages/APIAnalytics'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/system" element={<SystemMonitor />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/models" element={<Models />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/workspaces" element={<Workspaces />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/snippets" element={<Snippets />} />
      <Route path="/presets" element={<AgentPresets />} />
      <Route path="/api-playground" element={<APIPlayground />} />
      <Route path="/api-keys" element={<APIKeys />} />
      <Route path="/api-analytics" element={<APIAnalytics />} />
    </Routes>
  )
}
