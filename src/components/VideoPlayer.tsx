import React, { useRef, useEffect, useState, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward
} from 'lucide-react'
import { VideoPlayerProps } from '@/types'
import { formatTime } from '@/utils/format'
import { cn } from '@/utils/cn'

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  currentTime,
  duration,
  isPlaying,
  volume,
  onTimeUpdate,
  onDurationChange,
  onPlay,
  onPause,
  onSeek,
  onVolumeChange,
  showControls = true,
  autoPlay = false,
  className,
  ...props
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControlsOverlay, setShowControlsOverlay] = useState(true)
  const [isDragging, setIsDragging] = useState(false)

  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      onDurationChange(videoRef.current.duration)
      setIsLoaded(true)
    }
  }, [onDurationChange])

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current && !isDragging) {
      onTimeUpdate(videoRef.current.currentTime)
    }
  }, [onTimeUpdate, isDragging])

  const handlePlay = useCallback(() => {
    onPlay()
  }, [onPlay])

  const handlePause = useCallback(() => {
    onPause()
  }, [onPause])

  const handleSeek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time
      onSeek(time)
    }
  }, [onSeek])

  // Progress bar interaction
  const handleProgressClick = useCallback((e: React.MouseEvent) => {
    if (progressRef.current && duration) {
      const rect = progressRef.current.getBoundingClientRect()
      const percent = (e.clientX - rect.left) / rect.width
      const time = percent * duration
      handleSeek(time)
    }
  }, [duration, handleSeek])

  const handleProgressMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    handleProgressClick(e)
  }, [handleProgressClick])

  const handleProgressMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      handleProgressClick(e)
    }
  }, [isDragging, handleProgressClick])

  const handleProgressMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Volume control
  const handleVolumeChange = useCallback((newVolume: number) => {
    if (videoRef.current) {
      videoRef.current.volume = newVolume
      onVolumeChange(newVolume)
      setIsMuted(newVolume === 0)
    }
  }, [onVolumeChange])

  const handleVolumeClick = useCallback(() => {
    if (isMuted) {
      handleVolumeChange(volume || 0.5)
    } else {
      handleVolumeChange(0)
    }
  }, [isMuted, volume, handleVolumeChange])

  // Fullscreen
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return

    try {
      if (!isFullscreen) {
        await containerRef.current.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Fullscreen error:', error)
    }
  }, [isFullscreen])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          if (isPlaying) {
            videoRef.current.pause()
          } else {
            videoRef.current.play()
          }
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleSeek(Math.max(0, currentTime - 10))
          break
        case 'ArrowRight':
          e.preventDefault()
          handleSeek(Math.min(duration, currentTime + 10))
          break
        case 'KeyF':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'KeyM':
          e.preventDefault()
          handleVolumeClick()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isPlaying, currentTime, duration, handleSeek, toggleFullscreen, handleVolumeClick])

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Auto-hide controls
  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      setShowControlsOverlay(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [isPlaying, currentTime])

  const handleMouseMove = useCallback(() => {
    setShowControlsOverlay(true)
  }, [])

  // Sync video state with props
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (videoRef.current && !isDragging) {
      videoRef.current.currentTime = currentTime
    }
  }, [currentTime, isDragging])

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-black rounded-lg overflow-hidden group', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControlsOverlay(false)}
      {...props}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-contain"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        autoPlay={autoPlay}
        playsInline
      />

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300',
            showControlsOverlay || !isPlaying ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* Center Play/Pause Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={isPlaying ? handlePause : handlePlay}
              className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors duration-200 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 ml-1" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            {/* Progress Bar */}
            <div
              ref={progressRef}
              className="w-full h-2 bg-white/20 rounded-full cursor-pointer relative"
              onClick={handleProgressClick}
              onMouseDown={handleProgressMouseDown}
              onMouseMove={handleProgressMouseMove}
              onMouseUp={handleProgressMouseUp}
              onMouseLeave={handleProgressMouseUp}
            >
              <div
                className="h-full bg-primary-500 rounded-full relative"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={isPlaying ? handlePause : handlePlay}
                  className="text-white hover:text-primary-400 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5" />
                  )}
                </button>

                {/* Skip Buttons */}
                <button
                  onClick={() => handleSeek(Math.max(0, currentTime - 10))}
                  className="text-white hover:text-primary-400 transition-colors"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleSeek(Math.min(duration, currentTime + 10))}
                  className="text-white hover:text-primary-400 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Volume */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleVolumeClick}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    className="text-white hover:text-primary-400 transition-colors"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-5 h-5" />
                    ) : (
                      <Volume2 className="w-5 h-5" />
                    )}
                  </button>

                  {/* Volume Slider */}
                  {showVolumeSlider && (
                    <div
                      ref={volumeRef}
                      className="w-20 h-2 bg-white/20 rounded-full cursor-pointer"
                      onMouseLeave={() => setShowVolumeSlider(false)}
                      onClick={(e) => {
                        const rect = volumeRef.current?.getBoundingClientRect()
                        if (rect) {
                          const percent = (e.clientX - rect.left) / rect.width
                          handleVolumeChange(Math.max(0, Math.min(1, percent)))
                        }
                      }}
                    >
                      <div
                        className="h-full bg-primary-500 rounded-full"
                        style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Time Display */}
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Settings */}
                <button className="text-white hover:text-primary-400 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white hover:text-primary-400 transition-colors"
                >
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VideoPlayer
