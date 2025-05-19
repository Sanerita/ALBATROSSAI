'use client'

import { useState } from 'react'
import { format, startOfWeek, addDays, isSameDay, isSameMonth, isBefore, endOfDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { type Dispatch, type SetStateAction } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Meeting } from '@/types'
import { cn } from '@/lib/utils'


interface CalendarProps {
  meetings: Meeting[]
  onDateClick: (date: Date) => void
  onMeetingClick: (meeting: Meeting) => void
  initialDate?: Date
  mode?: string
  onSelect?: Dispatch<SetStateAction<Date | undefined>>
  selected?: Date | undefined
  initialFocus?: boolean;
}


export function Calendar({ meetings, onDateClick, onMeetingClick, initialDate = new Date(), mode = 'month', selected: selectedProp }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState(selectedProp || initialDate)

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(addDays(currentMonth, -7))}
        >
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(addDays(currentMonth, 7))}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const renderDays = () => {
    const dateFormat = 'EEE'
    const days = []
    const startDate = startOfWeek(currentMonth)

    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="text-center text-sm font-medium text-gray-500 py-2" key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>
      )
    }

    return <div className="grid grid-cols-7">{days}</div>
  }

  const renderCells = () => {
    const startDate = startOfWeek(currentMonth)
    const rows = []
    const today = new Date()

    for (let week = 0; week < 4; week++) {
      const days = []

      for (let day = 0; day < 7; day++) {
        const currentDate = addDays(startDate, week * 7 + day)
        const dayMeetings = meetings.filter(meeting =>
          isSameDay(new Date(meeting.date), currentDate)
        )

        days.push(
          <div
            key={currentDate.toString()}
            className={cn(
              'min-h-24 p-1 border border-gray-200',
              !isSameMonth(currentDate, currentMonth) && 'bg-gray-50 text-gray-400',
              isBefore(currentDate, today) && !isSameDay(currentDate, today) && 'opacity-60'
            )}
            onClick={() => {
              setSelectedDate(currentDate)
              onDateClick(currentDate)
            }}
          >
            <div className={cn(
              'flex justify-center items-center w-6 h-6 mx-auto rounded-full',
              isSameDay(currentDate, selectedDate) ? 'bg-teal-500 text-white' : '',
              isSameDay(currentDate, today) && !isSameDay(currentDate, selectedDate) ? 'border border-teal-500' : ''
            )}>
              {format(currentDate, 'd')}
            </div>

            <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
              {dayMeetings.map(meeting => (
                <div
                  key={meeting.id}
                  className="text-xs p-1 bg-teal-100 text-teal-800 rounded truncate cursor-pointer hover:bg-teal-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    onMeetingClick(meeting)
                  }}
                >
                  {format(new Date(meeting.date), 'h:mm a')} - {meeting.title}
                </div>
              ))}
            </div>
          </div>
        )
      }
      rows.push(
        <div className="grid grid-cols-7" key={week}>
          {days}
        </div>
      )
    }
    return <div className="mb-4">{rows}</div>
  }

  const renderSelectedDateMeetings = () => {
    const selectedDateMeetings = meetings.filter(meeting =>
      isSameDay(new Date(meeting.date), selectedDate)
    )

    if (selectedDateMeetings.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No meetings scheduled for {format(selectedDate, 'MMMM d, yyyy')}
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <h3 className="font-medium text-gray-800">
          Meetings on {format(selectedDate, 'MMMM d, yyyy')}
        </h3>
        {selectedDateMeetings.map(meeting => (
          <div
            key={meeting.id}
            className="p-3 border rounded-lg hover:bg-teal-50 transition-colors cursor-pointer"
            onClick={() => onMeetingClick(meeting)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{meeting.title}</h4>
                <p className="text-sm text-gray-600">
                  {format(new Date(meeting.date), 'h:mm a')} -{' '}
                  {format(new Date(new Date(meeting.date).getTime() + meeting.duration * 60000), 'h:mm a')}
                </p>
              </div>
              <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
                {meeting.duration} min
              </span>
            </div>
            {meeting.notes && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {meeting.notes}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderSelectedDateMeetings()}
    </div>
  )
}