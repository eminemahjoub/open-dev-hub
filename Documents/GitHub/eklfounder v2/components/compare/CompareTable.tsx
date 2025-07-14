'use client'

import Link from 'next/link'
import { Star, ExternalLink, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Fintech } from '@/types'

interface CompareTableProps {
  institutions: Fintech[]
  onRemoveInstitution?: (id: string) => void
}

const comparisonFields = [
  { key: 'category', label: 'Category', type: 'badge' },
  { key: 'monthlyFee', label: 'Monthly Fee', type: 'price' },
  { key: 'setupFee', label: 'Setup Fee', type: 'price' },
  { key: 'transactionFees', label: 'Transaction Fees', type: 'text' },
  { key: 'countries', label: 'Available Countries', type: 'list' },
  { key: 'acceptedRisk', label: 'Risk Level', type: 'text' },
  { key: 'minTurnover', label: 'Min. Turnover', type: 'price' },
  { key: 'isVerified', label: 'Verified', type: 'boolean' },
  { key: 'isPartner', label: 'Partner', type: 'boolean' },
  { key: 'supportedCurrencies', label: 'Currencies', type: 'list' },
]

export function CompareTable({ institutions, onRemoveInstitution }: CompareTableProps) {
  if (institutions.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-12 text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No institutions selected
        </h3>
        <p className="text-muted-foreground">
          Select institutions above to start comparing them side-by-side.
        </p>
      </div>
    )
  }

  const renderCellValue = (field: any, institution: Fintech) => {
    const value = institution[field.key as keyof Fintech]
    
    switch (field.type) {
      case 'badge':
        return <Badge variant="secondary">{value as string}</Badge>
              case 'price':
          if (value === null || value === undefined) {
            return <span className="text-muted-foreground">N/A</span>
          }
          return <span className="font-medium">€{String(value)}</span>
      case 'list':
        if (!value || !Array.isArray(value)) {
          return <span className="text-muted-foreground">None</span>
        }
        return <span className="text-sm">{(value as string[]).slice(0, 3).join(', ')}{(value as string[]).length > 3 ? '...' : ''}</span>
      case 'boolean':
        return (value as boolean) ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )
      default:
        return <span>{value as string || 'N/A'}</span>
    }
  }

  return (
    <div className="bg-card border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/30">
              <th className="text-left p-4 w-48">Features</th>
              {institutions.map((institution) => (
                <th key={institution.id} className="text-center p-4 min-w-64">
                  <div className="space-y-3">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-3xl">{institution.logo}</div>
                      <h3 className="font-semibold text-foreground">
                        {institution.name}
                      </h3>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {institution.rating}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({institution.reviewCount})
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 justify-center">
                        <Badge variant="secondary" className="text-xs">
                          {institution.category}
                        </Badge>
                        {institution.isPartner && (
                          <Badge variant="default" className="text-xs">
                            Partner
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button size="sm" className="w-full" asChild>
                        <Link href={`/institutions/${institution.slug}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        Start Application
                      </Button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {comparisonFields.map((field, index) => (
              <tr key={field.key} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                <td className="p-4 font-medium text-foreground border-r">
                  {field.label}
                </td>
                {institutions.map((institution) => (
                  <td key={institution.id} className="p-4 text-center">
                    {renderCellValue(field, institution)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-muted/30 border-t">
        <p className="text-sm text-muted-foreground text-center">
          💡 This comparison is based on public information and partner data. 
          Always verify details directly with the institution before applying.
        </p>
      </div>
    </div>
  )
} 