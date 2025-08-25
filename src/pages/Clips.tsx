import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  MoreVertical,
  Film,
  Play,
  Edit,
  Download,
  Trash2,
  Calendar,
  Clock,
  Eye,
  Copy,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react'
import { useAppSelector } from '@/hooks/redux'
import { formatDistanceToNow } from 'date-fns'

const Clips: React.FC = () => {
  const { clips } = useAppSelector(state => state.clip)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'duration' | 'createdAt' | 'updatedAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock data enhanced - in real app this would come from Redux store
  const mockClips = clips?.length > 0 ? clips : [
    {
      id: '1',
      name: 'Tech Review Intro',
      description: 'Introduction segment for the monthly tech review',
      duration: 120, // 2 minutes in seconds
      status: 'completed',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      thumbnail: null,
      url: 'https://example.com/clip1.mp4',
      tags: ['intro', 'technology'],
      size: 45.2, // MB
      projectId: '1',
      projectName: 'Tech Review Series'
    },
    {
      id: '2',
      name: 'Product Demo Walkthrough',
      description: 'Step-by-step demonstration of the new mobile app features',
      duration: 480, // 8 minutes in seconds
      status: 'processing',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      thumbnail: null,
      url: null,
      tags: ['demo', 'mobile', 'walkthrough'],
      size: 120.8,
      projectId: '2',
      projectName: 'Product Demo',
      progress: 75
    },
    {
      id: '3',
      name: 'Tutorial: Basic Editing',
      description: 'Learn the basics of video editing with this comprehensive guide',
      duration: 900, // 15 minutes in seconds
      status: 'completed',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
      thumbnail: null,
      url: 'https://example.com/clip3.mp4',
      tags: ['tutorial', 'beginners', 'editing'],
      size: 320.5,
      projectId: '3',
      projectName: 'Tutorial Videos'
    },
    {
      id: '4',
      name: 'Interview with Developer',
      description: 'Exclusive interview discussing the development process',
      duration: 720, // 12 minutes in seconds
      status: 'error',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 46 * 60 * 60 * 1000),
      thumbnail: null,
      url: null,
      tags: ['interview', 'developer'],
      size: 0,
      projectId: '1',
      projectName: 'Tech Review Series',
      error: 'Video processing failed due to corrupted source file'
    },
    {
      id: '5',
      name: 'Quick Tips Compilation',
      description: 'Collection of quick video editing tips and tricks',
      duration: 300, // 5 minutes in seconds
      status: 'draft',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      thumbnail: null,
      url: null,
      tags: ['tips', 'compilation'],
      size: 0,
      projectId: null,
      projectName: null
    }
  ]

  // Filter and sort clips
  const filteredClips = mockClips
    .filter(clip => {
      const matchesSearch = clip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           clip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (clip.tags && clip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
      const matchesStatus = statusFilter === 'all' || clip.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'duration':
          comparison = a.duration - b.duration
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'updatedAt':
        default:
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20'
      case 'processing':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20'
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20'
      default:
        return 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />
      case 'processing':
        return <Loader className="w-4 h-4 animate-spin" />
      case 'error':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Edit className="w-4 h-4" />
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatFileSize = (sizeInMB: number) => {
    if (sizeInMB < 1) {
      return `${(sizeInMB * 1024).toFixed(0)} KB`
    } else if (sizeInMB < 1024) {
      return `${sizeInMB.toFixed(1)} MB`
    } else {
      return `${(sizeInMB / 1024).toFixed(1)} GB`
    }
  }

  const handleViewClip = (clipId: string) => {
    // Mock view functionality
    console.log('Viewing clip:', clipId)
  }

  const handleEditClip = (clipId: string) => {
    // Mock edit functionality
    console.log('Editing clip:', clipId)
  }

  const handleDownloadClip = (clipId: string) => {
    // Mock download functionality
    console.log('Downloading clip:', clipId)
  }

  const handleDeleteClip = (clipId: string) => {
    // Mock delete functionality
    if (confirm('Are you sure you want to delete this clip? This action cannot be undone.')) {
      console.log('Deleting clip:', clipId)
    }
  }

  const handleRetryProcessing = (clipId: string) => {
    // Mock retry functionality
    console.log('Retrying processing for clip:', clipId)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Clips
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Manage your video clips and processing queue ({filteredClips.length} total)
          </p>
        </div>
        <Link to="/projects" className="btn btn-primary flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Clip
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search clips by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input px-3 py-2"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="error">Error</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="input px-3 py-2"
          >
            <option value="createdAt">Date Created</option>
            <option value="updatedAt">Last Updated</option>
            <option value="name">Name</option>
            <option value="duration">Duration</option>
          </select>

          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn btn-secondary p-2"
          >
            {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </button>

          <div className="flex border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-secondary-600 dark:text-secondary-400'} hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-secondary-600 dark:text-secondary-400'} hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Clips Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {filteredClips.map((clip) => (
            <div key={clip.id} className="card group hover:shadow-medium transition-all duration-200">
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-800 dark:to-secondary-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                {clip.thumbnail ? (
                  <img
                    src={clip.thumbnail}
                    alt={clip.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <Film className="w-12 h-12 text-secondary-400 mx-auto mb-2" />
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">No preview</p>
                  </div>
                )}

                {/* Play overlay */}
                {clip.status === 'completed' && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleViewClip(clip.id)}
                      className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Play className="w-5 h-5 text-secondary-900 ml-0.5" />
                    </button>
                  </div>
                )}

                {/* Status overlay */}
                <div className="absolute top-3 right-3">
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(clip.status)}`}>
                    {getStatusIcon(clip.status)}
                    <span className="capitalize">{clip.status}</span>
                  </div>
                </div>

                {/* Progress bar for processing clips */}
                {clip.status === 'processing' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary-200 dark:bg-secondary-700">
                    <div
                      className="h-full bg-primary-500 transition-all duration-300"
                      style={{ width: `${clip.progress || 0}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                      {clip.name}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2 mt-1">
                      {clip.description}
                    </p>
                  </div>
                  <div className="relative">
                    <button className="p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                {clip.tags && clip.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {clip.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
                      >
                        {tag}
                      </span>
                    ))}
                    {clip.tags.length > 2 && (
                      <span className="text-xs text-secondary-500 dark:text-secondary-400">
                        +{clip.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Meta info */}
                <div className="flex items-center justify-between text-sm text-secondary-600 dark:text-secondary-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(clip.duration)}
                    </span>
                    {clip.size > 0 && (
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {formatFileSize(clip.size)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Project info */}
                {clip.projectName && (
                  <div className="text-xs text-secondary-500 dark:text-secondary-400">
                    Project: <Link to={`/projects`} className="text-primary-600 hover:text-primary-500">{clip.projectName}</Link>
                  </div>
                )}

                {/* Updated time */}
                <div className="flex items-center gap-1 text-xs text-secondary-500 dark:text-secondary-400">
                  <Calendar className="w-3 h-3" />
                  <span>Updated {formatDistanceToNow(clip.updatedAt, { addSuffix: true })}</span>
                </div>

                {/* Error message */}
                {clip.status === 'error' && clip.error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                    <p className="text-xs text-red-700 dark:text-red-300">{clip.error}</p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2 pt-2">
                  {clip.status === 'completed' && (
                    <>
                      <button
                        onClick={() => handleViewClip(clip.id)}
                        className="flex-1 btn btn-secondary text-sm flex items-center justify-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadClip(clip.id)}
                        className="flex-1 btn btn-secondary text-sm flex items-center justify-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </button>
                    </>
                  )}

                  {clip.status === 'error' && (
                    <button
                      onClick={() => handleRetryProcessing(clip.id)}
                      className="flex-1 btn btn-primary text-sm flex items-center justify-center gap-1"
                    >
                      <Loader className="w-3 h-3" />
                      Retry
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteClip(clip.id)}
                    className="btn btn-secondary text-sm p-2"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredClips.map((clip) => (
            <div key={clip.id} className="card hover:shadow-medium transition-shadow duration-200">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-20 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-800 dark:to-secondary-700 rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                  {clip.thumbnail ? (
                    <img
                      src={clip.thumbnail}
                      alt={clip.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Film className="w-6 h-6 text-secondary-400" />
                  )}

                  {/* Status indicator */}
                  <div className="absolute -top-1 -right-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${getStatusColor(clip.status)}`}>
                      {getStatusIcon(clip.status)}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                        {clip.name}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-1">
                        {clip.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-secondary-500 dark:text-secondary-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(clip.duration)}
                        </span>
                        {clip.size > 0 && (
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {formatFileSize(clip.size)}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(clip.updatedAt, { addSuffix: true })}
                        </span>
                        {clip.projectName && (
                          <span>
                            Project: <Link to={`/projects`} className="text-primary-600 hover:text-primary-500">{clip.projectName}</Link>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      {clip.status === 'completed' && (
                        <>
                          <button
                            onClick={() => handleViewClip(clip.id)}
                            className="btn btn-secondary text-sm p-2"
                            title="View Clip"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownloadClip(clip.id)}
                            className="btn btn-secondary text-sm p-2"
                            title="Download Clip"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {clip.status === 'error' && (
                        <button
                          onClick={() => handleRetryProcessing(clip.id)}
                          className="btn btn-primary text-sm flex items-center gap-1"
                        >
                          <Loader className="w-3 h-3" />
                          Retry
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteClip(clip.id)}
                        className="btn btn-secondary text-sm p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete Clip"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {filteredClips.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {searchQuery || statusFilter !== 'all' ? (
              <Search className="w-12 h-12 text-secondary-400" />
            ) : (
              <Film className="w-12 h-12 text-secondary-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No clips found' : 'No clips yet'}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Upload your first video clip to start building amazing content.'
            }
          </p>
          {(searchQuery || statusFilter !== 'all') ? (
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('')
                  setStatusFilter('all')
                }}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
              <Link to="/projects" className="btn btn-primary">
                Upload Clip
              </Link>
            </div>
          ) : (
            <Link to="/projects" className="btn btn-primary">
              Upload Your First Clip
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default Clips
