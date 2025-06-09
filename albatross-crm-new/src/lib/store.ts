// src/lib/store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import type { Lead, LeadStatus } from '../types'

interface LeadStore {
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'id'>) => Promise<Lead>
  updateLeadStatus: (id: string, status: LeadStatus) => void
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>
  updateLeadScore: (id: string, score: number) => void
  addRecommendation: (leadId: string, recommendation: string) => void
  deleteLead: (id: string) => Promise<void>
  getLeadById: (id: string) => Lead | undefined
  getHotLeads: () => Lead[]
}

export const useLeadStore = create<LeadStore>()(
  immer(
    persist(
      (set, get) => ({
        leads: [],
        
        // Async lead creation with optimistic UI
        addLead: async (lead) => {
          const newLead = {
            ...lead,
            id: crypto.randomUUID(),
            energyScore: 0,
            recommendations: [],
            createdAt: new Date()
          }
          
          set((state) => {
            state.leads.push(newLead)
          })
          
          // Simulate API call
          await fetch('/api/leads', {
            method: 'POST',
            body: JSON.stringify(newLead)
          })
          
          return newLead
        },
        
        updateLeadStatus: (id, status) => {
          set((state) => {
            const lead = state.leads.find((l: Lead) => l.id === id)
            if (lead) lead.status = status
          })
        },
        
        // Atomic updates with rollback capability
        updateLead: async (id, updates) => {
          const originalLeads = get().leads
          
          try {
            set((state) => {
              const lead = state.leads.find((l: Lead) => l.id === id)
              if (lead) Object.assign(lead, updates)
            })
            
            await fetch(`/api/leads/${id}`, {
              method: 'PATCH',
              body: JSON.stringify(updates)
            })
          } catch (error) {
            set({ leads: originalLeads })
            throw error
          }
        },
        
        updateLeadScore: (id, score) => {
          set((state) => {
            const lead = state.leads.find((l: Lead) => l.id === id)
            if (lead) lead.energyScore = score
          })
        },
        
        addRecommendation: (leadId, recommendation) => {
          set((state) => {
            const lead = state.leads.find((l: Lead) => l.id === leadId)
            if (lead && lead.recommendations) {
              lead.recommendations = [
                ...(lead.recommendations || []),
                {
                  id: crypto.randomUUID(),
                  text: recommendation,
                  date: new Date().toISOString()
                }
              ]
            }
          })
        },
        
        deleteLead: async (id) => {
          const originalLeads = get().leads

          try {            
            set((state) => {
              state.leads = state.leads.filter((lead: Lead) => lead.id !== id)
            })
            
            await fetch(`/api/leads/${id}`, {
              method: 'DELETE'
            })
          } catch (error) {
            set({ leads: originalLeads })
            throw error
          }
        },
        
        // Derived selectors
        getLeadById: (id) => get().leads.find((lead: Lead) => lead.id === id),
        
        getHotLeads: () => get().leads
 .filter((l: Lead) => l.energyScore !== undefined && l.energyScore > 75)
          .sort((a: Lead, b: Lead) => (b.energyScore ?? 0) - (a.energyScore ?? 0))
      }),
      {
        name: 'lead-storage',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({ leads: state.leads })
      }
    )
  )
)