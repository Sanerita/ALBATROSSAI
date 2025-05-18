export interface Lead {
    id: string
  name: string
  email: string
  budget: number
  status: 'New' | 'Contacted' | 'Closed' // Enum-like status
  urgency: boolean
  engagement: number
  lastContact: Date
  }
  
  declare namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }