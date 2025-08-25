import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  clips: string[] // clip IDs
  status: 'draft' | 'processing' | 'completed' | 'error'
  tags?: string[]
  progress?: number
  settings: {
    outputFormat: 'mp4' | 'webm'
    quality: 'low' | 'medium' | 'high'
    resolution: string
  }
}

interface ProjectState {
  projects: Record<string, Project>
  currentProject: string | null
  loading: boolean
  error: string | null
}

const initialState: ProjectState = {
  projects: {
    '1': {
      id: '1',
      name: 'Tech Review Series',
      description: 'Monthly technology reviews and tutorials covering the latest gadgets and software',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
      clips: ['1', '2', '3'],
      status: 'completed',
      tags: ['technology', 'reviews'],
      progress: 100,
      settings: {
        outputFormat: 'mp4',
        quality: 'high',
        resolution: '1920x1080'
      }
    },
    '2': {
      id: '2',
      name: 'Product Demo',
      description: 'Software product demonstration for the new mobile application',
      createdAt: '2024-02-01T09:00:00Z',
      updatedAt: '2024-02-05T16:45:00Z',
      clips: ['4', '5'],
      status: 'processing',
      tags: ['demo', 'mobile'],
      progress: 75,
      settings: {
        outputFormat: 'mp4',
        quality: 'medium',
        resolution: '1280x720'
      }
    },
    '3': {
      id: '3',
      name: 'Tutorial Videos',
      description: 'Step-by-step tutorial series for beginners learning video editing',
      createdAt: '2024-01-10T11:30:00Z',
      updatedAt: '2024-01-18T13:20:00Z',
      clips: ['6', '7', '8'],
      status: 'draft',
      tags: ['tutorial', 'beginners'],
      progress: 0,
      settings: {
        outputFormat: 'webm',
        quality: 'medium',
        resolution: '1920x1080'
      }
    }
  },
  currentProject: null,
  loading: false,
  error: null,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload.reduce((acc, project) => {
        acc[project.id] = project
        return acc
      }, {} as Record<string, Project>)
    },
    addProject: (state, action: PayloadAction<Project>) => {
      state.projects[action.payload.id] = action.payload
    },
    updateProject: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const { id, updates } = action.payload
      if (state.projects[id]) {
        state.projects[id] = { ...state.projects[id], ...updates, updatedAt: new Date().toISOString() }
      }
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      delete state.projects[action.payload]
      if (state.currentProject === action.payload) {
        state.currentProject = null
      }
    },
    setCurrentProject: (state, action: PayloadAction<string | null>) => {
      state.currentProject = action.payload
    },
    addClipToProject: (state, action: PayloadAction<{ projectId: string; clipId: string }>) => {
      const { projectId, clipId } = action.payload
      if (state.projects[projectId]) {
        state.projects[projectId].clips.push(clipId)
        state.projects[projectId].updatedAt = new Date().toISOString()
      }
    },
    removeClipFromProject: (state, action: PayloadAction<{ projectId: string; clipId: string }>) => {
      const { projectId, clipId } = action.payload
      if (state.projects[projectId]) {
        state.projects[projectId].clips = state.projects[projectId].clips.filter(id => id !== clipId)
        state.projects[projectId].updatedAt = new Date().toISOString()
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
  },
})

export const {
  setProjects,
  addProject,
  updateProject,
  deleteProject,
  setCurrentProject,
  addClipToProject,
  removeClipFromProject,
  setLoading: setProjectLoading,
  setError: setProjectError,
} = projectSlice.actions

export default projectSlice.reducer
