'use client'

import { useState } from 'react'
import { CompareHeader } from '@/components/compare/CompareHeader'
import { CompareTable } from '@/components/compare/CompareTable'
import { AddInstitutions } from '@/components/compare/AddInstitutions'
import type { Fintech } from '@/types'

export default function ComparePage() {
  const [selectedInstitutions, setSelectedInstitutions] = useState<Fintech[]>([])

  const handleRemoveInstitution = (id: string) => {
    setSelectedInstitutions(prev => prev.filter(inst => inst.id !== id))
  }

  return (
    <div className="min-h-screen bg-background">
      <CompareHeader />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <AddInstitutions />
          <CompareTable 
            institutions={selectedInstitutions} 
            onRemoveInstitution={handleRemoveInstitution}
          />
        </div>
      </div>
    </div>
  )
} 