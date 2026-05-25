import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const BOT_PATTERN =
  /bot|crawler|spider|crawling|facebookexternalhit|slurp|bingpreview|mediapartners|lighthouse|headless|pingdom|monitor|preview|fetch|curl|wget|python-requests|axios|node-fetch/i

const MAX_PATH_LENGTH = 500
const MAX_REFERRER_LENGTH = 500

export async function POST(request: NextRequest) {
  try {
    const userAgent = request.headers.get('user-agent') ?? ''
    if (BOT_PATTERN.test(userAgent)) {
      return NextResponse.json({ ok: true, skipped: 'bot' })
    }

    const body = await request.json().catch(() => null)
    if (!body || typeof body.path !== 'string') {
      return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
    }

    const path = body.path.slice(0, MAX_PATH_LENGTH)

    if (
      path.startsWith('/api') ||
      path.startsWith('/studio') ||
      path.startsWith('/_next')
    ) {
      return NextResponse.json({ ok: true, skipped: 'internal' })
    }

    const locale =
      typeof body.locale === 'string' ? body.locale.slice(0, 5) : null
    const referrer =
      typeof body.referrer === 'string'
        ? body.referrer.slice(0, MAX_REFERRER_LENGTH)
        : null

    await prisma.pageView.create({
      data: { path, locale, referrer },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error tracking pageview:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
