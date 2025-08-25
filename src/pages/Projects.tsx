import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Play,
  Edit,
  Download,
  Trash2,
  Calendar,
  Clock,
  Film,
  Settings,
  Eye,
  Copy,
  Archive,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react'
import { useAppSelector } from '@/hooks/redux'
import { formatDistanceToNow } from 'date-fns'

const Projects: React.FC = () => {
  const { projects } = useAppSelector(state => state.project)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'updatedAt' | 'createdAt'>('updatedAt')

  // Mock data enhanced - in real app this would come from Redux store
  const mockProjects = projects?.length > 0 ? projects : [
    {
      id: '1',
      name: 'Tech Review Series',
      description: 'Monthly technology reviews and tutorials covering the latest gadgets and software',
      clips: 12,
      duration: 2730, // 45m 30s in seconds
      status: 'completed',
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      thumbnail: null,
      tags: ['technology', 'reviews'],
      progress: 100
    },
    {
      id: '2',
      name: 'Product Demo',
      description: 'Software product demonstration for the new mobile application',
      clips: 8,
      duration: 1695, // 28m 15s in seconds
      status: 'processing',
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      thumbnail: null,
      tags: ['demo', 'mobile'],
      progress: 75
    },
    {
      id: '3',
      name: 'Tutorial Videos',
      description: 'Step-by-step tutorial series for beginners learning video editing',
      clips: 15,
      duration: 4800, // 1h 20m in seconds
      status: 'draft',
      updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
      thumbnail: null,
      tags: ['tutorial', 'beginners'],
      progress: 0
    }
  ]

  // Filter and sort projects
  const filteredProjects = mockProjects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'updatedAt':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'processing':
        return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
      case 'error':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      default:
        return 'text-secondary-600 bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3" />
      case 'processing':
        return <Loader className="w-3 h-3 animate-spin" />
      case 'error':
        return <AlertCircle className="w-3 h-3" />
      default:
        return <Edit className="w-3 h-3" />
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleNewProject = () => {
    // Mock new project creation
    console.log('Creating new project...')
  }

  const handleEditProject = (projectId: string) => {
    // Navigate to editor or project settings
    console.log('Editing project:', projectId)
  }

  const handleExportProject = (projectId: string) => {
    // Mock export functionality
    console.log('Exporting project:', projectId)
  }

  const handleDeleteProject = (projectId: string) => {
    // Mock delete functionality
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      console.log('Deleting project:', projectId)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Projects
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Manage and organize your video projects ({filteredProjects.length} total)
          </p>
        </div>
        <Link
          to="/new-project"
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Project
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search projects by name or description..."
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
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Date Created</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="card group hover:shadow-medium transition-all duration-200">
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
              {project.thumbnail ? (
                <img
                  src={project.thumbnail}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-lg">
                      {project.name.charAt(0)}
                    </span>
                  </div>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">No preview</p>
                </div>
              )}

              {/* Status overlay */}
              <div className="absolute top-3 right-3">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span className="capitalize">{project.status}</span>
                </div>
              </div>

              {/* Progress bar for processing projects */}
              {project.status === 'processing' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary-200 dark:bg-secondary-700">
                  <div
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/editor/${project.id}`}
                    className="block group/link"
                  >
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 truncate group-hover/link:text-primary-600 dark:group-hover/link:text-primary-400 transition-colors">
                      {project.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-2 mt-1">
                    {project.description}
                  </p>
                </div>
                <div className="relative">
                  <button className="p-1 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
                  </button>
                </div>
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 3 && (
                    <span className="text-xs text-secondary-500 dark:text-secondary-400">
                      +{project.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Meta info */}
              <div className="flex items-center justify-between text-sm text-secondary-600 dark:text-secondary-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Film className="w-3 h-3" />
                    {project.clips} clips
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(project.duration)}
                  </span>
                </div>
              </div>

              {/* Updated time */}
              <div className="flex items-center gap-1 text-xs text-secondary-500 dark:text-secondary-400">
                <Calendar className="w-3 h-3" />
                <span>Updated {formatDistanceToNow(project.updatedAt, { addSuffix: true })}</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 pt-2">
                <Link
                  to={`/editor/${project.id}`}
                  className="flex-1 btn btn-primary text-sm flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Link>
                <button
                  onClick={() => handleExportProject(project.id)}
                  disabled={project.status !== 'completed'}
                  className="flex-1 btn btn-secondary text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <Download className="w-3 h-3" />
                  Export
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
            {searchQuery || statusFilter !== 'all' ? (
              <Search className="w-12 h-12 text-secondary-400" />
            ) : (
              <Plus className="w-12 h-12 text-secondary-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            {searchQuery || statusFilter !== 'all' ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Create your first project to start organizing your video clips and building amazing content.'
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
              <button onClick={handleNewProject} className="btn btn-primary">
                Create Project
              </button>
            </div>
          ) : (
            <button onClick={handleNewProject} className="btn btn-primary">
              Create Your First Project
            </button>
          )}
        </div>
      )}

      {/* Bulk Actions (if multiple projects selected) */}
      {filteredProjects.length > 1 && (
        <div className="fixed bottom-6 right-6 bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-lg shadow-hard p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              {filteredProjects.length} projects selected
            </span>
            <div className="flex gap-2">
              <button className="btn btn-secondary text-sm">
                <Archive className="w-3 h-3 mr-1" />
                Archive
              </button>
              <button className="btn btn-secondary text-sm">
                <Copy className="w-3 h-3 mr-1" />
                Duplicate
              </button>
              <button className="btn bg-red-600 hover:bg-red-700 text-white text-sm">
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Projects
