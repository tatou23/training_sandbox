import { NextResponse } from 'next/server'
import { simulateNetworkDelay, shouldTriggerError } from '@/lib/chaos'
import { getTrainingAuthFromRequest } from '@/lib/server/trainingAuth'
import { getChaosConfigFromRequest } from '@/lib/server/chaosFromRequest'

export async function POST(request: Request) {
  const { authorized } = getTrainingAuthFromRequest(request)
  const chaosState = getChaosConfigFromRequest(request, authorized)
  await simulateNetworkDelay(chaosState.seed, chaosState, 1)

  if (chaosState.enabled && shouldTriggerError(chaosState.seed, chaosState.errorRate, 2)) {
    return NextResponse.json({ error: 'Erreur lors de l\'ajout au panier' }, { status: 500 })
  }

  const body = await request.json()
  return NextResponse.json({ success: true, item: body })
}
