// src/app/api/leads/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { Lead, calculateEnergyScore } from '@/types' // Ensure this path is correct

export async function GET() {
  try {
    const leads = await db.lead.findMany()
    return NextResponse.json(leads)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data: Omit<Lead, 'id'> = await request.json()
    const lead = await db.lead.create({ 
      data: {
        ...data,
        energyScore: calculateEnergyScore(data)
      }
    })
    return NextResponse.json(lead)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}