import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

// GET - Get all bookings from the current user with session details
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Get user's bookings from Prisma
    const bookings = await prisma.reserva.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (bookings.length === 0) {
      return NextResponse.json({ bookings: [] })
    }

    // Get session details from Sanity
    const sessionIds = bookings.map((booking) => booking.sessionId)

    const sessionsQuery = groq`
      *[_type == "session" && _id in $sessionIds] {
        _id,
        date,
        price,
        totalPlaces,
        album->{
          _id,
          title,
          artist,
          year,
          genre,
          coverImage
        },
        sala->{
          _id,
          name,
          address
        },
        sessionType->{
          _id,
          key,
          name
        }
      }
    `

    const sessions = await client.fetch(sessionsQuery, { sessionIds })

    // Merge bookings with session details
    const bookingsWithSessions = bookings.map((booking) => {
      const sessionData = sessions.find((s: any) => s._id === booking.sessionId)
      return {
        id: booking.id,
        sessionId: booking.sessionId,
        numPlaces: booking.numPlaces,
        totalAmount: booking.totalAmount.toString(),
        status: booking.status,
        paymentMethod: booking.paymentMethod,
        attended: booking.attended,
        attendedAt: booking.attendedAt,
        cancelledAt: booking.cancelledAt,
        createdAt: booking.createdAt,
        session: sessionData,
      }
    })

    return NextResponse.json({ bookings: bookingsWithSessions })
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
