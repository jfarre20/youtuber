import React, { useRef, useState, useCallback, useEffect } from 'react'
import { TimelineProps, TimelineClip } from '@/types'
import { formatTime } from '@/utils/format'
import { cn } from '@/utils/cn'

const Timeline: React.FC<TimelineProps> = ({
  clips,
  currentTime,
  duration,
  zoom = 1,
  selectedClipId,
  onTimeChange,
  onClipSelect,
  onClipUpdate,
  onClipReorder,
  snapToGrid = true,
  gridSize = 0.1,
  className,
  ...props
}) => {
  const timelineRef = useRef<HTMLDivElement>(null)
  const playheadRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartX, setDragStartX] = useState(0)
  const [draggedClip, setDraggedClip] = useState<TimelineClip | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [resizingClip, setResizingClip] = useState<string | null>(null)
  const [resizeHandle, setResizeHandle] = useState<'start' | 'end' | null>(null)

  const timelineHeight = 80
  const headerHeight = 30
  const pixelsPerSecond = 100 * zoom // Base 100px per second, scaled by zoom

  // Convert time to pixels
  const timeToPixels = useCallback((time: number) => time * pixelsPerSecond, [pixelsPerSecond])

  // Convert pixels to time
  const pixelsToTime = useCallback((pixels: number) => pixels / pixelsPerSecond, [pixelsPerSecond])

  // Snap time to grid
  const snapToGridTime = useCallback((time: number) => {
    if (!snapToGrid) return time
    return Math.round(time / gridSize) * gridSize
  }, [snapToGrid, gridSize])

  // Handle playhead drag
  const handlePlayheadMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStartX(e.clientX)
    e.preventDefault()
  }, [])

  const handlePlayheadMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !timelineRef.current) return

    const rect = timelineRef.current.getBoundingClientRect()
    const relativeX = e.clientX - rect.left
    const newTime = Math.max(0, Math.min(duration, pixelsToTime(relativeX)))
    const snappedTime = snapToGridTime(newTime)

    onTimeChange(snappedTime)
  }, [isDragging, duration, pixelsToTime, snapToGridTime, onTimeChange])

  const handlePlayheadMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Handle timeline click (seek)
  const handleTimelineClick = useCallback((e: React.MouseEvent) => {
    if (isDragging || draggedClip || resizingClip) return

    const rect = timelineRef.current?.getBoundingClientRect()
    if (!rect) return

    const relativeX = e.clientX - rect.left
    const newTime = Math.max(0, Math.min(duration, pixelsToTime(relativeX)))
    const snappedTime = snapToGridTime(newTime)

    onTimeChange(snappedTime)
  }, [isDragging, draggedClip, resizingClip, duration, pixelsToTime, snapToGridTime, onTimeChange])

  // Handle clip drag start
  const handleClipMouseDown = useCallback((e: React.MouseEvent, clip: TimelineClip) => {
    e.stopPropagation()
    setDraggedClip(clip)
    setDragStartX(e.clientX)

    const rect = e.currentTarget.getBoundingClientRect()
    const timelineRect = timelineRef.current?.getBoundingClientRect()
    if (timelineRect) {
      setDragOffset(e.clientX - rect.left - timelineRect.left)
    }

    onClipSelect(clip.id)
  }, [onClipSelect])

  // Handle clip resize start
  const handleResizeMouseDown = useCallback((e: React.MouseEvent, clipId: string, handle: 'start' | 'end') => {
    e.stopPropagation()
    setResizingClip(clipId)
    setResizeHandle(handle)
    setDragStartX(e.clientX)
  }, [])

  // Handle mouse move for dragging and resizing
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedClip) {
      // Handle clip dragging
      const timelineRect = timelineRef.current?.getBoundingClientRect()
      if (!timelineRect) return

      const relativeX = e.clientX - timelineRect.left - dragOffset
      const newStartTime = Math.max(0, pixelsToTime(relativeX))
      const snappedStartTime = snapToGridTime(newStartTime)
      const duration = draggedClip.endTime - draggedClip.startTime
      const newEndTime = snappedStartTime + duration

      if (newEndTime <= overallDuration) {
        onClipUpdate(draggedClip.id, {
          startTime: snappedStartTime,
          endTime: newEndTime
        })
      }
    } else if (resizingClip && resizeHandle) {
      // Handle clip resizing
      const deltaX = e.clientX - dragStartX
      const deltaTime = pixelsToTime(deltaX)
      const snappedDeltaTime = snapToGridTime(deltaTime)

      const clip = clips.find(c => c.id === resizingClip)
      if (!clip) return

      if (resizeHandle === 'start') {
        const newStartTime = Math.max(0, clip.startTime + snappedDeltaTime)
        if (newStartTime < clip.endTime) {
          onClipUpdate(resizingClip, { startTime: newStartTime })
        }
      } else if (resizeHandle === 'end') {
        const newEndTime = Math.min(overallDuration, clip.endTime + snappedDeltaTime)
        if (newEndTime > clip.startTime) {
          onClipUpdate(resizingClip, { endTime: newEndTime })
        }
      }
    } else if (isDragging) {
      handlePlayheadMouseMove(e)
    }
  }, [draggedClip, resizingClip, resizeHandle, dragStartX, dragOffset, pixelsToTime, snapToGridTime, onClipUpdate, isDragging, handlePlayheadMouseMove])

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setDraggedClip(null)
    setResizingClip(null)
    setResizeHandle(null)
    setDragOffset(0)
    handlePlayheadMouseUp()
  }, [handlePlayheadMouseUp])

  // Global mouse event listeners
  useEffect(() => {
    if (draggedClip || resizingClip || isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [draggedClip, resizingClip, isDragging, handleMouseMove, handleMouseUp])

  // Calculate total timeline width
  const overallDuration = Math.max(duration, ...clips.map(clip => clip.endTime), 0)
  const timelineWidth = timeToPixels(overallDuration)

  // Generate time markers
  const generateTimeMarkers = useCallback(() => {
    const markers = []
    const interval = Math.max(1, Math.floor(50 / zoom)) // Adjust interval based on zoom

    for (let time = 0; time <= overallDuration; time += interval) {
      markers.push(time)
    }

    return markers
  }, [overallDuration, zoom])

  const timeMarkers = generateTimeMarkers()

  return (
    <div className={cn('flex flex-col bg-secondary-800 border border-secondary-700 rounded-lg', className)} {...props}>
      {/* Timeline Header */}
      <div className="flex items-center justify-between p-3 border-b border-secondary-700">
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-medium text-secondary-100">Timeline</h3>
          <span className="text-xs text-secondary-400">
            {formatTime(currentTime)} / {formatTime(overallDuration)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary-400">Zoom:</span>
          <input
            type="range"
            min="0.1"
            max="5"
            step="0.1"
            value={zoom}
            onChange={(e) => onClipUpdate('', { zoom: parseFloat(e.target.value) } as any)}
            className="w-16 h-2 bg-secondary-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <span className="text-xs text-secondary-400 w-8">{zoom}x</span>
        </div>
      </div>

      {/* Timeline Container */}
      <div className="relative overflow-x-auto" style={{ height: timelineHeight + headerHeight }}>
        <div
          ref={timelineRef}
          className="relative cursor-crosshair"
          style={{ width: timelineWidth, height: timelineHeight }}
          onClick={handleTimelineClick}
        >
          {/* Time Ruler */}
          <div className="absolute top-0 left-0 right-0 h-6 bg-secondary-900 border-b border-secondary-700">
            {timeMarkers.map((time) => (
              <div
                key={time}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: timeToPixels(time) }}
              >
                <div className="w-px h-2 bg-secondary-600" />
                <span className="text-xs text-secondary-400 mt-1">
                  {formatTime(time)}
                </span>
              </div>
            ))}
          </div>

          {/* Grid Lines */}
          {snapToGrid && (
            <div className="absolute top-6 left-0 right-0 bottom-0 opacity-20">
              {timeMarkers.map((time) => (
                <div
                  key={`grid-${time}`}
                  className="absolute top-0 w-px h-full bg-secondary-600"
                  style={{ left: timeToPixels(time) }}
                />
              ))}
            </div>
          )}

          {/* Timeline Clips */}
          <div className="absolute top-6 left-0 right-0 bottom-0">
            {clips.map((clip) => (
              <div
                key={clip.id}
                className={cn(
                  'absolute top-2 h-12 rounded border-2 cursor-move transition-all duration-200',
                  selectedClipId === clip.id
                    ? 'border-primary-400 bg-primary-500/20 shadow-lg'
                    : 'border-secondary-500 bg-secondary-600 hover:border-secondary-400'
                )}
                style={{
                  left: timeToPixels(clip.startTime),
                  width: timeToPixels(clip.endTime - clip.startTime),
                }}
                onMouseDown={(e) => handleClipMouseDown(e, clip)}
                onClick={(e) => {
                  e.stopPropagation()
                  onClipSelect(clip.id)
                }}
              >
                {/* Clip Content */}
                <div className="flex items-center justify-between h-full px-2">
                  <span className="text-xs text-white truncate font-medium">
                    Clip {clip.position + 1}
                  </span>
                  <span className="text-xs text-secondary-300">
                    {formatTime(clip.endTime - clip.startTime)}
                  </span>
                </div>

                {/* Resize Handles */}
                <div
                  className="absolute left-0 top-0 w-1 h-full cursor-ew-resize bg-primary-400 opacity-0 hover:opacity-100"
                  onMouseDown={(e) => handleResizeMouseDown(e, clip.id, 'start')}
                />
                <div
                  className="absolute right-0 top-0 w-1 h-full cursor-ew-resize bg-primary-400 opacity-0 hover:opacity-100"
                  onMouseDown={(e) => handleResizeMouseDown(e, clip.id, 'end')}
                />
              </div>
            ))}
          </div>

          {/* Playhead */}
          <div
            ref={playheadRef}
            className="absolute top-0 w-0.5 bg-primary-400 z-10 cursor-ew-resize"
            style={{
              left: timeToPixels(currentTime),
              height: timelineHeight,
            }}
            onMouseDown={handlePlayheadMouseDown}
          >
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-primary-400 rounded-full" />
          </div>
        </div>
      </div>

      {/* Timeline Footer */}
      <div className="flex items-center justify-between p-2 border-t border-secondary-700 text-xs text-secondary-400">
        <div className="flex items-center gap-4">
          <span>Clips: {clips.length}</span>
          <span>Duration: {formatTime(overallDuration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={snapToGrid}
              onChange={(e) => onClipUpdate('', { snapToGrid: e.target.checked } as any)}
              className="rounded"
            />
            Snap to grid
          </label>
        </div>
      </div>
    </div>
  )
}

export default Timeline
