import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import { resend, FROM_EMAIL, isResendConfigured } from '@/lib/resend'
import { formatInvoiceNumber } from '@/lib/company'
import BookingCancellation from '@/emails/BookingCancellation'
import type { Session } from '@/lib/sanity/types'

const CANCELLATION_WINDOW_HOURS = 48

export async function POST(
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
    const isStaff = userRole === 'ADMIN' || userRole === 'EDITOR'

    const body = await request.json().catch(() => ({}))
    const { reason, locale = 'ca' } = body as { reason?: string; locale?: string }

    // Fetch the booking
    const reserva = await prisma.reserva.findUnique({
      where: { id },
      include: { user: { select: { email: true, name: true, language: true } } },
    })

    if (!reserva) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Only the owner or staff can cancel
    if (reserva.userId !== userId && !isStaff) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Must be CONFIRMED to cancel
    if (reserva.status !== 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Booking cannot be cancelled', status: reserva.status },
        { status: 400 }
      )
    }

    // Already attended — cannot cancel
    if (reserva.attended) {
      return NextResponse.json(
        { error: 'Cannot cancel a booking that has already been checked in' },
        { status: 400 }
      )
    }

    // Fetch session from Sanity to check the date
    const sessionData: Session | null = await client.fetch(sessionByIdQuery, { id: reserva.sessionId })

    if (!sessionData) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Check 48h cancellation policy (staff can override)
    const sessionDate = new Date(sessionData.date)
    const now = new Date()
    const hoursUntilSession = (sessionDate.getTime() - now.getTime()) / (1000 * 60 * 60)

    if (sessionDate <= now) {
      return NextResponse.json(
        { error: 'Cannot cancel a booking for a past session' },
        { status: 400 }
      )
    }

    if (hoursUntilSession < CANCELLATION_WINDOW_HOURS && !isStaff) {
      return NextResponse.json(
        {
          error: 'Cancellation window has passed',
          hoursUntilSession: Math.round(hoursUntilSession),
          policy: `Free cancellation up to ${CANCELLATION_WINDOW_HOURS}h before the session`,
        },
        { status: 409 }
      )
    }

    const refundAmount = Number(reserva.totalAmount)
    const refundStatus = hoursUntilSession >= CANCELLATION_WINDOW_HOURS ? 'FULL' : 'FULL' // Staff override is still full refund

    // Issue Stripe refund
    if (reserva.stripePaymentId) {
      try {
        await stripe.refunds.create({
          payment_intent: reserva.stripePaymentId,
        })
      } catch (stripeError: any) {
        // If already refunded, continue with DB update
        if (stripeError.code !== 'charge_already_refunded') {
          console.error('Stripe refund failed:', stripeError)
          return NextResponse.json(
            { error: 'Refund failed. Please try again or contact support.' },
            { status: 502 }
          )
        }
      }
    }

    // Update booking in database
    await prisma.reserva.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        cancelledAt: now,
        cancellationReason: reason || (isStaff ? 'Cancelled by staff' : 'Cancelled by user'),
        refundAmount,
        refundStatus,
      },
    })

    // Send cancellation email
    if (reserva.user.email && isResendConfigured) {
      const emailLocale = (locale?.toUpperCase() || reserva.user.language || 'CA') as 'CA' | 'ES' | 'EN'
      const dateLocaleMap = { CA: 'ca-ES', ES: 'es-ES', EN: 'en-GB' } as const
      const dateStr = sessionDate.toLocaleDateString(dateLocaleMap[emailLocale], {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })

      const venueLocale = emailLocale.toLowerCase() as 'ca' | 'es' | 'en'

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: reserva.user.email,
          subject: emailLocale === 'CA' ? 'Reserva cancel·lada - Sound Deluxe'
            : emailLocale === 'ES' ? 'Reserva cancelada - Sound Deluxe'
            : 'Booking cancelled - Sound Deluxe',
          react: BookingCancellation({
            name: reserva.user.name || reserva.user.email,
            language: emailLocale,
            albumTitle: sessionData.album.title,
            albumArtist: sessionData.album.artist,
            sessionDate: dateStr,
            venueName: sessionData.sala.name[venueLocale] || sessionData.sala.name.ca,
            numPlaces: reserva.numPlaces,
            refundAmount: refundAmount.toFixed(2) + '€',
            bookingId: reserva.id,
            invoiceNumber: reserva.invoiceNumber
              ? await formatInvoiceNumber(reserva.invoiceNumber, reserva.createdAt)
              : undefined,
          }),
        })
      } catch (emailError) {
        console.error('Failed to send cancellation email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      bookingId: id,
      refundAmount: refundAmount.toFixed(2),
      refundStatus,
    })
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
