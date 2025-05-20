import { PrismaClient } from '@prisma/client'

type PrismaClientSingleton = ReturnType<typeof getPrismaClient>

const getPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error']
      : ['warn', 'error']
  })
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientSingleton | undefined
}

const prisma = globalThis.prisma ?? getPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma