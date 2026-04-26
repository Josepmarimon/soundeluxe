import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, password } = body

    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 })
    }
    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Missing password' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { passwordSetupToken: token },
      select: {
        id: true,
        email: true,
        passwordSetupTokenExpiry: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid token', code: 'INVALID_TOKEN' },
        { status: 400 }
      )
    }

    if (
      !user.passwordSetupTokenExpiry ||
      user.passwordSetupTokenExpiry < new Date()
    ) {
      return NextResponse.json(
        { error: 'Token expired', code: 'TOKEN_EXPIRED' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        emailVerified: new Date(),
        passwordSetupToken: null,
        passwordSetupTokenExpiry: null,
      },
    })

    return NextResponse.json({ success: true, email: user.email })
  } catch (error) {
    console.error('Set-password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
