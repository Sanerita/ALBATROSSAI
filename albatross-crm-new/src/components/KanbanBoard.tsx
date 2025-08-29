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
import { Plus, CalendarIcon, BatteryFullIcon, FilterIcon } from 'lucide-react'
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
  const [searchTerm, setSearchTerm] = useState('')

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
          description: `$${updatedLead.budget.toLocaleString()} contract`,
          duration: 5000,
          action: {
            label: 'View',
            onClick: () => console.log('View lead')
          }
        })
      } else if (newStatus !== leads[oldIndex].status) {
        toast.info(`Lead moved to ${newStatus}`, {
          description: `${updatedLead.name}'s status updated`
        })
      }

      newLeads[newIndex] = updatedLead
      return newLeads
    })
  }

  const handleAddLead = (newLead: Omit<Lead, 'id' | 'status' | 'energy' | 'score' | 'createdAt' | 'updatedAt' | 'lastContact' | 'replies' | 'company'> & { company?: string }) => {
    const leadWithScore: Lead = {
      ...newLead,
      company: newLead.company || '',
      id: Date.now().toString(),
      status: 'New',
      lastContact: new Date(),
      replies: 0,
      energy: calculateEnergyScore(newLead.budget, 0),
      score: calculateEnergyScore(newLead.budget, 0),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setLeads(prev => [leadWithScore, ...prev])
    setShowAddModal(false)
    toast.success('Lead added successfully', {
      description: `${leadWithScore.name} added to pipeline`
    })
  }

  const calculateEnergyScore = (budget: number, replies: number): number => {
    const budgetScore = Math.min(budget / 500 * 12, 60)
    const replyScore = Math.min(replies * 10, 40)
    return Math.min(Math.round(budgetScore + replyScore), 100)
  }

  const handleDeleteLead = (leadId: string) => {
    const leadToDelete = leads.find(lead => lead.id === leadId)
    setLeads(prev => prev.filter(lead => lead.id !== leadId))
    
    toast('Lead deleted', {
      description: `${leadToDelete?.name} removed from pipeline`,
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

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const statuses: { id: LeadStatus; title: string; color: string; bgColor: string }[] = [
    { id: 'New', title: 'New Leads', color: 'text-blue-800', bgColor: 'bg-blue-100' },
    { id: 'Contacted', title: 'Contacted', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
    { id: 'Closed', title: 'Closed Won', color: 'text-green-800', bgColor: 'bg-green-100' },
  ]

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Lead Pipeline</h1>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
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

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search leads..."
                className="pl-8 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FilterIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>

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
      </div>

      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
          {statuses.map((status) => {
            const columnLeads = filteredLeads.filter((lead) => lead.status === status.id)
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
                  <div className="space-y-3 h-full">
                    {columnLeads.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500 rounded-lg bg-gray-50 h-full flex items-center justify-center">
                        No {status.title.toLowerCase()}
                      </div>
                    ) : (
                      columnLeads.map((lead) => (
                        <LeadCard 
                          key={lead.id} 
                          lead={lead}
                          onDelete={() => handleDeleteLead(lead.id)}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
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