import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        {/* Loading Spinner */}
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        
        {/* Loading Text */}
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-foreground">Loading...</h2>
          <p className="text-sm text-muted-foreground">
            Please wait while we load the content
          </p>
        </div>
        
        {/* Loading Progress Bars */}
        <div className="w-64 mx-auto space-y-2">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  )
} 