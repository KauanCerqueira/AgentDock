import { Model, ChatMessage, Task, Workspace, WorkspaceFile, WorkspaceGroup, SystemInstruction, EngineHealth, ActivityLog, PerformanceMetric, UserSettings, PromptSnippet, AgentPreset } from '@/types'

interface DownloadedModel {
  filename: string
  path: string
  sizeMb: number
  sizeGb: number
  requirements: {
    minRamGb: number
    recommendedRamGb: number
    modelSize: string
    quantization: string
  }
  compatibility: {
    canRun: boolean
    level: string
    performanceEstimate: string
  }
}

interface SendChatPayload {
  model: string
  messages: ChatMessage[]
  stream?: boolean
  options?: {
    temperature?: number
    numPredict?: number
    topP?: number
    topK?: number
    repeatPenalty?: number
  }
}

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

  async getDownloadedModels(): Promise<DownloadedModel[]> {
    const res = await fetch(`${API_BASE}/models/downloaded`)
    return res.json()
  },

  async loadModel(filename: string): Promise<void> {
    await fetch(`${API_BASE}/models/load-model`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename }),
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

  async sendChatWithModel(payload: SendChatPayload): Promise<{ message?: ChatMessage; content?: string }> {
    const res = await fetch(`${API_BASE}/chat/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
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

  // Workspaces
  async getWorkspaces(): Promise<Workspace[]> {
    const res = await fetch(`${API_BASE}/workspaces`)
    return res.json()
  },

  async getWorkspace(id: string): Promise<Workspace> {
    const res = await fetch(`${API_BASE}/workspaces/${id}`)
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

  async getWorkspaceFiles(workspaceId: string): Promise<WorkspaceFile[]> {
    const res = await fetch(`${API_BASE}/workspaces/${workspaceId}/files`)
    return res.json()
  },

  async searchFiles(workspaceId: string, query: string): Promise<WorkspaceFile[]> {
    const res = await fetch(`${API_BASE}/workspaces/${workspaceId}/files/search?query=${encodeURIComponent(query)}`)
    return res.json()
  },

  async getWorkspaceStats(workspaceId: string): Promise<any> {
    const res = await fetch(`${API_BASE}/workspaces/${workspaceId}/stats`)
    return res.json()
  },

  async addFileTag(workspaceId: string, fileId: string, tag: string): Promise<void> {
    await fetch(`${API_BASE}/workspaces/${workspaceId}/files/${fileId}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag }),
    })
  },

  async removeFileTag(workspaceId: string, fileId: string, tag: string): Promise<void> {
    await fetch(`${API_BASE}/workspaces/${workspaceId}/files/${fileId}/tags/${encodeURIComponent(tag)}`, {
      method: 'DELETE',
    })
  },

  async getWorkspaceGroups(): Promise<WorkspaceGroup[]> {
    const res = await fetch(`${API_BASE}/workspaces/groups`)
    return res.json()
  },

  async createWorkspaceGroup(data: { name: string; description: string }): Promise<WorkspaceGroup> {
    const res = await fetch(`${API_BASE}/workspaces/groups`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async addWorkspaceToGroup(groupId: string, workspaceId: string): Promise<void> {
    await fetch(`${API_BASE}/workspaces/groups/${groupId}/workspaces/${workspaceId}`, {
      method: 'POST',
    })
  },

  async deleteWorkspace(workspaceId: string): Promise<void> {
    await fetch(`${API_BASE}/workspaces/${workspaceId}`, {
      method: 'DELETE',
    })
  },

  // System Instructions
  async getInstructions(): Promise<SystemInstruction[]> {
    const res = await fetch(`${API_BASE}/instructions`)
    return res.json()
  },

  async getInstruction(id: string): Promise<SystemInstruction> {
    const res = await fetch(`${API_BASE}/instructions/${id}`)
    return res.json()
  },

  async createInstruction(data: { name: string; description: string; content: string; category: string }): Promise<SystemInstruction> {
    const res = await fetch(`${API_BASE}/instructions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async updateInstruction(id: string, data: { name: string; description: string; content: string; category: string; isEnabled: boolean }): Promise<SystemInstruction> {
    const res = await fetch(`${API_BASE}/instructions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async deleteInstruction(id: string): Promise<void> {
    await fetch(`${API_BASE}/instructions/${id}`, {
      method: 'DELETE',
    })
  },

  async toggleInstruction(id: string): Promise<SystemInstruction> {
    const res = await fetch(`${API_BASE}/instructions/${id}/toggle`, {
      method: 'POST',
    })
    return res.json()
  },

  async reorderInstructions(instructionIds: string[]): Promise<void> {
    await fetch(`${API_BASE}/instructions/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ instructionIds }),
    })
  },

  // API Keys
  async getAPIKeys(): Promise<any[]> {
    const res = await fetch(`${API_BASE}/apikeys`)
    return res.json()
  },

  async createAPIKey(name: string): Promise<any> {
    const res = await fetch(`${API_BASE}/apikeys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    return res.json()
  },

  async revokeAPIKey(id: string): Promise<void> {
    await fetch(`${API_BASE}/apikeys/${id}`, {
      method: 'DELETE',
    })
  },

  // Analytics
  async getAnalytics(timeRange: string = '24h'): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics?timeRange=${timeRange}`)
    return res.json()
  }
}