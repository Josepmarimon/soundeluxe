import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH - Update a link
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params
    const body = await request.json()

    const data: Record<string, any> = {}
    if (body.recipientEmail !== undefined) data.recipientEmail = body.recipientEmail
    if (body.recipientName !== undefined) data.recipientName = body.recipientName
    if (body.recipientCompany !== undefined) data.recipientCompany = body.recipientCompany || null
    if (body.notes !== undefined) data.notes = body.notes || null
    if (body.expiresAt !== undefined) data.expiresAt = body.expiresAt ? new Date(body.expiresAt) : null
    if (body.lang !== undefined) data.lang = body.lang
    if (body.status !== undefined) data.status = body.status
    if (body.recipientType !== undefined) data.recipientType = body.recipientType
    if (body.sections !== undefined) data.sections = body.sections

    const link = await prisma.commercialLink.update({
      where: { id },
      data,
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('Error updating link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE - Soft delete a link
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params

    await prisma.commercialLink.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting link:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
