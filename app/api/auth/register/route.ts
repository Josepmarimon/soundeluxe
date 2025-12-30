import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, APP_URL, isResendConfigured } from '@/lib/resend'
import VerifyEmail from '@/emails/VerifyEmail'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, language } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification token
    const verifyToken = crypto.randomBytes(32).toString('hex')
    const verifyTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        language: language || 'CA',
        role: 'REGISTERED',
        verifyToken,
        verifyTokenExpiry,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        language: true,
        createdAt: true,
      },
    })

    // Send verification email
    if (isResendConfigured) {
      const verifyUrl = `${APP_URL}/api/auth/verify?token=${verifyToken}`

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: language === 'CA'
            ? 'Verifica el teu email - Sound Deluxe'
            : language === 'ES'
              ? 'Verifica tu email - Sound Deluxe'
              : 'Verify your email - Sound Deluxe',
          react: VerifyEmail({
            verifyUrl,
            name,
            language: language || 'CA',
          }),
        })
      } catch (emailError) {
        console.error('Error sending verification email:', emailError)
        // Don't fail the registration if email fails, user can request new verification
      }
    } else {
      console.warn('Resend not configured - verification email not sent')
    }

    return NextResponse.json(
      {
        message: 'User created successfully. Please check your email to verify your account.',
        user,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
