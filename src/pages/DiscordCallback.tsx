import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MessageCircle, CheckCircle, XCircle, Loader } from 'lucide-react'
import { useAppDispatch } from '@/hooks/redux'
import { setUser } from '@/store/slices/userSlice'

const DiscordCallback: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleDiscordCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        setStatus('error')
        setMessage(`Discord authentication failed: ${error}`)
        return
      }

      if (!code) {
        setStatus('error')
        setMessage('No authorization code received from Discord')
        return
      }

      try {
        // Exchange code for access token
        const CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID || 'your-discord-client-id'
        const CLIENT_SECRET = import.meta.env.VITE_DISCORD_CLIENT_SECRET || 'your-discord-client-secret'
        const REDIRECT_URI = `${window.location.origin}/auth/discord/callback`

        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: REDIRECT_URI,
          }),
        })

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token')
        }

        const tokenData = await tokenResponse.json()

        // Get user information
        const userResponse = await fetch('https://discord.com/api/users/@me', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        })

        if (!userResponse.ok) {
          throw new Error('Failed to fetch user information')
        }

        const discordUser = await userResponse.json()

        // Create or update user in your system
        const user = {
          id: discordUser.id,
          name: discordUser.username,
          email: discordUser.email,
          avatar: discordUser.avatar
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null,
          discordId: discordUser.id,
          preferences: {
            theme: 'light' as const,
            notifications: true,
            language: 'en'
          }
        }

        dispatch(setUser(user))
        setStatus('success')
        setMessage('Successfully signed in with Discord!')

        // Redirect after a short delay
        setTimeout(() => {
          navigate('/')
        }, 2000)

      } catch (err) {
        console.error('Discord authentication error:', err)
        setStatus('error')
        setMessage('Failed to complete Discord authentication. Please try again.')
      }
    }

    handleDiscordCallback()
  }, [searchParams, dispatch, navigate])

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader className="w-8 h-8 text-primary-500 animate-spin" />
      case 'success':
        return <CheckCircle className="w-8 h-8 text-success-500" />
      case 'error':
        return <XCircle className="w-8 h-8 text-error-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-primary-600 dark:text-primary-400'
      case 'success':
        return 'text-success-600 dark:text-success-400'
      case 'error':
        return 'text-error-600 dark:text-error-400'
    }
  }

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Discord Authentication
          </h1>
        </div>

        {/* Status */}
        <div className="card">
          <div className="flex flex-col items-center space-y-4">
            {getStatusIcon()}

            <div>
              <h2 className={`text-xl font-semibold ${getStatusColor()}`}>
                {status === 'loading' && 'Connecting to Discord...'}
                {status === 'success' && 'Authentication Successful!'}
                {status === 'error' && 'Authentication Failed'}
              </h2>

              <p className="text-secondary-600 dark:text-secondary-400 mt-2">
                {message}
              </p>
            </div>

            {status === 'loading' && (
              <div className="w-full bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div className="bg-primary-500 h-2 rounded-full animate-pulse w-3/4"></div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-3 w-full">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full btn btn-primary"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full btn btn-secondary"
                >
                  Go Home
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-secondary-500 dark:text-secondary-400">
            This page will redirect you automatically after authentication.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DiscordCallback
