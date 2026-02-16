import { NextResponse } from 'next/server'

export async function GET() {
  // Public: minimal, sans informations internes (seed/chaos/etc).
  return NextResponse.json(
    { status: 'ok' },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    }
  )
}
