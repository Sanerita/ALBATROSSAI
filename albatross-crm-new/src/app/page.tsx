import { LeadsTable } from '@/components/LeadsTable';
import { StatsCards } from '@/components/StatsCards';
import { RecentActivity } from '@/components/RecentActivity';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your leads.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCards />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leads Table */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-navy-800 mb-4">Recent Leads</h2>
          <LeadsTable />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-navy-800 mb-4">Activity Feed</h2>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}