// lib/leadScoring.ts
export interface Lead {
  id: string
  name: string
  email: string
  status: 'new' | 'contacted' | 'closed'
  budget: number
  replyCount: number
  lastContacted?: Date
  notes?: string
  energyScore?: number
}
  
  export function getEnergyScore(lead: Lead): number {
    let score = 0
    
    // Budget contributes up to 40 points
    if (lead.budget >= 10000) score += 40
    else if (lead.budget >= 5000) score += 30
    else if (lead.budget >= 2000) score += 20
    else score += 10
    
    // Email replies contribute up to 30 points
    score += Math.min(lead.replyCount * 10, 30)
    
    // Recent contact adds up to 20 points
    if (lead.lastContacted) {
      const daysSinceContact = Math.floor(
        (new Date().getTime() - lead.lastContacted.getTime()) / (1000 * 60 * 60 * 24)
      )
      if (daysSinceContact <= 1) score += 20
      else if (daysSinceContact <= 3) score += 15
      else if (daysSinceContact <= 7) score += 10
    }
    
    // Status contributes up to 10 points
    if (lead.status === 'contacted') score += 5
    else if (lead.status === 'closed') score += 10
    
    return Math.min(score, 100)
  }