'use client'

import { LeadsTable } from '@/components/LeadsTable'
import { Button } from '@/components/ui/button'
import { PlusIcon, CalendarIcon, BatteryFullIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Lead, LeadStatus } from '@/types'
import { useState, useEffect } from 'react'
import AddLeadModal from '@/components/AddLeadModal'
import { v4 as uuidv4 } from 'uuid'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban')

  // Fetch leads data
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setIsLoading(true)
        // Mock data - replace with actual API call
        const mockLeads: Lead[] = [
          {
            id: uuidv4(),
            name: 'Acme Corporation',
            email: 'contact@acme.com',
            phone: '+1 (555) 123-4567',
            company: 'Acme Corp',
            budget: 25000,
            status: 'New',
            score: 85,
            urgency: false,
            engagement: 4,
            notes: 'Interested in enterprise plan',
            lastContact: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: uuidv4(),
            name: 'Beta Startups',
            email: 'ceo@betastartups.com',
            phone: '+1 (555) 987-6543',
            company: 'Beta Startups',
            budget: 15000,
            status: 'Contacted',
            score: 65,
            urgency: true,
            engagement: 3,
            notes: 'Requested demo',
            lastContact: new Date(Date.now() - 86400000),
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: uuidv4(),
            name: 'Gamma Tech',
            email: 'sales@gammatech.io',
            phone: '+1 (555) 456-7890',
            company: 'Gamma Tech',
            budget: 5000,
            status: 'New',
            score: 45,
            urgency: false,
            engagement: 1,
            notes: 'Evaluating options',
            lastContact: new Date(Date.now() - 172800000),
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        setLeads(mockLeads)
      } catch (error) {
        toast.error('Failed to load leads', {
          description: 'Please try again later'
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const calculateLeadScore = (lead: Partial<Lead>): number => {
    let score = 0
    // Budget contributes up to 30 points
    score += Math.min((lead.budget || 0) / 2000 * 30, 30)
    // Engagement (1-5 scale) contributes up to 30 points
    score += (lead.engagement || 0) * 6
    // Urgency adds 40 points
    if (lead.urgency) score += 40
    return Math.min(Math.round(score), 100)
  }

  const handleAddLead = (newLead: Omit<Lead, 'id' | 'status' | 'score' | 'createdAt' | 'updatedAt'>) => {
    const leadWithScore: Lead = {
      ...newLead,
      id: uuidv4(),
      status: 'New',
      score: calculateLeadScore(newLead),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    setLeads(prev => [leadWithScore, ...prev])
    setShowAddModal(false)
    toast.success('Lead added successfully', {
      description: `${newLead.name} has been added to your pipeline`,
      action: {
        label: 'View',
        onClick: () => router.push(`/leads/${leadWithScore.id}`)
      }
    })
  }

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId
          ? { ...lead, status: newStatus, updatedAt: new Date() }
          : lead
      )
    )
    
    const lead = leads.find(l => l.id === leadId)
    if (newStatus === 'Closed') {
      toast.success('Deal closed!', {
        description: `Congratulations on closing with ${lead?.name}`,
        duration: 5000
      })
    } else {
      toast.info('Status updated', {
        description: `${lead?.name} moved to ${newStatus}`
      })
    }
  }

  const handleDeleteLead = (leadId: string) => {
    const leadToDelete = leads.find(lead => lead.id === leadId)
    setLeads(prev => prev.filter(lead => lead.id !== leadId))
    
    toast('Lead deleted', {
      description: `${leadToDelete?.name} was removed`,
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

  const handleLeadClick = (leadId: string) => {
    router.push(`/leads/${leadId}`)
  }

  const handleScheduleMeeting = () => {
    toast.info('Schedule meeting feature coming soon!')
  }

  return (
    <div className="space-y-6">
      {/* Header with quick actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Lead Pipeline</h1>
          <p className="text-gray-600">
            Visually track your leads' energy levels and progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleScheduleMeeting}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowAddModal(true)}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <Tabs 
        value={viewMode} 
        onValueChange={(value) => setViewMode(value as 'kanban' | 'table')}
        className="w-full"
      >
        <TabsList className="grid grid-cols-2 w-[200px]">
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="table">Table</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Energy Legend */}
      <Card className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <BatteryFullIcon className="h-5 w-5 text-blue-500" />
            <span className="font-medium">Lead Energy:</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { level: 'High', color: 'bg-green-500', range: '80-100%' },
              { level: 'Medium', color: 'bg-yellow-500', range: '50-79%' },
              { level: 'Low', color: 'bg-red-500', range: '0-49%' },
            ].map((item) => (
              <div key={item.level} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                <span className="text-sm">
                  {item.level} ({item.range})
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Content Area */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['New', 'Contacted', 'Closed'].map((status) => (
            <div key={status} className="space-y-4">
              <h3 className="font-medium text-gray-800">{status} Leads</h3>
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-8 w-24" />
                  </div>
                </Card>
              ))}
            </div>
          ))}
        </div>
      ) : leads.length > 0 ? (
        viewMode === 'kanban' ? (
          <LeadsTable
            leads={leads}
            onStatusChange={handleStatusChange}
            onDeleteLead={handleDeleteLead}
            onLeadClick={handleLeadClick}
          />
        ) : (
          <div className="bg-white rounded-lg shadow p-4">
            {/* Table view implementation would go here */}
            <p className="text-center text-gray-500 py-8">
              Table view coming soon - currently showing Kanban view
            </p>
            <LeadsTable
              leads={leads}
              onStatusChange={handleStatusChange}
              onDeleteLead={handleDeleteLead}
              onLeadClick={handleLeadClick}
            />
          </div>
        )
      ) : (
        <Card className="p-8 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <BatteryFullIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No leads yet</h3>
            <p className="text-gray-500">
              Get started by adding your first lead to see the energy meter in action
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowAddModal(true)}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </div>
        </Card>
      )}

      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddLead}
      />
    </div>
  )
}