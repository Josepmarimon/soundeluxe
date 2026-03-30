import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - List all links with visits
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const links = await prisma.commercialLink.findMany({
      where: {
        deletedAt: null,
        ...(status ? { status: status as any } : {}),
      },
      include: {
        visits: { orderBy: { visitedAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    })

    // Group visits by link ID for the client
    const visitsMap: Record<string, typeof links[0]['visits']> = {}
    const linksWithoutVisits = links.map((link) => {
      visitsMap[link.id] = link.visits
      const { visits: _, ...linkData } = link
      return linkData
    })

    return NextResponse.json({ links: linksWithoutVisits, visits: visitsMap })
  } catch (error) {
    console.error('Error fetching links:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Create a new link
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()

    const link = await prisma.commercialLink.create({
      data: {
        recipientEmail: body.recipientEmail,
        recipientName: body.recipientName,
        recipientCompany: body.recipientCompany || null,
        notes: body.notes || null,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
        lang: body.lang || 'CA',
        recipientType: body.recipientType || 'VENUE',
        sections: body.sections || undefined,
        createdBy: body.createdBy || (session.user as { id: string }).id,
      },
    })

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error('Error creating link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
