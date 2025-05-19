import { Redis } from '@upstash/redis'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()
// Define base lead properties without Redis-specific requirements
interface BaseLead {
  name: string
  email: string
  budget: number
  status: 'New' | 'Contacted' | 'Closed'
  company?: string
  urgency?: boolean
  engagement?: number
  notes?: string
  score: number
}

// Define Redis-compatible type with index signature
type RedisLead = BaseLead & {
  id: string
  createdAt: number
  updatedAt: number
  lastContact: number | null
  [key: string]: unknown // Index signature
}

// Response type for API (converts timestamps to Dates)
type LeadResponse = Omit<RedisLead, 'createdAt' | 'updatedAt' | 'lastContact'> & {
  createdAt: Date
  updatedAt: Date
  lastContact: Date | null
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const generateId = (): string => `lead:${Date.now()}:${Math.random().toString(36).substring(2, 8)}`

function calculateEnergyScore(leadData: Pick<BaseLead, 'budget' | 'urgency' | 'engagement'>): number {
  let score = leadData.budget / 1000
  if (leadData.urgency) score += 30
  if (leadData.engagement) score += leadData.engagement * 10
  return Math.min(Math.round(score), 100)
}

export const leadRepository = {
  create: async (leadData: Omit<BaseLead, 'score'>): Promise<LeadResponse> => {
    const id = generateId()
    const now = Date.now()
    const score = calculateEnergyScore(leadData)

    const redisLead: RedisLead = {
      ...leadData,
      id,
      score,
      createdAt: now,
      updatedAt: now,
      lastContact: leadData.status === 'Contacted' ? now : null
    }

    await redis.hset(id, redisLead)
    await redis.zadd('leads:index', { score: now, member: id })

    return {
      ...redisLead,
      createdAt: new Date(now),
      updatedAt: new Date(now),
      lastContact: redisLead.lastContact ? new Date(redisLead.lastContact) : null
    }
  },

  findAll: async (): Promise<LeadResponse[]> => {
    const ids = await redis.zrange<string[]>('leads:index', 0, -1)
    
    if (!ids.length) return []

    const pipeline = redis.pipeline()
    ids.forEach(id => pipeline.hgetall<RedisLead>(id))
    const results = await pipeline.exec()

    if (!results) return []

    return results
      .filter((result): result is RedisLead => result !== null)
      .map(lead => ({
        ...lead,
        budget: Number(lead.budget),
        engagement: lead.engagement ? Number(lead.engagement) : undefined,
        score: Number(lead.score),
        createdAt: new Date(Number(lead.createdAt)),
        updatedAt: new Date(Number(lead.updatedAt)),
        lastContact: lead.lastContact ? new Date(Number(lead.lastContact)) : null
      }))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}

export default prisma