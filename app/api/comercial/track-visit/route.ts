import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple IP-based geolocation using ip-api.com (free tier)
async function getGeoFromIP(ip: string): Promise<{ country: string | null; city: string | null }> {
  try {
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
      return { country: null, city: null }
    }

    const response = await fetch(`http://ip-api.com/json/${ip}?fields=country,city`, {
      signal: AbortSignal.timeout(2000),
    })

    if (!response.ok) return { country: null, city: null }

    const data = await response.json()
    return { country: data.country || null, city: data.city || null }
  } catch {
    return { country: null, city: null }
  }
}

// Parse user agent
function parseUserAgent(ua: string | null): { deviceType: string; browser: string; os: string } {
  if (!ua) return { deviceType: 'unknown', browser: 'unknown', os: 'unknown' }

  let deviceType = 'desktop'
  if (/Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(ua)) {
    deviceType = /iPad|Tablet/i.test(ua) ? 'tablet' : 'mobile'
  }

  let browser = 'unknown'
  if (/Chrome/i.test(ua) && !/Edge|OPR|Edg/i.test(ua)) browser = 'Chrome'
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari'
  else if (/Firefox/i.test(ua)) browser = 'Firefox'
  else if (/Edg/i.test(ua)) browser = 'Edge'
  else if (/OPR|Opera/i.test(ua)) browser = 'Opera'

  let os = 'unknown'
  if (/Windows/i.test(ua)) os = 'Windows'
  else if (/Mac OS X/i.test(ua)) os = 'macOS'
  else if (/Linux/i.test(ua) && !/Android/i.test(ua)) os = 'Linux'
  else if (/Android/i.test(ua)) os = 'Android'
  else if (/iOS|iPhone|iPad|iPod/i.test(ua)) os = 'iOS'

  return { deviceType, browser, os }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Find the link
    const link = await prisma.commercialLink.findUnique({
      where: { token },
    })

    if (!link || link.deletedAt) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    // Check expiration
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return NextResponse.json({ error: 'Link expired' }, { status: 410 })
    }

    // Parse request info
    const userAgent = request.headers.get('user-agent') || null
    const forwardedFor = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || null

    const { deviceType, browser, os } = parseUserAgent(userAgent)

    let geo = { country: null as string | null, city: null as string | null }
    if (ip) {
      geo = await getGeoFromIP(ip)
    }

    // Create visit and update link in a transaction
    const now = new Date()
    const [visit] = await prisma.$transaction([
      prisma.commercialLinkVisit.create({
        data: {
          linkId: link.id,
          ipAddress: ip,
          userAgent,
          deviceType: body.deviceType || deviceType,
          browser,
          os,
          country: body.country || geo.country,
          city: body.city || geo.city,
        },
      }),
      prisma.commercialLink.update({
        where: { id: link.id },
        data: {
          status: link.status === 'PENDING' || link.status === 'SENT' ? 'OPENED' : link.status,
          firstOpenedAt: link.firstOpenedAt || now,
          lastOpenedAt: now,
          openCount: { increment: 1 },
        },
      }),
    ])

    return NextResponse.json({
      visitId: visit.id,
      linkId: link.id,
      recipientName: link.recipientName,
    })
  } catch (error) {
    console.error('Error in track-visit:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
