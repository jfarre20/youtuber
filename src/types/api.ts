import { ApiResponse, PaginatedResponse, CreateProjectRequest, UpdateProjectRequest, CreateClipRequest, ProcessClipRequest, ExportProjectRequest, Project, Clip, User, YouTubeMetadata } from './index'

// Project API Types
export interface GetProjectsParams {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  sortBy?: 'name' | 'createdAt' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

export interface GetProjectsResponse extends PaginatedResponse<Project> {}

export interface CreateProjectResponse extends ApiResponse<Project> {}

export interface UpdateProjectResponse extends ApiResponse<Project> {}

export interface DeleteProjectResponse extends ApiResponse<null> {}

// Clip API Types
export interface GetClipsParams {
  page?: number
  limit?: number
  search?: string
  tags?: string[]
  status?: 'processing' | 'ready' | 'error'
  sortBy?: 'name' | 'createdAt' | 'duration' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface GetClipsResponse extends PaginatedResponse<Clip> {}

export interface CreateClipResponse extends ApiResponse<Clip> {}

export interface UpdateClipResponse extends ApiResponse<Clip> {}

export interface DeleteClipResponse extends ApiResponse<null> {}

export interface ProcessClipResponse extends ApiResponse<{ jobId: string }> {}

export interface GetClipMetadataResponse extends ApiResponse<YouTubeMetadata> {}

// User API Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse extends ApiResponse<{
  user: User
  token: string
  refreshToken: string
}> {}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface RegisterResponse extends ApiResponse<{
  user: User
  token: string
  refreshToken: string
}> {}

export interface RefreshTokenResponse extends ApiResponse<{
  token: string
  refreshToken: string
}> {}

export interface UpdateProfileRequest {
  name?: string
  preferences?: Partial<User['preferences']>
}

export interface UpdateProfileResponse extends ApiResponse<User> {}

// Export API Types
export interface ExportProjectResponse extends ApiResponse<{
  exportId: string
  downloadUrl?: string
}> {}

export interface GetExportStatusResponse extends ApiResponse<{
  exportId: string
  status: 'processing' | 'completed' | 'error'
  progress: number
  downloadUrl?: string
  error?: string
}> {}

// File Upload Types
export interface UploadFileRequest {
  file: File
  type: 'clip' | 'thumbnail' | 'asset'
  metadata?: Record<string, any>
}

export interface UploadFileResponse extends ApiResponse<{
  fileId: string
  url: string
  size: number
  mimeType: string
}> {}

// Analytics API Types
export interface GetAnalyticsResponse extends ApiResponse<{
  totalProjects: number
  totalClips: number
  totalProcessingTime: number
  storageUsed: number
  recentActivity: Array<{
    id: string
    type: 'project_created' | 'clip_processed' | 'project_exported'
    description: string
    timestamp: string
  }>
}> {}

// Error Response Types
export interface ErrorResponse {
  success: false
  error: string
  code?: string
  details?: any
  timestamp: string
}

// WebSocket Events
export type WebSocketEventType =
  | 'processing_update'
  | 'export_update'
  | 'clip_ready'
  | 'project_exported'
  | 'error'
  | 'notification'
  | 'ping'
  | 'join_project'
  | 'leave_project'
  | 'project_update'
  | 'cursor_position'

export interface WebSocketEvent {
  type: WebSocketEventType
  payload: any
  userId: string
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

// API Client Types
export interface ApiClientConfig {
  baseURL: string
  timeout: number
  retries: number
  headers: Record<string, string>
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  url: string
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
}

export interface RetryConfig {
  attempts: number
  delay: number
  backoff: 'linear' | 'exponential'
}

// Cache Types
export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  ttl: number // time to live in milliseconds
}

export interface CacheConfig {
  defaultTTL: number
  maxSize: number
  storage: 'memory' | 'localStorage' | 'indexedDB'
}

// Rate Limiting Types
export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  blockDuration: number
}

export interface RateLimitState {
  requests: number
  windowStart: number
  blocked: boolean
  blockUntil?: number
}
