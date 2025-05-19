// components/KanbanColumn.tsx
'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: string
  title: string
  count: number
  children: React.ReactNode
}

export function KanbanColumn({ id, title, count, children }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
    data: { status: id },
  })

  const columnColors: Record<string, string> = {
    new: 'bg-blue-50 border-blue-200',
    contacted: 'bg-yellow-50 border-yellow-200',
    closed: 'bg-green-50 border-green-200',
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'p-3 rounded-lg border',
        columnColors[id] || 'bg-gray-50 border-gray-200'
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-800">{title}</h3>
        <span className="text-xs px-2 py-1 bg-white rounded-full shadow-sm">
          {count}
        </span>
      </div>
      {children}
    </div>
  )
}