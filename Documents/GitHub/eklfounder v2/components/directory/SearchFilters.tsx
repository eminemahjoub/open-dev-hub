'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const categories = [
  { id: 'EMI', label: 'EMI', count: 18 },
  { id: 'Bank', label: 'Bank', count: 12 },
  { id: 'PSP', label: 'PSP', count: 15 },
  { id: 'Crypto', label: 'Crypto', count: 8 },
]

const countries = [
  { id: 'UK', label: 'United Kingdom', count: 25 },
  { id: 'EU', label: 'European Union', count: 30 },
  { id: 'US', label: 'United States', count: 20 },
  { id: 'CA', label: 'Canada', count: 8 },
]

const riskLevels = [
  { id: 'Low', label: 'Low Risk', count: 15 },
  { id: 'Medium', label: 'Medium Risk', count: 25 },
  { id: 'High', label: 'High Risk', count: 10 },
]

interface FilterProps {
  filters: {
    category?: string
    countries?: string
    riskLevel?: string
    isPartner?: boolean
    minRating?: number
    minFee?: number
    maxFee?: number
  }
  onFiltersChange: (filters: any) => void
  onClearAll: () => void
}

export function SearchFilters({ filters, onFiltersChange, onClearAll }: FilterProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'category', 'country', 'risk'
  ])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    onFiltersChange({
      category: checked ? categoryId : undefined
    })
  }

  const handleCountryChange = (countryId: string, checked: boolean) => {
    onFiltersChange({
      countries: checked ? countryId : undefined
    })
  }

  const handleRiskLevelChange = (riskId: string, checked: boolean) => {
    onFiltersChange({
      riskLevel: checked ? riskId : undefined
    })
  }

  const handlePartnerChange = (checked: boolean) => {
    onFiltersChange({
      isPartner: checked || undefined
    })
  }

  const handleFeeRangeChange = (minFee?: number, maxFee?: number) => {
    onFiltersChange({
      minFee: minFee || undefined,
      maxFee: maxFee || undefined
    })
  }

  const handleRatingChange = (minRating?: number) => {
    onFiltersChange({
      minRating: minRating || undefined
    })
  }

  const getActiveFilters = () => {
    const active = []
    if (filters.category) active.push({ key: 'category', value: filters.category })
    if (filters.countries) active.push({ key: 'countries', value: filters.countries })
    if (filters.riskLevel) active.push({ key: 'riskLevel', value: filters.riskLevel })
    if (filters.isPartner) active.push({ key: 'isPartner', value: 'Partner' })
    if (filters.minRating) active.push({ key: 'minRating', value: `${filters.minRating}+ rating` })
    if (filters.minFee || filters.maxFee) {
      const feeRange = `€${filters.minFee || 0}-${filters.maxFee || '∞'}`
      active.push({ key: 'fee', value: feeRange })
    }
    return active
  }

  const removeFilter = (filterKey: string) => {
    switch (filterKey) {
      case 'category':
        handleCategoryChange('', false)
        break
      case 'countries':
        handleCountryChange('', false)
        break
      case 'riskLevel':
        handleRiskLevelChange('', false)
        break
      case 'isPartner':
        handlePartnerChange(false)
        break
      case 'minRating':
        handleRatingChange()
        break
      case 'fee':
        handleFeeRangeChange()
        break
    }
  }

  const FilterSection = ({ 
    title, 
    sectionId, 
    items,
    selectedValue,
    onChange
  }: { 
    title: string
    sectionId: string
    items: Array<{ id: string; label: string; count: number }>
    selectedValue?: string
    onChange: (id: string, checked: boolean) => void
  }) => (
    <div className="border-b pb-4">
      <button
        onClick={() => toggleSection(sectionId)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="font-medium text-foreground">{title}</h3>
        {expandedSections.includes(sectionId) ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      
      {expandedSections.includes(sectionId) && (
        <div className="mt-3 space-y-2">
          {items.map(item => (
            <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedValue === item.id}
                onChange={(e) => onChange(item.id, e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">{item.label}</span>
              <span className="text-xs text-muted-foreground">({item.count})</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )

  const activeFilters = getActiveFilters()

  return (
    <div className="bg-card border rounded-lg p-6 sticky top-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground flex items-center">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </h2>
        {activeFilters.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filter => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="text-xs cursor-pointer"
                onClick={() => removeFilter(filter.key)}
              >
                {filter.value} ×
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Filter Sections */}
      <div className="space-y-4">
        <FilterSection
          title="Category"
          sectionId="category"
          items={categories}
          selectedValue={filters.category}
          onChange={handleCategoryChange}
        />
        
        <FilterSection
          title="Country"
          sectionId="country"
          items={countries}
          selectedValue={filters.countries}
          onChange={handleCountryChange}
        />
        
        <FilterSection
          title="Risk Level"
          sectionId="risk"
          items={riskLevels}
          selectedValue={filters.riskLevel}
          onChange={handleRiskLevelChange}
        />

        {/* Monthly Fee Range */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('fee')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-foreground">Monthly Fee</h3>
            {expandedSections.includes('fee') ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          
          {expandedSections.includes('fee') && (
            <div className="mt-3 space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minFee || ''}
                  onChange={(e) => handleFeeRangeChange(
                    e.target.value ? parseInt(e.target.value) : undefined,
                    filters.maxFee
                  )}
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                />
                <span className="text-muted-foreground">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxFee || ''}
                  onChange={(e) => handleFeeRangeChange(
                    filters.minFee,
                    e.target.value ? parseInt(e.target.value) : undefined
                  )}
                  className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Range: €0 - €500
              </div>
            </div>
          )}
        </div>

        {/* Minimum Rating */}
        <div className="border-b pb-4">
          <button
            onClick={() => toggleSection('rating')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-medium text-foreground">Minimum Rating</h3>
            {expandedSections.includes('rating') ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
          
          {expandedSections.includes('rating') && (
            <div className="mt-3 space-y-2">
              {[4.5, 4.0, 3.5, 3.0].map(rating => (
                <label key={rating} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    checked={filters.minRating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{rating}+ stars</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Partner Status */}
        <div>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.isPartner || false}
              onChange={(e) => handlePartnerChange(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">Verified Partners Only</span>
          </label>
        </div>
      </div>
    </div>
  )
} 