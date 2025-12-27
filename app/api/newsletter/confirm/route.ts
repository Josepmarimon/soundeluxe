import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

    // Find subscriber by token
    const subscriber = await prisma.subscriber.findUnique({
      where: { confirmToken: token }
    })

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 404 }
      )
    }

    // Check if token is expired
    if (subscriber.tokenExpiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 410 }
      )
    }

    // Check if already confirmed
    if (subscriber.confirmed && subscriber.confirmedAt) {
      return NextResponse.json({
        success: true,
        message: 'Subscription already confirmed',
        alreadyConfirmed: true
      })
    }

    // Get client IP for GDPR consent record
    const forwardedFor = request.headers.get('x-forwarded-for')
    const clientIp = forwardedFor?.split(',')[0]?.trim() || 'unknown'

    // Confirm subscription
    const now = new Date()
    await prisma.subscriber.update({
      where: { id: subscriber.id },
      data: {
        confirmed: true,
        confirmedAt: now,
        consentedAt: now,
        consentIp: clientIp,
        // Generate new token to invalidate the old one
        confirmToken: crypto.randomUUID(),
        tokenExpiresAt: new Date(0), // Expired
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Subscription confirmed successfully',
      language: subscriber.language
    })

  } catch (error) {
    console.error('Newsletter confirmation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
