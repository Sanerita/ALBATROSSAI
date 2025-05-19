'use client'

import { DndContext, DragEndEvent, DragOverlay } from '@dnd-kit/core'
import { useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import PipelineColumn from './PipelineColumn'
import { Lead, LeadStatus } from '../types'
import { DraggableLeadCard } from '../components/DraggableLeadCard'

interface PipelineBoardProps {
  leads: Lead[]
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void
}

export default function PipelineBoard({ leads, onStatusChange }: PipelineBoardProps) {
  const statuses: LeadStatus[] = ['New', 'Contacted', 'Closed'] // Capitalized
  const [activeLead, setActiveLead] = useState<Lead | null>(null)

  const handleDragStart = (event: any) => {
    if (event.active.data.current?.type === 'lead') {
      setActiveLead(event.active.data.current.lead)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveLead(null)
      return
    }
    
    if (active.data.current?.type === 'lead' && over.data.current?.type === 'column') {
      const leadId = active.id.toString()
      const newStatus = over.data.current.status as LeadStatus
      onStatusChange(leadId, newStatus)
    }
    
    setActiveLead(null)
  }

  return (
    <DndContext 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4 overflow-x-auto h-full">
        {statuses.map((status) => (
          <PipelineColumn
            key={status}
            status={status}
            leads={leads.filter(lead => lead.status === status)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeLead ? (
          <div className="border rounded-lg p-4 bg-white shadow-lg w-[300px]">
            <h3 className="font-medium">{activeLead.name}</h3>
            <p className="text-sm text-muted-foreground">
              Budget: {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(activeLead.budget)}
            </p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}