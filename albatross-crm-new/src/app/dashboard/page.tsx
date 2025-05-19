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
        
        const [leadsRes, meetingsRes, activitiesRes] = await Promise.all([
          fetch('/api/leads'),
          fetch('/api/meetings'),
          fetch('/api/activities')
        ])

        // Check for HTTP errors
        if (!leadsRes.ok) throw new Error('Failed to fetch leads')
        if (!meetingsRes.ok) throw new Error('Failed to fetch meetings')
        if (!activitiesRes.ok) throw new Error('Failed to fetch activities')

        // Verify content type is JSON
        const leadsContentType = leadsRes.headers.get('content-type')
        const meetingsContentType = meetingsRes.headers.get('content-type')
        const activitiesContentType = activitiesRes.headers.get('content-type')

        if (!leadsContentType?.includes('application/json')) {
          throw new Error('Leads API did not return JSON')
        }
        if (!meetingsContentType?.includes('application/json')) {
          throw new Error('Meetings API did not return JSON')
        }
        if (!activitiesContentType?.includes('application/json')) {
          throw new Error('Activities API did not return JSON')
        }

        const [leadsData, meetingsData, activitiesData] = await Promise.all([
          leadsRes.json(),
          meetingsRes.json(),
          activitiesRes.json()
        ])

        const processedLeads: Lead[] = leadsData.map((lead: any) => ({
          ...lead,
          id: lead.id || uuidv4(),
          status: lead.status as LeadStatus,
          lastContact: lead.lastContact ? new Date(lead.lastContact) : undefined,
          score: calculateLeadScore(lead)
        }))

        const processedMeetings: Meeting[] = meetingsData.map((meeting: any) => ({
          ...meeting,
          date: new Date(meeting.date),
          createdAt: new Date(meeting.createdAt || Date.now())
        }))

        setLeads(processedLeads)
        setMeetings(processedMeetings)
        setActivities(activitiesData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const calculateLeadScore = (lead: Partial<Lead>): number => {
    let score = 0
    score += Math.min((lead.budget || 0) / 2000 * 30, 30)
    if (lead.urgency) score += 40
    score += (lead.engagement || 0) * 10
    return Math.min(score, 100)
  }

  const handleLeadStatusChange = (leadId: string, newStatus: LeadStatus) => {
    setLeads(prevLeads =>
      prevLeads.map(lead =>
        lead.id === leadId 
          ? { 
              ...lead, 
              status: newStatus,
              score: calculateLeadScore({ ...lead, status: newStatus })
            } 
          : lead
      )
    )

    if (newStatus === 'Closed') {
      setTriggerCelebration(true)
      setTimeout(() => setTriggerCelebration(false), 3000)
    }
  }

  const handleAddLead = (newLead: { name: string; email: string; budget: number; notes: string }) => {
    const leadWithScore: Lead = {
      ...newLead,
      id: uuidv4(),
      status: 'New',
      score: calculateLeadScore(newLead)
    }
    setLeads(prevLeads => [...prevLeads, leadWithScore])
    setShowAddLeadModal(false)
  }

  const handleScheduleMeeting = (meeting: Omit<Meeting, 'id' | 'createdAt'>) => {
    const newMeeting: Meeting = {
      ...meeting,
      id: uuidv4(),
      createdAt: new Date()
    }
    setMeetings(prev => [...prev, newMeeting])
    setShowScheduleModal(false)
  }

  const stats = {
    totalLeads: leads.length,
    hotLeads: leads.filter(lead => lead.score > 75).length,
    meetingsToday: meetings.filter(meeting => 
      isSameDay(meeting.date, new Date())
    ).length,
    conversionRate: leads.length > 0 
      ? Math.round((leads.filter(lead => lead.status === 'Closed').length / leads.length) * 100)
      : 0
  }


  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // In your dashboard page component
if (isLoading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-lg" />
          <Skeleton className="h-96 rounded-lg" />
        </div>
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">AlbatrossAI CRM</h1>
          <p className="text-gray-800">
            Your leads' energy levels at a glance. Focus on what matters!
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-teal-500 hover:bg-teal-600"
            onClick={() => setShowAddLeadModal(true)}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowScheduleModal(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            View Schedule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg bg-[#f5d67a]" />
          ))
        ) : (
          <StatsCards stats={stats} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Lead Pipeline
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <HighlighterIcon className="h-4 w-4 text-teal-500" />
              <span>Energy Meter: </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                Low
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                High
              </span>
            </div>
          </div>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-[#f5d67a]" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-[#f5d67a]" />
              ))}
            </div>
          ) : (
            <LeadsTable 
              leads={leads} 
              onStatusChange={handleLeadStatusChange}
            />
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Scheduled Meetings
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full bg-[#f5d67a]" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {meetings.slice(0, 3).map(meeting => {
                  const lead = leads.find(l => l.id === meeting.leadId)
                  return (
                    <div 
                      key={meeting.id}
                      className="p-3 border rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{lead?.name || 'Unknown Lead'}</h3>
                          <p className="text-sm text-gray-600">{meeting.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
                            {meeting.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => router.push(`/meeting/${meeting.id}`)}
                          >
                            Join
                          </Button>
                        </div>
                      </div>
                      {lead && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs">Energy:</span>
                          <div className="relative w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`absolute top-0 left-0 h-full ${
                                lead.score > 75 ? 'bg-green-500' :
                                lead.score > 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${lead.score}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium">{lead.score}%</span>
                        </div>
                      )}
                    </div>
                  )
                })}
                {meetings.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    No meetings scheduled
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Activity Feed
            </h2>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-[#f5d67a]" />
                ))}
              </div>
            ) : (
              <RecentActivity activities={activities} />
            )}
          </div>
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