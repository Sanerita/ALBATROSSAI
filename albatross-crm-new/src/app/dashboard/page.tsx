// app/dashboard/page.tsx
import { Suspense } from 'react'
import { StatsCards } from '@/components/StatsCards'
import { LeadsTable } from '@/components/LeadsTable'
import { RecentActivity } from '@/components/RecentActivity'
import { Celebration } from '@/components/Celebration'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { PlusIcon, CalendarIcon, HighlighterIcon } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header with quick actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">AlbatrossAI CRM</h1>
          <p className="text-gray-800">
            Your leads' energy levels at a glance. Focus on what matters!
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-teal-500 hover:bg-teal-600">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            View Schedule
          </Button>
        </div>
      </div>

      {/* Stats Cards with energy metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Suspense fallback={
          <>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg bg-[#f5d67a]" />
            ))}
          </>
        }>
          <StatsCards />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Table with energy meter */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Lead Pipeline
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <HighlighterIcon className="h-4 w-4 text-teal-500" />
              <span>Energy Meter: </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
                Low
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-yellow-500"></span>
                Medium
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                High
              </span>
            </div>
          </div>
          <Suspense fallback={
            <div className="space-y-4">
              <Skeleton className="h-12 w-full bg-[#f5d67a]" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full bg-[#f5d67a]" />
              ))}
            </div>
          }>
            <LeadsTable />
          </Suspense>
        </div>

        {/* Recent Activity with scheduling highlights */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Scheduled Meetings
            </h2>
            <Suspense fallback={
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full bg-[#f5d67a]" />
                ))}
              </div>
            }>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg hover:bg-teal-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">Maria Lopez</h3>
                      <p className="text-sm text-gray-600">Project Kickoff</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 bg-teal-100 text-teal-800 rounded-full">
                        Today, 2:00 PM
                      </span>
                      <Button variant="outline" size="sm" className="text-xs">
                        Join
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs">Energy:</span>
                    <div className="relative w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="absolute top-0 left-0 h-full bg-green-500" 
                        style={{ width: '80%' }}
                      ></div>
                    </div>
                    <span className="text-xs font-medium">80%</span>
                  </div>
                </div>
                {/* More meeting items would go here */}
              </div>
            </Suspense>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Activity Feed
            </h2>
            <Suspense fallback={
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-[#f5d67a]" />
                ))}
              </div>
            }>
              <RecentActivity />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Celebration Effects (hidden until triggered) */}
      <Celebration />
    </div>
  )
}