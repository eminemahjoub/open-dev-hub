import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface Institution {
  category: string
}

interface RelatedInstitutionsProps {
  currentInstitution: Institution
}

// Données temporaires
const relatedInstitutions = [
  {
    id: '2',
    name: 'Wise Business',
    slug: 'wise-business',
    logo: '💰',
    description: 'International business banking with real exchange rates.',
    monthlyFee: 0,
    category: 'EMI',
    rating: 4.9,
    reviewCount: 2100,
    isPartner: true,
  },
  {
    id: '5',
    name: 'Monzo Business',
    slug: 'monzo-business',
    logo: '🏧',
    description: 'UK-based digital bank with innovative solutions.',
    monthlyFee: 5,
    category: 'Bank',
    rating: 4.4,
    reviewCount: 678,
    isPartner: false,
  },
  {
    id: '6',
    name: 'Square',
    slug: 'square',
    logo: '⬜',
    description: 'Complete commerce platform with payment processing.',
    monthlyFee: 0,
    category: 'PSP',
    rating: 4.5,
    reviewCount: 3200,
    isPartner: true,
  },
]

export function RelatedInstitutions({ currentInstitution }: RelatedInstitutionsProps) {
  // Filtrer les institutions similaires (même catégorie)
  const related = relatedInstitutions.filter(
    inst => inst.category === currentInstitution.category
  ).slice(0, 3)

  if (related.length === 0) return null

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Similar Institutions
        </h2>
        <Button variant="outline" asChild>
          <Link href="/directory">
            View All
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((institution) => (
          <div
            key={institution.id}
            className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
          >
            {/* Header */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="text-2xl">{institution.logo}</div>
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
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">
              {institution.description}
            </p>

            {/* Details */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Monthly fee</span>
                <span className="font-medium text-foreground">
                  €{institution.monthlyFee}
                </span>
              </div>
              
              {/* Rating */}
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium text-foreground">
                  {institution.rating}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({institution.reviewCount})
                </span>
              </div>
            </div>

            {/* Action */}
            <Button size="sm" className="w-full" asChild>
              <Link href={`/institutions/${institution.slug}`}>
                View Details
              </Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
} 