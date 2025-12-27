import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, APP_URL } from '@/lib/resend'
import ConfirmSubscriptionEmail from '@/emails/ConfirmSubscription'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, language = 'CA' } = body

    // Validate email
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate language
    const validLanguages = ['CA', 'ES', 'EN']
    const lang = validLanguages.includes(language.toUpperCase())
      ? language.toUpperCase() as 'CA' | 'ES' | 'EN'
      : 'CA'

    // Get client IP for GDPR consent record
    const forwardedFor = request.headers.get('x-forwarded-for')
    const clientIp = forwardedFor?.split(',')[0]?.trim() || 'unknown'

    // Check if email exists in User table
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: { id: true, newsletterSubscribed: true, newsletterConfirmedAt: true }
    })

    if (existingUser) {
      if (existingUser.newsletterSubscribed && existingUser.newsletterConfirmedAt) {
        // User already subscribed - return generic success (security)
        return NextResponse.json({
          success: true,
          message: 'If this email exists, you will receive a confirmation email.'
        })
      }

      // User exists but not subscribed - update and send confirmation
      // For registered users, we'll use a different flow (direct subscription via profile)
      return NextResponse.json({
        success: true,
        message: 'If this email exists, you will receive a confirmation email.'
      })
    }

    // Check if email exists in Subscriber table
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email: email.toLowerCase() }
    })

    // Token expiration: 24 hours
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    let subscriber
    let confirmToken: string

    if (existingSubscriber) {
      if (existingSubscriber.confirmed && !existingSubscriber.unsubscribedAt) {
        // Already confirmed and active - return generic success
        return NextResponse.json({
          success: true,
          message: 'If this email exists, you will receive a confirmation email.'
        })
      }

      // Regenerate token and resend email
      confirmToken = crypto.randomUUID()
      subscriber = await prisma.subscriber.update({
        where: { id: existingSubscriber.id },
        data: {
          confirmToken,
          tokenExpiresAt,
          language: lang,
          unsubscribedAt: null, // Reactivate if previously unsubscribed
        }
      })
    } else {
      // Create new subscriber
      confirmToken = crypto.randomUUID()
      subscriber = await prisma.subscriber.create({
        data: {
          email: email.toLowerCase(),
          language: lang,
          confirmToken,
          tokenExpiresAt,
          unsubscribeToken: crypto.randomUUID(),
          consentIp: clientIp,
        }
      })
    }

    // Build confirmation URL
    const confirmUrl = `${APP_URL}/${lang.toLowerCase()}/newsletter/confirm?token=${confirmToken}`

    // Send confirmation email
    try {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email.toLowerCase(),
        subject: lang === 'CA'
          ? 'Confirma la teva subscripció - Sound Deluxe'
          : lang === 'ES'
          ? 'Confirma tu suscripción - Sound Deluxe'
          : 'Confirm your subscription - Sound Deluxe',
        react: ConfirmSubscriptionEmail({
          confirmUrl,
          language: lang,
        }),
      })
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError)
      // Don't expose email sending failures to the client
    }

    // Return generic success message (security - don't reveal if email exists)
    return NextResponse.json({
      success: true,
      message: 'If this email exists, you will receive a confirmation email.'
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
