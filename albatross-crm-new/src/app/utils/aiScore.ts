// utils/aiScore.ts
interface Lead {
    budget: number
    lastContact: Date | null
    emailOpens: number
    replies: number
    urgency: boolean
  }
  
  export function calculateAlbatrossScore(lead: Lead): number {
    // Budget contributes up to 30 points
    const budgetScore = Math.min(lead.budget / 2000 * 30, 30)
    
    // Engagement (email opens + replies)
    const engagementScore = Math.min(
      lead.emailOpens * 2 + lead.replies * 10,
      30
    )
    
    // Recency (more recent = better)
    const recencyScore = lead.lastContact 
      ? 30 - Math.min(
          (new Date().getTime() - lead.lastContact.getTime()) / (1000 * 60 * 60 * 24 * 7),
          30
        )
      : 0
      
    // Urgency flag adds 10 points
    const urgencyScore = lead.urgency ? 10 : 0
    
    return Math.min(
      budgetScore + engagementScore + recencyScore + urgencyScore,
      100
    )
  }