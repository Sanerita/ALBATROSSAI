'use client'
import { Lead } from '../types'


export default function LeadCard({ lead }: { lead: Lead }) {
    // Calculate Albatross Score (mock AI)
    const score = Math.min(
      (lead.budget / 2000) * 30 + // Budget factor
      (lead.urgency ? 40 : 0) +   // Urgency bonus
      (lead.engagement * 10),     // Engagement score
      100
    )
  
    return (
      <div className="bg-white rounded-lg shadow-md border-l-4 border-gold p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-navy">{lead.name}</h3>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">AI Score:</span>
            <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gold transition-all duration-300"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm mt-1">{lead.company}</p>
        
        <div className="mt-3 flex justify-between items-center">
          <span className="text-navy font-medium">${lead.budget.toLocaleString()}</span>
          {lead.urgency && (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
              ⏰ Urgent
            </span>
          )}
        </div>
      </div>
    )
  }