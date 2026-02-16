import { NextResponse } from 'next/server'
import { getTrainingAuthFromRequest } from '@/lib/server/trainingAuth'
import { getChaosConfigFromRequest } from '@/lib/server/chaosFromRequest'

export async function GET(request: Request) {
  const { authorized } = getTrainingAuthFromRequest(request)
  if (!authorized) {
    return new NextResponse(null, { status: 404 })
  }

  const chaosState = getChaosConfigFromRequest(request, authorized)

  // Interne uniquement. Ne jamais renvoyer de secrets.
  return NextResponse.json(
    { chaos: chaosState, timestamp: new Date().toISOString() },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
