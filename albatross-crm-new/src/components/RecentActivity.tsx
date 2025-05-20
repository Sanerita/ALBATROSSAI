// components/RecentActivity.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"

interface Activity {
  id: string
  type: string
  message: string
  timestamp: Date
  user?: {
    name: string
    avatar?: string
  }
}

interface RecentActivityProps {
  activities: Activity[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities || activities.length === 0) {
    return (
      <Card className="p-4">
        <p className="text-center text-gray-500">No recent activity</p>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage 
                src={activity.user?.avatar} 
                alt={activity.user?.name || 'User'} 
              />
              <AvatarFallback>
                {activity.user?.name?.charAt(0) || 'A'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm">{activity.message}</p>
              <p className="text-xs text-gray-500">
                {new Date(activity.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}