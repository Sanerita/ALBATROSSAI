// components/KanbanColumn.tsx
'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

interface KanbanColumnProps {
  id: string
  title: string
  count: number
  children: React.ReactNode
  className?: string
}

export function KanbanColumn({ id, title, count, children, className }: KanbanColumnProps) {
  const { setNodeRef, isOver, active } = useDroppable({
    id,
    data: { 
      status: id,
      type: 'column'
    }
  })

  const columnStyles: Record<string, { bg: string; border: string; text: string }> = {
    new: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800'
    },
    contacted: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800'
    },
    closed: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800'
    },
    default: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-800'
    }
  }

  const currentStyle = columnStyles[id.toLowerCase()] || columnStyles.default
  const isDraggingOver = isOver && active?.data.current?.type !== 'column'

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col h-full p-3 rounded-lg border transition-colors',
        currentStyle.bg,
        currentStyle.border,
        isDraggingOver && 'ring-2 ring-blue-400 bg-opacity-70',
        className
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className={cn('font-medium', currentStyle.text)}>
          {title}
        </h3>
        <span className={cn(
          'text-xs px-2 py-1 rounded-full shadow-sm',
          currentStyle.bg.replace('50', '100'),
          currentStyle.text
        )}>
          {count}
        </span>
      </div>

      <div className="flex-grow space-y-3 overflow-y-auto">
        {children}
      </div>

      {isDraggingOver && (
        <div className="mt-2 h-1 rounded-full bg-blue-400 animate-pulse"></div>
      )}
    </div>
  )
}