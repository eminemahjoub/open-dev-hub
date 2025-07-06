import Link from 'next/link'
import { ArrowRight, Plus, MessageSquare, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Institution {
  id: string
  name: string
  slug: string
  isPartner: boolean
}

interface InstitutionCTAProps {
  institution: Institution
}

export function InstitutionCTA({ institution }: InstitutionCTAProps) {
  return (
    <div className="space-y-6">
      {/* Main CTA */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Ready to get started?
        </h3>
        <div className="space-y-3">
          <Button size="lg" className="w-full" asChild>
            <Link href={`/onboarding/${institution.slug}`}>
              Start Application
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add to Compare
          </Button>
          
          <Button variant="ghost" size="lg" className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Us
          </Button>
        </div>
        
        {institution.isPartner && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg">
            <p className="text-sm text-primary font-medium">
              ⚡ Fast-track approval available for verified partners
            </p>
          </div>
        )}
      </div>

      {/* Quick Info */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Quick Info</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Application time</span>
            <span className="text-foreground">10-15 min</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Approval time</span>
            <span className="text-foreground">3-5 days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Success rate</span>
            <span className="text-green-600 font-medium">94%</span>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Resources</h3>
        <div className="space-y-2">
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Application Checklist
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Document Templates
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start">
            <Download className="h-4 w-4 mr-2" />
            Fee Structure PDF
          </Button>
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-muted/50 border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Our experts are here to guide you through the application process.
        </p>
        <Button variant="outline" size="sm" className="w-full">
          Schedule a Call
        </Button>
      </div>
    </div>
  )
} 