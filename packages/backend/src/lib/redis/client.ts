/**
 * Redis Client
 * Singleton pattern for Redis connection
 */

import Redis from 'ioredis'

let redisClient: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisClient) {
    const redisUrl = process.env.REDIS_URL

    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not set')
    }

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
    })

    redisClient.on('connect', () => {
      console.log('Redis connected')
    })

    redisClient.on('error', (err) => {
      console.error('Redis error:', err.message)
    })
  }

  return redisClient
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit()
    redisClient = null
  }
}
