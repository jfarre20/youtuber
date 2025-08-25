import React, { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Scissors,
  RotateCcw,
  Save,
  Download,
  Upload,
  ZoomIn,
  ZoomOut,
  Settings,
  Eye,
  Film,
  Clock,
  Plus,
  Trash2,
  Move,
  Copy,
  ArrowLeft
} from 'lucide-react'
import { useAppSelector } from '@/hooks/redux'
import { formatDistanceToNow } from 'date-fns'

const VideoEditor: React.FC = () => {
  const { projectId } = useParams()
  const { projects, clips } = useAppSelector(state => state.project)
  const { clips: allClips } = useAppSelector(state => state.clip)

  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [selectedClip, setSelectedClip] = useState<string | null>(null)

  // Get current project
  const currentProject = projects ? (Object.values(projects) as any[]).find(p => p.id === projectId) : null

  // Mock timeline data - in real app this would be stored in project state
  const [timelineClips, setTimelineClips] = useState([
    {
      id: '1',
      name: 'Intro Clip',
      startTime: 0,
      duration: 30,
      sourceClip: '1',
      thumbnail: null
    },
    {
      id: '2',
      name: 'Main Content',
      startTime: 30,
      duration: 120,
      sourceClip: '2',
      thumbnail: null
    },
    {
      id: '3',
      name: 'Outro',
      startTime: 150,
      duration: 20,
      sourceClip: '3',
      thumbnail: null
    }
  ])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (videoRef.current) {
      videoRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleSplitClip = () => {
    // Mock split functionality
    console.log('Splitting clip at', currentTime)
  }

  const handleDeleteClip = (clipId: string) => {
    setTimelineClips(timelineClips.filter(clip => clip.id !== clipId))
  }

  const handleAddClip = () => {
    // Mock add clip functionality
    console.log('Adding new clip')
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
            Project Not Found
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6">
            The project you're looking for doesn't exist or has been deleted.
          </p>
          <Link to="/projects" className="btn btn-primary">
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      {/* Header - Mobile Responsive */}
      <div className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/projects"
              className="btn btn-secondary flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Projects</span>
            </Link>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                {currentProject.name}
              </h1>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Video Editor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="btn btn-secondary text-sm flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button className="btn btn-primary text-sm flex items-center gap-2">
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
            <button className="btn btn-primary text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor Layout - Fully Responsive */}
      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* Left Sidebar - Project Info & Clips - Collapsible on Mobile */}
        <div className="w-full lg:w-80 bg-white dark:bg-secondary-800 border-b lg:border-b-0 lg:border-r border-secondary-200 dark:border-secondary-700 flex flex-col">
          {/* Mobile Toggle Header */}
          <div className="lg:hidden p-4 border-b border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-secondary-900 dark:text-secondary-100">
                Project Panel
              </h2>
              <button
                onClick={handleAddClip}
                className="btn btn-secondary btn-sm flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Clip
              </button>
            </div>
          </div>

          {/* Project Info */}
          <div className="p-4 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              Project Info
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-secondary-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  currentProject.status === 'completed'
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : currentProject.status === 'processing'
                    ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                }`}>
                  {currentProject.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-secondary-400">Clips:</span>
                <span className="text-secondary-900 dark:text-secondary-100">
                  {timelineClips.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-600 dark:text-secondary-400">Duration:</span>
                <span className="text-secondary-900 dark:text-secondary-100">
                  {formatTime(timelineClips.reduce((total, clip) => total + clip.duration, 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Available Clips - Scrollable */}
          <div className="flex-1 p-4 overflow-hidden">
            <div className="hidden lg:flex items-center justify-between mb-4">
              <h2 className="font-semibold text-secondary-900 dark:text-secondary-100">
                Available Clips
              </h2>
              <button
                onClick={handleAddClip}
                className="btn btn-secondary btn-sm flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add
              </button>
            </div>

            <div className="space-y-2 h-full overflow-y-auto max-h-96 lg:max-h-none">
              {timelineClips.map((clip) => (
                <div
                  key={clip.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors touch-manipulation ${
                    selectedClip === clip.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedClip(clip.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary-200 dark:bg-secondary-700 rounded flex items-center justify-center flex-shrink-0">
                      <Film className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-secondary-900 dark:text-secondary-100 truncate">
                        {clip.name}
                      </div>
                      <div className="text-xs text-secondary-600 dark:text-secondary-400">
                        {formatTime(clip.duration)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Editor Area - Responsive Layout */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Video Preview - Responsive */}
          <div className="bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-4xl">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-48 sm:max-h-64 lg:max-h-96 object-contain rounded-lg shadow-lg"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                poster="/api/placeholder/800/450"
                playsInline
              >
                <source src="/api/placeholder-video.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Controls - Mobile Optimized */}
              <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-2 sm:px-4">
                {/* Main Controls */}
                <div className="flex items-center gap-2 sm:gap-4">
                  <button
                    onClick={() => videoRef.current && (videoRef.current.currentTime -= 10)}
                    className="btn btn-secondary btn-sm touch-manipulation"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePlayPause}
                    className="btn btn-primary btn-sm flex items-center gap-2 touch-manipulation"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => videoRef.current && (videoRef.current.currentTime += 10)}
                    className="btn btn-secondary btn-sm touch-manipulation"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Bar - Full Width on Mobile */}
                <div className="flex-1 w-full sm:w-auto sm:mx-4">
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                  />
                </div>

                {/* Volume & Time - Stacked on Mobile */}
                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={toggleMute}
                      className="btn btn-secondary btn-sm touch-manipulation"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-16 sm:w-20 h-2 bg-secondary-200 rounded-lg appearance-none cursor-pointer touch-manipulation"
                    />
                  </div>

                  <span className="text-sm text-secondary-600 dark:text-secondary-400 text-center sm:text-left">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline - Mobile Optimized */}
          <div className="flex-1 bg-white dark:bg-secondary-800 border-t border-secondary-200 dark:border-secondary-700 overflow-hidden">
            {/* Timeline Controls - Responsive */}
            <div className="p-2 sm:p-4 border-b border-secondary-200 dark:border-secondary-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
                  <button
                    onClick={handleSplitClip}
                    className="btn btn-secondary btn-sm flex items-center gap-2 whitespace-nowrap touch-manipulation"
                  >
                    <Scissors className="w-4 h-4" />
                    Split
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
                      className="btn btn-secondary btn-sm touch-manipulation"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-secondary-600 dark:text-secondary-400 min-w-12 text-center">
                      {Math.round(zoom * 100)}%
                    </span>
                    <button
                      onClick={() => setZoom(Math.min(5, zoom + 0.1))}
                      className="btn btn-secondary btn-sm touch-manipulation"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="btn btn-secondary btn-sm touch-manipulation">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline Tracks - Horizontal Scroll on Mobile */}
            <div className="flex-1 overflow-auto" ref={timelineRef}>
              <div className="p-2 sm:p-4 min-w-max">
                {/* Time Ruler - Responsive */}
                <div className="mb-4 border-b border-secondary-200 dark:border-secondary-700 pb-2">
                  <div className="flex" style={{ width: `${Math.max(100, (duration || 60) * zoom * 40)}px` }}>
                    {Array.from({ length: Math.ceil((duration || 60) / 10) + 1 }, (_, i) => (
                      <div key={i} className="flex-shrink-0 text-xs text-secondary-500 dark:text-secondary-400" style={{ width: `${10 * zoom * 40}px` }}>
                        {formatTime(i * 10)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Video Track - Touch Friendly */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                    Video Track
                  </div>

                  <div className="relative bg-secondary-100 dark:bg-secondary-700 rounded-lg p-2 min-h-20 touch-manipulation"
                       style={{ width: `${Math.max(100, (duration || 60) * zoom * 40 + 32)}px` }}>
                    {timelineClips.map((clip, index) => (
                      <div
                        key={clip.id}
                        className={`absolute top-2 h-12 sm:h-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded border-2 cursor-pointer transition-all touch-manipulation ${
                          selectedClip === clip.id ? 'border-primary-300' : 'border-primary-400'
                        } hover:border-primary-300 flex items-center px-2 sm:px-3 group`}
                        style={{
                          left: `${clip.startTime * zoom * 40}px`,
                          width: `${clip.duration * zoom * 40}px`,
                        }}
                        onClick={() => setSelectedClip(clip.id)}
                      >
                        <div className="text-white text-xs sm:text-sm font-medium truncate flex-1">
                          {clip.name}
                        </div>

                        {/* Clip Actions - Larger on Mobile */}
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClip(clip.id)
                            }}
                            className="w-6 h-6 sm:w-6 sm:h-6 bg-red-500 hover:bg-red-600 rounded flex items-center justify-center touch-manipulation"
                          >
                            <Trash2 className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Current Time Indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-red-500 pointer-events-none z-10"
                      style={{ left: `${currentTime * zoom * 40}px` }}
                    >
                      <div className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Audio Track - Simplified on Mobile */}
                <div className="space-y-2 mt-4 sm:mt-6">
                  <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                    Audio Track
                  </div>

                  <div className="relative bg-secondary-100 dark:bg-secondary-700 rounded-lg p-2 min-h-12 sm:min-h-16"
                       style={{ width: `${Math.max(100, (duration || 60) * zoom * 40 + 32)}px` }}>
                    <div className="h-8 sm:h-12 bg-secondary-200 dark:bg-secondary-600 rounded opacity-50 flex items-center justify-center">
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        Audio waveforms
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoEditor
