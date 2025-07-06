'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* Error Visual */}
        <div className="space-y-2">
          <div className="flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Something went wrong!</h1>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground">
          We're sorry, but something unexpected happened. 
          Please try refreshing the page or go back to the homepage.
        </p>
        
        {/* Error Details (in development only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-muted/30 rounded-lg p-4 text-left">
            <h3 className="font-medium text-foreground mb-2">Error Details:</h3>
            <pre className="text-xs text-muted-foreground overflow-auto">
              {error.message}
            </pre>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <a href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </a>
          </Button>
        </div>
        
        {/* Support Info */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            If this problem persists, please{' '}
            <a 
              href="/contact" 
              className="text-primary hover:text-primary/80 underline"
            >
              contact our support team
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
} 