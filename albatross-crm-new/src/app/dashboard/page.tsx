// app/dashboard/page.tsx
import { Suspense } from 'react'
import { StatsCards } from '@/components/StatsCards'
import { LeadsTable } from '@/components/LeadsTable'
import { RecentActivity } from '@/components/RecentActivity'
import { Celebration } from '@/components/Celebration'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-800">
          Welcome back! Here's what's happening with your leads.
        </p>
      </div>

      {/* Stats Cards */}
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
        {/* Leads Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Recent Leads
          </h2>
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

      {/* Celebration Effects (hidden until triggered) */}
      <Celebration />
    </div>
  )
}