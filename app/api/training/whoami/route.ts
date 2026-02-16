import { NextResponse } from 'next/server'
import { getTrainingAuthFromRequest } from '@/lib/server/trainingAuth'

export async function GET(request: Request) {
  const { authorized } = getTrainingAuthFromRequest(request)
  if (!authorized) {
    // 404 pour réduire la découvrabilité.
    return new NextResponse(null, { status: 404 })
  }

  return NextResponse.json(
    { authorized: true },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}

