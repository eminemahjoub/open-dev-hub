import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { InstitutionHeader } from '@/components/institutions/InstitutionHeader'
import { InstitutionDetails } from '@/components/institutions/InstitutionDetails'
import { InstitutionCTA } from '@/components/institutions/InstitutionCTA'
import { RelatedInstitutions } from '@/components/institutions/RelatedInstitutions'

// Données temporaires (plus tard depuis la base de données)
const getInstitution = async (slug: string) => {
  const institutions = [
    {
      id: '1',
      name: 'Revolut Business',
      slug: 'revolut-business',
      logo: '🏦',
      description: 'Revolut Business offers comprehensive financial services for modern businesses. With multi-currency accounts, competitive exchange rates, and innovative banking solutions, Revolut helps businesses manage their finances efficiently across global markets.',
      website: 'https://business.revolut.com',
      monthlyFee: 25,
      setupFee: 0,
      transactionFees: '0.5% on international transfers',
      countries: ['UK', 'EU', 'US', 'AU'],
      supportedCurrencies: ['EUR', 'USD', 'GBP', 'AUD', 'CAD'],
      category: 'EMI' as const,
      acceptedRisk: 'Medium' as const,
      minTurnover: 50000,
      isPartner: true,
      isVerified: true,
      isRecommended: true,
      rating: 4.8,
      reviewCount: 1250,
      requiredDocuments: [
        'Company registration certificate',
        'Proof of business address',
        'Directors\' identification',
        'Bank statements (last 3 months)',
        'Business plan or trading history'
      ],
      features: [
        'Multi-currency accounts (30+ currencies)',
        'Real-time exchange rates',
        'Corporate cards with spending controls',
        'Expense management tools',
        'API integration',
        'Mobile and web banking',
        '24/7 customer support',
        'SEPA and SWIFT transfers'
      ],
      pros: [
        'Excellent exchange rates',
        'Modern mobile app',
        'Fast account opening',
        'Global reach'
      ],
      cons: [
        'Limited phone support',
        'Monthly fees for premium features',
        'Not suitable for high-risk businesses'
      ],
      complianceInfo: {
        regulators: ['FCA (UK)', 'Bank of Lithuania'],
        licenses: ['EMI License', 'AISP/PISP'],
        coverage: 'FSCS protected up to £85,000'
      },
      onboardingTime: '3-5 business days',
      kycRequirements: 'Enhanced due diligence for all directors and beneficial owners'
    },
    // Ajouter d'autres institutions ici...
  ]

  return institutions.find(inst => inst.slug === slug)
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const institution = await getInstitution(params.slug)
  
  if (!institution) {
    return {
      title: 'Institution Not Found',
    }
  }

  return {
    title: institution.name,
    description: institution.description,
    openGraph: {
      title: `${institution.name} - Fintech Institution Details`,
      description: institution.description,
    },
  }
}

export default async function InstitutionPage({ params }: { params: { slug: string } }) {
  const institution = await getInstitution(params.slug)

  if (!institution) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <InstitutionHeader institution={institution} />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <InstitutionDetails institution={institution} />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <InstitutionCTA institution={institution} />
          </div>
        </div>
        
        {/* Related Institutions */}
        <div className="mt-16">
          <RelatedInstitutions currentInstitution={institution} />
        </div>
      </div>
    </div>
  )
} 