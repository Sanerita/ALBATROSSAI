
'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar' // Adjust path if needed
import { Button } from '@/components/ui/button'
import { Meeting } from '@/types'

export default function CalendarPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  // Example meetings data
  const [meetings, setMeetings] = useState<Meeting[]>([])

useEffect(() => {
  const now = new Date()
  setMeetings([
    {
      id: '1',
      title: 'Meeting with Acme Corp',
      date: now,
      duration: 60,
      notes: 'Discuss Q3 strategy',
      leadId: 'lead-001',
      createdAt: now,
    },
    {
      id: '2',
      title: 'Follow-up with Sarah',
      date: new Date(now.getTime() + 86400000),
      duration: 30,
      notes: 'Review feedback',
      leadId: 'lead-002',
      createdAt: now,
    },
    {
      id: '3',
      title: 'Product Demo',
      date: new Date(now.getTime() + 2 * 86400000),
      duration: 60,
      notes: 'Showcase new features',
      leadId: 'lead-003',
      createdAt: now,
    },
  ])
}, [])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
  }

  const handleMeetingClick = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    alert(`Meeting selected: ${meeting.title}`)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Meeting Calendar</h2>

      <Button className="mb-4">Schedule New Meeting</Button>

      <Calendar
        meetings={meetings}
        onDateClick={handleDateClick}
        onMeetingClick={handleMeetingClick}
        selected={selectedDate}
      />

      <h3 className="text-xl font-semibold mt-6 mb-2">Upcoming Meetings</h3>
      <div className="space-y-2">
        {meetings.map(meeting => (
          <div key={meeting.id} className="p-4 border rounded shadow-sm">
            <h4 className="font-medium">{meeting.title}</h4>
            <p>
              {new Date(meeting.date).toDateString()} •{' '}
              {new Date(meeting.date).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <div className="flex gap-2 mt-2">
              <Button onClick={() => alert(`Details for ${meeting.title}`)}>Details</Button>
              <Button variant="outline" onClick={() => alert(`Reschedule ${meeting.title}`)}>
                Reschedule
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
