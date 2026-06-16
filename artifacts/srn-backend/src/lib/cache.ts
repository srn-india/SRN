import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

export const redis = new Redis(redisUrl, { enableOfflineQueue: false });

redis.on('connect', () => {
  console.log('Redis connected successfully');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

/**
 * Sets data in cache with a TTL (default 1 hour)
 */
export const setCache = async (key: string, data: any, ttlSeconds: number = 3600) => {
  try {
    await redis.set(key, JSON.stringify(data), 'EX', ttlSeconds);
  } catch (err) {
    console.error(`Error setting cache for key ${key}:`, err);
  }
};

/**
 * Gets data from cache
 */
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`Error getting cache for key ${key}:`, err);
    return null;
  }
};

/**
 * Deletes data from cache
 */
export const delCache = async (key: string) => {
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`Error deleting cache for key ${key}:`, err);
  }
};
