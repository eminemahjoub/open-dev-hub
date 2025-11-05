'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md mx-auto">
            {/* Error Visual */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <div className="p-4 bg-red-100 rounded-full">
                  <AlertTriangle className="h-12 w-12 text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Application Error
              </h1>
            </div>
            
            {/* Description */}
            <p className="text-gray-600">
              A critical error occurred in the application. 
              Please refresh the page to try again.
            </p>
            
            {/* Error Details (in development only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-100 rounded-lg p-4 text-left">
                <h3 className="font-medium text-gray-900 mb-2">Error Details:</h3>
                <pre className="text-xs text-gray-600 overflow-auto">
                  {error.message}
                </pre>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Go to Homepage
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
} 