'use client'

import React, { useState } from 'react'
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { KanbanColumn } from './KanbanColumn'
import LeadCard from './LeadCard'
import { Button } from '@/components/ui/button'
import { Plus, CalendarIcon, BatteryFullIcon } from 'lucide-react'

type LeadStatus = 'New' | 'Contacted' | 'Closed'

interface Lead {
  id: string
  name: string
  email: string
  company: string
  budget: number
  status: LeadStatus
  energy: number
  lastContact: Date
  replies: number
  score: number
  createdAt: Date
  updatedAt: Date
}

export function KanbanBoard() {
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: '1',
      name: 'Maria Lopez',
      email: 'maria@techcorp.com',
      company: 'TechCorp',
      budget: 15000,
      status: 'New',
      energy: 85,
      lastContact: new Date('2023-11-15'),
      replies: 3,
      score: 85,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // ... other sample leads
  ])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    setLeads((leads) => {
      const oldIndex = leads.findIndex((lead) => lead.id === active.id)
      const newIndex = leads.findIndex((lead) => lead.id === over.id)

      const newStatus = (over.data.current?.status || 
                       leads[newIndex]?.status || 
                       leads[oldIndex].status) as LeadStatus

      const newLeads = arrayMove(leads, oldIndex, newIndex)
      const updatedLead = {
        ...newLeads[newIndex],
        status: newStatus,
        updatedAt: new Date()
      }

      if (newStatus === 'Closed') {
        updatedLead.energy = 100
      }

      newLeads[newIndex] = updatedLead
      return newLeads
    })
  }

  const statuses: { id: LeadStatus; title: string }[] = [
    { id: 'New', title: 'New Leads' },
    { id: 'Contacted', title: 'Contacted' },
    { id: 'Closed', title: 'Closed Won' },
  ]

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button className="gap-2">
          <Plus size={16} />
          Add New Lead
        </Button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statuses.map((status) => {
            const columnLeads = leads.filter((lead) => lead.status === status.id)
            return (
              <KanbanColumn
                key={status.id}
                id={status.id}
                title={status.title}
                count={columnLeads.length}
              >
                <SortableContext
                  items={columnLeads}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {columnLeads.map((lead) => (
                      <LeadCard key={lead.id} lead={lead} />
                    ))}
                  </div>
                </SortableContext>

                {columnLeads.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500 rounded-lg bg-gray-50">
                    No {status.title.toLowerCase()}
                  </div>
                )}
              </KanbanColumn>
            )
          })}
        </div>
      </DndContext>
    </div>
  )
}