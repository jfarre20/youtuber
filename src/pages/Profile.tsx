import React from 'react'
import { Link } from 'react-router-dom'
import {
  User,
  Mail,
  Calendar,
  Film,
  Play,
  Clock,
  Award,
  Settings,
  Edit,
  MapPin,
  Globe,
  MessageCircle
} from 'lucide-react'
import { useAppSelector } from '@/hooks/redux'
import { formatDistanceToNow } from 'date-fns'

const Profile: React.FC = () => {
  const { currentUser } = useAppSelector(state => state.user)
  const { projects } = useAppSelector(state => state.project)
  const { clips } = useAppSelector(state => state.clip)

  // Mock data for demonstration
  const userStats = {
    totalProjects: projects?.length || 0,
    totalClips: clips?.length || 0,
    totalWatchTime: 0, // Would be calculated from clips
    memberSince: currentUser?.createdAt || new Date('2024-01-01'),
    lastActive: new Date(),
    achievements: [
      { name: 'First Project', icon: '🎬', earned: true },
      { name: 'Video Editor', icon: '✂️', earned: true },
      { name: 'Collaborator', icon: '🤝', earned: false },
      { name: 'Content Creator', icon: '🎨', earned: false },
    ]
  }

  const recentProjects = projects ? (Object.values(projects) as any[]).slice(0, 3) : []
  const recentClips = clips ? (Object.values(clips) as any[]).slice(0, 5) : []

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Profile
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Your account overview and activity
          </p>
        </div>
        <Link
          to="/settings"
          className="btn btn-secondary flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {/* Profile Header */}
      <div className="card">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {currentUser?.name.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                {currentUser?.name || 'Anonymous User'}
              </h2>
              {currentUser?.discordId && (
                <div className="flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/20 rounded-full">
                  <MessageCircle className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                    Discord
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                <Mail className="w-4 h-4" />
                <span>{currentUser?.email || 'No email provided'}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                <Calendar className="w-4 h-4" />
                <span>Member since {userStats.memberSince.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-secondary-600 dark:text-secondary-400">
                <Clock className="w-4 h-4" />
                <span>Last active {formatDistanceToNow(userStats.lastActive, { addSuffix: true })}</span>
              </div>
            </div>

            {currentUser?.bio && (
              <p className="text-secondary-700 dark:text-secondary-300">
                {currentUser.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg mx-auto mb-3">
            <Play className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {userStats.totalProjects}
          </div>
          <div className="text-secondary-600 dark:text-secondary-400">
            Projects Created
          </div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg mx-auto mb-3">
            <Film className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {userStats.totalClips}
          </div>
          <div className="text-secondary-600 dark:text-secondary-400">
            Clips Processed
          </div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg mx-auto mb-3">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {formatDuration(userStats.totalWatchTime)}
          </div>
          <div className="text-secondary-600 dark:text-secondary-400">
            Total Duration
          </div>
        </div>

        <div className="card text-center">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg mx-auto mb-3">
            <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            {userStats.achievements.filter(a => a.earned).length}
          </div>
          <div className="text-secondary-600 dark:text-secondary-400">
            Achievements
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Achievements
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {userStats.achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg text-center ${
                achievement.earned
                  ? 'border-primary-200 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50 opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{achievement.icon}</div>
              <div className={`font-medium ${
                achievement.earned
                  ? 'text-secondary-900 dark:text-secondary-100'
                  : 'text-secondary-500 dark:text-secondary-400'
              }`}>
                {achievement.name}
              </div>
              {achievement.earned && (
                <div className="text-xs text-primary-600 dark:text-primary-400 mt-1">
                  Earned
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              Recent Projects
            </h2>
            <Link
              to="/projects"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="border border-secondary-200 dark:border-secondary-700 rounded-lg p-4 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                  {project.name}
                </h3>
                <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-3">
                  {project.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-sm text-secondary-500 dark:text-secondary-400">
                  <span>{project.clips?.length || 0} clips</span>
                  <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Clips */}
      {recentClips.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              Recent Clips
            </h2>
            <Link
              to="/clips"
              className="text-primary-600 hover:text-primary-500 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentClips.map((clip) => (
              <div key={clip.id} className="flex items-center gap-4 p-3 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                <div className="w-12 h-12 bg-secondary-200 dark:bg-secondary-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Film className="w-6 h-6 text-secondary-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                    {clip.name}
                  </h3>
                  <p className="text-secondary-600 dark:text-secondary-400 text-sm">
                    {clip.duration ? formatDuration(clip.duration) : 'Processing...'}
                  </p>
                </div>
                <div className="text-sm text-secondary-500 dark:text-secondary-400">
                  {formatDistanceToNow(new Date(clip.createdAt), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Account Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Account Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/settings"
            className="flex items-center gap-3 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
          >
            <Settings className="w-5 h-5 text-primary-500" />
            <div>
              <div className="font-medium text-secondary-900 dark:text-secondary-100">
                Account Settings
              </div>
              <div className="text-secondary-600 dark:text-secondary-400 text-sm">
                Manage your preferences and account details
              </div>
            </div>
          </Link>

          <Link
            to="/projects"
            className="flex items-center gap-3 p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors"
          >
            <Play className="w-5 h-5 text-primary-500" />
            <div>
              <div className="font-medium text-secondary-900 dark:text-secondary-100">
                My Projects
              </div>
              <div className="text-secondary-600 dark:text-secondary-400 text-sm">
                View and manage all your projects
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Profile
