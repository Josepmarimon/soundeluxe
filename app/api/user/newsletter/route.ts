import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: Get newsletter preferences
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: {
        newsletterSubscribed: true,
        newsletterConfirmedAt: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      subscribed: user.newsletterSubscribed,
      confirmedAt: user.newsletterConfirmedAt,
    })

  } catch (error) {
    console.error('Error fetching newsletter preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Update newsletter preferences
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { subscribed } = body

    if (typeof subscribed !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    const email = session.user.email.toLowerCase()

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update user preferences
    const now = new Date()
    await prisma.user.update({
      where: { id: user.id },
      data: {
        newsletterSubscribed: subscribed,
        newsletterConfirmedAt: subscribed ? now : null,
      }
    })

    // Also update Subscriber table if exists
    const subscriber = await prisma.subscriber.findUnique({
      where: { email }
    })

    if (subscriber) {
      if (subscribed) {
        // Reactivate subscription
        await prisma.subscriber.update({
          where: { id: subscriber.id },
          data: {
            confirmed: true,
            confirmedAt: now,
            consentedAt: now,
            unsubscribedAt: null,
          }
        })
      } else {
        // Unsubscribe
        await prisma.subscriber.update({
          where: { id: subscriber.id },
          data: {
            unsubscribedAt: now,
            unsubscribeToken: crypto.randomUUID(),
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      subscribed,
      confirmedAt: subscribed ? now : null,
    })

  } catch (error) {
    console.error('Error updating newsletter preferences:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
