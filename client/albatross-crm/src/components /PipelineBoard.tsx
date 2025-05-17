'use client'
import { DndContext, DragEndEvent } from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { useState } from 'react'; // Import useState
import PipelineColumn from './PipelineColumn' // Import PipelineColumn (adjust the path if necessary)

// Define initialLeads (replace with your actual initial data structure)
const initialLeads = [
  { id: '1', status: 'New', name: 'Lead 1' },
  { id: '2', status: 'Contacted', name: 'Lead 2' },
  { id: '3', status: 'New', name: 'Lead 3' },
  { id: '4', status: 'Closed', name: 'Lead 4' },
];


export default function PipelineBoard() {
  const [leads, setLeads] = useState(initialLeads)

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event
    if (over && active.id !== over.id) {
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
