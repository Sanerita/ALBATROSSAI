// lib/memory-rate-limiter.ts
// import type { Ratelimit } from '@upstash/ratelimit'

export class Memory {
  private state: Map<string, number> = new Map()

  async get(key: string): Promise<number | null> {
    return this.state.get(key) ?? null
  }

  async set(key: string, value: number): Promise<void> {
    this.state.set(key, value)
  }

  async delete(key: string): Promise<void> {
    this.state.delete(key)
  }

  async withAtomic<T>(key: string, cb: () => Promise<T>): Promise<T> {
    return cb()
  }
}