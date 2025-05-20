'use client'

import { CalendarIcon, BatteryFullIcon, MoveIcon, ZapIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Lead } from '../types'

interface LeadCardProps {
  lead: Lead
  draggable?: boolean
  className?: string
}

export default function LeadCard({ lead, draggable = true, className }: LeadCardProps) {
  // Calculate Albatross Score with proper operator precedence
  const score = Math.min(
    (lead.budget / 2000) * 30 + // Budget factor
    (lead.urgency ? 40 : 0) +   // Urgency bonus
    (lead.engagement ?? 0) * 10, // Engagement score (fixed operator precedence)
    100
  )

  // Determine energy level colors with type-safe values
  const energyColor = score > 75 
    ? 'bg-green-500 text-green-500' 
    : score > 50 
    ? 'bg-yellow-500 text-yellow-500' 
    : 'bg-red-500 text-red-500'

  // Format last contact date
  const lastContactDate = lead.lastContact?.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) || 'Never'

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md border-l-4 border-gold p-4 group relative",
        className
      )}
      data-testid="lead-card"
    >
      {/* Drag handle (only shown on hover if draggable) */}
      {draggable && (
        <button 
          className="absolute -left-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
          aria-label="Drag handle"
        >
          <MoveIcon className="h-4 w-4" />
        </button>
      )}

      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h3 className="font-bold text-navy truncate">{lead.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600 text-sm truncate">{lead.company}</p>
            {lead.email && (
              <span className="text-xs text-gray-400 truncate hidden sm:inline">
                • {lead.email}
              </span>
            )}
          </div>
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
          <BatteryFullIcon className={cn('h-4 w-4', energyColor.split(' ')[1])} />
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={cn('h-2 rounded-full', energyColor.split(' ')[0])}
              style={{ width: `${score}%` }}
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="text-xs font-medium w-8 text-right">
            {Math.round(score)}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Budget:</span>
            <span className="font-medium text-navy">
              ${lead.budget.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Last Contact:</span>
            <span className="font-medium">{lastContactDate}</span>
          </div>

          {lead.engagement !== undefined && (
            <div className="flex justify-between">
              <span className="text-gray-500">Engagement:</span>
              <span className="font-medium">
                {lead.engagement} {lead.engagement === 1 ? 'reply' : 'replies'}
              </span>
            </div>
          )}

          {lead.score && (
            <div className="flex justify-between">
              <span className="text-gray-500">Score:</span>
              <span className="font-medium">{lead.score}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex-1"
          aria-label="Schedule meeting"
        >
          <CalendarIcon className="mr-1 h-3 w-3" />
          Schedule
        </Button>
        <Button 
          size="sm" 
          className="text-xs flex-1"
          aria-label="View lead details"
        >
          View Details
        </Button>
      </div>
    </div>
  )
}