import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Download,
  Trash2,
  Save,
  Moon,
  Sun,
  Monitor,
  Mail,
  MessageCircle,
  Volume2,
  Globe
} from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/hooks/redux'
import { setTheme } from '@/store/slices/uiSlice'

const Settings: React.FC = () => {
  const dispatch = useAppDispatch()
  const { theme } = useAppSelector(state => state.ui)
  const { currentUser } = useAppSelector(state => state.user)

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
    projectUpdates: true,
    clipProcessing: true
  })

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    soundEnabled: true,
    autoSave: true
  })

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: '',
    website: ''
  })

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      dispatch(setTheme(systemTheme))
      if (systemTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      dispatch(setTheme(newTheme))
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    localStorage.setItem('theme', newTheme)
  }

  const handleSaveProfile = () => {
    // Mock save functionality
    console.log('Saving profile:', profileData)
    // Here you would typically call an API
  }

  const handleSaveNotifications = () => {
    // Mock save functionality
    console.log('Saving notifications:', notifications)
    localStorage.setItem('notificationSettings', JSON.stringify(notifications))
  }

  const handleSavePreferences = () => {
    // Mock save functionality
    console.log('Saving preferences:', preferences)
    localStorage.setItem('userPreferences', JSON.stringify(preferences))
  }

  const handleExportData = () => {
    // Mock data export
    const data = {
      profile: profileData,
      notifications,
      preferences,
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-data-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
          Settings
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            Profile Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
              className="input w-full"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              className="input w-full"
              placeholder="Enter your email"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              className="input w-full"
              rows={3}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={profileData.website}
              onChange={(e) => setProfileData({...profileData, website: e.target.value})}
              className="input w-full"
              placeholder="https://your-website.com"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={handleSaveProfile} className="btn btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Profile
          </button>
        </div>
      </div>

      {/* Appearance Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            Appearance
          </h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 border rounded-lg transition-colors ${
                theme === 'light'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-secondary-300 dark:border-secondary-600'
              }`}
            >
              <Sun className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-center">
                <div className="font-medium">Light</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Always light mode</div>
              </div>
            </button>

            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 border rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-secondary-300 dark:border-secondary-600'
              }`}
            >
              <Moon className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-center">
                <div className="font-medium">Dark</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Always dark mode</div>
              </div>
            </button>

            <button
              onClick={() => handleThemeChange('system')}
              className="p-4 border border-secondary-300 dark:border-secondary-600 rounded-lg hover:border-primary-500 transition-colors"
            >
              <Monitor className="w-8 h-8 text-secondary-500 mx-auto mb-2" />
              <div className="text-center">
                <div className="font-medium">System</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Follow system preference</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            Notifications
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-secondary-500" />
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Receive notifications via email</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-secondary-500" />
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Receive browser push notifications</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-secondary-500" />
              <div>
                <div className="font-medium">Project Updates</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Get notified about project changes</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.projectUpdates}
                onChange={(e) => setNotifications({...notifications, projectUpdates: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-secondary-500" />
              <div>
                <div className="font-medium">Clip Processing</div>
                <div className="text-sm text-secondary-600 dark:text-secondary-400">Get notified when clips finish processing</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.clipProcessing}
                onChange={(e) => setNotifications({...notifications, clipProcessing: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-secondary-600 peer-checked:bg-primary-600"></div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={handleSaveNotifications} className="btn btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Notifications
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            Preferences
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Language
            </label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
              className="input w-full"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Timezone
            </label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
              className="input w-full"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="soundEnabled"
              checked={preferences.soundEnabled}
              onChange={(e) => setPreferences({...preferences, soundEnabled: e.target.checked})}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="soundEnabled" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Enable sound effects
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="autoSave"
              checked={preferences.autoSave}
              onChange={(e) => setPreferences({...preferences, autoSave: e.target.checked})}
              className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="autoSave" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Auto-save projects
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={handleSavePreferences} className="btn btn-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </div>

      {/* Account Management */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary-500" />
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
            Account Management
          </h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg">
            <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
              Export Your Data
            </h3>
            <p className="text-secondary-600 dark:text-secondary-400 text-sm mb-4">
              Download a copy of all your data including projects, clips, and settings.
            </p>
            <button onClick={handleExportData} className="btn btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </button>
          </div>

          <div className="p-4 border border-error-200 dark:border-error-800 rounded-lg">
            <h3 className="font-semibold text-error-900 dark:text-error-100 mb-2">
              Danger Zone
            </h3>
            <p className="text-error-700 dark:text-error-300 text-sm mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <button className="btn bg-error-600 hover:bg-error-700 text-white flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
