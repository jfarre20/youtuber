import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Clip {
  id: string
  name: string
  description?: string
  youtubeUrl: string
  startTime: number // in seconds
  endTime: number // in seconds
  duration: number // in seconds
  thumbnail?: string
  tags: string[]
  createdAt: string
  updatedAt: string
  status: 'processing' | 'ready' | 'error' | 'completed' | 'draft'
  error?: string
  projectId?: string | null
  projectName?: string | null
  progress?: number
  size?: number // in MB
  metadata?: {
    title: string
    channel: string
    viewCount: number
    uploadDate: string
  }
}

interface ClipState {
  clips: Record<string, Clip>
  loading: boolean
  error: string | null
  searchQuery: string
  selectedTags: string[]
}

const initialState: ClipState = {
  clips: {
    '1': {
      id: '1',
      name: 'Tech Review Intro',
      description: 'Introduction segment for the monthly tech review',
      duration: 120, // 2 minutes in seconds
      startTime: 0,
      endTime: 120,
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ?t=0',
      tags: ['intro', 'technology'],
      projectId: '1',
      projectName: 'Tech Review Series',
      size: 45.2 // MB
    },
    '2': {
      id: '2',
      name: 'Product Demo Walkthrough',
      description: 'Step-by-step demonstration of the new mobile app features',
      duration: 480, // 8 minutes in seconds
      startTime: 120,
      endTime: 600,
      status: 'processing',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ?t=120',
      tags: ['demo', 'mobile', 'walkthrough'],
      projectId: '2',
      projectName: 'Product Demo',
      progress: 75,
      size: 120.8
    },
    '3': {
      id: '3',
      name: 'Tutorial: Basic Editing',
      description: 'Learn the basics of video editing with this comprehensive guide',
      duration: 900, // 15 minutes in seconds
      startTime: 600,
      endTime: 1500,
      status: 'completed',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ?t=600',
      tags: ['tutorial', 'beginners', 'editing'],
      projectId: '3',
      projectName: 'Tutorial Videos',
      size: 320.5
    },
    '4': {
      id: '4',
      name: 'Interview with Developer',
      description: 'Exclusive interview discussing the development process',
      duration: 720, // 12 minutes in seconds
      startTime: 1500,
      endTime: 2220,
      status: 'error',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 46 * 60 * 60 * 1000).toISOString(),
      youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ?t=1500',
      tags: ['interview', 'developer'],
      projectId: '1',
      projectName: 'Tech Review Series',
      error: 'Video processing failed due to corrupted source file',
      size: 0
    },
    '5': {
      id: '5',
      name: 'Quick Tips Compilation',
      description: 'Collection of quick video editing tips and tricks',
      duration: 300, // 5 minutes in seconds
      startTime: 2100,
      endTime: 2400,
      status: 'draft',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ?t=2100',
      tags: ['tips', 'compilation'],
      projectId: null,
      projectName: null,
      size: 0
    }
  },
  loading: false,
  error: null,
  searchQuery: '',
  selectedTags: [],
}

const clipSlice = createSlice({
  name: 'clip',
  initialState,
  reducers: {
    setClips: (state, action: PayloadAction<Clip[]>) => {
      state.clips = action.payload.reduce((acc, clip) => {
        acc[clip.id] = clip
        return acc
      }, {} as Record<string, Clip>)
    },
    addClip: (state, action: PayloadAction<Clip>) => {
      state.clips[action.payload.id] = action.payload
    },
    updateClip: (state, action: PayloadAction<{ id: string; updates: Partial<Clip> }>) => {
      const { id, updates } = action.payload
      if (state.clips[id]) {
        state.clips[id] = { ...state.clips[id], ...updates, updatedAt: new Date().toISOString() }
      }
    },
    deleteClip: (state, action: PayloadAction<string>) => {
      delete state.clips[action.payload]
    },
    setClipStatus: (state, action: PayloadAction<{ id: string; status: Clip['status']; error?: string }>) => {
      const { id, status, error } = action.payload
      if (state.clips[id]) {
        state.clips[id].status = status
        if (error) {
          state.clips[id].error = error
        }
        state.clips[id].updatedAt = new Date().toISOString()
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSelectedTags: (state, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload
    },
    addTag: (state, action: PayloadAction<{ clipId: string; tag: string }>) => {
      const { clipId, tag } = action.payload
      if (state.clips[clipId] && !state.clips[clipId].tags.includes(tag)) {
        state.clips[clipId].tags.push(tag)
        state.clips[clipId].updatedAt = new Date().toISOString()
      }
    },
    removeTag: (state, action: PayloadAction<{ clipId: string; tag: string }>) => {
      const { clipId, tag } = action.payload
      if (state.clips[clipId]) {
        state.clips[clipId].tags = state.clips[clipId].tags.filter(t => t !== tag)
        state.clips[clipId].updatedAt = new Date().toISOString()
      }
    },
  },
})

export const {
  setClips,
  addClip,
  updateClip,
  deleteClip,
  setClipStatus,
  setLoading: setClipLoading,
  setError: setClipError,
  setSearchQuery,
  setSelectedTags,
  addTag,
  removeTag,
} = clipSlice.actions

export default clipSlice.reducer
