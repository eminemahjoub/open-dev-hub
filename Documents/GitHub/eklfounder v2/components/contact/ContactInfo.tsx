import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'

export function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Contact Details */}
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 rounded-lg p-3">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Email</h3>
            <p className="text-muted-foreground">hello@eklfounder.com</p>
            <p className="text-muted-foreground">support@eklfounder.com</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 rounded-lg p-3">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Phone</h3>
            <p className="text-muted-foreground">+44 20 7123 4567</p>
            <p className="text-muted-foreground">+33 1 23 45 67 89</p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 rounded-lg p-3">
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Address</h3>
            <p className="text-muted-foreground">
              123 Fintech Street<br />
              London, EC2V 8AB<br />
              United Kingdom
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-4">
          <div className="bg-primary/10 rounded-lg p-3">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
            <p className="text-muted-foreground">
              Monday - Friday: 9:00 AM - 6:00 PM GMT<br />
              Saturday: 10:00 AM - 4:00 PM GMT<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>

      {/* Quick Help */}
      <div className="bg-muted/30 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 mr-2" />
          Need Quick Help?
        </h3>
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-foreground">For urgent matters:</h4>
            <p className="text-muted-foreground text-sm">
              Call us directly during business hours for immediate assistance
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground">For partnerships:</h4>
            <p className="text-muted-foreground text-sm">
              Email partnerships@eklfounder.com with your proposal
            </p>
          </div>
          <div>
            <h4 className="font-medium text-foreground">For media inquiries:</h4>
            <p className="text-muted-foreground text-sm">
              Contact media@eklfounder.com for press-related questions
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Link */}
      <div className="bg-primary/10 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-2">Frequently Asked Questions</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Check our FAQ section for quick answers to common questions about our platform and services.
        </p>
        <a
          href="/faq"
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          View FAQ →
        </a>
      </div>
    </div>
  )
} 