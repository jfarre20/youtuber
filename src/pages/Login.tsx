import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useAppDispatch } from '@/hooks/redux'
import { setUser } from '@/store/slices/userSlice'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDiscordLogin = () => {
    // Discord OAuth2 configuration
    const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || 'your-discord-client-id'
    const REDIRECT_URI = `${window.location.origin}/auth/discord/callback`
    const SCOPE = 'identify email'

    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(SCOPE)}`

    window.location.href = discordAuthUrl
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock successful login
      const user = {
        id: '1',
        name: 'Demo User',
        email: email,
        avatar: null,
        preferences: {
          theme: 'light' as const,
          notifications: true,
          language: 'en'
        }
      }

      dispatch(setUser(user))
      navigate('/')
    } catch (err) {
      setError('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎬</span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Welcome Back
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-lg">
              <p className="text-error-600 dark:text-error-400 text-sm">{error}</p>
            </div>
          )}

          {/* Discord Login Button */}
          <button
            onClick={handleDiscordLogin}
            className="w-full btn btn-secondary mb-6 flex items-center justify-center gap-3"
          >
            <MessageCircle className="w-5 h-5" />
            Continue with Discord
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-200 dark:border-secondary-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-secondary-800 text-secondary-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-secondary-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10 w-full"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-secondary-600 dark:text-secondary-400">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-secondary-600 dark:text-secondary-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                Sign up
              </Link>
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-secondary-500 dark:text-secondary-400">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
