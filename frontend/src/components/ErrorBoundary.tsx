import React, { ReactNode } from 'react'
import { AlertCircle, RotateCw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service (Sentry in production)
    console.error('Error caught:', error, errorInfo)
    this.setState({ errorInfo })

    // Send to Sentry if available
    if ((window as any).__SENTRY_DSN__) {
      // Sentry.captureException(error, { contexts: { react: errorInfo } })
    }
  }

  reset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
          <div className="text-center max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Something went wrong
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            {((import.meta as any).env.DEV || false) && this.state.errorInfo && (
              <details className="mb-4 text-left text-xs bg-gray-100 dark:bg-zinc-800 p-3 rounded text-gray-700 dark:text-gray-300">
                <summary className="cursor-pointer font-mono font-bold mb-2">
                  Details (Dev Only)
                </summary>
                <pre className="overflow-auto max-h-40 font-mono text-xs">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={this.reset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
