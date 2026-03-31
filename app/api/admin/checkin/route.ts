import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userRole = (session.user as any).role
    if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { bookingId } = await request.json()

    if (!bookingId) {
      return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
    }

    const reserva = await prisma.reserva.findUnique({
      where: { id: bookingId },
      include: { user: { select: { name: true, email: true } } },
    })

    if (!reserva) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (reserva.status !== 'CONFIRMED') {
      return NextResponse.json({ error: 'Booking is not confirmed', status: reserva.status }, { status: 400 })
    }

    if (reserva.attended) {
      return NextResponse.json({
        alreadyCheckedIn: true,
        attendedAt: reserva.attendedAt,
        user: reserva.user,
        numPlaces: reserva.numPlaces,
      })
    }

    // Perform check-in
    const updated = await prisma.reserva.update({
      where: { id: bookingId },
      data: {
        attended: true,
        attendedAt: new Date(),
      },
      include: { user: { select: { name: true, email: true } } },
    })

    return NextResponse.json({
      success: true,
      attendedAt: updated.attendedAt,
      user: updated.user,
      numPlaces: updated.numPlaces,
    })
  } catch (error) {
    console.error('Error during check-in:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
