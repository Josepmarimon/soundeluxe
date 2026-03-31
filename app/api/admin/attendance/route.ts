import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    const bookings = await prisma.reserva.findMany({
      where: {
        sessionId,
        status: 'CONFIRMED',
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const totalPlaces = bookings.reduce((sum, b) => sum + b.numPlaces, 0)
    const checkedInPlaces = bookings
      .filter((b) => b.attended)
      .reduce((sum, b) => sum + b.numPlaces, 0)

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        id: b.id,
        userName: b.user.name || b.user.email,
        userEmail: b.user.email,
        numPlaces: b.numPlaces,
        attended: b.attended,
        attendedAt: b.attendedAt,
        paymentMethod: b.paymentMethod,
        createdAt: b.createdAt,
      })),
      summary: {
        totalBookings: bookings.length,
        totalPlaces,
        checkedInPlaces,
      },
    })
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
