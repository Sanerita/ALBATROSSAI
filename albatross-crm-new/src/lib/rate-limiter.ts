// lib/rate-limiter.ts
import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const ratelimit = (() => {
  // Production configuration with Redis
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })

    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(
        parseInt(process.env.RATE_LIMIT_REQUESTS || '10'),
        (process.env.RATE_LIMIT_WINDOW || '10 s') as `${number} ${'s' | 'ms' | 'm' | 'h' | 'd'}`
      ),
      prefix: '@albatross/ratelimit',
    })
  }

  // Development fallback configuration
  return new Ratelimit({
    redis: new Redis({
      url: 'http://localhost:6379', // Dummy URL for type safety
      token: 'dummy_token',
    }),
    limiter: Ratelimit.slidingWindow(100, '10 s'),
    ephemeralCache: new Map<string, number>(),
    prefix: '@albatross/ratelimit:dev',
  })
})()