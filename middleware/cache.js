import NodeCache from "node-cache"

// Create cache instance
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes default TTL
  checkperiod: 60, // Check for expired keys every 60 seconds
  useClones: false, // Don't clone objects when getting/setting
})

/**
 * Middleware to cache API responses
 * @param {number} ttl - Time to live in seconds
 * @param {Function} [keyGenerator] - Custom function to generate cache key
 * @returns {Function} Express middleware
 */
export const cacheMiddleware = (ttl = 300, keyGenerator) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== "GET") {
      return next()
    }

    // Generate cache key
    const key = keyGenerator ? keyGenerator(req) : `${req.originalUrl || req.url}:${JSON.stringify(req.query)}`

    // Try to get cached response
    const cachedResponse = cache.get(key)

    if (cachedResponse) {
      // Return cached response
      return res.status(200).json(cachedResponse)
    }

    // Store original send function
    const originalSend = res.json

    // Override send function to cache response
    res.json = function (body) {
      // Only cache successful responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        cache.set(key, body, ttl)
      }

      // Call original send function
      return originalSend.call(this, body)
    }

    next()
  }
}

/**
 * Clear cache for specific pattern
 * @param {string} pattern - Pattern to match cache keys
 */
export const clearCache = (pattern) => {
  const keys = cache.keys()
  const matchedKeys = keys.filter((key) => key.includes(pattern))

  if (matchedKeys.length > 0) {
    cache.del(matchedKeys)
  }
}

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  cache.flushAll()
}

export default {
  cacheMiddleware,
  clearCache,
  clearAllCache,
}
