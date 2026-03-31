import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import { getAvailablePlaces } from '@/lib/booking'
import type { Session } from '@/lib/sanity/types'
import { APP_URL } from '@/lib/resend'

const MAX_PLACES_PER_BOOKING = 4

export async function POST(request: Request) {
  try {
    const authSession = await auth()

    if (!authSession?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (authSession.user as any).id
    const userEmail = authSession.user.email!
    const body = await request.json()
    const { sessionId, numPlaces, locale = 'ca' } = body

    if (!sessionId || !numPlaces) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (numPlaces < 1 || numPlaces > MAX_PLACES_PER_BOOKING) {
      return NextResponse.json(
        { error: `Number of places must be between 1 and ${MAX_PLACES_PER_BOOKING}` },
        { status: 400 }
      )
    }

    // Fetch session from Sanity
    const session: Session | null = await client.fetch(sessionByIdQuery, { id: sessionId })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check session is in the future
    if (new Date(session.date) < new Date()) {
      return NextResponse.json(
        { error: 'Session has already passed' },
        { status: 400 }
      )
    }

    // Check availability
    const available = await getAvailablePlaces(session._id, session.totalPlaces)

    if (numPlaces > available) {
      return NextResponse.json(
        { error: 'Not enough places available', available },
        { status: 409 }
      )
    }

    const totalAmount = session.price * numPlaces

    // Format date for display
    const sessionDate = new Date(session.date)
    const dateStr = sessionDate.toLocaleDateString(locale === 'ca' ? 'ca-ES' : locale === 'es' ? 'es-ES' : 'en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    const vatLabel = locale === 'ca' ? 'IVA inclòs' : locale === 'es' ? 'IVA incluido' : 'VAT included'

    // Create Stripe Checkout Session
    // Note: Bizum must be enabled in your Stripe Dashboard.
    // Using payment_method_types with 'bizum' cast because Stripe SDK types
    // may not include it yet, but the API supports it for Spanish accounts.
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'bizum'] as any,
      customer_email: userEmail,
      locale: locale === 'ca' ? 'auto' : locale as 'es' | 'en',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${session.album.title} — ${session.album.artist}`,
              description: `${dateStr} · ${vatLabel}`,
            },
            unit_amount: Math.round(session.price * 100), // cents
          },
          quantity: numPlaces,
        },
      ],
      metadata: {
        userId,
        sessionId: session._id,
        numPlaces: String(numPlaces),
        locale,
        totalAmount: String(totalAmount),
      },
      success_url: `${APP_URL}/${locale}/booking/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${APP_URL}/${locale}/sessions/${session._id}`,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
