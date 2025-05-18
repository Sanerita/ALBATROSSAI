// src/lib/store.ts
import { create } from 'zustand'
import { Lead } from '../../types'

interface LeadStore {
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'id'>) => void
  updateLeadStatus: (id: string, status: Lead['status']) => void
  updateLead: (id: string, updates: Partial<Lead>) => void
  deleteLead: (id: string) => void
}

export const useLeadStore = create<LeadStore>((set) => ({
  leads: [],
  addLead: (lead) => set((state) => ({
    leads: [...state.leads, { 
      ...lead, 
      id: Date.now().toString(),
      energyScore: calculateEnergyScore(lead)
    }]
  })),
  updateLeadStatus: (id, status) => set((state) => ({
    leads: state.leads.map((lead) => 
      lead.id === id ? { ...lead, status } : lead
    )
  })),
  updateLead: (id, updates) => set((state) => ({
    leads: state.leads.map((lead) =>
      lead.id === id ? { ...lead, ...updates } : lead
    )
  })),
  deleteLead: (id) => set((state) => ({
    leads: state.leads.filter((lead) => lead.id !== id)
  }))
}))

function calculateEnergyScore(lead: Omit<Lead, 'id'>): number {
  let score = 0
  if (lead.budget >= 10000) score += 40
  else if (lead.budget >= 5000) score += 30
  else if (lead.budget >= 2000) score += 20
  else score += 10

  if (lead.lastContact) {
    const days = (new Date().getTime() - lead.lastContact.getTime()) / (1000 * 60 * 60 * 24)
    if (days <= 1) score += 20
    else if (days <= 3) score += 15
    else if (days <= 7) score += 10
  }

  if (lead.status === 'Contacted') score += 5
  else if (lead.status === 'Closed') score += 10

  return Math.min(score, 100)
}