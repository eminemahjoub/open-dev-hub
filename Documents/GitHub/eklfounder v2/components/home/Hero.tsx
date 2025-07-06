import Link from 'next/link'
import { ArrowRight, Search, Shield, Zap, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Find the Perfect{' '}
                <span className="text-primary">Fintech Partner</span>{' '}
                for Your Business
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Compare EMIs, banks, PSPs, and other financial institutions. 
                Get onboarded quickly with transparent pricing and verified partners.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/directory" className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Compare Institutions
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/how-it-works">
                  How it works
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Institutions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">30+</div>
                <div className="text-sm text-muted-foreground">Countries</div>
              </div>
            </div>
          </div>

          {/* Right Column - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Verified Partners</h3>
              <p className="text-sm text-muted-foreground">
                All institutions are thoroughly vetted and verified for security and compliance.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Fast Onboarding</h3>
              <p className="text-sm text-muted-foreground">
                Streamlined application process with guided step-by-step onboarding.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Smart Comparison</h3>
              <p className="text-sm text-muted-foreground">
                Compare fees, features, and requirements side-by-side to make informed decisions.
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6 space-y-3">
              <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Expert Support</h3>
              <p className="text-sm text-muted-foreground">
                Get guidance from our team of fintech experts throughout your journey.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[800px] w-[800px] rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-20"></div>
        </div>
      </div>
    </section>
  )
} 