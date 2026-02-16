import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/data'
import { simulateNetworkDelay, shouldTriggerError } from '@/lib/chaos'
import { getTrainingAuthFromRequest } from '@/lib/server/trainingAuth'
import { getChaosConfigFromRequest } from '@/lib/server/chaosFromRequest'

export async function GET(request: Request) {
  const { authorized } = getTrainingAuthFromRequest(request)
  const chaosState = getChaosConfigFromRequest(request, authorized)
  await simulateNetworkDelay(chaosState.seed, chaosState, 1)

  if (chaosState.enabled && shouldTriggerError(chaosState.seed, chaosState.errorRate, 2)) {
    return NextResponse.json({ error: 'Erreur serveur simulée' }, { status: 500 })
  }

  return NextResponse.json({ products: PRODUCTS })
}
