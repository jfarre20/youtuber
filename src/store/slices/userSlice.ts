import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
  preferences: {
    theme: 'light' | 'dark'
    language: string
    notifications: boolean
  }
}

interface UserState {
  currentUser: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  currentUser: {
    id: '1',
    email: 'creator@example.com',
    name: 'Creator',
    avatar: undefined,
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true
    }
  },
  isAuthenticated: true,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload
      state.isAuthenticated = true
      state.error = null
    },
    clearUser: (state) => {
      state.currentUser = null
      state.isAuthenticated = false
      state.error = null
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    updateUserPreferences: (state, action: PayloadAction<Partial<User['preferences']>>) => {
      if (state.currentUser) {
        state.currentUser.preferences = { ...state.currentUser.preferences, ...action.payload }
      }
    },
  },
})

export const { setUser, clearUser, setLoading, setError, updateUserPreferences } = userSlice.actions
export default userSlice.reducer
