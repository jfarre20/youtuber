// Core Entity Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  preferences: UserPreferences
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  language: string
  notifications: boolean
  defaultQuality: 'low' | 'medium' | 'high'
  autoSave: boolean
  keyboardShortcuts: boolean
}

export interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  clips: string[] // clip IDs
  settings: ProjectSettings
  tags: string[]
  status: 'draft' | 'processing' | 'completed' | 'error'
  thumbnail?: string
  duration: number // total duration in seconds
  version: number
}

export interface ProjectSettings {
  outputFormat: 'mp4' | 'webm'
  quality: 'low' | 'medium' | 'high'
  resolution: string
  frameRate: number
  bitrate: string
  codec: string
}

export interface Clip {
  id: string
  name: string
  youtubeUrl: string
  startTime: number // in seconds
  endTime: number // in seconds
  duration: number // in seconds
  thumbnail?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  status: 'processing' | 'ready' | 'error'
  error?: string
  metadata?: YouTubeMetadata
  processingProgress?: number // 0-100
  fileSize?: number // in bytes
  localPath?: string // for downloaded files
}

export interface YouTubeMetadata {
  title: string
  channel: string
  channelId: string
  viewCount: number
  uploadDate: string
  duration: string
  thumbnailUrl: string
  description?: string
  tags: string[]
  category: string
}

export interface TimelineClip {
  id: string
  clipId: string
  startTime: number
  endTime: number
  position: number // order in timeline
  volume: number // 0-1
  fadeIn: number // seconds
  fadeOut: number // seconds
  effects: VideoEffect[]
  transition?: Transition
}

export interface VideoEffect {
  id: string
  type: 'brightness' | 'contrast' | 'saturation' | 'speed' | 'filter'
  value: number
  startTime: number
  endTime: number
}

export interface Transition {
  id: string
  type: 'fade' | 'wipe' | 'slide' | 'zoom'
  duration: number // seconds
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface CreateProjectRequest {
  name: string
  description?: string
  settings: ProjectSettings
  tags?: string[]
}

export interface UpdateProjectRequest {
  name?: string
  description?: string
  settings?: Partial<ProjectSettings>
  tags?: string[]
}

export interface CreateClipRequest {
  youtubeUrl: string
  startTime: number
  endTime: number
  name?: string
  tags?: string[]
}

export interface ProcessClipRequest {
  clipId: string
  quality: 'low' | 'medium' | 'high'
  format: 'mp4' | 'webm'
}

export interface ExportProjectRequest {
  projectId: string
  format: 'mp4' | 'webm'
  quality: 'low' | 'medium' | 'high'
  includeWatermark?: boolean
  outputName?: string
}

// WebSocket Types
export interface WebSocketMessage {
  type: string
  payload: any
  id?: string
  timestamp: number
}

export interface ProcessingUpdate {
  type: 'processing_update'
  clipId: string
  progress: number
  status: 'processing' | 'completed' | 'error'
  message?: string
  estimatedTimeRemaining?: number
}

export interface ExportUpdate {
  type: 'export_update'
  projectId: string
  progress: number
  status: 'processing' | 'completed' | 'error'
  downloadUrl?: string
  message?: string
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

export interface VideoPlayerProps extends BaseComponentProps {
  src: string
  currentTime: number
  duration: number
  isPlaying: boolean
  volume: number
  onTimeUpdate: (time: number) => void
  onDurationChange: (duration: number) => void
  onPlay: () => void
  onPause: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  showControls?: boolean
  autoPlay?: boolean
}

export interface TimelineProps extends BaseComponentProps {
  clips: TimelineClip[]
  currentTime: number
  duration: number
  zoom: number
  selectedClipId?: string
  onTimeChange: (time: number) => void
  onClipSelect: (clipId: string | null) => void
  onClipUpdate: (clipId: string, updates: Partial<TimelineClip>) => void
  onClipReorder: (sourceIndex: number, destinationIndex: number) => void
  snapToGrid?: boolean
  gridSize?: number
}

export interface WaveformProps extends BaseComponentProps {
  audioData: number[]
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  height?: number
  color?: string
  progressColor?: string
}

// Redux State Types
export interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  loading: {
    global: boolean
    local: Record<string, boolean>
  }
  notifications: Notification[]
  modals: Record<string, boolean>
  keyboardShortcuts: Record<string, string>
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface ProjectState {
  projects: Record<string, Project>
  currentProject: string | null
  loading: boolean
  error: string | null
  searchQuery: string
  sortBy: 'name' | 'createdAt' | 'updatedAt'
  sortOrder: 'asc' | 'desc'
}

export interface ClipState {
  clips: Record<string, Clip>
  loading: boolean
  error: string | null
  searchQuery: string
  selectedTags: string[]
  sortBy: 'name' | 'createdAt' | 'duration' | 'status'
  sortOrder: 'asc' | 'desc'
}

export interface EditorState {
  currentTime: number
  duration: number
  isPlaying: boolean
  timelineClips: TimelineClip[]
  selectedClipId: string | null
  zoom: number // 0.1 - 5.0
  volume: number // 0-1
  mute: boolean
  loop: boolean
  snapToGrid: boolean
  gridSize: number // seconds
  showWaveform: boolean
  processing: boolean
  exportProgress: number // 0-100
  history: HistoryState
}

export interface HistoryState {
  past: EditorState[]
  present: EditorState
  future: EditorState[]
  canUndo: boolean
  canRedo: boolean
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  { [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>> }[Keys]

// Event Handler Types
export type EventHandler<T = Element, E = Event> = (event: E & { currentTarget: T }) => void
export type MouseEventHandler<T = Element> = EventHandler<T, React.MouseEvent<T>>
export type KeyboardEventHandler<T = Element> = EventHandler<T, React.KeyboardEvent<T>>
export type ChangeEventHandler<T = Element> = EventHandler<T, React.ChangeEvent<T>>

// Form Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox'
  required?: boolean
  placeholder?: string
  options?: Array<{ label: string; value: string }>
  validation?: {
    min?: number
    max?: number
    pattern?: RegExp
    message?: string
  }
}

export interface FormState<T = Record<string, any>> {
  values: T
  errors: Record<string, string>
  touched: Record<string, boolean>
  isSubmitting: boolean
  isValid: boolean
}

// Error Types
export interface AppError {
  code: string
  message: string
  details?: any
  stack?: string
}

export interface ValidationError {
  field: string
  message: string
  code?: string
}

// File Upload Types
export interface FileUploadState {
  files: File[]
  uploading: boolean
  progress: Record<string, number>
  errors: Record<string, string>
  completed: string[]
}

export interface UploadProgress {
  fileId: string
  loaded: number
  total: number
  percentage: number
}

// Export Types
export interface ExportOptions {
  format: 'mp4' | 'webm'
  quality: 'low' | 'medium' | 'high'
  resolution: string
  includeAudio: boolean
  includeWatermark: boolean
  outputName: string
}

export interface ExportResult {
  success: boolean
  url?: string
  fileName?: string
  fileSize?: number
  error?: string
}
