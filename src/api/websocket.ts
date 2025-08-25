import { WebSocketEvent, ProcessingUpdate, ExportUpdate, WebSocketEventType } from '@/types/api'

type EventHandler<T = any> = (data: T) => void

interface WebSocketClientOptions {
  url?: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private heartbeatInterval: number
  private reconnectAttempts = 0
  private heartbeatTimer: NodeJS.Timeout | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private eventHandlers = new Map<WebSocketEventType, EventHandler[]>()
  private isConnecting = false
  private userId?: string

  constructor(options: WebSocketClientOptions = {}) {
    this.url = options.url || 'ws://localhost:3001'
    this.reconnectInterval = options.reconnectInterval || 5000
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5
    this.heartbeatInterval = options.heartbeatInterval || 30000
  }

  // Connect to WebSocket server
  connect(userId?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve()
        return
      }

      if (this.isConnecting) {
        reject(new Error('Connection attempt already in progress'))
        return
      }

      this.isConnecting = true
      this.userId = userId

      try {
        const wsUrl = userId ? `${this.url}?userId=${userId}` : this.url
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = () => {
          console.log('WebSocket connected')
          this.isConnecting = false
          this.reconnectAttempts = 0
          this.startHeartbeat()
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketEvent = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error('Failed to parse WebSocket message:', error)
          }
        }

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason)
          this.isConnecting = false
          this.stopHeartbeat()

          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect()
          }
        }

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error)
          this.isConnecting = false
          reject(error)
        }

      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    this.stopHeartbeat()

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect')
      this.ws = null
    }

    this.eventHandlers.clear()
  }

  // Send message to server
  send(type: WebSocketEventType, payload: any, id?: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketEvent = {
        type,
        payload,
        userId: this.userId,
        timestamp: Date.now(),
        ...(id && { id }),
      }

      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  // Subscribe to events
  on<T = any>(eventType: WebSocketEventType, handler: EventHandler<T>): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }

    const handlers = this.eventHandlers.get(eventType)!
    if (!handlers.includes(handler)) {
      handlers.push(handler)
    }
  }

  // Unsubscribe from events
  off<T = any>(eventType: WebSocketEventType, handler?: EventHandler<T>): void {
    if (!handler) {
      this.eventHandlers.delete(eventType)
      return
    }

    const handlers = this.eventHandlers.get(eventType)
    if (handlers) {
      const index = handlers.indexOf(handler)
      if (index > -1) {
        handlers.splice(index, 1)
      }
    }
  }

  // Handle incoming messages
  private handleMessage(message: WebSocketEvent): void {
    const handlers = this.eventHandlers.get(message.type)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(message.payload)
        } catch (error) {
          console.error('Error in WebSocket event handler:', error)
        }
      })
    }

    // Handle specific message types
    switch (message.type) {
      case 'processing_update':
        this.handleProcessingUpdate(message.payload as ProcessingUpdate['payload'])
        break
      case 'export_update':
        this.handleExportUpdate(message.payload as ExportUpdate['payload'])
        break
      case 'notification':
        this.handleNotification(message.payload)
        break
      case 'error':
        this.handleError(message.payload)
        break
    }
  }

  // Handle processing updates
  private handleProcessingUpdate(payload: ProcessingUpdate['payload']): void {
    console.log('Processing update:', payload)
    // Emit custom event for processing updates
    this.emitCustomEvent('processingUpdate', payload)
  }

  // Handle export updates
  private handleExportUpdate(payload: ExportUpdate['payload']): void {
    console.log('Export update:', payload)
    // Emit custom event for export updates
    this.emitCustomEvent('exportUpdate', payload)
  }

  // Handle notifications
  private handleNotification(payload: any): void {
    console.log('Notification:', payload)
    // Show browser notification if permission granted
    if (Notification.permission === 'granted' && payload.title) {
      new Notification(payload.title, {
        body: payload.message,
        icon: payload.icon,
      })
    }
  }

  // Handle errors
  private handleError(payload: any): void {
    console.error('WebSocket error:', payload)
    this.emitCustomEvent('error', payload)
  }

  // Emit custom events for external listeners
  private emitCustomEvent(type: string, data: any): void {
    const event = new CustomEvent(`ws:${type}`, { detail: data })
    window.dispatchEvent(event)
  }

  // Heartbeat to keep connection alive
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() })
      }
    }, this.heartbeatInterval)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  // Reconnection logic
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.reconnectAttempts++
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    this.reconnectTimer = setTimeout(() => {
      this.connect(this.userId).catch(error => {
        console.error('Reconnection failed:', error)
        this.scheduleReconnect()
      })
    }, this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1)) // Exponential backoff
  }

  // Get connection status
  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  get connectionState(): string {
    if (!this.ws) return 'disconnected'

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'connecting'
      case WebSocket.OPEN:
        return 'connected'
      case WebSocket.CLOSING:
        return 'closing'
      case WebSocket.CLOSED:
        return 'disconnected'
      default:
        return 'unknown'
    }
  }

  // Subscribe to specific processing updates
  subscribeToProcessing(clipId: string, handler: EventHandler<ProcessingUpdate['payload']>): void {
    const wrappedHandler = (data: ProcessingUpdate['payload']) => {
      if (data.clipId === clipId) {
        handler(data)
      }
    }

    this.on('processing_update', wrappedHandler)

    // Return unsubscribe function
    return () => this.off('processing_update', wrappedHandler)
  }

  // Subscribe to specific export updates
  subscribeToExport(projectId: string, handler: EventHandler<ExportUpdate['payload']>): void {
    const wrappedHandler = (data: ExportUpdate['payload']) => {
      if (data.projectId === projectId) {
        handler(data)
      }
    }

    this.on('export_update', wrappedHandler)

    // Return unsubscribe function
    return () => this.off('export_update', wrappedHandler)
  }

  // Join project room for real-time collaboration
  joinProject(projectId: string): void {
    this.send('join_project', { projectId })
  }

  // Leave project room
  leaveProject(projectId: string): void {
    this.send('leave_project', { projectId })
  }

  // Send project update for collaboration
  sendProjectUpdate(projectId: string, updates: any): void {
    this.send('project_update', { projectId, updates })
  }

  // Send cursor position for collaboration
  sendCursorPosition(projectId: string, position: { x: number; y: number }): void {
    this.send('cursor_position', { projectId, position })
  }
}

// Create singleton instance
export const wsClient = new WebSocketClient()

// Export for creating additional instances if needed
export default WebSocketClient

// Helper hooks for React components
export const useWebSocket = () => {
  return {
    connect: (userId?: string) => wsClient.connect(userId),
    disconnect: () => wsClient.disconnect(),
    send: (type: WebSocketEventType, payload: any, id?: string) =>
      wsClient.send(type, payload, id),
    on: <T = any>(eventType: WebSocketEventType, handler: EventHandler<T>) =>
      wsClient.on(eventType, handler),
    off: <T = any>(eventType: WebSocketEventType, handler?: EventHandler<T>) =>
      wsClient.off(eventType, handler),
    subscribeToProcessing: (clipId: string, handler: EventHandler<ProcessingUpdate['payload']>) =>
      wsClient.subscribeToProcessing(clipId, handler),
    subscribeToExport: (projectId: string, handler: EventHandler<ExportUpdate['payload']>) =>
      wsClient.subscribeToExport(projectId, handler),
    isConnected: wsClient.isConnected,
    connectionState: wsClient.connectionState,
  }
}
