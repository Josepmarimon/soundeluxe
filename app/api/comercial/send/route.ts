import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { resend, FROM_EMAIL_COMERCIAL, APP_URL } from '@/lib/resend'
import CommercialProposal from '@/emails/CommercialProposal'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { linkId } = await request.json()
    if (!linkId) {
      return NextResponse.json({ error: 'linkId is required' }, { status: 400 })
    }

    const link = await prisma.commercialLink.findUnique({ where: { id: linkId } })
    if (!link || link.deletedAt) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const proposalUrl = `${APP_URL}/comercial/${link.token}`

    const subjects: Record<string, string> = {
      CA: `Proposta de col·laboració — Sound Deluxe`,
      ES: `Propuesta de colaboración — Sound Deluxe`,
      EN: `Collaboration Proposal — Sound Deluxe`,
    }

    const { error: emailError } = await resend.emails.send({
      from: FROM_EMAIL_COMERCIAL,
      to: link.recipientEmail,
      subject: subjects[link.lang] || subjects.CA,
      react: CommercialProposal({
        recipientName: link.recipientName,
        recipientCompany: link.recipientCompany,
        proposalUrl,
        language: link.lang,
      }),
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }

    // Update link status to SENT
    await prisma.commercialLink.update({
      where: { id: linkId },
      data: { status: 'SENT' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in send:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
