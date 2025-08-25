import React, { useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { Film } from 'lucide-react'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Projects from '@/pages/Projects'
import Editor from '@/pages/Editor'
import Profile from '@/pages/Profile'
import NotFound from '@/pages/NotFound'
import Login from '@/pages/Login'
import DiscordCallback from '@/pages/DiscordCallback'
import Terms from '@/pages/Terms'
import Privacy from '@/pages/Privacy'
import Settings from '@/pages/Settings'
import Clips from '@/pages/Clips'
import NewProject from '@/pages/NewProject'
import VideoEditor from '@/pages/VideoEditor'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { setTheme } from '@/store/slices/uiSlice'

function App() {
  console.log('App component rendered')
  const { theme } = useAppSelector(state => state.ui)
  const { currentUser } = useAppSelector(state => state.user)
  const dispatch = useAppDispatch()

  console.log('App state:', { theme, currentUser })

  // Add debugging to track route rendering
  React.useEffect(() => {
    console.log('App: Route changed to:', window.location.pathname)
  }, [])

  // Initialize theme on app load
  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'light'

    // Apply saved theme to document
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Update Redux store with saved theme
    if (savedTheme !== theme) {
      dispatch(setTheme(savedTheme))
    }
  }, [dispatch, theme])

  return (
    <ErrorBoundary>
      <Routes>
        {/* Standalone pages without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/auth/discord/callback" element={<DiscordCallback />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Main app without layout (Outlet fix) */}
        <Route path="/" element={
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            {/* Simple Navigation Header */}
            <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-secondary-900 dark:text-white">ClipMaster</span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/projects" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Projects
                    </Link>
                    <Link to="/clips" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Clips
                    </Link>
                    <Link to="/profile" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                    <Link to="/settings" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Dashboard />
            </div>
          </div>
        } />
        <Route path="/projects" element={
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-secondary-900 dark:text-white">ClipMaster</span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/projects" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Projects
                    </Link>
                    <Link to="/clips" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Clips
                    </Link>
                    <Link to="/profile" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                    <Link to="/settings" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Projects />
            </div>
          </div>
        } />
        <Route path="/profile" element={
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-secondary-900 dark:text-white">ClipMaster</span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/projects" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Projects
                    </Link>
                    <Link to="/clips" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Clips
                    </Link>
                    <Link to="/profile" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                    <Link to="/settings" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Profile />
            </div>
          </div>
        } />
        <Route path="/settings" element={
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-secondary-900 dark:text-white">ClipMaster</span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/projects" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Projects
                    </Link>
                    <Link to="/clips" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Clips
                    </Link>
                    <Link to="/profile" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                    <Link to="/settings" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Settings />
            </div>
          </div>
        } />
        <Route path="/test" element={
          <div style={{ padding: '20px', background: 'yellow' }}>
            <h1 style={{ color: 'black', fontSize: '32px' }}>🎉 TEST ROUTE WORKS! 🎉</h1>
            <p style={{ color: 'black' }}>If you see this, routes are working without Layout!</p>
          </div>
        } />
        <Route path="/new-project" element={
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-secondary-900 dark:text-white">ClipMaster</span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/projects" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Projects
                    </Link>
                    <Link to="/clips" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Clips
                    </Link>
                    <Link to="/profile" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                    <Link to="/settings" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <NewProject />
            </div>
          </div>
        } />
        <Route path="/clips" element={
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-secondary-900 dark:text-white">ClipMaster</span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/projects" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Projects
                    </Link>
                    <Link to="/clips" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Clips
                    </Link>
                    <Link to="/profile" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                    <Link to="/settings" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Clips />
            </div>
          </div>
        } />
        <Route path="/editor/:projectId" element={
          <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
            <nav className="bg-white dark:bg-secondary-800 shadow-sm border-b border-secondary-200 dark:border-secondary-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                        <Film className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl font-bold text-secondary-900 dark:text-white">ClipMaster</span>
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Dashboard
                    </Link>
                    <Link to="/projects" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Projects
                    </Link>
                    <Link to="/clips" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Clips
                    </Link>
                    <Link to="/profile" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Profile
                    </Link>
                    <Link to="/settings" className="text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium">
                      Settings
                    </Link>
                  </div>
                </div>
              </div>
            </nav>
            <VideoEditor />
          </div>
        } />
        <Route path="*" element={
          <Layout>
            <NotFound />
          </Layout>
        } />
      </Routes>
    </ErrorBoundary>
  )
}

export default App
