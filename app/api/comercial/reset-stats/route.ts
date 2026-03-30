import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    const { linkId } = await request.json()
    if (!linkId) {
      return NextResponse.json({ error: 'linkId is required' }, { status: 400 })
    }

    // Delete all visits and reset link stats in a transaction
    const [deleteResult] = await prisma.$transaction([
      prisma.commercialLinkVisit.deleteMany({ where: { linkId } }),
      prisma.commercialLink.update({
        where: { id: linkId },
        data: {
          openCount: 0,
          firstOpenedAt: null,
          lastOpenedAt: null,
          status: 'PENDING',
        },
      }),
    ])

    return NextResponse.json({
      success: true,
      deletedVisitsCount: deleteResult.count,
    })
  } catch (error) {
    console.error('Error in reset-stats:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
