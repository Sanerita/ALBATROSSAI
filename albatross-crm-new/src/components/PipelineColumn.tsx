'use client'
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import LeadCard from './LeadCard'
import type { Lead } from '../../types'

interface PipelineColumnProps {
  status: 'New' | 'Contacted' | 'Closed'
  leads: Lead[]
}

export default function PipelineColumn({ status, leads }: PipelineColumnProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const statusColors: Record<string, string> = {
    'Lead': 'text-blue-500',
    'Contacted': 'text-yellow-600',
    'Closed': 'text-green-500',
    // add other statuses and colors
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex flex-col w-full max-w-xs border rounded-lg p-4`}
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
        <button
          className="mt-4 w-full py-2 bg-gold hover:bg-gold-dark text-white rounded-md transition-colors"
          onClick={() => console.log('Add lead clicked')}
        >
          + Add Lead
        </button>
      )}
    </div>
  )
}