// src/lib/store.ts
import { create } from 'zustand'
import { Lead, LeadStatus, calculateEnergyScore } from '../types'

interface LeadStore {
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'id'>) => void
  updateLeadStatus: (id: string, status: LeadStatus) => void
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