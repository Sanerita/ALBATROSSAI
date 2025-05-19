// src/app/api/leads/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { LeadStatus } from '@/types'
import { z } from 'zod'

const leadCreateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  budget: z.number().min(0, "Budget must be positive"),
  status: z.enum(["New", "Contacted", "Closed"]),
  company: z.string().optional(),
  urgency: z.boolean().optional(),
  engagement: z.number().optional(),
  notes: z.string().optional()
})

function calculateEnergyScore(leadData: {
  budget: number
  urgency?: boolean
  engagement?: number
}): number {
  let score = leadData.budget / 1000 // Base score on budget
  if (leadData.urgency) score += 30
  if (leadData.engagement) score += leadData.engagement * 10
  return Math.min(Math.round(score), 100) // Cap at 100
}

export async function GET() {
  try {
    const leads = await db.lead.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        budget: true,
        status: true,
        company: true,
        urgency: true,
        engagement: true,
        lastContact: true,
        score: true,
        notes: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json(leads, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('[LEADS_GET]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const validation = leadCreateSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.flatten() },
        { status: 400 }
      )
    }

    const leadData = validation.data
    const score = calculateEnergyScore(leadData)

    const lead = await db.lead.create({
      data: {
        ...leadData,
        score,
        lastContact: leadData.status === 'Contacted' ? new Date() : null
      },
      select: {
        id: true,
        name: true,
        email: true,
        budget: true,
        status: true,
        company: true,
        score: true,
        createdAt: true
      }
    })

    return NextResponse.json(lead, { status: 201 })
  } catch (error) {
    console.error('[LEADS_POST]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}