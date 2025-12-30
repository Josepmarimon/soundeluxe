import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { APP_URL } from '@/lib/resend'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(`${APP_URL}/ca/login?error=missing_token`)
    }

    // Find user with this token
    const user = await prisma.user.findUnique({
      where: { verifyToken: token },
      select: {
        id: true,
        email: true,
        language: true,
        verifyTokenExpiry: true,
        emailVerified: true,
      },
    })

    if (!user) {
      return NextResponse.redirect(`${APP_URL}/ca/login?error=invalid_token`)
    }

    // Check if already verified
    if (user.emailVerified) {
      const locale = user.language?.toLowerCase() || 'ca'
      return NextResponse.redirect(`${APP_URL}/${locale}/login?verified=already`)
    }

    // Check if token has expired
    if (user.verifyTokenExpiry && user.verifyTokenExpiry < new Date()) {
      const locale = user.language?.toLowerCase() || 'ca'
      return NextResponse.redirect(`${APP_URL}/${locale}/login?error=token_expired`)
    }

    // Verify the email
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verifyToken: null,
        verifyTokenExpiry: null,
      },
    })

    const locale = user.language?.toLowerCase() || 'ca'
    return NextResponse.redirect(`${APP_URL}/${locale}/login?verified=true`)
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.redirect(`${APP_URL}/ca/login?error=verification_failed`)
  }
}
