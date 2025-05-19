'use client'

import { useDraggable } from '@dnd-kit/core'
import { Lead } from '@/types'

interface DraggableLeadCardProps {
  lead: Lead
}

export function DraggableLeadCard({ lead }: DraggableLeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: {
      type: 'lead',
      lead
    }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`border rounded-lg p-4 bg-white shadow-sm cursor-grab ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <h3 className="font-medium">{lead.name}</h3>
      <p className="text-sm text-muted-foreground">
        Budget: {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(lead.budget)}
      </p>
      <div className="mt-2 flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              lead.score > 75 ? 'bg-green-500' :
              lead.score > 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${lead.score}%` }}
          />
        </div>
        <span className="text-xs">{lead.score}%</span>
      </div>
    </div>
  )
}