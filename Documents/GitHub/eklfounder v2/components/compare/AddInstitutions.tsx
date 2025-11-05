'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

// Données temporaires
const availableInstitutions = [
  { id: '1', name: 'Revolut Business', logo: '🏦', category: 'EMI' },
  { id: '2', name: 'Wise Business', logo: '💰', category: 'EMI' },
  { id: '3', name: 'Stripe', logo: '💳', category: 'PSP' },
  { id: '4', name: 'Adyen', logo: '🔄', category: 'PSP' },
  { id: '5', name: 'Monzo Business', logo: '🏧', category: 'Bank' },
  { id: '6', name: 'Square', logo: '⬜', category: 'PSP' },
]

export function AddInstitutions() {
  const [selectedInstitutions, setSelectedInstitutions] = useState<string[]>(['1', '2'])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredInstitutions = availableInstitutions.filter(
    inst => inst.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleInstitution = (id: string) => {
    setSelectedInstitutions(prev => {
      if (prev.includes(id)) {
        return prev.filter(instId => instId !== id)
      } else if (prev.length < 4) {
        return [...prev, id]
      }
      return prev
    })
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Select Institutions to Compare (max 4)
      </h2>
      
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search institutions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Selected count */}
      <p className="text-sm text-muted-foreground mb-4">
        {selectedInstitutions.length} of 4 institutions selected
      </p>

      {/* Institution grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredInstitutions.map((institution) => {
          const isSelected = selectedInstitutions.includes(institution.id)
          const canSelect = selectedInstitutions.length < 4 || isSelected
          
          return (
            <div
              key={institution.id}
              className={`
                border rounded-lg p-4 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? 'border-primary bg-primary/5' 
                  : canSelect 
                    ? 'border-border hover:border-primary/50' 
                    : 'border-border opacity-50 cursor-not-allowed'
                }
              `}
              onClick={() => canSelect && toggleInstitution(institution.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{institution.logo}</div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground text-sm">
                    {institution.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {institution.category}
                  </Badge>
                </div>
                {isSelected && (
                  <div className="text-primary">✓</div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {selectedInstitutions.length === 4 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-sm text-amber-800">
            Maximum of 4 institutions reached. Remove one to add another.
          </p>
        </div>
      )}
    </div>
  )
} 