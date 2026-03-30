import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Support both JSON and sendBeacon (text/plain)
    let body: { visitId: string; timeOnPageSeconds?: number; scrollDepthPercent?: number; sectionsViewed?: string[] }

    const contentType = request.headers.get('content-type')
    if (contentType?.includes('application/json')) {
      body = await request.json()
    } else {
      const text = await request.text()
      body = JSON.parse(text)
    }

    const { visitId, timeOnPageSeconds, scrollDepthPercent, sectionsViewed } = body

    if (!visitId) {
      return NextResponse.json({ error: 'visitId is required' }, { status: 400 })
    }

    await prisma.commercialLinkVisit.update({
      where: { id: visitId },
      data: {
        ...(timeOnPageSeconds !== undefined && { timeOnPageSeconds }),
        ...(scrollDepthPercent !== undefined && { scrollDepthPercent }),
        ...(sectionsViewed && { sectionsViewed }),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in update-engagement:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
