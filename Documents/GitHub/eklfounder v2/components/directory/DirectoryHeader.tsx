'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

interface DirectoryHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function DirectoryHeader({ searchQuery, onSearchChange }: DirectoryHeaderProps) {
  const [localQuery, setLocalQuery] = useState(searchQuery)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [localQuery, onSearchChange])

  // Sync with parent query changes
  useEffect(() => {
    setLocalQuery(searchQuery)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(localQuery)
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Fintech Directory
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Compare and discover the best fintech institutions for your business needs
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mt-8">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search institutions by name, category, or country..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {localQuery && (
                  <button
                    type="button"
                    onClick={() => setLocalQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 