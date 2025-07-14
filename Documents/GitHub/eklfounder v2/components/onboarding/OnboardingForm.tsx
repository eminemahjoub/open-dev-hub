'use client'

import { useState } from 'react'
import { ChevronRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import { onboardingApi, handleApiError } from '@/lib/api'

interface Institution {
  id: string
  name: string
  category: string
}

interface OnboardingFormProps {
  institution: Institution
}

interface UploadedFile {
  id: string
  filename: string
  originalName: string
  path: string
  size: number
  type: string
  category: string
  uploadedAt: string
}

export function OnboardingForm({ institution }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    phone: '',
    country: '',
    businessType: '',
    expectedVolume: '',
    additionalInfo: ''
  })
  const [documents, setDocuments] = useState<UploadedFile[]>([])

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)

    try {
      const applicationData = {
        fintechId: institution.id,
        companyName: formData.companyName,
        contactEmail: formData.email,
        contactPhone: formData.phone,
        country: formData.country,
        businessType: formData.businessType,
        expectedVolume: formData.expectedVolume,
        additionalInfo: formData.additionalInfo,
        documents: documents.map(doc => ({
          filename: doc.originalName,
          path: doc.path,
          size: doc.size,
          type: doc.type
        }))
      }

      await onboardingApi.create(applicationData)
      setSubmitSuccess(true)
      setCurrentStep(5) // Success step
    } catch (error) {
      setSubmitError(handleApiError(error))
    } finally {
      setSubmitting(false)
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleDocumentUpload = (files: UploadedFile[]) => {
    setDocuments(files)
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.email && formData.phone && formData.country
      case 2:
        return formData.businessType && formData.expectedVolume
      case 3:
        return documents.length > 0
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Company Name *</label>
                <input
                  type="text"
                  required
                  value={formData.companyName}
                  onChange={(e) => updateFormData('companyName', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="john@acme.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="+44 20 1234 5678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Country *</label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select Country</option>
                  <option value="UK">United Kingdom</option>
                  <option value="FR">France</option>
                  <option value="DE">Germany</option>
                  <option value="NL">Netherlands</option>
                  <option value="ES">Spain</option>
                  <option value="IT">Italy</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>
          </div>
        )
      
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Business Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Type *</label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => updateFormData('businessType', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select Business Type</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="saas">SaaS</option>
                  <option value="consulting">Consulting</option>
                  <option value="fintech">Fintech</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="subscription">Subscription Service</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Expected Monthly Volume *</label>
                <select
                  required
                  value={formData.expectedVolume}
                  onChange={(e) => updateFormData('expectedVolume', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select Expected Volume</option>
                  <option value="0-10k">€0 - €10,000</option>
                  <option value="10k-50k">€10,000 - €50,000</option>
                  <option value="50k-100k">€50,000 - €100,000</option>
                  <option value="100k-500k">€100,000 - €500,000</option>
                  <option value="500k+">€500,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Additional Information</label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => updateFormData('additionalInfo', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  rows={4}
                  placeholder="Tell us more about your business needs..."
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Document Upload</h3>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Please upload the required documents for your application. This helps us process your request faster.
              </p>
              
              <FileUpload
                category="onboarding"
                multiple={true}
                maxFiles={10}
                onUpload={handleDocumentUpload}
                label="Required Documents"
                description="Upload business registration, ID documents, or any relevant paperwork"
                existingFiles={documents}
              />

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Commonly Required Documents:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Business registration certificate</li>
                  <li>• Director/owner identification documents</li>
                  <li>• Bank statements (last 3 months)</li>
                  <li>• Proof of business address</li>
                  <li>• Website/app screenshots (if applicable)</li>
                </ul>
              </div>
            </div>
          </div>
        )
      
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review & Submit</h3>
            <div className="bg-muted/30 rounded-lg p-6">
              <h4 className="font-medium mb-4">Application Summary</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-muted-foreground">Institution:</span> <span className="ml-2 font-medium">{institution.name}</span></div>
                <div><span className="text-muted-foreground">Company:</span> <span className="ml-2">{formData.companyName}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span className="ml-2">{formData.email}</span></div>
                <div><span className="text-muted-foreground">Country:</span> <span className="ml-2">{formData.country}</span></div>
                <div><span className="text-muted-foreground">Business Type:</span> <span className="ml-2">{formData.businessType}</span></div>
                <div><span className="text-muted-foreground">Expected Volume:</span> <span className="ml-2">{formData.expectedVolume}</span></div>
                <div><span className="text-muted-foreground">Documents:</span> <span className="ml-2">{documents.length} files uploaded</span></div>
              </div>
            </div>

            {submitError && (
              <div className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">{submitError}</span>
              </div>
            )}

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Ready to Submit</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your application will be reviewed within 2-3 business days. You'll receive email updates on the progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-900">Application Submitted Successfully!</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Thank you for your application to {institution.name}. We've received your documents and will review them shortly.
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">What happens next?</h4>
              <div className="text-sm text-green-700 space-y-1">
                <p>1. Initial review within 24 hours</p>
                <p>2. Detailed assessment within 2-3 business days</p>
                <p>3. Decision notification via email</p>
                <p>4. Setup assistance if approved</p>
              </div>
            </div>
            <Button
              onClick={() => window.location.href = '/directory'}
              variant="outline"
            >
              Return to Directory
            </Button>
          </div>
        )
      
      default:
        return null
    }
  }

  if (submitSuccess && currentStep === 5) {
    return (
      <div className="max-w-2xl mx-auto">
        {renderStep()}
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 
                ${currentStep >= step ? 'bg-primary border-primary text-white' : 'border-gray-300'}
              `}>
                {currentStep > step ? <CheckCircle className="h-4 w-4" /> : step}
              </div>
              {step < 4 && <div className={`w-full h-0.5 mx-4 ${currentStep > step ? 'bg-primary' : 'bg-gray-300'}`} />}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of 4
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1 || submitting}
        >
          Previous
        </Button>
        
        {currentStep < 4 ? (
          <Button 
            onClick={handleNext}
            disabled={!canProceedToNext() || submitting}
          >
            Next <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            disabled={submitting || !canProceedToNext()}
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Submit Application <CheckCircle className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
} 