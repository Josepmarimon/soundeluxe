import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateQRDataURL } from '@/lib/qr'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const userId = (session.user as any).id
    const userRole = (session.user as any).role

    const reserva = await prisma.reserva.findUnique({
      where: { id },
    })

    if (!reserva) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Only the booking owner or admin/editor can access QR
    const isOwner = reserva.userId === userId
    const isStaff = userRole === 'ADMIN' || userRole === 'EDITOR'

    if (!isOwner && !isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    if (reserva.status !== 'CONFIRMED') {
      return NextResponse.json({ error: 'Booking is not confirmed' }, { status: 400 })
    }

    const locale = request.headers.get('x-locale') || 'ca'
    const qrDataUrl = await generateQRDataURL(reserva.id, locale)

    return NextResponse.json({
      qrDataUrl,
      bookingId: reserva.id,
      attended: reserva.attended,
      attendedAt: reserva.attendedAt,
    })
  } catch (error) {
    console.error('Error generating QR:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
