'use client'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'
import PipelineColumn from './PipelineColumn'
import { Lead } from '@/types'

// Define initialLeads with complete Lead type structure
const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Lead 1',
    email: 'lead1@example.com',
    budget: 10000,
    status: 'New',
    urgency: true,
    engagement: 2,
    lastContact: new Date()
  },
  {
    id: '2',
    name: 'Lead 2',
    email: 'lead2@example.com',
    budget: 8000,
    status: 'Contacted',
    urgency: false,
    engagement: 4,
    lastContact: new Date(Date.now() - 86400000)
  },
  {
    id: '3',
    name: 'Lead 3',
    email: 'lead3@example.com',
    budget: 15000,
    status: 'New',
    urgency: true,
    engagement: 1,
    lastContact: new Date()
  },
  {
    id: '4',
    name: 'Lead 4',
    email: 'lead4@example.com',
    budget: 5000,
    status: 'Closed',
    urgency: false,
    engagement: 3,
    lastContact: new Date(Date.now() - 172800000)
  },
]

export default function PipelineBoard() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event
    
    if (!over) return
    
    // Handle moving between columns (status change)
    if (active.data.current?.type === 'lead' && over.data.current?.type === 'column') {
      const leadId = active.id
      const newStatus = over.data.current.status
      
      setLeads(leads => leads.map(lead => 
        lead.id === leadId ? {...lead, status: newStatus} : lead
      ))
      return
    }
    
    // Handle reordering within same column
    if (active.id !== over.id) {
      setLeads(leads => {
        const oldIndex = leads.findIndex(lead => lead.id === active.id)
        const newIndex = leads.findIndex(lead => lead.id === over.id)
        return arrayMove(leads, oldIndex, newIndex)
      })
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4">
        {['New', 'Contacted', 'Closed'].map(status => (
          <PipelineColumn
            key={status}
            status={status}
            leads={leads.filter(lead => lead.status === status)}
          />
        ))}
      </div>
    </DndContext>
  )
}