
'use client'

import { Lead } from '../types'
import { useState } from 'react'

export function SchedulerModal({ lead }: { lead: Lead }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  
  // Mock available time slots
  const timeSlots = [
    '9:00 AM - 10:00 AM',
    '11:00 AM - 12:00 PM',
    '2:00 PM - 3:00 PM',
    '4:00 PM - 5:00 PM'
  ]

  const handleSchedule = () => {
    // In a real app, this would call your API
    alert(`Meeting scheduled with ${lead.name} at ${selectedSlot}`)
    setIsOpen(false)
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600"
      >
        Schedule Meeting
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              Schedule with {lead.name}
            </h3>
            <div className="space-y-2 mb-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full text-left p-2 rounded ${
                    selectedSlot === slot 
                      ? 'bg-teal-100 border-teal-500 border' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSchedule}
                disabled={!selectedSlot}
                className="px-4 py-2 bg-teal-500 text-white rounded disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}