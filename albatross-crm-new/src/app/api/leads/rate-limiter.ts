// src/app/api/leads/rate-limiter.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ratelimit } from '@/lib/rate-limiter'

export async function middleware(request: NextRequest) {
  // to get IP in Next.js 14
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1'
  
  const { success } = await ratelimit.limit(ip)
  
  if (!success) {
    return new NextResponse('Too many requests', { status: 429 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/leads/:path*',
}