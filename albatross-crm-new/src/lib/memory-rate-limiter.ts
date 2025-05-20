// lib/memory-rate-limiter.ts
// import type { Ratelimit } from '@upstash/ratelimit'

export class Memory {
  private state: Map<string, number> = new Map()

  get(key: string): number | null {
    return this.state.get(key) ?? null
  }

  set(key: string, value: number): void {
    this.state.set(key, value)
  }

  delete(key: string): void {
    this.state.delete(key)
  }

  withAtomic<T>(key: string, cb: () => Promise<T>): Promise<T> {
    return cb()
  }
}