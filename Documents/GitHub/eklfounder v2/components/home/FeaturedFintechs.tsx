'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Star, MapPin, CreditCard, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { institutionsApi, handleApiError } from '@/lib/api'
import type { Fintech } from '@/types'

export function FeaturedFintechs() {
  const [institutions, setInstitutions] = useState<Fintech[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeaturedInstitutions = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch recommended or partner institutions
        const response = await institutionsApi.getAll({
          isPartner: true,
          limit: 4,
          sortBy: 'rating',
          sortOrder: 'desc'
        })
        
        setInstitutions(response.data)
      } catch (err) {
        setError(handleApiError(err))
        console.error('Error fetching featured institutions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedInstitutions()
  }, [])
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            Featured Fintech Partners
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover top-rated financial institutions trusted by thousands of businesses worldwide
          </p>
        </div>

        {/* Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-card border rounded-lg p-6 animate-pulse">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="h-12 bg-muted rounded mb-4"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded"></div>
                </div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="h-3 bg-muted rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded"></div>
                  <div className="h-8 bg-muted rounded"></div>
                </div>
              </div>
            ))
          ) : error ? (
            // Error state
            <div className="col-span-full text-center py-12">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Unable to load featured institutions
              </h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : institutions.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🏦</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No featured institutions available
              </h3>
              <p className="text-muted-foreground">
                Check back later for featured fintech partners.
              </p>
            </div>
          ) : (
            // Data loaded successfully
            institutions.map((institution) => (
              <div
                key={institution.id}
                className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{institution.logo || '🏦'}</div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">
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
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
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
                      {institution.acceptedRisk}
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
                <div className="space-y-2">
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/institutions/${institution.slug}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    Add to Compare
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/directory" className="flex items-center">
              View All Institutions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
} 