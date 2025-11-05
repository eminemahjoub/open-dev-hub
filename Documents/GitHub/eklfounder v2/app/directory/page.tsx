'use client'

import { useState, useMemo } from 'react'
import { DirectoryHeader } from '@/components/directory/DirectoryHeader'
import { SearchFilters } from '@/components/directory/SearchFilters'
import { FintechGrid } from '@/components/directory/FintechGrid'
import { ViewToggle } from '@/components/directory/ViewToggle'

interface Filters {
  query?: string
  category?: string
  countries?: string
  riskLevel?: string
  isPartner?: boolean
  minRating?: number
  minFee?: number
  maxFee?: number
}



export default function DirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({})
  const [totalInstitutions, setTotalInstitutions] = useState(0)

  const combinedFilters = useMemo(() => ({
    ...filters,
    query: searchQuery.trim() || undefined
  }), [filters, searchQuery])

  const handleFiltersChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const clearAllFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  return (
    <div className="min-h-screen bg-background">
      <DirectoryHeader 
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <SearchFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearAll={clearAllFilters}
            />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Fintech Directory
                </h1>
                <p className="text-muted-foreground mt-1">
                  {totalInstitutions}+ verified institutions
                </p>
              </div>
              <ViewToggle />
            </div>
            
            <FintechGrid 
              filters={combinedFilters}
              onTotalChange={setTotalInstitutions}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 