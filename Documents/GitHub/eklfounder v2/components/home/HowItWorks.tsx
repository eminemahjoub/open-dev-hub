import { Search, GitCompare, FileText, CheckCircle } from 'lucide-react'

const steps = [
  {
    icon: Search,
    title: 'Search & Filter',
    description: 'Browse our directory of verified fintech institutions. Use smart filters to find institutions that match your business needs and risk profile.',
  },
  {
    icon: GitCompare,
    title: 'Compare Options',
    description: 'Add institutions to your comparison table to view fees, features, requirements, and jurisdictions side-by-side.',
  },
  {
    icon: FileText,
    title: 'Apply Online',
    description: 'Submit your onboarding application through our secure multi-step form. Upload required documents directly to the platform.',
  },
  {
    icon: CheckCircle,
    title: 'Get Approved',
    description: 'Track your application status in real-time. Receive updates and guidance throughout the approval process.',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Get started with your fintech onboarding journey in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              {/* Step Number */}
              <div className="relative">
                <div className="h-16 w-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>

              {/* Step Content */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {/* Connector Line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-border -z-10">
                  <div className="w-1/2 h-full bg-primary"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 bg-muted/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need Help Getting Started?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our team of fintech experts is here to guide you through the process. 
            From institution selection to application submission, we're with you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-card border rounded-lg p-4 text-left">
              <div className="font-semibold text-foreground">Expert Consultation</div>
              <div className="text-sm text-muted-foreground">Free 30-minute consultation call</div>
            </div>
            <div className="bg-card border rounded-lg p-4 text-left">
              <div className="font-semibold text-foreground">Document Review</div>
              <div className="text-sm text-muted-foreground">We review your docs before submission</div>
            </div>
            <div className="bg-card border rounded-lg p-4 text-left">
              <div className="font-semibold text-foreground">Application Support</div>
              <div className="text-sm text-muted-foreground">Guidance throughout the process</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 