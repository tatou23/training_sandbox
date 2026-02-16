import { NextResponse } from 'next/server'
import { PRODUCTS } from '@/lib/data'
import { simulateNetworkDelay, shouldTriggerError } from '@/lib/chaos'
import { getTrainingAuthFromRequest } from '@/lib/server/trainingAuth'
import { getChaosConfigFromRequest } from '@/lib/server/chaosFromRequest'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { authorized } = getTrainingAuthFromRequest(request)
  const chaosState = getChaosConfigFromRequest(request, authorized)
  await simulateNetworkDelay(chaosState.seed, chaosState, 1)

  if (chaosState.enabled && shouldTriggerError(chaosState.seed, chaosState.errorRate, 2)) {
    return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
  }

  const product = PRODUCTS.find((p) => p.id === params.id)
  if (!product) {
    return NextResponse.json({ error: 'Produit non trouvé' }, { status: 404 })
  }

  return NextResponse.json({ product })
}
