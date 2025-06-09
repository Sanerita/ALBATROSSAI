'use client'

import { CalendarIcon, BatteryFullIcon, MoveIcon, ZapIcon, MailIcon, PhoneIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Lead } from '../types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface LeadCardProps {
  lead: Lead
  draggable?: boolean
  className?: string
  onStatusChange?: (leadId: string, newStatus: Lead['status']) => void
  onDelete?: (leadId: string) => void
}

export default function LeadCard({ 
  lead, 
  draggable = true, 
  className,
  onStatusChange,
  onDelete
}: LeadCardProps) {
  const router = useRouter()
  
  // Calculate Albatross Score with proper operator precedence
  const score = Math.min(
    Math.floor(
      (lead.budget / 2000) * 30 + // Budget factor (30% weight)
      (lead.urgency ? 40 : 0) +   // Urgency bonus (40 points)
      (lead.engagement ?? 0) * 10  // Engagement score (10 points per reply)
    ),
    100
  )

  // Energy level colors with proper TypeScript typing
  const energyLevel: 'high' | 'medium' | 'low' = 
    score > 75 ? 'high' : score > 50 ? 'medium' : 'low'

  const energyColorMap = {
    high: { bg: 'bg-green-500', text: 'text-green-500' },
    medium: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
    low: { bg: 'bg-red-500', text: 'text-red-500' }
  }

  // Format last contact date with proper null check
  const lastContactDate = lead.lastContact 
    ? new Date(lead.lastContact).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    : 'Never'

  const handleStatusChange = (newStatus: Lead['status']) => {
    if (onStatusChange) {
      onStatusChange(lead.id, newStatus)
      toast.success(`Lead moved to ${newStatus}`)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(lead.id)
      toast('Lead deleted', {
        action: {
          label: 'Undo',
          onClick: () => onDelete(lead.id) // Would need to implement undo logic
        }
      })
    }
  }

  const handleQuickAction = (action: 'email' | 'call' | 'meeting') => {
    switch(action) {
      case 'email':
        window.location.href = `mailto:${lead.email}`
        break
      case 'call':
        window.location.href = `tel:${lead.phone}`
        break
      case 'meeting':
        // Would integrate with calendar API in production
        toast.info('Opening calendar to schedule meeting')
        break
    }
  }

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm border border-gray-200 p-4 group relative",
        "hover:shadow-md transition-shadow duration-200",
        "flex flex-col gap-3",
        className
      )}
      data-testid="lead-card"
      aria-labelledby={`lead-${lead.id}-title`}
    >
      {/* Drag handle (only shown on hover if draggable) */}
      {draggable && (
        <button 
          className="absolute -left-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-label={`Drag to reorder ${lead.name}`}
        >
          <MoveIcon className="h-4 w-4" />
        </button>
      )}

      {/* Header with name and actions */}
      <div className="flex justify-between items-start gap-2">
        <div className="min-w-0">
          <h3 
            id={`lead-${lead.id}-title`}
            className="font-semibold text-gray-900 truncate"
          >
            {lead.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600 text-sm truncate">{lead.company}</p>
            {lead.email && (
              <span className="text-xs text-gray-400 truncate hidden sm:inline">
                • {lead.email}
              </span>
            )}
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 -mt-1 -mr-1"
              aria-label="Lead actions"
            >
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" 
                  fill="currentColor" fillRule="evenodd" clipRule="evenodd">
                </path>
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleQuickAction('email')}>
              <MailIcon className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleQuickAction('call')}>
              <PhoneIcon className="mr-2 h-4 w-4" />
              Make Call
            </DropdownMenuItem>
            {onStatusChange && (
              <>
                <DropdownMenuItem onClick={() => handleStatusChange('New')}>
                  Mark as New
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('Contacted')}>
                  Mark as Contacted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('Closed')}>
                  Mark as Closed
                </DropdownMenuItem>
              </>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                Delete Lead
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Urgency Badge */}
      {lead.urgency && (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 w-fit">
          <ZapIcon className="h-3 w-3" />
          Urgent
        </span>
      )}

      {/* Combined Energy Meter and AI Score */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BatteryFullIcon className={cn('h-4 w-4', energyColorMap[energyLevel].text)} />
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={cn('h-2 rounded-full', energyColorMap[energyLevel].bg)}
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

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col">
            <span className="text-gray-500">Budget</span>
            <span className="font-medium text-gray-900">
              ${lead.budget.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-500">Last Contact</span>
            <span className="font-medium text-gray-900">{lastContactDate}</span>
          </div>

          {lead.engagement !== undefined && (
            <div className="flex flex-col">
              <span className="text-gray-500">Engagement</span>
              <span className="font-medium text-gray-900">
                {lead.engagement} {lead.engagement === 1 ? 'reply' : 'replies'}
              </span>
            </div>
          )}

          <div className="flex flex-col">
            <span className="text-gray-500">Status</span>
            <span className="font-medium text-gray-900 capitalize">{lead.status}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-2 flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs flex-1 gap-1"
          onClick={() => handleQuickAction('meeting')}
        >
          <CalendarIcon className="h-3.5 w-3.5" />
          Meeting
        </Button>
        <Button 
          size="sm" 
          className="text-xs flex-1"
          onClick={() => router.push(`/leads/${lead.id}`)}
        >
          View Details
        </Button>
      </div>
    </div>
  )
}