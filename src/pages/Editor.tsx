import React, { useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import {
  Play,
  Pause,
  Upload,
  Download,
  Settings,
  Volume2,
  Scissors,
  RotateCcw,
  RotateCw,
  ZoomIn
} from 'lucide-react'
import VideoPlayer from '@/components/VideoPlayer'
import Timeline from '@/components/Timeline'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import {
  setCurrentTime,
  setDuration,
  setPlaying,
  play,
  pause,
  addTimelineClip,
  updateTimelineClip,
  removeTimelineClip,
  setSelectedClip,
  setZoom,
  setVolume,
  clearTimeline
} from '@/store/slices/editorSlice'
import { formatTime } from '@/utils/format'
import { extractYouTubeId } from '@/utils/youtube'
import { cn } from '@/utils/cn'

const Editor: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const dispatch = useAppDispatch()
  const {
    currentTime,
    duration,
    isPlaying,
    timelineClips,
    selectedClipId,
    zoom,
    volume,
    processing,
    exportProgress
  } = useAppSelector(state => state.editor)

  const { currentProject } = useAppSelector(state => state.project)

  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [isDragging, setIsDragging] = useState(false)

  // Video player handlers
  const handleTimeUpdate = useCallback((time: number) => {
    dispatch(setCurrentTime(time))
  }, [dispatch])

  const handleDurationChange = useCallback((newDuration: number) => {
    dispatch(setDuration(newDuration))
  }, [dispatch])

  const handlePlay = useCallback(() => {
    dispatch(play())
  }, [dispatch])

  const handlePause = useCallback(() => {
    dispatch(pause())
  }, [dispatch])

  const handleSeek = useCallback((time: number) => {
    dispatch(setCurrentTime(time))
  }, [dispatch])

  const handleVolumeChange = useCallback((newVolume: number) => {
    dispatch(setVolume(newVolume))
  }, [dispatch])

  // Timeline handlers
  const handleTimelineTimeChange = useCallback((time: number) => {
    dispatch(setCurrentTime(time))
  }, [dispatch])

  const handleClipSelect = useCallback((clipId: string | null) => {
    dispatch(setSelectedClip(clipId))
  }, [dispatch])

  const handleClipUpdate = useCallback((clipId: string, updates: any) => {
    if (clipId === '') {
      // Handle timeline-level updates (like zoom)
      if (updates.zoom !== undefined) {
        dispatch(setZoom(updates.zoom))
      }
    } else {
      dispatch(updateTimelineClip({ id: clipId, updates }))
    }
  }, [dispatch])

  // YouTube URL handler
  const handleYouTubeUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const videoId = extractYouTubeId(youtubeUrl)
    if (videoId) {
      // In a real app, this would process the YouTube video
      // For now, we'll create a mock clip
      const newClip = {
        id: `clip-${Date.now()}`,
        clipId: `youtube-${videoId}`,
        startTime: 0,
        endTime: 30, // Mock 30 second clip
        position: timelineClips.length,
        volume: 1,
        fadeIn: 0,
        fadeOut: 0,
        effects: [],
        transition: undefined
      }
      dispatch(addTimelineClip(newClip))
      setYoutubeUrl('')
    }
  }, [youtubeUrl, timelineClips.length, dispatch])

  // Export handler
  const handleExport = useCallback(() => {
    // Mock export functionality
    console.log('Exporting project:', projectId)
    console.log('Timeline clips:', timelineClips)
  }, [projectId, timelineClips])

  // Clear timeline
  const handleClearTimeline = useCallback(() => {
    dispatch(clearTimeline())
  }, [dispatch])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Video Editor
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            {currentProject?.name || 'Untitled Project'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClearTimeline}
            className="btn btn-secondary flex items-center gap-2"
            disabled={timelineClips.length === 0}
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={handleExport}
            className="btn btn-primary flex items-center gap-2"
            disabled={timelineClips.length === 0 || processing}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* YouTube URL Input */}
      <div className="card">
        <form onSubmit={handleYouTubeUrlSubmit} className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Paste YouTube URL or video ID..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="input"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary flex items-center gap-2"
            disabled={!youtubeUrl.trim()}
          >
            <Upload className="w-4 h-4" />
            Add Clip
          </button>
        </form>
      </div>

      {/* Main Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-0 overflow-hidden">
            <VideoPlayer
              src={selectedClipId ? `https://www.youtube.com/embed/${selectedClipId.replace('youtube-', '')}` : ''}
              currentTime={currentTime}
              duration={duration}
              isPlaying={isPlaying}
              volume={volume}
              onTimeUpdate={handleTimeUpdate}
              onDurationChange={handleDurationChange}
              onPlay={handlePlay}
              onPause={handlePause}
              onSeek={handleSeek}
              onVolumeChange={handleVolumeChange}
              className="aspect-video"
            />
          </div>

          {/* Playback Controls */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="w-12 h-12 bg-primary-600 hover:bg-primary-700 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-secondary-600" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <span className="text-sm text-secondary-600">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
                  <Scissors className="w-4 h-4 text-secondary-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors">
                  <Settings className="w-4 h-4 text-secondary-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Sidebar */}
        <div className="space-y-4">
          {/* Timeline */}
          <Timeline
            clips={timelineClips}
            currentTime={currentTime}
            duration={duration}
            zoom={zoom}
            selectedClipId={selectedClipId}
            onTimeChange={handleTimelineTimeChange}
            onClipSelect={handleClipSelect}
            onClipUpdate={handleClipUpdate}
            onClipReorder={() => {}} // Implement later if needed
            snapToGrid={true}
            gridSize={0.1}
          />

          {/* Clip Properties */}
          {selectedClipId && (
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Clip Properties
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Volume
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={timelineClips.find(c => c.id === selectedClipId)?.volume || 1}
                    onChange={(e) => {
                      const clip = timelineClips.find(c => c.id === selectedClipId)
                      if (clip) {
                        dispatch(updateTimelineClip({
                          id: selectedClipId,
                          updates: { volume: parseFloat(e.target.value) }
                        }))
                      }
                    }}
                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Fade In
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={timelineClips.find(c => c.id === selectedClipId)?.fadeIn || 0}
                      onChange={(e) => {
                        const clip = timelineClips.find(c => c.id === selectedClipId)
                        if (clip) {
                          dispatch(updateTimelineClip({
                            id: selectedClipId,
                            updates: { fadeIn: parseFloat(e.target.value) }
                          }))
                        }
                      }}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Fade Out
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={timelineClips.find(c => c.id === selectedClipId)?.fadeOut || 0}
                      onChange={(e) => {
                        const clip = timelineClips.find(c => c.id === selectedClipId)
                        if (clip) {
                          dispatch(updateTimelineClip({
                            id: selectedClipId,
                            updates: { fadeOut: parseFloat(e.target.value) }
                          }))
                        }
                      }}
                      className="input w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export Progress */}
          {processing && (
            <div className="card">
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
                Processing...
              </h3>
              <div className="w-full bg-secondary-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-2">
                {exportProgress}% complete
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Editor
