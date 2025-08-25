import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  Film,
  Play,
  Settings,
  User,
  Menu,
  X,
  Moon,
  Sun,
  LogOut
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { toggleSidebar, setTheme } from '@/store/slices/uiSlice'
import { cn } from '@/utils/cn'

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: Play },
  { name: 'Clips', href: '/clips', icon: Film },
  { name: 'Profile', href: '/profile', icon: User },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const Sidebar: React.FC = () => {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const { sidebarOpen, theme } = useAppSelector(state => state.ui)
  const { currentUser } = useAppSelector(state => state.user)

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))

    // Apply theme to document
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Persist theme to localStorage
    localStorage.setItem('theme', newTheme)
  }

  const handleSidebarToggle = () => {
    dispatch(toggleSidebar())
  }

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-secondary-900/50 lg:hidden"
          onClick={handleSidebarToggle}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-secondary-800 text-secondary-100 transition-transform duration-300 ease-in-out lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <Film className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">ClipMaster</h1>
          </div>

          {/* Mobile close button */}
          <button
            onClick={handleSidebarToggle}
            className="p-1 rounded-lg hover:bg-secondary-700 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-secondary-300 hover:bg-secondary-700 hover:text-white'
                )}
                onClick={() => {
                  // Close sidebar on mobile after navigation
                  if (window.innerWidth < 1024) {
                    dispatch(toggleSidebar())
                  }
                }}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-secondary-700 p-4">
          {currentUser ? (
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {currentUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-secondary-400 truncate">
                  {currentUser.email}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <Link
                to="/login"
                className="w-full btn btn-primary flex items-center justify-center gap-2"
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    dispatch(toggleSidebar())
                  }
                }}
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={handleThemeToggle}
            className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-secondary-300 rounded-lg hover:bg-secondary-700 hover:text-white transition-colors duration-200"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-5 h-5" />
                Dark Mode
              </>
            ) : (
              <>
                <Sun className="w-5 h-5" />
                Light Mode
              </>
            )}
          </button>

          {/* Logout button */}
          {currentUser && (
            <button
              onClick={() => {
                // Mock logout functionality
                console.log('Logging out...')
                // In real app, dispatch logout action
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-secondary-300 rounded-lg hover:bg-secondary-700 hover:text-white transition-colors duration-200 mt-2"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={handleSidebarToggle}
        className="fixed top-4 left-4 z-30 p-2 bg-secondary-800 text-secondary-100 rounded-lg lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  )
}

export default Sidebar
