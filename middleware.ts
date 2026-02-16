import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getTrainingAuthFromNextRequest, shouldHideInternalsInProd, TRAINING_SESSION_COOKIE } from './lib/server/trainingAuth'

export function middleware(request: NextRequest) {
  const { authorized, hadTokenInQuery } = getTrainingAuthFromNextRequest(request)
  const pathname = request.nextUrl.pathname
  const expectedToken = process.env.INTERNAL_TRAINING_TOKEN
  const isProd = process.env.NODE_ENV === 'production'

  // Si le token est passé en query param, on le retire de l’URL (évite de le laisser visible côté client).
  if (hadTokenInQuery) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.searchParams.delete('training_token')
    const res = NextResponse.redirect(redirectUrl)
    // Si token valide, on le convertit en session HttpOnly (sans exposer le token au JS).
    if (authorized && expectedToken) {
      res.cookies.set(TRAINING_SESSION_COOKIE, expectedToken, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
        maxAge: 60 * 60 * 8, // 8h
      })
    }
    return res
  }

  // Routes internes à masquer (retourner 404 si non autorisé).
  const isInternalRoute =
    pathname === '/__state' ||
    pathname === '/api/reset' ||
    pathname === '/api/training/whoami' ||
    pathname === '/admin/training' ||
    pathname.startsWith('/admin/training/')

  if (isInternalRoute && !authorized) {
    return new NextResponse(null, { status: 404 })
  }

  // En production, ignorer toute tentative d’activer chaos/debug sans autorisation.
  if (shouldHideInternalsInProd(authorized)) {
    const url = request.nextUrl.clone()
    const hadChaosParams =
      url.searchParams.has('chaos') ||
      url.searchParams.has('seed') ||
      url.searchParams.has('debug')

    if (hadChaosParams) {
      url.searchParams.delete('chaos')
      url.searchParams.delete('seed')
      url.searchParams.delete('debug')
      return NextResponse.redirect(url)
    }

    // Supprimer aussi le header x-chaos-seed pour éviter l’activation via header.
    const requestHeaders = new Headers(request.headers)
    if (requestHeaders.has('x-chaos-seed')) {
      requestHeaders.delete('x-chaos-seed')
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  const res = NextResponse.next()
  // Si autorisé via header (ou cookie déjà), on s’assure d’avoir la session cookie (best effort).
  if (authorized && expectedToken && request.cookies.get(TRAINING_SESSION_COOKIE)?.value !== expectedToken) {
    res.cookies.set(TRAINING_SESSION_COOKIE, expectedToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProd,
      path: '/',
      maxAge: 60 * 60 * 8,
    })
  }
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
