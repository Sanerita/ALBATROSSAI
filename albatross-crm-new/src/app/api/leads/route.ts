// app/api/leads/route.ts
import { NextResponse } from 'next/server'
import { db } from '@/lib/db' // Your database client

export async function GET() {
  const leads = await db.lead.findMany()
  return NextResponse.json(leads)
}

export async function POST(request: Request) {
  const data = await request.json()
  const lead = await db.lead.create({ data })
  return NextResponse.json(lead)
}