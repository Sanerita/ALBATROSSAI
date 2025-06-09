import { NextResponse } from 'next/server';
import { z } from 'zod';

const LeadSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  company: z.string(),
  interactions: z.array(z.record(z.any()))
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lead = LeadSchema.parse(body);
    
    // Call Lead Qualifier Agent
    const qualifierResponse = await fetch(
      `http://localhost:5000/score`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      }
    );

    if (!qualifierResponse.ok) throw new Error("Qualifier failed");
    
    const { score } = await qualifierResponse.json();
    
    // Update database
    const updatedLead = await prisma.lead.update({
      where: { id: lead.id },
      data: { 
        score,
        lastScored: new Date() 
      }
    });

    return NextResponse.json(updatedLead);
    
  } catch (error) {
    console.error('[ADK_ORCHESTRATION_ERROR]', error);
    return new NextResponse("Agent orchestration failed", { status: 500 });
  }
}