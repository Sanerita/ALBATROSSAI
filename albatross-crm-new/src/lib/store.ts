// src/lib/store.ts
import { create } from 'zustand'
import type { Lead, LeadStatus } from '../types'

interface LeadStore {
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'id'>) => void
  updateLeadStatus: (id: string, status: LeadStatus) => void
  updateLead: (id: string, updates: Partial<Lead>) => void
  deleteLead: (id: string) => void
}

export const useLeadStore = create<LeadStore>((set) => ({
  leads: [], // Initial state
  addLead: (lead) => set((state) => ({
    leads: [...state.leads, { 
      ...lead, 
      id: Date.now().toString(), // Simple unique ID
      energyScore: 0 // Initial energy score, will be calculated elsewhere
    }]
  })),
  updateLeadStatus: (id, status) => set((state) => ({
    leads: state.leads.map((lead) => 
      lead.id === id ? { ...lead, status: status } : lead
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