'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CalendarIcon, ClockIcon, XIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Lead, Meeting } from '@/types'

interface ScheduleMeetingModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (meeting: Omit<Meeting, 'id' | 'createdAt'>) => void
  leads: Lead[]
}

export function ScheduleMeetingModal({ open, onClose, onSubmit, leads }: ScheduleMeetingModalProps) {
  const [title, setTitle] = useState('')
  const [selectedLeadId, setSelectedLeadId] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [time, setTime] = useState('09:00')
  const [duration, setDuration] = useState(30)
  const [notes, setNotes] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !selectedLeadId || !date) return

    const [hours, minutes] = time.split(':').map(Number)
    const meetingDate = new Date(date)
    meetingDate.setHours(hours, minutes)

    onSubmit({
      title,
      leadId: selectedLeadId,
      date: meetingDate,
      duration,
      notes
    })

    setTitle('')
    setSelectedLeadId('')
    setDate(new Date())
    setTime('09:00')
    setDuration(30)
    setNotes('')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-semibold">Schedule New Meeting</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Project Kickoff Call"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>With Lead</Label>
            <Select value={selectedLeadId} onValueChange={setSelectedLeadId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a lead" />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    {lead.name} ({lead.company || 'No company'})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                // In ScheduleMeetingModal.tsx
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  initialFocus
  meetings={[]}
  onDateClick={() => {}}
  onMeetingClick={() => {}}
/>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Time</Label>
              <div className="relative">
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pr-8"
                  required
                />
                <ClockIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration (minutes)</Label>
            <Select value={duration.toString()} onValueChange={(val) => setDuration(Number(val))}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 min</SelectItem>
                <SelectItem value="30">30 min</SelectItem>
                <SelectItem value="45">45 min</SelectItem>
                <SelectItem value="60">60 min</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-teal-600 hover:bg-teal-700">
              Schedule Meeting
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}