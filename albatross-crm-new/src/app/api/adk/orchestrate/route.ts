// src/app/api/adk/orchestrate/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleAuth } from 'google-auth-library';
import type { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/logger';


const LeadSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(100),
  company: z.string().max(100),
  interactions: z.array(z.record(z.unknown())).max(50)
});

const ADK_AGENT_URL = process.env.ADK_AGENT_URL || 'http://localhost:5000';

export async function POST(req: Request) {
  // Initialize Google Auth with retry logic
  const auth = new GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!),
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  try {
    // Validate request
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      throw new Error('Missing Google Cloud credentials');
    }

    const body = await req.json();
    const lead = LeadSchema.parse(body);
    
    // Get authenticated client
    const client = await auth.getClient();
    const token = await client.getAccessToken();

    // Call Lead Qualifier Agent with retry
    const qualifierResponse = await fetch(
      `${ADK_AGENT_URL}/score`,
      {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.token}`
        },
        body: JSON.stringify(lead),
        next: { revalidate: 0 } // Disable caching
      }
    );

    if (!qualifierResponse.ok) {
      const errorData = await qualifierResponse.text();
      throw new Error(`Qualifier failed: ${errorData}`);
    }
    
    const { score } = await qualifierResponse.json();

    // Validate score
    if (typeof score !== 'number' || score < 0 || score > 100) {
      throw new Error('Invalid score returned from agent');
    }

    // Transactional database update
    const updatedLead = await prisma.$transaction(async (tx: PrismaClient) => {
      const existing = await tx.lead.findUnique({
        where: { id: lead.id },
        select: { version: true }
      });

      if (!existing) {
        throw new Error('Lead not found');
      }

      return await tx.lead.update({
        where: { id: lead.id },
        data: { 
          score,
          lastScored: new Date(),
          version: { increment: 1 }
        }
      });
    });

    // Audit log
    logger.info(`Lead ${lead.id} scored`, {
      leadId: lead.id,
      score,
      agent: 'qualifier'
    });

    return NextResponse.json(updatedLead, {
      headers: {
        'X-ADK-Version': '1.0',
        'Cache-Control': 'no-store'
      }
    });
    
  } catch (error) {
    const errorId = crypto.randomUUID();
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    logger.error(`ADK Orchestration Error [${errorId}]`, {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined
    });

    return new NextResponse(
      JSON.stringify({
        error: 'Agent orchestration failed',
        referenceId: errorId
      }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}