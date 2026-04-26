import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL, APP_URL, isResendConfigured } from '@/lib/resend'
import SetPasswordLink from '@/emails/SetPasswordLink'

const PASSWORD_SETUP_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, locale = 'ca' } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Missing email' }, { status: 400 })
    }

    const normalizedEmail = email.trim().toLowerCase()

    // No revelar existència de comptes — sempre 200
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        language: true,
      },
    })

    if (user && !user.password && isResendConfigured) {
      const passwordSetupToken = crypto.randomBytes(32).toString('hex')
      const passwordSetupTokenExpiry = new Date(Date.now() + PASSWORD_SETUP_TOKEN_TTL_MS)

      await prisma.user.update({
        where: { id: user.id },
        data: { passwordSetupToken, passwordSetupTokenExpiry },
      })

      const lang = (user.language || 'CA') as 'CA' | 'ES' | 'EN'
      const venueLocale = lang.toLowerCase() as 'ca' | 'es' | 'en'
      const setupUrl = `${APP_URL}/${locale || venueLocale}/set-password?token=${passwordSetupToken}`

      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: user.email,
          subject:
            lang === 'CA' ? 'Crea la teva contrasenya - Sound Deluxe'
            : lang === 'ES' ? 'Crea tu contraseña - Sound Deluxe'
            : 'Create your password - Sound Deluxe',
          react: SetPasswordLink({
            setupUrl,
            name: user.name || user.email,
            language: lang,
          }),
        })
      } catch (emailError) {
        console.error('Failed to send set-password email:', emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Request-password-setup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
