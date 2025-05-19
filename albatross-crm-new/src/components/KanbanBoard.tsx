// components/KanbanBoard.tsx
'use client'

import { useState } from 'react'
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
import { CalendarIcon, BatteryFullIcon } from 'lucide-react'

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
  score: number;
}

export function KanbanBoard() {
  // Sample data - in a real app this would come from your API
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
    },
    {
      id: '2',
      name: 'James Wilson',
      email: 'james@designstudio.com',
      company: 'DesignStudio',
      budget: 8000,
      status: 'Contacted',
      energy: 65,
      lastContact: new Date('2023-11-14'),
      replies: 2,
      score: 65,
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah@startup.io',
      company: 'Startup.io',
      budget: 25000,
      status: 'New',
      energy: 92,
      lastContact: new Date('2023-11-16'),
      replies: 4,
      score: 92,
    },
    {
      id: '4',
      name: 'David Kim',
      email: 'david@enterprise.com',
      company: 'Enterprise Inc',
      budget: 5000,
      status: 'Closed',
      energy: 40,
      lastContact: new Date('2023-11-10'),
      replies: 1,
      score: 40,
    },
  ])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) return

    setLeads((leads) => {
      const oldIndex = leads.findIndex((lead) => lead.id === active.id)
      const newIndex = leads.findIndex((lead) => lead.id === over.id)

      // Update status based on the column dropped into
      const newStatus = (over.data.current?.status ||
                        leads[newIndex].status) as LeadStatus

      const newLeads = arrayMove(leads, oldIndex, newIndex)
      newLeads[newIndex].status = newStatus

      // If moved to closed, boost energy to 100%
      if (newStatus === 'Closed') {
        newLeads[newIndex].energy = 100
      }

      return newLeads
    })
  }

  const statuses: { id: LeadStatus; title: string }[] = [
    { id: 'New', title: 'New Leads' },
    { id: 'Contacted', title: 'Contacted' },
    { id: 'Closed', title: 'Closed Won' },
  ]

  return (
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

              {/* Empty state */}
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
  )
}