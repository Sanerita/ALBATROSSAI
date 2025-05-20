// components/StatsCards.tsx
import { Card } from "@/components/ui/card"

interface StatsCardsProps {
  stats: {
    totalLeads: number
    hotLeads: number
    meetingsToday: number
    conversionRate: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <h3 className="text-sm font-medium text-blue-600">Total Leads</h3>
        <p className="text-2xl font-bold mt-2 text-blue-900">
          {stats.totalLeads.toLocaleString()}
        </p>
        <p className="text-xs text-blue-500 mt-1">All potential opportunities</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
        <h3 className="text-sm font-medium text-amber-600">Hot Leads</h3>
        <p className="text-2xl font-bold mt-2 text-amber-900">
          {stats.hotLeads.toLocaleString()}
        </p>
        <p className="text-xs text-amber-500 mt-1">High energy leads</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
        <h3 className="text-sm font-medium text-teal-600">Meetings Today</h3>
        <p className="text-2xl font-bold mt-2 text-teal-900">
          {stats.meetingsToday.toLocaleString()}
        </p>
        <p className="text-xs text-teal-500 mt-1">Scheduled appointments</p>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <h3 className="text-sm font-medium text-purple-600">Conversion Rate</h3>
        <p className="text-2xl font-bold mt-2 text-purple-900">
          {stats.conversionRate}%
        </p>
        <p className="text-xs text-purple-500 mt-1">Leads to customers</p>
      </Card>
    </div>
  )
}