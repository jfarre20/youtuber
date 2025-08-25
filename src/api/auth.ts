import { apiClient } from './client'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  User
} from '@/types/api'

export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse['data']>('/auth/login', credentials)

    // Store tokens in localStorage
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token)
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
    }

    return response
  },

  // Register new user
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse['data']>('/auth/register', userData)

    // Store tokens in localStorage
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token)
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
    }

    return response
  },

  // Refresh authentication token
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await apiClient.post<RefreshTokenResponse['data']>('/auth/refresh', {
      refreshToken,
    })

    // Update tokens in localStorage
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token)
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
    }

    return response
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens regardless of API response
      localStorage.removeItem('authToken')
      localStorage.removeItem('refreshToken')
    }
  },

  // Get current user profile
  async getProfile(): Promise<{ data: User }> {
    return apiClient.get<User>('/auth/profile')
  },

  // Update user profile
  async updateProfile(profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    return apiClient.patch<UpdateProfileResponse['data']>('/auth/profile', profileData)
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('authToken')
    if (!token) return false

    try {
      // Basic JWT validation (check if not expired)
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp > currentTime
    } catch (error) {
      return false
    }
  },

  // Get stored auth token
  getToken(): string | null {
    return localStorage.getItem('authToken')
  },

  // Get stored refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken')
  },

  // Clear all auth data
  clearAuth(): void {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<{ data: { message: string } }> {
    return apiClient.post('/auth/forgot-password', { email })
  },

  // Reset password with token
  async resetPassword(
    token: string,
    newPassword: string
  ): Promise<{ data: { message: string } }> {
    return apiClient.post('/auth/reset-password', { token, password: newPassword })
  },

  // Verify email address
  async verifyEmail(token: string): Promise<{ data: { message: string } }> {
    return apiClient.post('/auth/verify-email', { token })
  },

  // Resend verification email
  async resendVerification(): Promise<{ data: { message: string } }> {
    return apiClient.post('/auth/resend-verification')
  },

  // OAuth login (Google, GitHub, etc.)
  async oauthLogin(
    provider: 'google' | 'github' | 'twitter',
    code: string
  ): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse['data']>('/auth/oauth', {
      provider,
      code,
    })

    // Store tokens
    if (response.data?.token) {
      localStorage.setItem('authToken', response.data.token)
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken)
      }
    }

    return response
  },

  // Get OAuth URL for provider
  async getOAuthUrl(provider: 'google' | 'github' | 'twitter'): Promise<{ data: { url: string } }> {
    return apiClient.get(`/auth/oauth/${provider}`)
  },

  // Change password (authenticated)
  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<{ data: { message: string } }> {
    return apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    })
  },

  // Delete user account
  async deleteAccount(password: string): Promise<{ data: { message: string } }> {
    return apiClient.post('/auth/delete-account', { password })
  },
}
