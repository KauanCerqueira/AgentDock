import { Model, ChatMessage, Task, Workspace, EngineHealth, ActivityLog, PerformanceMetric, UserSettings, PromptSnippet, AgentPreset } from '@/types'

const API_BASE = '/api'

export const api = {
  async getEngineHealth(): Promise<EngineHealth> {
    const res = await fetch(`${API_BASE}/engine/health`)
    return res.json()
  },

  async getModels(): Promise<Model[]> {
    const res = await fetch(`${API_BASE}/models`)
    return res.json()
  },

  async pullModel(id: string): Promise<void> {
    await fetch(`${API_BASE}/models/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  },

  async removeModel(id: string): Promise<void> {
    await fetch(`${API_BASE}/models/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  },

  async getChatHistory(): Promise<ChatMessage[]> {
    const res = await fetch(`${API_BASE}/chat/history`)
    return res.json()
  },

  async sendMessage(message: string): Promise<ChatMessage> {
    const res = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    return res.json()
  },

  async getTasks(): Promise<Task[]> {
    const res = await fetch(`${API_BASE}/tasks`)
    return res.json()
  },

  async createTask(name: string, type: string, instruction: string): Promise<Task> {
    const res = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, type, instruction }),
    })
    return res.json()
  },

  async getWorkspaces(): Promise<Workspace[]> {
    const res = await fetch(`${API_BASE}/workspaces`)
    return res.json()
  },

  async connectWorkspace(path: string): Promise<Workspace> {
    const res = await fetch(`${API_BASE}/workspaces/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    })
    return res.json()
  },

  // Activity Logs
  async getActivityLogs(limit = 100, category?: string, type?: string): Promise<ActivityLog[]> {
    const params = new URLSearchParams({ limit: limit.toString() })
    if (category) params.append('category', category)
    if (type) params.append('type', type)
    const res = await fetch(`${API_BASE}/logs/activity?${params}`)
    return res.json()
  },

  async getPerformanceMetrics(minutes = 60): Promise<PerformanceMetric[]> {
    const res = await fetch(`${API_BASE}/logs/performance?minutes=${minutes}`)
    return res.json()
  },

  async getLogStatistics(): Promise<Record<string, number>> {
    const res = await fetch(`${API_BASE}/logs/statistics`)
    return res.json()
  },

  // Settings
  async getSettings(): Promise<UserSettings> {
    const res = await fetch(`${API_BASE}/settings`)
    return res.json()
  },

  async updateSettings(settings: UserSettings): Promise<void> {
    await fetch(`${API_BASE}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
  },

  // Snippets
  async getSnippets(category?: string, favoriteOnly?: boolean): Promise<PromptSnippet[]> {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (favoriteOnly !== undefined) params.append('favoriteOnly', favoriteOnly.toString())
    const res = await fetch(`${API_BASE}/snippets?${params}`)
    return res.json()
  },

  async createSnippet(snippet: Omit<PromptSnippet, 'id' | 'createdAt' | 'lastUsed' | 'useCount'>): Promise<PromptSnippet> {
    const res = await fetch(`${API_BASE}/snippets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snippet),
    })
    return res.json()
  },

  async deleteSnippet(id: string): Promise<void> {
    await fetch(`${API_BASE}/snippets/${id}`, { method: 'DELETE' })
  },

  async useSnippet(id: string): Promise<void> {
    await fetch(`${API_BASE}/snippets/${id}/use`, { method: 'POST' })
  },

  // Agent Presets
  async getAgentPresets(category?: string): Promise<AgentPreset[]> {
    const params = category ? `?category=${category}` : ''
    const res = await fetch(`${API_BASE}/agentpresets${params}`)
    return res.json()
  },

  async useAgentPreset(id: string): Promise<void> {
    await fetch(`${API_BASE}/agentpresets/${id}/use`, { method: 'POST' })
  },
}
