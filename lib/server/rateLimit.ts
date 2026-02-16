import 'server-only'

/**
 * Rate limit simple “best effort” (in-memory).
 * Suffisant pour réduire l’abus sans dépendances externes.
 *
 * ⚠️ En serverless, l’état n’est pas garanti entre instances → ce n’est pas un
 * rate-limit “dur”, mais ça suffit pour l’objectif pédagogique.
 */

type Entry = { windowStartMs: number; count: number }

const buckets = new Map<string, Entry>()

export type RateLimitResult = { allowed: boolean; remaining: number; resetInMs: number }

export function rateLimitFixedWindow(opts: {
  key: string
  limit: number
  windowMs: number
  now?: number
}): RateLimitResult {
  const now = opts.now ?? Date.now()
  const existing = buckets.get(opts.key)

  if (!existing || now - existing.windowStartMs >= opts.windowMs) {
    buckets.set(opts.key, { windowStartMs: now, count: 1 })
    return { allowed: true, remaining: opts.limit - 1, resetInMs: opts.windowMs }
  }

  if (existing.count >= opts.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetInMs: opts.windowMs - (now - existing.windowStartMs),
    }
  }

  existing.count += 1
  buckets.set(opts.key, existing)
  return {
    allowed: true,
    remaining: Math.max(0, opts.limit - existing.count),
    resetInMs: opts.windowMs - (now - existing.windowStartMs),
  }
}

export function getClientIpFromRequest(request: Request): string {
  const xff = request.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]?.trim() || 'unknown'
  const xri = request.headers.get('x-real-ip')
  if (xri) return xri
  return 'unknown'
}

