'use client'

import { CalendarIcon, BatteryFullIcon, MoveIcon, ZapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Lead } from '../types'

interface LeadCardProps {
  lead: Lead
  draggable?: boolean
}

export default function LeadCard({ lead, draggable = true }: LeadCardProps) {
  // Calculate Albatross Score (mock AI)
  const score = Math.min(
    (lead.budget / 2000) * 30 + // Budget factor
    (lead.urgency ? 40 : 0) +   // Urgency bonus
    (lead.engagement ?? 0 * 10), // Engagement score
    100
  )

  // Determine energy level colors
  const energyColor = score > 75 
    ? 'bg-green-500' 
    : score > 50 
    ? 'bg-yellow-500' 
    : 'bg-red-500'

  return (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-gold p-4 group relative">
      {/* Drag handle (only shown on hover if draggable) */}
      {draggable && (
        <button className="absolute -left-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          <MoveIcon className="h-4 w-4" />
        </button>
      )}

      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-bold text-navy">{lead.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{lead.company}</p>
        </div>
        
        {lead.urgency && (
          <span className="flex-shrink-0 bg-red-100 text-red-800 text-xs px-2 py-1 rounded flex items-center gap-1">
            <ZapIcon className="h-3 w-3" />
            Urgent
          </span>
        )}
      </div>

      {/* Combined Energy Meter and AI Score */}
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <BatteryFullIcon
            className={cn('h-4 w-4', energyColor.replace('bg', 'text'))}
          />
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={cn('h-2 rounded-full', energyColor)}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-xs font-medium w-8 text-right">
            {score}%
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Budget:</span>
          <span className="font-medium text-navy">
            ${lead.budget.toLocaleString()}
          </span>
        </div>

        {lead.engagement && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Engagement:</span>
            <span className="font-medium">
              {lead.engagement} replies
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between gap-2">
        <Button variant="outline" size="sm" className="text-xs flex-1">
          <CalendarIcon className="mr-1 h-3 w-3" />
          Schedule
        </Button>
        <Button size="sm" className="text-xs flex-1">
          View Details
        </Button>
      </div>
    </div>
  )
}