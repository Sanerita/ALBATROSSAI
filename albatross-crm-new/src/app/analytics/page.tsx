import { Card } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Lead Conversion</h2>
          <p className="text-gray-600">Track your lead to customer conversion rates</p>
          <div className="mt-4 h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-400">Chart Placeholder</p>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-2">Lead Energy</h2>
          <p className="text-gray-600">View lead engagement levels</p>
          <div className="mt-4 h-64 bg-gray-100 rounded flex items-center justify-center">
            <p className="text-gray-400">Energy Meter Visualization</p>
          </div>
        </Card>

        <Card className="p-6 md:col-span-2 lg:col-span-1">
          <h2 className="text-xl font-semibold mb-2">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border-b pb-2">
                <p className="font-medium">Lead #{item} moved to Closed</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}