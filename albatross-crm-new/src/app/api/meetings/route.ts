import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    {
      id: '1',
      title: 'Initial Consultation',
      date: new Date().toISOString(),
      leadId: '1'
    }
  ])
}