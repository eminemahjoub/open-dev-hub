import { Metadata } from 'next'
import { CompareHeader } from '@/components/compare/CompareHeader'
import { CompareTable } from '@/components/compare/CompareTable'
import { AddInstitutions } from '@/components/compare/AddInstitutions'

export const metadata: Metadata = {
  title: 'Compare Institutions',
  description: 'Compare fintech institutions side-by-side to find the best fit for your business.',
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background">
      <CompareHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <AddInstitutions />
          <CompareTable />
        </div>
      </div>
    </div>
  )
} 