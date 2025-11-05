import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OnboardingForm } from '@/components/onboarding/OnboardingForm'

// Mock data pour l'institution
const getInstitution = async (slug: string) => {
  const institutions = [
    {
      id: '1',
      name: 'Revolut Business',
      slug: 'revolut-business',
      logo: '🏦',
      category: 'EMI',
      description: 'Global business banking with multi-currency accounts',
    },
    {
      id: '2',
      name: 'Wise Business',
      slug: 'wise-business',
      logo: '💰',
      category: 'EMI',
      description: 'International business banking with real exchange rates',
    },
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
    title: `Apply to ${institution.name}`,
    description: `Start your application process with ${institution.name}. Quick and secure onboarding.`,
  }
}

export default async function OnboardingPage({ params }: { params: { slug: string } }) {
  const institution = await getInstitution(params.slug)

  if (!institution) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4">
            <div className="text-3xl">{institution.logo}</div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Apply to {institution.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {institution.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OnboardingForm institution={institution} />
      </div>
    </div>
  )
} 