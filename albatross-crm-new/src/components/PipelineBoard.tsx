// src/components/PipelineBoard.tsx
'use client';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import PipelineColumn from './PipelineColumn';
import { Lead, LeadStatus } from '../types';

const statuses: LeadStatus[] = ['New', 'Contacted', 'Closed'];

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Lead 1',
    email: 'lead1@example.com',
    budget: 10000,
    status: 'New',
    urgency: true,
    engagement: 2,
    lastContact: new Date(),
    replyCount: 0
  },
  // ... other leads
];

export default function PipelineBoard() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    
    if (!over) return;
    
    if (active.data.current?.type === 'lead' && over.data.current?.type === 'column') {
      const leadId = active.id.toString();
      const newStatus = over.data.current.status as LeadStatus;
      
      setLeads(leads => leads.map(lead => 
        lead.id === leadId ? {...lead, status: newStatus} : lead
      ));
      return;
    }
    
    if (active.id !== over.id) {
      setLeads(leads => {
        const oldIndex = leads.findIndex(lead => lead.id === active.id.toString());
        const newIndex = leads.findIndex(lead => lead.id === over.id.toString());
        return arrayMove(leads, oldIndex, newIndex);
      });
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4">
        {statuses.map((status) => (
          <PipelineColumn
            key={status}
            status={status}
            leads={leads.filter(lead => lead.status === status)}
          />
        ))}
      </div>
    </DndContext>
  );
}
