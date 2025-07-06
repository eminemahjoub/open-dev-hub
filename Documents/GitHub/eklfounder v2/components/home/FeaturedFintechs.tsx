import Link from 'next/link'
import { Star, MapPin, CreditCard, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// Données temporaires - plus tard ce sera depuis la base de données
const featuredFintechs = [
  {
    id: '1',
    name: 'Revolut Business',
    slug: 'revolut-business',
    logo: '🏦',
    description: 'Global business banking with multi-currency accounts and competitive FX rates.',
    monthlyFee: 25,
    countries: ['UK', 'EU', 'US'],
    isPartner: true,
    rating: 4.8,
    category: 'EMI',
    acceptedRisk: 'Medium',
  },
  {
    id: '2', 
    name: 'Wise Business',
    slug: 'wise-business',
    logo: '💰',
    description: 'International business banking with real exchange rates and low fees.',
    monthlyFee: 0,
    countries: ['UK', 'EU', 'US', 'AU'],
    isPartner: true,
    rating: 4.9,
    category: 'EMI',
    acceptedRisk: 'Low',
  },
  {
    id: '3',
    name: 'Stripe',
    slug: 'stripe',
    logo: '💳',
    description: 'Payment processing platform for online businesses with global reach.',
    monthlyFee: 0,
    countries: ['Global'],
    isPartner: false,
    rating: 4.7,
    category: 'PSP',
    acceptedRisk: 'Medium',
  },
  {
    id: '4',
    name: 'Adyen',
    slug: 'adyen',
    logo: '🔄',
    description: 'End-to-end payment platform for enterprise businesses.',
    monthlyFee: 'Custom',
    countries: ['Global'],
    isPartner: true,
    rating: 4.6,
    category: 'PSP',
    acceptedRisk: 'High',
  },
]

export function FeaturedFintechs() {
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
          {featuredFintechs.map((fintech) => (
            <div
              key={fintech.id}
              className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{fintech.logo}</div>
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">
                      {fintech.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {fintech.category}
                      </Badge>
                      {fintech.isPartner && (
                        <Badge variant="default" className="text-xs">
                          Partner
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {fintech.description}
              </p>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Monthly fee</span>
                  <span className="font-medium text-foreground">
                    {typeof fintech.monthlyFee === 'number' 
                      ? `€${fintech.monthlyFee}`
                      : fintech.monthlyFee
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className="font-medium text-foreground">
                    {fintech.acceptedRisk}
                  </span>
                </div>
              </div>

              {/* Countries */}
              <div className="flex items-center space-x-1 mb-4">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {fintech.countries.slice(0, 2).join(', ')}
                  {fintech.countries.length > 2 && ` +${fintech.countries.length - 2}`}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">
                  {fintech.rating}
                </span>
                <span className="text-xs text-muted-foreground">
                  (100+ reviews)
                </span>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button size="sm" className="w-full" asChild>
                  <Link href={`/institutions/${fintech.slug}`}>
                    View Details
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  Add to Compare
                </Button>
              </div>
            </div>
          ))}
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