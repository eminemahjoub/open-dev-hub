import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        {/* 404 Visual */}
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">Page Not Found</h2>
        </div>
        
        {/* Description */}
        <p className="text-muted-foreground">
          Sorry, we couldn't find the page you're looking for. 
          It might have been moved, deleted, or you entered the wrong URL.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
        
        {/* Quick Links */}
        <div className="pt-8 border-t">
          <p className="text-sm text-muted-foreground mb-4">
            Quick links:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link 
              href="/directory" 
              className="text-sm text-primary hover:text-primary/80 underline"
            >
              Directory
            </Link>
            <Link 
              href="/compare" 
              className="text-sm text-primary hover:text-primary/80 underline"
            >
              Compare
            </Link>
            <Link 
              href="/about" 
              className="text-sm text-primary hover:text-primary/80 underline"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-primary hover:text-primary/80 underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 