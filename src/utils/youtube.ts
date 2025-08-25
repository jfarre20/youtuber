import { YouTubeMetadata } from '@/types'

// YouTube URL patterns
const YOUTUBE_PATTERNS = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^&\n?#]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^&\n?#]+)/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^&\n?#]+)/
]

// YouTube video ID validation
const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/

/**
 * Extract YouTube video ID from various URL formats
 */
export function extractYouTubeId(url: string): string | null {
  if (!url || typeof url !== 'string') return null

  // Check if it's already a video ID
  if (YOUTUBE_ID_PATTERN.test(url.trim())) {
    return url.trim()
  }

  // Try each pattern
  for (const pattern of YOUTUBE_PATTERNS) {
    const match = url.match(pattern)
    if (match && match[1]) {
      const videoId = match[1]
      if (YOUTUBE_ID_PATTERN.test(videoId)) {
        return videoId
      }
    }
  }

  return null
}

/**
 * Validate if a string is a valid YouTube URL or video ID
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null
}

/**
 * Generate YouTube embed URL
 */
export function createYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}

/**
 * Generate YouTube thumbnail URL
 */
export function createYouTubeThumbnailUrl(
  videoId: string,
  quality: 'default' | 'medium' | 'high' | 'maxres' = 'medium'
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`
}

/**
 * Generate YouTube video URL
 */
export function createYouTubeVideoUrl(videoId: string, timestamp?: number): string {
  const baseUrl = `https://www.youtube.com/watch?v=${videoId}`
  if (timestamp && timestamp > 0) {
    return `${baseUrl}&t=${Math.floor(timestamp)}s`
  }
  return baseUrl
}

/**
 * Parse timestamp from YouTube URL (e.g., &t=123s or &t=2m30s)
 */
export function parseYouTubeTimestamp(url: string): number {
  const timestampMatch = url.match(/[?&]t=([^&]+)/)
  if (!timestampMatch) return 0

  const timestamp = timestampMatch[1]

  // Handle seconds (e.g., 123s)
  const secondsMatch = timestamp.match(/^(\d+)s?$/)
  if (secondsMatch) {
    return parseInt(secondsMatch[1], 10)
  }

  // Handle minutes and seconds (e.g., 2m30s)
  const timeMatch = timestamp.match(/^(\d+)m(\d+)s?$/)
  if (timeMatch) {
    const minutes = parseInt(timeMatch[1], 10)
    const seconds = parseInt(timeMatch[2], 10)
    return minutes * 60 + seconds
  }

  // Handle just minutes (e.g., 2m)
  const minutesMatch = timestamp.match(/^(\d+)m$/)
  if (minutesMatch) {
    return parseInt(minutesMatch[1], 10) * 60
  }

  // Try to parse as plain seconds
  const plainSeconds = parseInt(timestamp, 10)
  if (!isNaN(plainSeconds)) {
    return plainSeconds
  }

  return 0
}

/**
 * Extract start time from YouTube URL
 */
export function extractYouTubeStartTime(url: string): number {
  const videoId = extractYouTubeId(url)
  if (!videoId) return 0

  return parseYouTubeTimestamp(url)
}

/**
 * Create YouTube URL with timestamp
 */
export function createYouTubeUrlWithTimestamp(videoId: string, startTime: number): string {
  return createYouTubeVideoUrl(videoId, startTime)
}

/**
 * Mock YouTube metadata (in real app, this would come from YouTube API)
 */
export function getMockYouTubeMetadata(videoId: string): YouTubeMetadata {
  // This would be replaced with actual YouTube API calls
  return {
    title: `YouTube Video ${videoId}`,
    channel: 'YouTube Channel',
    channelId: 'UC1234567890',
    viewCount: Math.floor(Math.random() * 1000000),
    uploadDate: new Date().toISOString(),
    duration: 'PT10M30S', // ISO 8601 duration format
    thumbnailUrl: createYouTubeThumbnailUrl(videoId, 'high'),
    description: 'This is a sample video description.',
    tags: ['sample', 'video', 'content'],
    category: 'Education'
  }
}

/**
 * Parse ISO 8601 duration to seconds
 */
export function parseDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0

  const hours = parseInt(match[1] || '0', 10)
  const minutes = parseInt(match[2] || '0', 10)
  const seconds = parseInt(match[3] || '0', 10)

  return hours * 3600 + minutes * 60 + seconds
}

/**
 * Format seconds to YouTube timestamp format
 */
export function formatYouTubeTimestamp(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}m${minutes}s`
  }
  if (minutes > 0) {
    return `${minutes}m${secs}s`
  }
  return `${secs}s`
}

/**
 * Extract video information from YouTube URL
 */
export function extractYouTubeVideoInfo(url: string): {
  videoId: string | null
  startTime: number
  isValid: boolean
} {
  const videoId = extractYouTubeId(url)
  const startTime = parseYouTubeTimestamp(url)

  return {
    videoId,
    startTime,
    isValid: videoId !== null
  }
}
