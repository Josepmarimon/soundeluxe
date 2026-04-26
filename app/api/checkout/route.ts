import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { auth } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import { getAvailablePlaces } from '@/lib/booking'
import { prisma } from '@/lib/prisma'
import type { Session } from '@/lib/sanity/types'
import { APP_URL } from '@/lib/resend'
import { formatSessionDateTime, resolveSessionLocale } from '@/lib/datetime'

const MAX_PLACES_PER_BOOKING = 4
const PASSWORD_SETUP_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 dies

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const localeToLanguage = (locale: string): 'CA' | 'ES' | 'EN' =>
  locale === 'es' ? 'ES' : locale === 'en' ? 'EN' : 'CA'

const generatePasswordSetupToken = () => ({
  passwordSetupToken: crypto.randomBytes(32).toString('hex'),
  passwordSetupTokenExpiry: new Date(Date.now() + PASSWORD_SETUP_TOKEN_TTL_MS),
})

export async function POST(request: Request) {
  try {
    const authSession = await auth()
    const body = await request.json()
    const {
      sessionId,
      numPlaces,
      locale = 'ca',
      isGift = false,
      recipientName,
      recipientEmail,
      giftMessage,
      guestEmail,
      guestName,
    } = body

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

    // Resoldre comprador: usuari autenticat o guest checkout (lazy registration)
    let userId: string
    let userEmail: string
    let isLazyUser = false

    if (authSession?.user) {
      userId = (authSession.user as any).id
      userEmail = authSession.user.email!
    } else {
      const normalizedEmail =
        typeof guestEmail === 'string' ? guestEmail.trim().toLowerCase() : ''
      const normalizedName = typeof guestName === 'string' ? guestName.trim() : ''

      if (!normalizedEmail || !normalizedName) {
        return NextResponse.json(
          { error: 'Email and name are required for guest checkout', code: 'GUEST_FIELDS_REQUIRED' },
          { status: 400 }
        )
      }
      if (!EMAIL_REGEX.test(normalizedEmail)) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL' },
          { status: 400 }
        )
      }

      const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })

      if (existing && existing.password) {
        // Compte registrat ja existeix → forçar login
        return NextResponse.json(
          {
            error: 'An account with this email already exists. Please sign in.',
            code: 'ACCOUNT_EXISTS',
          },
          { status: 409 }
        )
      }

      const tokenData = generatePasswordSetupToken()

      if (existing) {
        // Lazy user previ → regenerar token i actualitzar nom
        const updated = await prisma.user.update({
          where: { id: existing.id },
          data: {
            name: normalizedName,
            ...tokenData,
          },
        })
        userId = updated.id
        userEmail = updated.email
      } else {
        const created = await prisma.user.create({
          data: {
            email: normalizedEmail,
            name: normalizedName,
            password: null,
            emailVerified: null,
            language: localeToLanguage(locale),
            role: 'REGISTERED',
            ...tokenData,
          },
        })
        userId = created.id
        userEmail = created.email
      }
      isLazyUser = true
    }

    let normalizedRecipientName: string | undefined
    let normalizedRecipientEmail: string | undefined
    let normalizedGiftMessage: string | undefined

    if (isGift) {
      normalizedRecipientName = typeof recipientName === 'string' ? recipientName.trim() : ''
      normalizedRecipientEmail = typeof recipientEmail === 'string' ? recipientEmail.trim().toLowerCase() : ''
      normalizedGiftMessage = typeof giftMessage === 'string' ? giftMessage.trim().slice(0, 300) : undefined

      if (!normalizedRecipientName || !normalizedRecipientEmail) {
        return NextResponse.json(
          { error: 'Recipient name and email are required for a gift' },
          { status: 400 }
        )
      }

      if (!EMAIL_REGEX.test(normalizedRecipientEmail)) {
        return NextResponse.json(
          { error: 'Invalid recipient email' },
          { status: 400 }
        )
      }

      if (normalizedRecipientEmail === userEmail.toLowerCase()) {
        return NextResponse.json(
          { error: 'Recipient email must differ from buyer email', code: 'GIFT_SELF' },
          { status: 400 }
        )
      }
    }

    // Fetch session from Sanity
    const session: Session | null = await client.fetch(sessionByIdQuery, { id: sessionId })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Block booking when date or venue is not yet confirmed
    if (!session.date || !session.sala) {
      return NextResponse.json(
        { error: 'Session details not yet confirmed', code: 'SESSION_INCOMPLETE' },
        { status: 400 }
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

    // Format date for display (always in Madrid TZ)
    const dateStr = formatSessionDateTime(session.date, resolveSessionLocale(locale), {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })

    const vatLabel = locale === 'ca' ? 'IVA inclòs' : locale === 'es' ? 'IVA incluido' : 'VAT included'
    const giftLabel = locale === 'ca' ? 'Regal' : locale === 'es' ? 'Regalo' : 'Gift'

    const productName = isGift
      ? `${giftLabel} · ${session.album.title} — ${session.album.artist}`
      : `${session.album.title} — ${session.album.artist}`

    const metadata: Record<string, string> = {
      userId,
      sessionId: session._id,
      numPlaces: String(numPlaces),
      locale,
      totalAmount: String(totalAmount),
      isGift: isGift ? 'true' : 'false',
      isLazyUser: isLazyUser ? 'true' : 'false',
    }
    if (isGift) {
      metadata.recipientName = normalizedRecipientName!
      metadata.recipientEmail = normalizedRecipientEmail!
      if (normalizedGiftMessage) {
        metadata.giftMessage = normalizedGiftMessage
      }
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: userEmail,
      locale: locale === 'ca' ? 'auto' : locale as 'es' | 'en',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description: `${dateStr} · ${vatLabel}`,
            },
            unit_amount: Math.round(session.price * 100), // cents
          },
          quantity: numPlaces,
        },
      ],
      metadata,
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
