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
  
  // Enhanced score calculation with proper weights
  const calculateScore = () => {
    const budgetScore = Math.min(lead.budget / 2000 * 30, 30) // Max 30 points
    const urgencyScore = lead.urgency ? 20 : 0 // 20 points for urgency
    const engagementScore = Math.min((lead.engagement ?? 0) * 10, 30) // Max 30 points
    const responseTimeScore = lead.lastContact ? 
      Math.max(0, 20 - (Date.now() - new Date(lead.lastContact).getTime()) / (1000 * 60 * 60 * 24) * 2) : 0 // Up to 20 points
    
    return Math.min(Math.floor(budgetScore + urgencyScore + engagementScore + responseTimeScore), 100)
  }

  const score = calculateScore()

  const energyLevel = score > 75 ? 'high' : score > 50 ? 'medium' : 'low'
  const energyColors = {
    high: { bg: 'bg-green-500', text: 'text-green-500' },
    medium: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
    low: { bg: 'bg-red-500', text: 'text-red-500' }
  }

  const formatDate = (date?: Date) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const handleStatusChange = (newStatus: Lead['status']) => {
    onStatusChange?.(lead.id, newStatus)
    toast.success(`Status updated to ${newStatus}`, {
      action: newStatus === 'Closed' ? {
        label: 'View',
        onClick: () => router.push(`/leads/${lead.id}`)
      } : undefined
    })
  }

  const handleDelete = () => {
    onDelete?.(lead.id)
    toast('Lead deleted', {
      action: {
        label: 'Undo',
        onClick: () => onDelete?.(lead.id) // Note: This would need actual undo logic
      }
    })
  }

  const handleQuickAction = (action: 'email' | 'call' | 'meeting') => {
    switch(action) {
      case 'email':
        window.open(`mailto:${lead.email}?subject=Regarding your inquiry`, '_blank')
        break
      case 'call':
        if (lead.phone) {
          window.open(`tel:${lead.phone}`, '_blank')
        } else {
          toast.warning('No phone number available')
        }
        break
      case 'meeting':
        toast.info('Scheduling meeting...', {
          description: 'Would integrate with calendar API in production'
        })
        break
    }
  }

  return (
    <div 
      className={cn(
        "relative bg-white rounded-lg border border-gray-200 p-4",
        "shadow-sm hover:shadow-md transition-shadow",
        "flex flex-col gap-3 group",
        className
      )}
      aria-labelledby={`lead-title-${lead.id}`}
    >
      {/* Drag handle */}
      {draggable && (
        <button 
          className="absolute -left-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white shadow border border-gray-200 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:ring-2 focus:ring-blue-500"
          aria-label={`Drag ${lead.name}`}
        >
          <MoveIcon className="h-4 w-4" />
        </button>
      )}

      {/* Header */}
      <div className="flex justify-between gap-2">
        <div className="min-w-0">
          <h3 
            id={`lead-title-${lead.id}`}
            className="font-semibold text-gray-900 truncate"
          >
            {lead.name}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-sm">
            <span className="text-gray-600 truncate">{lead.company}</span>
            {lead.email && (
              <span className="hidden sm:inline text-gray-400">• {lead.email}</span>
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
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <path d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z" 
                  fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => handleQuickAction('email')}>
              <MailIcon className="mr-2 h-4 w-4" />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleQuickAction('call')}
              disabled={!lead.phone}
            >
              <PhoneIcon className="mr-2 h-4 w-4" />
              Call
            </DropdownMenuItem>
            {onStatusChange && (
              <>
                <DropdownMenuItem key="new" onClick={() => handleStatusChange('New')}>
                  Mark as New
                </DropdownMenuItem>
                <DropdownMenuItem key="contacted" onClick={() => handleStatusChange('Contacted')}>
                  Mark as Contacted
                </DropdownMenuItem>
                <DropdownMenuItem key="closed" onClick={() => handleStatusChange('Closed')}>
                  Mark as Closed
                </DropdownMenuItem>
              </>
            )}
            {onDelete && (
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:bg-red-50"
              >
                Delete Lead
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Urgency indicator */}
      {lead.urgency && (
        <div className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 w-fit">
          <ZapIcon className="h-3 w-3" />
          Urgent
        </div>
      )}

      {/* Score and metrics */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BatteryFullIcon className={cn('h-4 w-4', energyColors[energyLevel].text)} />
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={cn('h-2 rounded-full', energyColors[energyLevel].bg)}
              style={{ width: `${score}%` }}
              aria-valuenow={score}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <span className="text-xs font-medium w-8 text-right">
            {score}%
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500">Budget</p>
            <p className="font-medium">${lead.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Last Contact</p>
            <p className="font-medium">{formatDate(lead.lastContact)}</p>
          </div>
          <div>
            <p className="text-gray-500">Engagement</p>
            <p className="font-medium">
              {lead.engagement ?? 0} {lead.engagement === 1 ? 'reply' : 'replies'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="font-medium capitalize">{lead.status}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
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