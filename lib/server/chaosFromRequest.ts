import 'server-only'

import { initChaosFromRequest, type ChaosConfig } from '@/lib/chaos'
import { shouldHideInternalsInProd } from '@/lib/server/trainingAuth'

/**
 * Construit une config chaos **stateless** à partir de la requête.
 * En production, si non autorisé, toute tentative d’activer chaos/seed est ignorée.
 */
export function getChaosConfigFromRequest(request: Request, authorized: boolean): ChaosConfig {
  const url = new URL(request.url)

  const headersObj: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    headersObj[key.toLowerCase()] = value
  })

  // Par défaut, on respecte la requête (dev/local).
  let searchParams = url.searchParams

  // En prod, sans autorisation: ignorer chaos/seed/header.
  if (shouldHideInternalsInProd(authorized)) {
    searchParams = new URLSearchParams()
    delete headersObj['x-chaos-seed']
  }

  const defaultChaosEnabled = process.env.NEXT_PUBLIC_DEFAULT_CHAOS === '1'
  const hasExplicitChaos = searchParams.has('chaos')

  if (!hasExplicitChaos && defaultChaosEnabled) {
    const sp = new URLSearchParams(searchParams.toString())
    sp.set('chaos', '1')
    return initChaosFromRequest(sp, headersObj)
  }

  return initChaosFromRequest(searchParams, headersObj)
}

