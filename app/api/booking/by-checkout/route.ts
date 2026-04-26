import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

// GET /api/booking/by-checkout?session_id=cs_live_xxx
// Endpoint públic: la possessió del cs_id és la clau d'accés.
// Retorna la Reserva associada al checkout session de Stripe (si ja existeix).
// Si encara no hi és (webhook no processat), retorna 202 perquè el client torni a polling.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stripeSessionId = searchParams.get('session_id')

    if (!stripeSessionId || !stripeSessionId.startsWith('cs_')) {
      return NextResponse.json({ error: 'Invalid session_id' }, { status: 400 })
    }

    // Recupera el checkout session de Stripe per validar i obtenir el payment_intent
    let checkoutSession
    try {
      checkoutSession = await stripe.checkout.sessions.retrieve(stripeSessionId, {
        expand: ['payment_intent'],
      })
    } catch {
      return NextResponse.json({ error: 'Checkout session not found' }, { status: 404 })
    }

    if (checkoutSession.payment_status !== 'paid') {
      return NextResponse.json(
        { status: 'pending', payment_status: checkoutSession.payment_status },
        { status: 202 }
      )
    }

    const paymentIntentId =
      typeof checkoutSession.payment_intent === 'string'
        ? checkoutSession.payment_intent
        : checkoutSession.payment_intent?.id

    // Busca la reserva: primer per payment_intent, sinó per cs_id (fallback que webhook fa servir)
    const booking = await prisma.reserva.findFirst({
      where: {
        OR: [
          paymentIntentId ? { stripePaymentId: paymentIntentId } : undefined,
          { stripePaymentId: stripeSessionId },
        ].filter(Boolean) as { stripePaymentId: string }[],
      },
      include: {
        places: { orderBy: { placeNumber: 'asc' } },
      },
    })

    if (!booking) {
      // Pagat però webhook encara no ha creat la reserva — torna 202 per continuar polling
      return NextResponse.json({ status: 'processing' }, { status: 202 })
    }

    // Detalls de sessió de Sanity
    const sessionsQuery = groq`
      *[_type == "session" && _id == $sessionId][0] {
        _id,
        date,
        price,
        album->{ _id, title, artist, coverImage },
        sala->{ _id, name, address }
      }
    `
    const sessionData = await client.fetch(sessionsQuery, { sessionId: booking.sessionId })

    // Detectar si és comprador convidat sense password (lazy)
    const buyer = await prisma.user.findUnique({
      where: { id: booking.userId },
      select: { email: true, name: true, password: true, passwordSetupToken: true },
    })

    const passwordSetupToken =
      buyer && !buyer.password ? buyer.passwordSetupToken : null

    return NextResponse.json({
      booking: {
        id: booking.id,
        sessionId: booking.sessionId,
        numPlaces: booking.numPlaces,
        totalAmount: booking.totalAmount.toString(),
        status: booking.status,
        paymentMethod: booking.paymentMethod,
        createdAt: booking.createdAt,
        session: sessionData ?? null,
        places: booking.places.map((p) => ({
          id: p.id,
          placeNumber: p.placeNumber,
          attended: p.attended,
        })),
      },
      buyerEmail: buyer?.email ?? null,
      buyerName: buyer?.name ?? null,
      passwordSetupToken, // null si l'usuari ja té password (no convidat)
    })
  } catch (error) {
    console.error('Error fetching booking by checkout session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
