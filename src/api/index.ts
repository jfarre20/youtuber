export { apiClient } from './client'
export { authApi } from './auth'
export { projectsApi } from './projects'
export { wsClient, useWebSocket } from './websocket'

// Export types for convenience
export type {
  ApiResponse,
  PaginatedResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
  Project,
  Clip,
  WebSocketEvent,
  ProcessingUpdate,
  ExportUpdate,
} from '@/types/api'
