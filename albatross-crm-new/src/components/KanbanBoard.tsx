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
import { toast } from 'sonner'
import AddLeadModal from './AddLeadModal'

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
  notes: string
  createdAt: Date
  updatedAt: Date
}

export interface KanbanBoardProps {
  leads: Lead[];
  onStatusChange: (leadId: string, newStatus: LeadStatus) => void;
  onDeleteLead: (leadId: string) => void;
  onLeadClick: (leadId: string) => void;
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
      notes: 'Interested in enterprise plan',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'James Wilson',
      email: 'james@digital.io',
      company: 'Digital Solutions',
      budget: 8000,
      status: 'Contacted',
      energy: 65,
      lastContact: new Date('2023-11-10'),
      replies: 2,
      score: 65,
      notes: 'Requested custom demo',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      email: 'sarah@innovate.com',
      company: 'Innovate Inc',
      budget: 25000,
      status: 'Closed',
      energy: 100,
      lastContact: new Date('2023-11-05'),
      replies: 5,
      score: 100,
      notes: 'Closed deal - enterprise contract',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])

  const [showAddModal, setShowAddModal] = useState(false)

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
        toast.success(`Deal closed with ${updatedLead.name}!`, {
          description: `$${updatedLead.budget.toLocaleString()} contract`
        })
      }

      newLeads[newIndex] = updatedLead
      return newLeads
    })
  }

  const handleAddLead = ({ name, email, budget, notes }: { name: string; email: string; budget: number; notes: string; }) => {
    const leadWithScore: Lead = {
      name,
      email,
      budget,
      notes,
      id: Date.now().toString(),
      status: 'New',
      company: '', // Assuming company is optional or set later
      lastContact: new Date(), // Assuming last contact is now
      replies: 0, // Assuming 0 replies initially
      energy: calculateEnergyScore(budget, 0), // Assuming 0 replies for new leads
      score: calculateEnergyScore(budget, 0),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setLeads(prev => [leadWithScore, ...prev]);
    setShowAddModal(false);
    toast.success('Lead added successfully');
  }

  const calculateEnergyScore = (budget: number, replies: number): number => {
    let score = 0
    // Budget contributes up to 60 points
    score += Math.min(budget / 500 * 12, 60)
    // Replies contribute up to 40 points
    score += Math.min(replies * 10, 40)
    return Math.min(Math.round(score), 100)
  }

  const handleDeleteLead = (leadId: string) => {
    const leadToDelete = leads.find(lead => lead.id === leadId)
    setLeads(prev => prev.filter(lead => lead.id !== leadId))
    
    toast('Lead deleted', {
      action: {
        label: 'Undo',
        onClick: () => {
          if (leadToDelete) {
            setLeads(prev => [...prev, leadToDelete])
          }
        }
      }
    })
  }

  const statuses: { id: LeadStatus; title: string; color: string }[] = [
    { id: 'New', title: 'New Leads', color: 'bg-blue-100 text-blue-800' },
    { id: 'Contacted', title: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'Closed', title: 'Closed Won', color: 'bg-green-100 text-green-800' },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Lead Pipeline</h2>
          <div className="flex items-center gap-2 text-sm">
            <BatteryFullIcon className="h-4 w-4 text-blue-500" />
            <span>Energy Levels:</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Medium
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              Low
            </span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
          >
            <CalendarIcon size={16} />
            View Calendar
          </Button>
          <Button 
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            Add Lead
          </Button>
        </div>
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
                color={status.color}
              >
                <SortableContext
                  items={columnLeads}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {columnLeads.map((lead) => (
                      <LeadCard 
                        key={lead.id} 
                        lead={lead}
                        onDelete={() => handleDeleteLead(lead.id)}
                      />
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

      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddLead}
      />
    </div>
  )
}