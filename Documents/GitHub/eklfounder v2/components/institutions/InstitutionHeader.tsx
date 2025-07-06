import { Star, MapPin, ExternalLink, Shield, Zap, Award } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Institution {
  name: string
  logo: string
  description: string
  website?: string
  category: string
  countries: string[]
  rating?: number
  reviewCount?: number
  isPartner: boolean
  isVerified: boolean
  isRecommended?: boolean
}

interface InstitutionHeaderProps {
  institution: Institution
}

export function InstitutionHeader({ institution }: InstitutionHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Left Side - Main Info */}
          <div className="flex-1">
            <div className="flex items-start space-x-4 mb-4">
              <div className="text-4xl">{institution.logo}</div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  {institution.name}
                </h1>
                
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant="secondary">{institution.category}</Badge>
                  {institution.isPartner && (
                    <Badge variant="default">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified Partner
                    </Badge>
                  )}
                  {institution.isVerified && (
                    <Badge variant="success">
                      <Zap className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  {institution.isRecommended && (
                    <Badge variant="warning">
                      <Award className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>

                {/* Rating */}
                {institution.rating && (
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-semibold text-foreground">
                        {institution.rating}
                      </span>
                    </div>
                    <span className="text-muted-foreground">
                      ({institution.reviewCount} reviews)
                    </span>
                  </div>
                )}

                {/* Countries */}
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Available in: {institution.countries.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-3xl">
              {institution.description}
            </p>
          </div>

          {/* Right Side - Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
            <Button size="lg" className="whitespace-nowrap">
              Start Onboarding
            </Button>
            <Button variant="outline" size="lg" className="whitespace-nowrap">
              Add to Compare
            </Button>
            {institution.website && (
              <Button variant="ghost" size="lg" className="whitespace-nowrap" asChild>
                <a href={institution.website} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 