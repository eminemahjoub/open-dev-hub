import { Check, X, Clock, FileText, Shield, DollarSign } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface Institution {
  monthlyFee: number | string
  setupFee?: number
  transactionFees?: string
  minTurnover?: number
  features: string[]
  pros: string[]
  cons: string[]
  requiredDocuments: string[]
  complianceInfo: {
    regulators: string[]
    licenses: string[]
    coverage: string
  }
  onboardingTime: string
  kycRequirements: string
}

interface InstitutionDetailsProps {
  institution: Institution
}

export function InstitutionDetails({ institution }: InstitutionDetailsProps) {
  return (
    <div className="space-y-8">
      {/* Pricing */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
          <DollarSign className="h-6 w-6 mr-2" />
          Pricing & Fees
        </h2>
        <div className="bg-card border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Monthly Fee</div>
              <div className="text-2xl font-bold text-foreground">
                {typeof institution.monthlyFee === 'number' 
                  ? `€${institution.monthlyFee}`
                  : institution.monthlyFee
                }
              </div>
            </div>
            {institution.setupFee !== undefined && (
              <div>
                <div className="text-sm text-muted-foreground">Setup Fee</div>
                <div className="text-2xl font-bold text-foreground">
                  €{institution.setupFee}
                </div>
              </div>
            )}
            {institution.minTurnover && (
              <div>
                <div className="text-sm text-muted-foreground">Min. Annual Turnover</div>
                <div className="text-2xl font-bold text-foreground">
                  €{institution.minTurnover.toLocaleString()}
                </div>
              </div>
            )}
          </div>
          {institution.transactionFees && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm text-muted-foreground">Transaction Fees</div>
              <div className="text-foreground">{institution.transactionFees}</div>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Features & Services</h2>
        <div className="bg-card border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {institution.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pros & Cons */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4">Pros & Cons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pros */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-800 mb-3 flex items-center">
              <Check className="h-5 w-5 mr-2" />
              Advantages
            </h3>
            <ul className="space-y-2">
              {institution.pros.map((pro, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-green-700">{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Cons */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-semibold text-red-800 mb-3 flex items-center">
              <X className="h-5 w-5 mr-2" />
              Considerations
            </h3>
            <ul className="space-y-2">
              {institution.cons.map((con, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <X className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700">{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          Required Documents
        </h2>
        <div className="bg-card border rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {institution.requiredDocuments.map((doc, index) => (
              <div key={index} className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-foreground">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance & Onboarding */}
      <section>
        <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center">
          <Shield className="h-6 w-6 mr-2" />
          Compliance & Onboarding
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Compliance */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-3">Regulatory Information</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-muted-foreground">Regulators</div>
                <div className="text-foreground">
                  {institution.complianceInfo.regulators.join(', ')}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Licenses</div>
                <div className="text-foreground">
                  {institution.complianceInfo.licenses.join(', ')}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Protection</div>
                <div className="text-foreground">{institution.complianceInfo.coverage}</div>
              </div>
            </div>
          </div>

          {/* Onboarding */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-3">Onboarding Process</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Typical timeline</div>
                  <div className="text-foreground">{institution.onboardingTime}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">KYC Requirements</div>
                <div className="text-foreground">{institution.kycRequirements}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 