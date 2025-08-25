import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { ApiResponse, ApiClientConfig, RequestConfig } from '@/types/api'

// Environment configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:3001'

// Default configuration
const defaultConfig: ApiClientConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  retries: 3,
  headers: {
    'Content-Type': 'application/json',
  },
}

class ApiClient {
  private axiosInstance: AxiosInstance
  private config: ApiClientConfig

  constructor(config: Partial<ApiClientConfig> = {}) {
    this.config = { ...defaultConfig, ...config }
    this.axiosInstance = axios.create(this.config)

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = this.getAuthToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Add request timestamp
        config.headers['X-Request-Time'] = Date.now().toString()

        return config
      },
      (error) => {
        console.error('Request error:', error)
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const newToken = await this.refreshToken()
            if (newToken) {
              originalRequest.headers = {
                ...originalRequest.headers,
                Authorization: `Bearer ${newToken}`,
              }
              return this.axiosInstance(originalRequest)
            }
          } catch (refreshError) {
            // Token refresh failed, redirect to login
            this.handleAuthError()
            return Promise.reject(refreshError)
          }
        }

        // Handle rate limiting
        if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after']
          if (retryAfter) {
            await this.delay(parseInt(retryAfter) * 1000)
            return this.axiosInstance(originalRequest)
          }
        }

        return Promise.reject(error)
      }
    )
  }

  private getAuthToken(): string | null {
    return localStorage.getItem('authToken')
  }

  private async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) return null

      const response = await axios.post(`${this.config.baseURL}/auth/refresh`, {
        refreshToken,
      })

      const { token, refreshToken: newRefreshToken } = response.data.data

      localStorage.setItem('authToken', token)
      localStorage.setItem('refreshToken', newRefreshToken)

      return token
    } catch (error) {
      return null
    }
  }

  private handleAuthError() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    // Redirect to login page
    window.location.href = '/login'
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Generic request method with retry logic
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: any,
    config: Partial<AxiosRequestConfig> = {}
  ): Promise<ApiResponse<T>> {
    let lastError: Error

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance.request({
          method,
          url,
          data,
          ...config,
        })

        return response.data
      } catch (error) {
        lastError = error as Error

        if (attempt < this.config.retries) {
          // Exponential backoff
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
          await this.delay(delay)
        }
      }
    }

    throw lastError!
  }

  // HTTP methods
  async get<T>(url: string, config?: Partial<AxiosRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config)
  }

  async post<T>(url: string, data?: any, config?: Partial<AxiosRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config)
  }

  async put<T>(url: string, data?: any, config?: Partial<AxiosRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config)
  }

  async patch<T>(url: string, data?: any, config?: Partial<AxiosRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config)
  }

  async delete<T>(url: string, config?: Partial<AxiosRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config)
  }

  // File upload with progress
  async uploadFile(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append('file', file)

    return this.request('POST', url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
  }

  // Update configuration
  updateConfig(newConfig: Partial<ApiClientConfig>) {
    this.config = { ...this.config, ...newConfig }
    this.axiosInstance.defaults = { ...this.axiosInstance.defaults, ...newConfig }
  }

  // Set authentication token
  setAuthToken(token: string) {
    localStorage.setItem('authToken', token)
  }

  // Clear authentication
  clearAuth() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  }
}

// Create default instance
export const apiClient = new ApiClient()

// Export for creating additional instances if needed
export default ApiClient
