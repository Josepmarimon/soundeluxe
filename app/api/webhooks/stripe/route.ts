import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import { resend, FROM_EMAIL, APP_URL, isResendConfigured } from '@/lib/resend'
import { formatInvoiceNumber } from '@/lib/company'
import BookingConfirmation from '@/emails/BookingConfirmation'
import GiftReceived from '@/emails/GiftReceived'
import type { Session } from '@/lib/sanity/types'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const checkoutSession = event.data.object as Stripe.Checkout.Session

    const {
      userId,
      sessionId,
      numPlaces,
      locale,
      isGift,
      recipientName,
      recipientEmail,
      giftMessage,
    } = checkoutSession.metadata || {}

    if (!userId || !sessionId || !numPlaces) {
      console.error('Missing metadata in checkout session:', checkoutSession.id)
      return NextResponse.json({ error: 'Missing metadata' }, { status: 400 })
    }

    const paymentIntentId = typeof checkoutSession.payment_intent === 'string'
      ? checkoutSession.payment_intent
      : checkoutSession.payment_intent?.id

    const paymentMethod: 'CARD' | 'BIZUM' = 'CARD'

    // Fetch session data from Sanity for validation and email
    const sessionData: Session | null = await client.fetch(sessionByIdQuery, { id: sessionId })

    if (!sessionData) {
      console.error('Session not found in Sanity:', sessionId)
      return NextResponse.json({ error: 'Session not found' }, { status: 400 })
    }

    const numPlacesInt = parseInt(numPlaces)
    const totalAmount = (checkoutSession.amount_total || 0) / 100
    const isGiftBooking = isGift === 'true'

    try {
      // Create reserva in a transaction with availability check
      const reserva = await prisma.$transaction(async (tx) => {
        // Check current booked places
        const { _sum } = await tx.reserva.aggregate({
          where: { sessionId, status: 'CONFIRMED' },
          _sum: { numPlaces: true },
        })

        const bookedPlaces = _sum.numPlaces || 0

        if (bookedPlaces + numPlacesInt > sessionData.totalPlaces) {
          throw new Error('SOLD_OUT')
        }

        return tx.reserva.create({
          data: {
            userId,
            sessionId,
            numPlaces: numPlacesInt,
            totalAmount,
            status: 'CONFIRMED',
            paymentMethod,
            stripePaymentId: paymentIntentId || checkoutSession.id,
          },
        })
      })

      // Fetch user for email + lazy detection
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          email: true,
          name: true,
          language: true,
          password: true,
          passwordSetupToken: true,
        },
      })

      if (user?.email && isResendConfigured) {
        const sessionDate = new Date(sessionData.date)
        const emailLocale = (locale?.toUpperCase() || user.language || 'CA') as 'CA' | 'ES' | 'EN'
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
        const venueName = sessionData.sala.name[venueLocale] || sessionData.sala.name.ca
        const venueAddress = `${sessionData.sala.address.street}, ${sessionData.sala.address.city}`

        // URL pública del QR (els clients de correu no carreguen data:URLs).
        const qrDataUrl = `${APP_URL}/api/booking/${reserva.id}/qr-image?locale=${venueLocale}`

        const invoiceNumberFormatted = reserva.invoiceNumber
          ? await formatInvoiceNumber(reserva.invoiceNumber, reserva.createdAt)
          : undefined

        const passwordSetupUrl = (!user.password && user.passwordSetupToken)
          ? `${APP_URL}/${venueLocale}/set-password?token=${user.passwordSetupToken}`
          : undefined

        // 1. Email al destinatari del regal (amb QR)
        if (isGiftBooking && recipientEmail && recipientName) {
          try {
            await resend.emails.send({
              from: FROM_EMAIL,
              to: recipientEmail,
              subject: emailLocale === 'CA' ? 'Tens un regal - Sound Deluxe'
                : emailLocale === 'ES' ? 'Tienes un regalo - Sound Deluxe'
                : 'You\'ve received a gift - Sound Deluxe',
              react: GiftReceived({
                recipientName,
                buyerName: user.name || user.email,
                language: emailLocale,
                albumTitle: sessionData.album.title,
                albumArtist: sessionData.album.artist,
                sessionDate: dateStr,
                venueName,
                venueAddress,
                numPlaces: numPlacesInt,
                bookingId: reserva.id,
                qrDataUrl,
                giftMessage: giftMessage || undefined,
              }),
            })
          } catch (emailError) {
            console.error('Failed to send gift email to recipient:', emailError)
          }
        }

        // 2. Email al comprador
        // - Si és regal: confirmació SENSE QR (el QR ha anat al destinatari)
        // - Si no: confirmació amb QR
        try {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: emailLocale === 'CA' ? 'Reserva confirmada - Sound Deluxe'
              : emailLocale === 'ES' ? 'Reserva confirmada - Sound Deluxe'
              : 'Booking confirmed - Sound Deluxe',
            react: BookingConfirmation({
              name: user.name || user.email,
              language: emailLocale,
              albumTitle: sessionData.album.title,
              albumArtist: sessionData.album.artist,
              sessionDate: dateStr,
              venueName,
              venueAddress,
              numPlaces: numPlacesInt,
              totalAmount: totalAmount.toFixed(2),
              qrDataUrl: isGiftBooking ? undefined : qrDataUrl,
              bookingId: reserva.id,
              invoiceNumber: invoiceNumberFormatted,
              isGiftPurchaser: isGiftBooking,
              recipientName: isGiftBooking ? recipientName : undefined,
              passwordSetupUrl,
            }),
          })
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError)
          // Don't fail the webhook for email errors
        }
      }

      return NextResponse.json({ received: true })
    } catch (error: any) {
      if (error.message === 'SOLD_OUT') {
        // Automatic refund
        console.error('Sold out after payment, issuing refund for:', paymentIntentId)
        if (paymentIntentId) {
          try {
            await stripe.refunds.create({ payment_intent: paymentIntentId })
          } catch (refundError) {
            console.error('Failed to issue automatic refund:', refundError)
          }
        }
        return NextResponse.json({ received: true, refunded: true })
      }

      // Handle duplicate stripePaymentId (idempotency)
      if (error.code === 'P2002') {
        // Unique constraint violation - booking already exists
        return NextResponse.json({ received: true, duplicate: true })
      }

      throw error
    }
  }

  // Return 200 for unhandled events
  return NextResponse.json({ received: true })
}
