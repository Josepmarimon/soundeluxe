import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET: Unsubscribe via email link (one-click)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      )
    }

    // Find subscriber by unsubscribe token
    const subscriber = await prisma.subscriber.findUnique({
      where: { unsubscribeToken: token }
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 404 }
      )
    }

    // Check if already unsubscribed
    if (subscriber.unsubscribedAt) {
      return NextResponse.json({
        success: true,
        message: 'Already unsubscribed',
        alreadyUnsubscribed: true
      })
    }

    // Unsubscribe (soft delete - keep record for GDPR audit)
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        unsubscribedAt: new Date(),
        // Generate new token for security
        unsubscribeToken: crypto.randomUUID(),
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed successfully',
      language: subscriber.language
    })

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST: Unsubscribe from user profile (authenticated)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const email = session.user.email.toLowerCase()

    // Update User record
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        newsletterSubscribed: false,
        newsletterConfirmedAt: null,
      }
    })

    // Also unsubscribe from Subscriber table if exists
    const subscriber = await prisma.subscriber.findUnique({
      where: { email }
    })

    if (subscriber && !subscriber.unsubscribedAt) {
      await prisma.subscriber.update({
        where: { id: subscriber.id },
        data: {
          unsubscribedAt: new Date(),
          unsubscribeToken: crypto.randomUUID(),
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed successfully'
    })

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
