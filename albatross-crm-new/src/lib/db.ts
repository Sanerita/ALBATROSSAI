import { Redis } from '@upstash/redis'
import { PrismaClient } from '@prisma/client';




 
// Enhanced Singleton Prisma Client with proper typing
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

// Type definitions
type LeadStatus = 'New' | 'Contacted' | 'Closed'

interface BaseLead {
  name: string
  email: string
  budget: number
  status: LeadStatus
  company?: string
  urgency?: boolean
  engagement?: number
  notes?: string
  score: number
}

interface RedisLead extends BaseLead {
  id: string
  createdAt: number
  updatedAt: number
  lastContact: number | null
  [key: string]: unknown // Index signature
}

interface LeadResponse extends Omit<BaseLead, 'score'> {
  id: string
  createdAt: Date
  updatedAt: Date
  lastContact: Date | null
}

// Redis client with error handling
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

// Utility functions
const generateId = (): string => 
  `lead:${Date.now()}:${Math.random().toString(36).substring(2, 8)}`

const calculateEnergyScore = (leadData: Pick<BaseLead, 'budget' | 'urgency' | 'engagement'>): number => {
  let score = leadData.budget / 1000
  if (leadData.urgency) score += 30
  if (leadData.engagement) score += leadData.engagement * 10
  return Math.min(Math.round(score), 100)
}

const toRedisLead = (data: Omit<BaseLead, 'score'>, id: string, score: number): RedisLead => ({
  ...data,
  id,
  score,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  lastContact: data.status === 'Contacted' ? Date.now() : null
})

const toLeadResponse = (lead: RedisLead | any): LeadResponse => {
  if ('createdAt' in lead && typeof lead.createdAt === 'number') {
    // Redis lead
    return {
      ...lead,
      createdAt: new Date(lead.createdAt),
      updatedAt: new Date(lead.updatedAt),
      lastContact: lead.lastContact ? new Date(lead.lastContact) : null
    }
  }
  // Prisma lead
  return {
    ...lead,
    urgency: lead.urgency ?? false,
    engagement: lead.engagement ?? undefined,
    score: lead.score ?? 0,
    lastContact: lead.lastContact ?? null
  }
}

export const leadRepository = {
  create: async (leadData: Omit<BaseLead, 'score'>): Promise<LeadResponse> => {
    const id = generateId()
    const score = calculateEnergyScore(leadData)
    const redisLead = toRedisLead(leadData, id, score)

    try {
      await Promise.all([
        redis.hset(id, redisLead),
        redis.zadd('leads:index', { score: redisLead.createdAt, member: id }),
        prisma.lead.create({
          data: {
            ...redisLead,
            createdAt: new Date(redisLead.createdAt),
            updatedAt: new Date(redisLead.updatedAt),
            lastContact: redisLead.lastContact ? new Date(redisLead.lastContact) : null
          }
        })
      ])

      return toLeadResponse(redisLead)
    } catch (error) {
      console.error('Failed to create lead:', error)
      throw new Error('Failed to create lead')
    }
  },

  findAll: async (): Promise<LeadResponse[]> => {
    try {
      // Try Redis first
      const redisIds = await redis.zrange<string[]>('leads:index', 0, -1)
      
      if (redisIds.length > 0) {
        const pipeline = redis.pipeline()
        redisIds.forEach(id => pipeline.hgetall<RedisLead>(id))
        const results = await pipeline.exec()

        if (results?.length) {
          return results
            .filter((result): result is RedisLead => result !== null)
            .map(toLeadResponse)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }
      }

      // Fallback to Prisma
      const prismaLeads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return prismaLeads.map(toLeadResponse)
    } catch (error) {
      console.error('Failed to fetch leads:', error)
      throw new Error('Failed to fetch leads')
    }
  },

  // Additional methods for better API
  findById: async (id: string): Promise<LeadResponse | null> => {
    try {
      const [redisLead, prismaLead] = await Promise.all([
        redis.hgetall<RedisLead>(id),
        prisma.lead.findUnique({ where: { id } })
      ])

      return redisLead 
        ? toLeadResponse(redisLead) 
        : prismaLead 
          ? toLeadResponse(prismaLead) 
          : null
    } catch (error) {
      console.error(`Failed to fetch lead ${id}:`, error)
      throw new Error(`Failed to fetch lead ${id}`)
    }
  }
}

export default prisma