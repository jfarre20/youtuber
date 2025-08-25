import React, { useRef, useEffect, useCallback, useState } from 'react'
import { WaveformProps } from '@/types'
import { cn } from '@/utils/cn'

const Waveform: React.FC<WaveformProps> = ({
  audioData,
  currentTime,
  duration,
  onSeek,
  height = 80,
  color = '#3b82f6',
  progressColor = '#1d4ed8',
  className,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [hoverTime, setHoverTime] = useState(0)

  // Draw waveform
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width, height: canvasHeight } = canvas
    const centerY = canvasHeight / 2

    // Clear canvas
    ctx.clearRect(0, 0, width, canvasHeight)

    if (!audioData || audioData.length === 0) {
      // Draw placeholder waveform
      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.beginPath()

      for (let x = 0; x < width; x += 2) {
        const amplitude = Math.sin(x * 0.1) * 20
        ctx.moveTo(x, centerY - amplitude)
        ctx.lineTo(x, centerY + amplitude)
      }

      ctx.stroke()
      return
    }

    // Calculate samples per pixel
    const samplesPerPixel = Math.max(1, Math.floor(audioData.length / width))

    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()

    for (let x = 0; x < width; x++) {
      // Get average amplitude for this pixel
      const startSample = x * samplesPerPixel
      const endSample = Math.min(startSample + samplesPerPixel, audioData.length)

      let sum = 0
      for (let i = startSample; i < endSample; i++) {
        sum += Math.abs(audioData[i])
      }
      const averageAmplitude = sum / (endSample - startSample)

      // Scale amplitude to fit canvas
      const scaledAmplitude = averageAmplitude * (canvasHeight * 0.8)

      // Draw vertical line
      ctx.moveTo(x, centerY - scaledAmplitude)
      ctx.lineTo(x, centerY + scaledAmplitude)
    }

    ctx.stroke()

    // Draw progress line
    if (duration > 0) {
      const progressX = (currentTime / duration) * width

      ctx.strokeStyle = progressColor
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(progressX, 0)
      ctx.lineTo(progressX, canvasHeight)
      ctx.stroke()

      // Draw progress glow
      ctx.shadowColor = progressColor
      ctx.shadowBlur = 4
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Draw hover line
    if (isHovering && hoverTime > 0) {
      const hoverX = (hoverTime / duration) * width

      ctx.strokeStyle = color
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(hoverX, 0)
      ctx.lineTo(hoverX, canvasHeight)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }, [audioData, currentTime, duration, color, progressColor, isHovering, hoverTime])

  // Handle canvas resize
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = height * window.devicePixelRatio

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${height}px`

    drawWaveform()
  }, [height, drawWaveform])

  // Handle click/seek
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!duration) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const clickTime = (x / rect.width) * duration

    onSeek(Math.max(0, Math.min(clickTime, duration)))
  }, [duration, onSeek])

  // Handle mouse move for hover
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!duration) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const time = (x / rect.width) * duration

    setHoverTime(Math.max(0, Math.min(time, duration)))
  }, [duration])

  // Set up canvas and event listeners
  useEffect(() => {
    resizeCanvas()

    const handleResize = () => resizeCanvas()
    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [resizeCanvas])

  // Redraw when data changes
  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative cursor-pointer bg-secondary-50 dark:bg-secondary-800 rounded-lg overflow-hidden',
        className
      )}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ height }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Time tooltip */}
      {isHovering && hoverTime > 0 && (
        <div
          className="absolute top-0 transform -translate-x-1/2 -translate-y-full mb-2 px-2 py-1 bg-secondary-900 text-white text-xs rounded shadow-lg pointer-events-none"
          style={{
            left: `${(hoverTime / duration) * 100}%`,
          }}
        >
          {Math.floor(hoverTime / 60)}:{(hoverTime % 60).toFixed(1).padStart(4, '0')}
        </div>
      )}

      {/* Loading state */}
      {!audioData && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  )
}

export default Waveform
