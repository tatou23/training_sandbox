import { NextResponse } from 'next/server'
import { resetChaosState } from '@/lib/chaos'
import { getTrainingAuthFromRequest } from '@/lib/server/trainingAuth'
import { getClientIpFromRequest, rateLimitFixedWindow } from '@/lib/server/rateLimit'

export async function POST(request: Request) {
  const { authorized } = getTrainingAuthFromRequest(request)
  if (!authorized) {
    return new NextResponse(null, { status: 404 })
  }

  // Rate limit simple: 5 resets / minute / IP (best effort).
  const ip = getClientIpFromRequest(request)
  const rl = rateLimitFixedWindow({ key: `reset:${ip}`, limit: 5, windowMs: 60_000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'rate_limited' },
      {
        status: 429,
        headers: {
          'Cache-Control': 'no-store',
          'Retry-After': Math.ceil(rl.resetInMs / 1000).toString(),
        },
      }
    )
  }

  resetChaosState()

  // Journaliser uniquement si debug interne activé côté serveur.
  if (process.env.INTERNAL_DEBUG === '1') {
    // eslint-disable-next-line no-console
    console.info('[training] reset state', { ip, ts: new Date().toISOString() })
  }

  return NextResponse.json(
    { success: true, message: 'État réinitialisé' },
    {
      headers: {
        'Cache-Control': 'no-store',
        // Permet de nettoyer l’état côté navigateur (localStorage/sessionStorage/cookies/cache).
        // Utile pour les tests E2E sans “tricher” et sans base de données.
        'Clear-Site-Data': '"cache", "cookies", "storage"',
        'X-RateLimit-Remaining': rl.remaining.toString(),
      },
    }
  )
}
