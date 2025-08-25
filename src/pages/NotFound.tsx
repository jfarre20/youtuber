import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl">🎬</span>
        </div>

        <h1 className="text-6xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Page Not Found
        </h2>

        <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn btn-primary flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="btn btn-secondary flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
