export type LeadStatus = "New" | "Contacted" | "Closed";

export interface Lead {
  id: string;
  name: string;
  email: string;
  budget: number;
  status: LeadStatus;
  urgency?: boolean;
  engagement?: number;
  lastContact?: Date;
  replyCount?: number;
  energyScore?: number;
  company?: string;
  score: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  date: Date;
  leadId: string;
  duration: number;
  notes: string;
  createdAt: Date;
}

/**
 * Calculates an energy score for a lead based on various factors
 * @param lead The lead data (without id)
 * @returns A score between 0-100 representing the lead's potential
 * @throws {Error} If the lead data is invalid
 */
export function calculateEnergyScore(lead: Omit<Lead, 'id'>): number {
  // Input validation
  if (typeof lead.budget !== 'number' || lead.budget < 0) {
    throw new Error('Invalid budget value');
  }

  if (lead.replyCount && (lead.replyCount < 0 || !Number.isInteger(lead.replyCount))) {
    throw new Error('Invalid reply count');
  }

  // Scoring breakdown
  const scoreComponents = {
    budget: 0,
    engagement: 0,
    recency: 0,
    status: 0,
    replies: 0
  };

  // Budget scoring (max 40 points)
  if (lead.budget >= 10000) scoreComponents.budget = 40;
  else if (lead.budget >= 5000) scoreComponents.budget = 30;
  else if (lead.budget >= 2000) scoreComponents.budget = 20;
  else scoreComponents.budget = 10;

  // Reply scoring (max 30 points)
  scoreComponents.replies = Math.min((lead.replyCount || 0) * 10, 30);

  // Contact recency scoring (max 20 points)
  if (lead.lastContact) {
    const daysSinceContact = Math.floor(
      (Date.now() - lead.lastContact.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysSinceContact <= 1) scoreComponents.recency = 20;
    else if (daysSinceContact <= 3) scoreComponents.recency = 15;
    else if (daysSinceContact <= 7) scoreComponents.recency = 10;
  }

  // Status scoring (max 10 points)
  switch (lead.status) {
    case 'Closed': scoreComponents.status = 10; break;
    case 'Contacted': scoreComponents.status = 5; break;
    default: scoreComponents.status = 0;
  }

  // Engagement scoring (if available)
  if (typeof lead.engagement === 'number') {
    scoreComponents.engagement = Math.min(lead.engagement * 2, 20); // Max 20 points
  }

  // Calculate total score (capped at 100)
  const totalScore = Object.values(scoreComponents).reduce((sum, value) => sum + value, 0);
  return Math.min(Math.max(totalScore, 0), 100);
}

/**
 * Utility function to get a score breakdown for debugging
 */
export function getScoreBreakdown(lead: Omit<Lead, 'id'>) {
  const score = calculateEnergyScore(lead);
  return {
    score,
    components: {
      budget: `$${lead.budget.toLocaleString()}`,
      replies: lead.replyCount || 0,
      lastContact: lead.lastContact?.toISOString() || 'Never',
      status: lead.status,
      engagement: lead.engagement || 'Not specified'
    }
  };
}