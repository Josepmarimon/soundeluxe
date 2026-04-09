import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import type { Session } from '@/lib/sanity/types'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userRole = (session.user as any).role
  if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(request.url)
  const bookingId = searchParams.get('bookingId')

  if (!bookingId) {
    return NextResponse.json({ error: 'Missing bookingId' }, { status: 400 })
  }

  const reserva = await prisma.reserva.findUnique({
    where: { id: bookingId },
    include: { user: { select: { name: true, email: true } } },
  })

  if (!reserva) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Fetch session data from Sanity
  const sessionData: Session | null = await client.fetch(sessionByIdQuery, { id: reserva.sessionId })

  const locale = request.headers.get('x-locale') || 'ca'

  return NextResponse.json({
    bookingId: reserva.id,
    userName: reserva.user.name || reserva.user.email,
    userEmail: reserva.user.email,
    numPlaces: reserva.numPlaces,
    status: reserva.status,
    attended: reserva.attended,
    attendedAt: reserva.attendedAt?.toISOString() || null,
    album: sessionData?.album.title || null,
    artist: sessionData?.album.artist || null,
    sessionDate: sessionData?.date || null,
    venue: sessionData?.sala.name[locale as keyof typeof sessionData.sala.name] || sessionData?.sala.name.ca || null,
  })
}
