import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Menu
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { toggleSidebar } from '@/store/slices/uiSlice'
import { cn } from '@/utils/cn'

interface BreadcrumbItem {
  name: string
  href?: string
}

const Header: React.FC = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { currentUser } = useAppSelector(state => state.user)
  const { notifications } = useAppSelector(state => state.ui)
  const [searchQuery, setSearchQuery] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Generate breadcrumbs from current path
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Add home
    breadcrumbs.push({ name: 'Dashboard', href: '/' })

    // Add path segments
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const isLast = index === pathSegments.length - 1

      // Convert segment to readable name
      const name = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      breadcrumbs.push({
        name,
        href: isLast ? undefined : currentPath
      })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()
  const unreadNotifications = notifications.filter(n => !n.duration).length

  return (
    <header className="sticky top-0 z-40 w-full border-b border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900">
      <div className="flex h-16 items-center justify-between px-4">
        {/* Left side - Mobile menu button and breadcrumbs */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 lg:hidden"
          >
            <Menu className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
          </button>

          {/* Breadcrumbs */}
          <nav className="hidden md:flex items-center space-x-2 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.name}>
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-secondary-400" />
                )}
                {crumb.href ? (
                  <Link
                    to={crumb.href}
                    className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-secondary-900 dark:text-secondary-100 font-medium">
                    {crumb.name}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-secondary-400" />
            </div>
            <input
              type="text"
              placeholder="Search projects, clips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full"
            />
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors">
            <Bell className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {currentUser?.name.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <span className="hidden md:block text-sm font-medium text-secondary-900 dark:text-secondary-100">
                {currentUser?.name || 'Guest'}
              </span>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-800 rounded-lg shadow-hard border border-secondary-200 dark:border-secondary-700 py-2 z-20">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-secondary-200 dark:border-secondary-700">
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400">
                          {currentUser.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="border-t border-secondary-200 dark:border-secondary-700 my-1"></div>
                      <button className="flex items-center gap-3 w-full px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4" />
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
