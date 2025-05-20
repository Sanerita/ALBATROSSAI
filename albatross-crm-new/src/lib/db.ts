import { Redis } from '@upstash/redis'
import { PrismaClient } from '@prisma/client'

// Enhanced Singleton Prisma Client with proper typing
declare global {
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

const isRedisLead = (lead: unknown): lead is RedisLead => {
  return (
    lead !== null &&
    typeof lead === 'object' &&
    'createdAt' in lead && 
    typeof (lead as RedisLead).createdAt === 'number'
  )
}

const toLeadResponse = (lead: RedisLead | LeadResponse): LeadResponse => {
  if (isRedisLead(lead)) {
    return {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      budget: lead.budget,
      status: lead.status,
      company: lead.company,
      urgency: lead.urgency,
      engagement: lead.engagement,
      notes: lead.notes,
      createdAt: new Date(lead.createdAt),
      updatedAt: new Date(lead.updatedAt),
      lastContact: lead.lastContact !== null ? new Date(lead.lastContact) : null
    }
  }

  return {
    ...lead,
    urgency: lead.urgency ?? false,
    engagement: lead.engagement ?? undefined,
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
            lastContact: redisLead.lastContact !== null ? new Date(redisLead.lastContact) : null
          }
        })
      ])

      return toLeadResponse(redisLead)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create lead: ${error.message}`)
      }
      throw new Error('Failed to create lead due to an unknown error')
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
          const validLeads = results.filter((result): result is RedisLead => result !== null)
          return validLeads.map(toLeadResponse)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        }
      }

      // Fallback to Prisma
      const prismaLeads = await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
      })
      return prismaLeads.map(toLeadResponse)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch leads: ${error.message}`)
      }
      throw new Error('Failed to fetch leads due to an unknown error')
    }
  },

  findById: async (id: string): Promise<LeadResponse | null> => {
    try {
      const [redisLead, prismaLead] = await Promise.all([
        redis.hgetall<RedisLead>(id),
        prisma.lead.findUnique({ where: { id } })
      ])

      if (redisLead) return toLeadResponse(redisLead)
      if (prismaLead) return toLeadResponse(prismaLead)
      return null
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch lead ${id}: ${error.message}`)
      }
      throw new Error(`Failed to fetch lead ${id} due to an unknown error`)
    }
  },

  update: async (id: string, updates: Partial<Omit<BaseLead, 'score'>>): Promise<LeadResponse> => {
    try {
      const [existingRedisLead] = await Promise.all([
        redis.hgetall<RedisLead>(id),
        prisma.lead.findUnique({ where: { id } })
      ])

      if (!existingRedisLead) {
        throw new Error(`Lead with id ${id} not found`)
      }

      const updatedLead = {
        ...existingRedisLead,
        ...updates,
        updatedAt: Date.now(),
        lastContact: updates.status === 'Contacted' ? Date.now() : existingRedisLead.lastContact
      }

      await Promise.all([
        redis.hset(id, updatedLead),
        prisma.lead.update({
          where: { id },
          data: {
            ...updates,
            updatedAt: new Date(updatedLead.updatedAt),
            lastContact: updatedLead.lastContact !== null ? new Date(updatedLead.lastContact) : null
          }
        })
      ])

      return toLeadResponse(updatedLead)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update lead ${id}: ${error.message}`)
      }
      throw new Error(`Failed to update lead ${id} due to an unknown error`)
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await Promise.all([
        redis.del(id),
        redis.zrem('leads:index', id),
        prisma.lead.delete({ where: { id } })
      ])
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete lead ${id}: ${error.message}`)
      }
      throw new Error(`Failed to delete lead ${id} due to an unknown error`)
    }
  }
}

export default prisma