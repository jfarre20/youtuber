import React from 'react'
import { Link } from 'react-router-dom'
import {
  Play,
  Film,
  Clock,
  Users,
  Plus,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Upload,
  ArrowRight,
  Calendar,
  BarChart3
} from 'lucide-react'
import { useAppSelector } from '@/hooks/redux'
import { formatDistanceToNow } from 'date-fns'

const Dashboard: React.FC = () => {
  console.log('Dashboard component rendered - START')

  // Always call hooks first - this follows the Rules of Hooks
  const { currentUser } = useAppSelector(state => state.user)
  const { projects } = useAppSelector(state => state.project)
  const { clips } = useAppSelector(state => state.clip)

  console.log('Dashboard data:', { currentUser, projects, clips })

  // Calculate dashboard stats
  const projectStats = projects ? (Object.values(projects) as any[]) : []
  const clipStats = clips ? (Object.values(clips) as any[]) : []

  const completedProjects = projectStats.filter((p: any) => p.status === 'completed').length
  const processingProjects = projectStats.filter((p: any) => p.status === 'processing').length
  const totalClips = clipStats.length
  const recentProjects = projectStats.slice(0, 3)
  const recentClips = clipStats.slice(0, 5)

  // Calculate total duration from clips
  const totalDuration = clipStats.reduce((total: number, clip: any) => total + (clip.duration || 0), 0)

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Welcome back, {currentUser?.name || 'Creator'}! 👋
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Here's what's happening with your video projects today.
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg mx-auto mb-3">
            <Film className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {projectStats.length}
          </div>
          <div className="text-secondary-600 dark:text-secondary-400">
            Total Projects
          </div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {completedProjects}
          </div>
          <div className="text-secondary-600 dark:text-secondary-400">
            Completed
          </div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/20 rounded-lg mx-auto mb-3">
            <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {processingProjects}
          </div>
          <div className="text-secondary-600 dark:text-secondary-400">
            Processing
          </div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mx-auto mb-3">
            <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {totalClips}
          </div>
          <div className="text-secondary-600 dark:text-secondary-400">
            Total Clips
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Recent Projects */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Projects */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                Recent Projects
              </h2>
              <Link
                to="/projects"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="flex items-center gap-4 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-primary-600 dark:text-primary-400 font-bold">
                        {project.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/editor/${project.id}`}
                        className="block group"
                      >
                        <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {project.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 line-clamp-1">
                        {project.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-secondary-500 dark:text-secondary-400">
                        <span className="flex items-center gap-1">
                          <Film className="w-3 h-3" />
                          {project.clips?.length || 0} clips
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                          : project.status === 'processing'
                          ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                          : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-700 dark:text-secondary-300'
                      }`}>
                        {project.status === 'completed' && <CheckCircle className="w-3 h-3" />}
                        {project.status === 'processing' && <Clock className="w-3 h-3" />}
                        {project.status === 'draft' && <AlertCircle className="w-3 h-3" />}
                        <span className="capitalize">{project.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Film className="w-8 h-8 text-secondary-400" />
                </div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  No projects yet
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Create your first project to start organizing your video clips.
                </p>
                <Link to="/projects" className="btn btn-primary">
                  Create Project
                </Link>
              </div>
            )}
          </div>

          {/* Recent Clips */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                Recent Clips
              </h2>
              <Link
                to="/clips"
                className="text-primary-600 hover:text-primary-500 text-sm font-medium flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentClips.length > 0 ? (
              <div className="space-y-3">
                {recentClips.map((clip) => (
                  <div key={clip.id} className="flex items-center gap-4 p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                    <div className="w-12 h-12 bg-secondary-200 dark:bg-secondary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Film className="w-6 h-6 text-secondary-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-secondary-900 dark:text-secondary-100 truncate">
                        {clip.name}
                      </h3>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {clip.duration ? formatDuration(clip.duration) : 'Processing...'}
                      </p>
                    </div>
                    <div className="text-sm text-secondary-500 dark:text-secondary-400">
                      {formatDistanceToNow(new Date(clip.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-secondary-400" />
                </div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                  No clips yet
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                  Upload your first video clip to get started.
                </p>
                <Link to="/clips" className="btn btn-primary">
                  Upload Clip
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Quick Actions & Activity */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/projects"
                className="flex items-center gap-3 p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="font-medium text-secondary-900 dark:text-secondary-100">
                    New Project
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    Start a new video project
                  </div>
                </div>
              </Link>

              <Link
                to="/clips"
                className="flex items-center gap-3 p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="font-medium text-secondary-900 dark:text-secondary-100">
                    Upload Clip
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    Add video clips to library
                  </div>
                </div>
              </Link>

              <Link
                to="/editor"
                className="flex items-center gap-3 p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <Film className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="font-medium text-secondary-900 dark:text-secondary-100">
                    Video Editor
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    Edit and process videos
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {projectStats.length > 0 ? (
                <>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-900 dark:text-secondary-100">
                        Project "{projectStats[0]?.name}" completed processing
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        2 hours ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Upload className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-900 dark:text-secondary-100">
                        New clip uploaded to "{projectStats[0]?.name}"
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        5 hours ago
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-secondary-900 dark:text-secondary-100">
                        New project created
                      </p>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        1 day ago
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BarChart3 className="w-6 h-6 text-secondary-400" />
                  </div>
                  <h3 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                    No activity yet
                  </h3>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">
                    Your recent activity will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Storage Usage */}
          <div className="card">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
              Storage Usage
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  Used
                </span>
                <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                  2.4 GB
                </span>
              </div>
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '24%' }}></div>
              </div>
              <div className="flex items-center justify-between text-xs text-secondary-500 dark:text-secondary-400">
                <span>0 GB</span>
                <span>10 GB free</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
