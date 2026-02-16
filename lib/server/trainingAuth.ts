import 'server-only'

import type { NextRequest } from 'next/server'

export const TRAINING_SESSION_COOKIE = 'training_session'

export type TrainingAuthResult = {
  authorized: boolean
  /** True si le token provenait d’un query param (à nettoyer). */
  hadTokenInQuery: boolean
}

function getExpectedToken(): string | null {
  const token = process.env.INTERNAL_TRAINING_TOKEN
  return token && token.length > 0 ? token : null
}

export function getTrainingAuthFromNextRequest(request: NextRequest): TrainingAuthResult {
  const expected = getExpectedToken()
  if (!expected) return { authorized: false, hadTokenInQuery: false }

  const headerToken = request.headers.get('x-training-token')
  const queryToken = request.nextUrl.searchParams.get('training_token')
  const cookieToken = request.cookies.get(TRAINING_SESSION_COOKIE)?.value

  const authorized = headerToken === expected || queryToken === expected || cookieToken === expected
  return { authorized, hadTokenInQuery: Boolean(queryToken) }
}

function getCookieValue(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null
  const parts = cookieHeader.split(';')
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return rest.join('=')
  }
  return null
}

export function getTrainingAuthFromRequest(request: Request): TrainingAuthResult {
  const expected = getExpectedToken()
  if (!expected) return { authorized: false, hadTokenInQuery: false }

  const url = new URL(request.url)
  const headerToken = request.headers.get('x-training-token')
  const queryToken = url.searchParams.get('training_token')
  const cookieToken = getCookieValue(request.headers.get('cookie'), TRAINING_SESSION_COOKIE)

  const authorized = headerToken === expected || queryToken === expected || cookieToken === expected
  return { authorized, hadTokenInQuery: Boolean(queryToken) }
}

export function shouldHideInternalsInProd(authorized: boolean): boolean {
  // En prod, on cache tout sans autorisation explicite.
  return process.env.NODE_ENV === 'production' && !authorized
}

