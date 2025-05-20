'use client'

import { useState, useEffect } from 'react'
import { StatsCards } from '@/components/StatsCards'
import { LeadsTable } from '@/components/LeadsTable'
import { RecentActivity } from '@/components/RecentActivity'
import { Celebration } from '@/components/Celebration'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { PlusIcon, CalendarIcon, HighlighterIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Lead, Meeting, LeadStatus } from '@/types'
import AddLeadModal from '@/components/AddLeadModal'
import { ScheduleMeetingModal } from '@/components/ScheduleMeetingModal'
import { v4 as uuidv4 } from 'uuid'
import { isSameDay } from 'date-fns'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'

export default function DashboardPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [showAddLeadModal, setShowAddLeadModal] = useState(false)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [triggerCelebration, setTriggerCelebration] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Enhanced mock data
        const mockLeads: Lead[] = [
          {
            id: uuidv4(),
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1 (555) 123-4567',
            company: 'Acme Corp',
            budget: 15000,
            status: 'New',
            score: 75,
            urgency: true,
            engagement: 3,
            notes: 'Interested in enterprise plan',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: uuidv4(),
            name: 'Jane Smith',
            email: 'jane@startup.io',
            phone: '+1 (555) 987-6543',
            company: 'StartUp Inc',
            budget: 8000,
            status: 'Contacted',
            score: 60,
            urgency: false,
            engagement: 2,
            notes: 'Requested demo',
            createdAt: new Date(Date.now() - 86400000),
            updatedAt: new Date()
          }
        ]
        
        const mockMeetings: Meeting[] = [
          {
            id: uuidv4(),
            leadId: mockLeads[0].id,
            title: 'Product Demo',
            date: new Date(Date.now() + 86400000), // Tomorrow
            duration: 45,
            notes: 'Show enterprise features',
            location: 'Zoom Meeting',
            createdAt: new Date()
          },
          {
            id: uuidv4(),
            leadId: mockLeads[1].id,
            title: 'Follow-up Call',
            date: new Date(Date.now() + 172800000), // 2 days from now
            duration: 30,
            notes: 'Discuss pricing options',
            location: 'Phone Call',
            createdAt: new Date()
          }
        ]
        
        const mockActivities = [
          {
            id: uuidv4(),
            type: 'lead_added',
            message: 'Added new lead: John Doe',
            timestamp: new Date(),
            user: {
              name: 'Alex Johnson',
              avatar: '/avatars/alex.jpg'
            }
          },
          {
            id: uuidv4(),
            type: 'meeting_scheduled',
            message: 'Scheduled meeting with Jane Smith',
            timestamp: new Date(Date.now() - 3600000),
            user: {
              name: 'Sam Wilson',
              avatar: '/avatars/sam.jpg'
            }
          }
        ]

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        setLeads(mockLeads)
        setMeetings(mockMeetings)
        setActivities(mockActivities)
        
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateLeadScore = (lead: Partial<Lead>): number => {
    let score = 0
    // Budget contributes up to 30 points ($2k = 30 points)
    score += Math.min((lead.budget || 0) / 2000 * 30, 30)
    // Urgency adds 40 points
    if (lead.urgency) score += 40
    // Engagement (1-5 scale) contributes up to 30 points
    score += (lead.engagement || 0) * 6
    return Math.min(Math.round(score), 100)
  }

  const handleLeadStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          lead.id === leadId 
            ? { 
                ...lead, 
                status: newStatus,
                score: calculateLeadScore({ ...lead, status: newStatus }),
                updatedAt: new Date()
              } 
            : lead
        )
      )

      if (newStatus === 'Closed') {
        setTriggerCelebration(true)
        setTimeout(() => setTriggerCelebration(false), 3000)
        toast.success('Lead closed successfully!')
        
        // Add activity
        const lead = leads.find(l => l.id === leadId)
        setActivities(prev => [
          {
            id: uuidv4(),
            type: 'lead_closed',
            message: `Closed lead: ${lead?.name || 'Unknown'}`,
            timestamp: new Date(),
            user: {
              name: 'You',
              avatar: '/avatars/current-user.jpg'
            }
          },
          ...prev
        ])
      }
    } catch (error) {
      toast.error('Failed to update lead status')
    }
  }

  const handleLeadClick = (leadId: string) => {
    // Placeholder function for handling lead clicks
    console.log(`Lead with ID ${leadId} clicked.`);
    // You can add your navigation or other logic here
  };

  const handleAddLead = async (newLead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'score'>) => {
    try {
      const leadWithScore: Lead = {
        ...newLead,
        id: uuidv4(),
        status: 'New',
        score: calculateLeadScore(newLead),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      setLeads(prevLeads => [leadWithScore, ...prevLeads])
      setShowAddLeadModal(false)
      toast.success('Lead added successfully!')
      
      // Add activity
      setActivities(prev => [
        {
          id: uuidv4(),
          type: 'lead_added',
          message: `Added new lead: ${newLead.name}`,
          timestamp: new Date(),
          user: {
            name: 'You',
            avatar: '/avatars/current-user.jpg'
          }
        },
        ...prev
      ])
    } catch (error) {
      toast.error('Failed to add lead')
    }
  }

  const handleScheduleMeeting = async (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    try {
      const newMeeting: Meeting = {
        ...meeting,
        id: uuidv4(),
        createdAt: new Date()
      }
      
      setMeetings(prev => [newMeeting, ...prev])
      setShowScheduleModal(false)
      toast.success('Meeting scheduled!')
      
      // Add activity
      const lead = leads.find(l => l.id === meeting.leadId)
      setActivities(prev => [
        {
          id: uuidv4(),
          type: 'meeting_scheduled',
          message: `Scheduled meeting with ${lead?.name || 'lead'}`,
          timestamp: new Date(),
          user: {
            name: 'You',
            avatar: '/avatars/current-user.jpg'
          }
        },
        ...prev
      ])
    } catch (error) {
      toast.error('Failed to schedule meeting')
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    try {
      setLeads(prev => prev.filter(lead => lead.id !== leadId))
      toast.success('Lead deleted successfully')
      
      // Add activity
      const lead = leads.find(l => l.id === leadId)
      setActivities(prev => [
        {
          id: uuidv4(),
          type: 'lead_deleted',
          message: `Deleted lead: ${lead?.name || 'Unknown'}`,
          timestamp: new Date(),
          user: {
            name: 'You',
            avatar: '/avatars/current-user.jpg'
          }
        },
        ...prev
      ])
    } catch (error) {
      toast.error('Failed to delete lead')
    }
  }

  const stats = {
    totalLeads: leads.length,
    hotLeads: leads.filter(lead => lead.score > 75).length,
    meetingsToday: meetings.filter(meeting => 
      isSameDay(meeting.date, new Date())
    ).length,
    conversionRate: leads.length > 0 
      ? Math.round((leads.filter(lead => lead.status === 'Closed').length / leads.length) * 100)
      : 0,
    totalValue: leads.reduce((sum, lead) => sum + (lead.budget || 0), 0)
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg bg-gray-200" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-lg bg-gray-200" />
          <Skeleton className="h-96 rounded-lg bg-gray-200" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <strong>Error loading data:</strong>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Overview of your leads and activities
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowAddLeadModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowScheduleModal(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Lead Pipeline</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <HighlighterIcon className="h-4 w-4 text-blue-500" />
                <span>Energy Meter</span>
              </div>
            </div>
            <LeadsTable 
              leads={leads} 
              onStatusChange={handleLeadStatusChange}
              onDeleteLead={handleDeleteLead}
              onLeadClick={handleLeadClick}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Upcoming Meetings</h2>
            <div className="space-y-3">
              {meetings.slice(0, 3).map(meeting => {
                const lead = leads.find(l => l.id === meeting.leadId)
                return (
                  <div 
                    key={meeting.id} 
                    className="p-3 border rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{meeting.title}</h3>
                        <p className="text-sm text-gray-600">
                          {lead?.name || 'Unknown lead'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {meeting.date.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {meeting.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="mt-2 text-blue-600 p-0 h-auto"
                      onClick={() => router.push(`/meetings/${meeting.id}`)}
                    >
                      View details
                    </Button>
                  </div>
                )
              })}
              {meetings.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  No meetings scheduled
                </p>
              )}
            </div>
          </Card>

          <Card className="bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <RecentActivity activities={activities} />
          </Card>
        </div>
      </div>

      <AddLeadModal
        isOpen={showAddLeadModal}
        onClose={() => setShowAddLeadModal(false)}
        onSubmit={handleAddLead}
      />
      
      <ScheduleMeetingModal
        open={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        onSubmit={handleScheduleMeeting}
        leads={leads}
      />

      <Celebration trigger={triggerCelebration} />
    </div>
  )
}