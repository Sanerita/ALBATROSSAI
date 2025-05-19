// app/leads/page.tsx
import { KanbanBoard } from '@/components/KanbanBoard'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import { PlusIcon, CalendarIcon, BatteryFullIcon } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      {/* Header with quick actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">AlbatrossAI CRM</h1>
          <p className="text-gray-800">
            Visually track your leads' energy levels and progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-teal-500 hover:bg-teal-600">
            <PlusIcon className="mr-2 h-4 w-4" />
            Quick Add Lead
          </Button>
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            View Schedule
          </Button>
        </div>
      </div>

      {/* Energy Legend */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
        <div className="flex items-center gap-2">
          <BatteryFullIcon className="h-5 w-5 text-teal-500" />
          <span className="font-medium">Lead Energy:</span>
        </div>
        <div className="flex gap-4">
          {[
            { level: 'High', color: 'bg-green-500', range: '80-100%' },
            { level: 'Medium', color: 'bg-yellow-500', range: '50-79%' },
            { level: 'Low', color: 'bg-red-500', range: '0-49%' },
          ].map((item) => (
            <div key={item.level} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
              <span className="text-sm">
                {item.level} ({item.range})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-lg shadow p-4">
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['New', 'Contacted', 'Closed'].map((status) => (
              <div key={status} className="space-y-4">
                <h3 className="font-medium text-gray-800">{status} Leads</h3>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg space-y-3">
                    <Skeleton className="h-5 w-3/4 bg-[#f5d67a]" />
                    <Skeleton className="h-4 w-1/2 bg-[#f5d67a]" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-3 w-16 bg-[#f5d67a]" />
                      <Skeleton className="h-8 w-24 bg-[#f5d67a]" />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        }>
          <KanbanBoard />
        </Suspense>
      </div>

      {/* Empty State - shown when no leads exist */}
      <div className="hidden bg-gray-50 rounded-lg p-8 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <BatteryFullIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">No leads yet</h3>
          <p className="text-gray-500">
            Get started by adding your first lead to see the energy meter in action
          </p>
          <Button className="bg-teal-500 hover:bg-teal-600">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>
    </div>
  )
}