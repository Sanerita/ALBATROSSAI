import { NextRequest, NextResponse } from 'next/server';
import { leadRepository } from '@/lib/db';
import type { Lead } from '@/types'; 
import type { LeadResponse } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { leadId: string } }) {
  try {
    const { leadId } = params;

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID is required' }, { status: 400 });
    }

    const lead: LeadResponse | null = await leadRepository.findById(leadId);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json(lead, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('[LEAD_DETAIL_GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead data' },
      { status: 500 }
    );
  }
}