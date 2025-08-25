import React, { useEffect } from 'react'
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface NotificationProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  onClose: (id: string) => void
  className?: string
}

const Notification: React.FC<NotificationProps> = ({
  id,
  type,
  message,
  duration = 5000,
  action,
  onClose,
  className,
  ...props
}) => {
  // Auto-close after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, id, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />
      case 'error':
        return <AlertCircle className="w-5 h-5" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />
      case 'info':
        return <Info className="w-5 h-5" />
    }
  }

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-success-50 border-success-200 text-success-800 dark:bg-success-900/20 dark:border-success-800 dark:text-success-400'
      case 'error':
        return 'bg-error-50 border-error-200 text-error-800 dark:bg-error-900/20 dark:border-error-800 dark:text-error-400'
      case 'warning':
        return 'bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-900/20 dark:border-warning-800 dark:text-warning-400'
      case 'info':
        return 'bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-400'
    }
  }

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-soft transition-all duration-300',
        getStyles(),
        className
      )}
      role="alert"
      aria-live="polite"
      {...props}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">
          {message}
        </p>
        {action && (
          <button
            onClick={action.onClick}
            className="mt-2 text-sm font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 rounded"
          >
            {action.label}
          </button>
        )}
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Notification
