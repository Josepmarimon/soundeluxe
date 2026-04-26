import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST /api/admin/checkin/place
// Body: { placeId }
// Marca una plaça concreta com a attended.
// Si TOTES les places de la reserva estan attended, també marca Reserva.attended.
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

    const { placeId } = await request.json()

    if (!placeId) {
      return NextResponse.json({ error: 'Missing placeId' }, { status: 400 })
    }

    const place = await prisma.reservaPlace.findUnique({
      where: { id: placeId },
      include: {
        reserva: {
          include: {
            user: { select: { name: true, email: true } },
            places: { select: { id: true, attended: true } },
          },
        },
      },
    })

    if (!place) {
      return NextResponse.json({ error: 'Place not found' }, { status: 404 })
    }

    if (place.reserva.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Booking is not confirmed', status: place.reserva.status },
        { status: 400 }
      )
    }

    if (place.attended) {
      return NextResponse.json({
        alreadyCheckedIn: true,
        attendedAt: place.attendedAt,
        place: {
          id: place.id,
          placeNumber: place.placeNumber,
          attended: place.attended,
        },
        reserva: {
          id: place.reserva.id,
          numPlaces: place.reserva.numPlaces,
          attendedPlaces: place.reserva.places.filter((p) => p.attended).length,
          user: place.reserva.user,
        },
      })
    }

    const now = new Date()

    // Transacció: marca la plaça i, si totes les places estan attended, marca la Reserva.
    const { updatedPlace, attendedCount } = await prisma.$transaction(async (tx) => {
      const updatedPlace = await tx.reservaPlace.update({
        where: { id: place.id },
        data: { attended: true, attendedAt: now },
      })

      const places = await tx.reservaPlace.findMany({
        where: { reservaId: place.reservaId },
        select: { attended: true },
      })

      const attendedCount = places.filter((p) => p.attended).length
      const allAttended = attendedCount === places.length

      if (allAttended && !place.reserva.attended) {
        await tx.reserva.update({
          where: { id: place.reservaId },
          data: { attended: true, attendedAt: now },
        })
      }

      return { updatedPlace, attendedCount }
    })

    return NextResponse.json({
      success: true,
      attendedAt: updatedPlace.attendedAt,
      place: {
        id: updatedPlace.id,
        placeNumber: updatedPlace.placeNumber,
        attended: updatedPlace.attended,
      },
      reserva: {
        id: place.reserva.id,
        numPlaces: place.reserva.numPlaces,
        attendedPlaces: attendedCount,
        user: place.reserva.user,
      },
    })
  } catch (error) {
    console.error('Error during place check-in:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
