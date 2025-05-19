import { NextResponse } from 'next/server'
import { leadRepository } from '@/lib/db'
import prisma from '@/lib/db'
import { z } from 'zod'
import type { LeadStatus } from '@/types'

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

export async function GET() {
  try {
    const leads = await leadRepository.findAll()
    
    return NextResponse.json(leads, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  } catch (error) {
    console.error('[LEADS_GET]', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
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

    const lead = await leadRepository.create(validation.data)
    
    return NextResponse.json(lead, { 
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('[LEADS_POST]', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}