'use client'

import { useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function ViewToggle() {
  const [view, setView] = useState<'grid' | 'list'>('grid')

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={view === 'grid' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setView('grid')}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        Grid
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setView('list')}
      >
        <List className="h-4 w-4 mr-2" />
        List
      </Button>
    </div>
  )
} 