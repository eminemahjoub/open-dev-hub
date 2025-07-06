import { Metadata } from 'next'
import { Users, Target, Award, TrendingUp } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about EklFounder - your trusted partner for fintech comparison and onboarding.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
              About EklFounder
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We simplify fintech selection and onboarding for businesses worldwide
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              To democratize access to financial services by providing businesses with transparent, 
              comprehensive information about fintech institutions and streamlined onboarding processes.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Transparency</h3>
              <p className="text-muted-foreground">
                We provide clear, unbiased information about all fintech institutions
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Precision</h3>
              <p className="text-muted-foreground">
                Accurate, up-to-date information to help you make informed decisions
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We strive for the highest quality in our platform and service
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary/10 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                Constantly improving to serve businesses better
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2024, EklFounder emerged from a simple observation: businesses 
                  struggle to navigate the complex landscape of fintech institutions. Whether 
                  you're looking for an EMI, a payment processor, or a modern banking solution, 
                  the process is often opaque and time-consuming.
                </p>
                <p>
                  Our team of fintech experts and former banking professionals came together 
                  to create a platform that would change this. We've built relationships with 
                  leading fintech institutions and developed proprietary tools to help businesses 
                  find their perfect match.
                </p>
                <p>
                  Today, we're proud to serve businesses across Europe, the UK, and beyond, 
                  helping them access the financial services they need to grow and thrive.
                </p>
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-muted-foreground">Verified Institutions</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-primary">1000+</div>
                  <div className="text-muted-foreground">Successful Onboardings</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-primary">25+</div>
                  <div className="text-muted-foreground">Countries Supported</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold text-primary">98%</div>
                  <div className="text-muted-foreground">Customer Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-muted/30 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center text-4xl">
                👨‍💼
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">John Smith</h3>
              <p className="text-muted-foreground mb-2">CEO & Co-Founder</p>
              <p className="text-sm text-muted-foreground">
                Former banking executive with 15 years of experience in financial services
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-muted/30 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center text-4xl">
                👩‍💻
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Sarah Johnson</h3>
              <p className="text-muted-foreground mb-2">CTO & Co-Founder</p>
              <p className="text-sm text-muted-foreground">
                Technology leader with expertise in fintech and compliance systems
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-muted/30 rounded-full w-32 h-32 mx-auto mb-4 flex items-center justify-center text-4xl">
                👨‍🔬
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Mike Chen</h3>
              <p className="text-muted-foreground mb-2">Head of Partnerships</p>
              <p className="text-sm text-muted-foreground">
                Relationship specialist with deep connections in the fintech ecosystem
              </p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="bg-muted/30 rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of businesses who trust EklFounder for their fintech needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/directory"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Institutions
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background rounded-lg hover:bg-accent transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
    </div>
  )
} 