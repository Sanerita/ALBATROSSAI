export interface Lead {
    id: string
    name: string
    email: string
    company?: string
    budget: number
    status: 'New' | 'Contacted' | 'Closed'
    urgency: boolean
    engagement: number
    lastContact?: Date
  }