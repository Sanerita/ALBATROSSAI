import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    {
      id: '1',
      type: 'status_change',
      description: 'Changed status to Contacted',
      timestamp: new Date().toISOString()
    }
  ])
}