'use client'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import LeadCard from './LeadCard'
import { Lead } from '@/types'

interface PipelineColumnProps {
  status: string
  leads: Lead[]
}

export default function PipelineColumn({ status, leads }: PipelineColumnProps) {
  const { setNodeRef } = useSortable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  })

  // Status-specific styling
  const statusStyles: Record<string, string> = {
    New: 'border-blue-200 bg-blue-50',
    Contacted: 'border-purple-200 bg-purple-50',
    Closed: 'border-green-200 bg-green-50',
  }

  const statusColors: Record<string, string> = {
    New: 'text-blue-600',
    Contacted: 'text-purple-600',
    Closed: 'text-green-600',
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-full max-w-xs border rounded-lg p-4 ${statusStyles[status]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className={`font-bold text-lg ${statusColors[status]}`}>
          {status}
        </h2>
        <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
          {leads.length}
        </span>
      </div>

      <div className="flex flex-col gap-3 flex-grow min-h-[100px]">
        {leads.map((lead) => (
          <LeadCard key={lead.id} lead={lead} />
        ))}

        {leads.length === 0 && (
          <div className="flex items-center justify-center text-gray-400 h-full">
            <p>No leads in this stage</p>
          </div>
        )}
      </div>

      {status === 'New' && (
        <button className="mt-4 w-full py-2 bg-gold hover:bg-gold-dark text-white rounded-md transition-colors">
          + Add Lead
        </button>
      )}
    </div>
  )
}