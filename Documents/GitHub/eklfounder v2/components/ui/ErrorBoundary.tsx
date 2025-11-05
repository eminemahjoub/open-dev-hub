'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './Button'

interface ErrorBoundaryProps {
  error?: string
  onRetry?: () => void
  title?: string
  description?: string
}

export function ErrorBoundary({ 
  error, 
  onRetry, 
  title = "Something went wrong",
  description = "An error occurred while loading this content."
}: ErrorBoundaryProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-destructive/10 rounded-full mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      <p className="text-muted-foreground mb-4 max-w-md">
        {error || description}
      </p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
    </div>
  )
} 