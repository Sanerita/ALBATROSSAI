'use client'

import { Clock, Mail, Phone, CheckCircle, XCircle, Calendar } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

interface Activity {
  id: string
  type: 'email' | 'call' | 'meeting' | 'status_change'
  user: {
    name: string
    avatar?: string
  }
  description: string
  timestamp: Date
  status?: 'completed' | 'failed'
  leadName: string
}

interface RecentActivityProps {
  activities: Activity[]
}

const getActivityIcon = (type: Activity['type'], status?: Activity['status']) => {
  switch (type) {
    case 'email':
      return <Mail className="h-4 w-4" />
    case 'call':
      return <Phone className="h-4 w-4" />
    case 'meeting':
      return <Calendar className="h-4 w-4" />
    case 'status_change':
      return status === 'completed' 
        ? <CheckCircle className="h-4 w-4 text-green-500" /> 
        : <XCircle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'email': return 'bg-blue-100 text-blue-800'
    case 'call': return 'bg-purple-100 text-purple-800'
    case 'meeting': return 'bg-orange-100 text-orange-800'
    case 'status_change': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.user.avatar} />
                  <AvatarFallback>
                    {activity.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    {activity.user.name}
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      with {activity.leadName}
                    </span>
                  </p>
                  <time className="text-xs text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </time>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className={`inline-flex items-center rounded-full p-1 ${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type, activity.status)}
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No recent activity
          </div>
        )}
      </div>
    </div>
  )
}