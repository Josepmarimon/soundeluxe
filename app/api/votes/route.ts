import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Create a vote
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { albumId } = await request.json()

    if (!albumId) {
      return NextResponse.json(
        { error: 'albumId is required' },
        { status: 400 }
      )
    }

    const userId = (session.user as any).id

    // Create vote (unique constraint will prevent duplicates)
    const vote = await prisma.votacion.create({
      data: {
        userId,
        albumId,
      },
    })

    return NextResponse.json({ success: true, vote }, { status: 201 })
  } catch (error: any) {
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Already voted for this album' },
        { status: 409 }
      )
    }

    console.error('Error creating vote:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a vote
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const albumId = searchParams.get('albumId')

    if (!albumId) {
      return NextResponse.json(
        { error: 'albumId is required' },
        { status: 400 }
      )
    }

    const userId = (session.user as any).id

    // Delete the vote
    await prisma.votacion.delete({
      where: {
        userId_albumId: {
          userId,
          albumId,
        },
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    // Check if record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Vote not found' },
        { status: 404 }
      )
    }

    console.error('Error deleting vote:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
