/**
 * Simple in-memory rate limiting for API endpoints
 * Store: { ip: string, endpoint: string, timestamps: number[] }
 */

interface RateLimitEntry {
  timestamps: number[]
}

type RateLimitStore = Map<string, RateLimitEntry>

const store: RateLimitStore = new Map()

// Configuration
const CONFIG = {
  // Contact form: max 5 submissions per hour per IP
  contact: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 1 hour
  // General API: max 100 requests per minute per IP
  api: { maxRequests: 100, windowMs: 60 * 1000 }, // 1 minute
}

/**
 * Get client IP from request
 */
export function getClientIp(
  headers: Record<string, string | string[] | undefined>
): string {
  const forwarded = headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  return headers['x-real-ip'] as string || 'unknown'
}

/**
 * Check if request exceeds rate limit
 */
export function checkRateLimit(
  key: string,
  type: 'contact' | 'api' = 'api'
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const config = CONFIG[type]

  // Get or create entry
  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // Remove old timestamps outside window
  entry.timestamps = entry.timestamps.filter((ts) => now - ts < config.windowMs)

  // Check if limit exceeded
  const remaining = Math.max(0, config.maxRequests - entry.timestamps.length)
  const allowed = entry.timestamps.length < config.maxRequests

  // Add current timestamp if allowed
  if (allowed) {
    entry.timestamps.push(now)
  }

  // Calculate reset time
  const oldestTimestamp = entry.timestamps[0]
  const resetAt = oldestTimestamp
    ? oldestTimestamp + config.windowMs
    : now + config.windowMs

  return { allowed, remaining, resetAt }
}

/**
 * Cleanup old entries (call periodically)
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  const maxWindow = Math.max(CONFIG.contact.windowMs, CONFIG.api.windowMs)

  const entries = Array.from(store.entries())
  entries.forEach(([key, entry]) => {
    entry.timestamps = entry.timestamps.filter((ts) => now - ts < maxWindow)

    if (entry.timestamps.length === 0) {
      store.delete(key)
    }
  })
}

// Cleanup every 5 minutes
if (typeof global !== 'undefined' && !global._rateLimitCleanupInterval) {
  global._rateLimitCleanupInterval = setInterval(() => {
    cleanupRateLimitStore()
  }, 5 * 60 * 1000)
}

declare global {
  var _rateLimitCleanupInterval: NodeJS.Timer | undefined
}
