import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  private handleRefresh = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900 flex items-center justify-center p-4">
          <div className="card max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-16 h-16 text-error-500" />
            </div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Something went wrong
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button
              onClick={this.handleRefresh}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </button>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-secondary-600 dark:text-secondary-400">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-secondary-100 dark:bg-secondary-800 p-3 rounded overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
