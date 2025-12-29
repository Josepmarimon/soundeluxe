import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Get all suggestions (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN' && user?.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Get query params for filtering
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const suggestions = await prisma.albumSuggestion.findMany({
      where: status ? { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'ADDED' } : undefined,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH - Update a suggestion (admin only)
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const adminUser = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
      select: { role: true, name: true, email: true },
    })

    if (adminUser?.role !== 'ADMIN' && adminUser?.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { id, status, adminResponse, adminNotes } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const updateData: {
      status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ADDED'
      adminResponse?: string | null
      adminNotes?: string | null
      respondedAt?: Date | null
      respondedBy?: string | null
    } = {}

    if (status) {
      updateData.status = status
    }

    if (adminResponse !== undefined) {
      updateData.adminResponse = adminResponse || null
      updateData.respondedAt = adminResponse ? new Date() : null
      updateData.respondedBy = adminResponse ? (adminUser.name || adminUser.email) : null
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes || null
    }

    const suggestion = await prisma.albumSuggestion.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, suggestion })
  } catch (error) {
    console.error('Error updating suggestion:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
