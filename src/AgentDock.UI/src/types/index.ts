export interface Model {
  id: string
  name: string
  size: string
  status: 'Installed' | 'Available' | 'Downloading'
  isActive: boolean
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface Task {
  id: string
  name: string
  status: 'Queued' | 'Running' | 'Completed' | 'Failed'
  type: string
  createdAt: string
}

export interface Workspace {
  id: string
  name: string
  path: string
  status: 'Ready' | 'Indexing' | 'Indexed'
  fileCount?: number
  createdAt?: string
  sizeBytes?: number
  tags?: string[]
  groupId?: string
  files?: WorkspaceFile[]
}

export interface WorkspaceFile {
  id: string
  name: string
  path: string
  extension: string
  sizeBytes: number
  modifiedAt: string
  isDirectory: boolean
  tags: string[]
  previewUrl?: string
  indexedContent?: string
}

export interface WorkspaceGroup {
  id: string
  name: string
  description: string
  workspaceIds?: string[]
  createdAt?: string
}

export interface SystemInstruction {
  id: string
  name: string
  description: string
  content: string
  order: number
  isEnabled: boolean
  createdAt: string
  updatedAt: string
  category: 'general' | 'coding' | 'analysis' | 'custom'
}

export interface EngineHealth {
  status: string
  version: string
}

export interface SystemStats {
  cpuUsagePercent: number
  totalMemoryGb: number
  usedMemoryGb: number
  availableMemoryGb: number
  osDescription: string
  architecture: string
  processCount: number
  upTime: string
  disks: DiskInfo[]
  topProcesses: ProcessInfo[]
  gpuInfo?: GpuInfo
  networkInfo?: NetworkInfo
}

export interface DiskInfo {
  name: string
  totalSizeGb: number
  freeSpaceGb: number
  usedSpaceGb: number
  usagePercent: number
}

export interface ProcessInfo {
  name: string
  id: number
  memoryMb: number
}

export interface GpuInfo {
  name: string
  usagePercent: number
  temperatureCelsius: number
  memoryUsedGb: number
  memoryTotalGb: number
  memoryUsagePercent: number
}

export interface NetworkInfo {
  downloadSpeedMbps: number
  uploadSpeedMbps: number
  totalDownloadedGb: number
  totalUploadedGb: number
}

export interface ActivityLog {
  id: string
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'system' | 'model' | 'task' | 'workspace' | 'user'
  message: string
  details?: string
  metadata?: Record<string, any>
}

export interface PerformanceMetric {
  timestamp: string
  cpuUsage: number
  memoryUsage: number
  gpuUsage: number
  networkDownload: number
  networkUpload: number
  activeTasks: number
}

export interface UserSettings {
  theme: string
  language: string
  autoUpdate: boolean
  desktopNotifications: boolean
  notificationPreferences: Record<string, boolean>
  modelSettings: ModelPreferences
  keyBindings: Record<string, string>
}

export interface ModelPreferences {
  temperature: number
  maxTokens: number
  topP: number
  topK: number
}

export interface PromptSnippet {
  id: string
  name: string
  content: string
  category: string
  tags: string[]
  createdAt: string
  lastUsed: string
  useCount: number
  isFavorite: boolean
}

export interface AgentPreset {
  id: string
  name: string
  description: string
  icon: string
  category: string
  systemPrompt: string
  modelSettings: ModelPreferences
  tags: string[]
  isBuiltIn: boolean
  useCount: number
}

// HuggingFace Model Types
export interface HFFile {
  filename: string
  size: number
  requirements?: ModelRequirements
  compatibility?: HardwareCompatibility
}

export interface ModelRequirements {
  minRamGb: number
  recommendedRamGb: number
  minVramGb: number
  recommendedVramGb: number
  requiresGpu: boolean
  modelSize: string
  parameterCount: number
  quantization: string
  supportedPlatforms: string[]
}

export interface HardwareCompatibility {
  canRun: boolean
  level: 'Excellent' | 'Good' | 'Adequate' | 'Poor' | 'Incompatible'
  warnings: string[]
  recommendations: string[]
  ramUtilizationPercent: number
  vramUtilizationPercent: number
  performanceEstimate: string
}
