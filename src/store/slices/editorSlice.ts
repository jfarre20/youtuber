import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface TimelineClip {
  id: string
  clipId: string
  startTime: number
  endTime: number
  position: number // order in timeline
  volume: number // 0-1
  fadeIn: number // seconds
  fadeOut: number // seconds
}

interface EditorState {
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
}

const initialState: EditorState = {
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  timelineClips: [],
  selectedClipId: null,
  zoom: 1,
  volume: 1,
  mute: false,
  loop: false,
  snapToGrid: true,
  gridSize: 0.1,
  showWaveform: true,
  processing: false,
  exportProgress: 0,
}

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = Math.max(0, Math.min(action.payload, state.duration))
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload
    },
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload
    },
    play: (state) => {
      state.isPlaying = true
    },
    pause: (state) => {
      state.isPlaying = false
    },
    stop: (state) => {
      state.isPlaying = false
      state.currentTime = 0
    },
    addTimelineClip: (state, action: PayloadAction<TimelineClip>) => {
      state.timelineClips.push(action.payload)
      state.timelineClips.sort((a, b) => a.position - b.position)
      state.duration = Math.max(state.duration, action.payload.endTime)
    },
    updateTimelineClip: (state, action: PayloadAction<{ id: string; updates: Partial<TimelineClip> }>) => {
      const { id, updates } = action.payload
      const clipIndex = state.timelineClips.findIndex(clip => clip.id === id)
      if (clipIndex !== -1) {
        state.timelineClips[clipIndex] = { ...state.timelineClips[clipIndex], ...updates }
        // Recalculate duration
        state.duration = Math.max(...state.timelineClips.map(clip => clip.endTime), 0)
      }
    },
    removeTimelineClip: (state, action: PayloadAction<string>) => {
      state.timelineClips = state.timelineClips.filter(clip => clip.id !== action.payload)
      if (state.selectedClipId === action.payload) {
        state.selectedClipId = null
      }
      // Recalculate duration
      state.duration = Math.max(...state.timelineClips.map(clip => clip.endTime), 0)
    },
    reorderTimelineClips: (state, action: PayloadAction<{ sourceIndex: number; destinationIndex: number }>) => {
      const { sourceIndex, destinationIndex } = action.payload
      const [removed] = state.timelineClips.splice(sourceIndex, 1)
      state.timelineClips.splice(destinationIndex, 0, removed)

      // Update positions
      state.timelineClips.forEach((clip, index) => {
        clip.position = index
      })
    },
    setSelectedClip: (state, action: PayloadAction<string | null>) => {
      state.selectedClipId = action.payload
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = Math.max(0.1, Math.min(action.payload, 5.0))
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(action.payload, 1))
    },
    setMute: (state, action: PayloadAction<boolean>) => {
      state.mute = action.payload
    },
    setLoop: (state, action: PayloadAction<boolean>) => {
      state.loop = action.payload
    },
    setSnapToGrid: (state, action: PayloadAction<boolean>) => {
      state.snapToGrid = action.payload
    },
    setGridSize: (state, action: PayloadAction<number>) => {
      state.gridSize = Math.max(0.01, action.payload)
    },
    setShowWaveform: (state, action: PayloadAction<boolean>) => {
      state.showWaveform = action.payload
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.processing = action.payload
    },
    setExportProgress: (state, action: PayloadAction<number>) => {
      state.exportProgress = Math.max(0, Math.min(action.payload, 100))
    },
    clearTimeline: (state) => {
      state.timelineClips = []
      state.selectedClipId = null
      state.currentTime = 0
      state.duration = 0
      state.isPlaying = false
    },
  },
})

export const {
  setCurrentTime,
  setDuration,
  setPlaying,
  play,
  pause,
  stop,
  addTimelineClip,
  updateTimelineClip,
  removeTimelineClip,
  reorderTimelineClips,
  setSelectedClip,
  setZoom,
  setVolume,
  setMute,
  setLoop,
  setSnapToGrid,
  setGridSize,
  setShowWaveform,
  setProcessing,
  setExportProgress,
  clearTimeline,
} = editorSlice.actions

export default editorSlice.reducer
