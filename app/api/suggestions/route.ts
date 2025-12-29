import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Create an album suggestion
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { artistName, albumTitle, mbid, coverUrl, year } = await request.json()

    if (!artistName || !albumTitle) {
      return NextResponse.json(
        { error: 'artistName and albumTitle are required' },
        { status: 400 }
      )
    }

    const userId = (session.user as { id: string }).id

    // Create suggestion (unique constraint will prevent duplicates per user)
    const suggestion = await prisma.albumSuggestion.create({
      data: {
        userId,
        artistName: artistName.trim(),
        albumTitle: albumTitle.trim(),
        mbid: mbid || null,
        coverUrl: coverUrl || null,
        year: year ? parseInt(year) : null,
      },
    })

    return NextResponse.json({ success: true, suggestion }, { status: 201 })
  } catch (error: unknown) {
    const prismaError = error as { code?: string }
    // Check for unique constraint violation
    if (prismaError.code === 'P2002') {
      return NextResponse.json(
        { error: 'You have already suggested this album' },
        { status: 409 }
      )
    }

    console.error('Error creating suggestion:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get user's suggestions
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as { id: string }).id

    const suggestions = await prisma.albumSuggestion.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
