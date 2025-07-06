'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Star, MapPin, Plus, Eye, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { institutionsApi, handleApiError, type ApiResponse } from '@/lib/api'
import type { Fintech } from '@/types'

interface FintechGridProps {
  filters: {
    query?: string
    category?: string
    countries?: string
    riskLevel?: string
    isPartner?: boolean
    minRating?: number
    minFee?: number
    maxFee?: number
  }
  onTotalChange?: (total: number) => void
}

export function FintechGrid({ filters, onTotalChange }: FintechGridProps) {
  const [institutions, setInstitutions] = useState<Fintech[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [sortBy, setSortBy] = useState('rating')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const fetchInstitutions = async (page = 1) => {
    try {
      setLoading(true)
      setError(null)

      const response = await institutionsApi.getAll({
        ...filters,
        page,
        limit: pagination.limit,
        sortBy,
        sortOrder
      })

      setInstitutions(response.data)
      if (response.pagination) {
        setPagination({
          ...pagination,
          ...response.pagination
        })
        onTotalChange?.(response.pagination.total)
      }
    } catch (err) {
      setError(handleApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstitutions(1)
  }, [filters, sortBy, sortOrder])

  const handlePageChange = (newPage: number) => {
    fetchInstitutions(newPage)
  }

  const handleSortChange = (value: string) => {
    const [field, order] = value.split(':')
    setSortBy(field)
    setSortOrder(order as 'asc' | 'desc')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading institutions...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => fetchInstitutions(pagination.page)}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  if (institutions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">No institutions found matching your criteria.</p>
        <Button 
          variant="outline" 
          onClick={() => fetchInstitutions(1)}
        >
          Reset Filters
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {institutions.length} of {pagination.total} institutions
        </p>
        <select 
          className="px-3 py-2 text-sm border border-input rounded-md bg-background"
          onChange={(e) => handleSortChange(e.target.value)}
          value={`${sortBy}:${sortOrder}`}
        >
          <option value="rating:desc">Sort by: Rating (High to Low)</option>
          <option value="rating:asc">Sort by: Rating (Low to High)</option>
          <option value="monthlyFee:asc">Sort by: Monthly Fee (Low to High)</option>
          <option value="monthlyFee:desc">Sort by: Monthly Fee (High to Low)</option>
          <option value="name:asc">Sort by: Name (A-Z)</option>
          <option value="name:desc">Sort by: Name (Z-A)</option>
          <option value="createdAt:desc">Sort by: Newest First</option>
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {institutions.map((institution) => (
          <div
            key={institution.id}
            className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 group"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{institution.logo || '🏦'}</div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {institution.name}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {institution.category}
                    </Badge>
                    {institution.isPartner && (
                      <Badge variant="default" className="text-xs">
                        Partner
                      </Badge>
                    )}
                    {institution.isVerified && (
                      <Badge variant="success" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {institution.description}
            </p>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly fee</span>
                <span className="font-medium text-foreground">
                  {institution.monthlyFee 
                    ? `€${institution.monthlyFee}`
                    : 'Free'
                  }
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Risk Level</span>
                <span className="font-medium text-foreground">
                  {institution.riskLevel}
                </span>
              </div>
            </div>

            {/* Countries */}
            <div className="flex items-center space-x-1 mb-4">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {institution.countries.slice(0, 2).join(', ')}
                {institution.countries.length > 2 && ` +${institution.countries.length - 2}`}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-1 mb-4">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-foreground">
                {institution.rating?.toFixed(1) || 'N/A'}
              </span>
              <span className="text-xs text-muted-foreground">
                ({institution.reviewCount || 0} reviews)
              </span>
            </div>

            {/* Actions */}
            <div className="flex space-x-2 group-hover:opacity-100 opacity-90 transition-opacity">
              <Button size="sm" className="flex-1" asChild>
                <Link href={`/institutions/${institution.slug}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2 pt-8">
          <Button 
            variant="outline" 
            size="sm" 
            disabled={!pagination.hasPrev}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <Button
                key={pageNum}
                variant={pageNum === pagination.page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Button>
            )
          })}
          
          <Button 
            variant="outline" 
            size="sm"
            disabled={!pagination.hasNext}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
} 