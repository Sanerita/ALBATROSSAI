'use client'

import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Lead } from '@/types'

interface DraggableLeadCardProps {
  lead: Lead
  className?: string
}

export function DraggableLeadCard({ lead, className }: DraggableLeadCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
    data: {
      type: 'lead',
      lead
    }
  })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    zIndex: isDragging ? 999 : 'auto',
    boxShadow: isDragging ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : 'none'
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`border rounded-lg p-4 bg-white shadow-sm cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-80 ring-2 ring-blue-500' : 'opacity-100'
      } ${className || ''}`}
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-gray-900">{lead.name}</h3>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
          {lead.status || 'New'}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mt-1">
        {lead.email}
      </p>
      
      <p className="text-sm text-muted-foreground mt-2">
        Budget: {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0
        }).format(lead.budget)}
      </p>

      <div className="mt-3 flex items-center gap-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${
              lead.score > 75 ? 'bg-green-500' :
              lead.score > 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${lead.score}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-700">{lead.score}%</span>
      </div>

      {lead.notes && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2">
          {lead.notes}
        </p>
      )}
    </div>
  )
}