import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Check if current user has voted for an album
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const session = await getServerSession(authConfig)

    if (!session?.user) {
      return NextResponse.json(
        { hasVoted: false },
        { status: 200 }
      )
    }

    const { albumId } = await params

    if (!albumId) {
      return NextResponse.json(
        { error: 'albumId is required' },
        { status: 400 }
      )
    }

    const userId = (session.user as any).id

    const vote = await prisma.votacion.findUnique({
      where: {
        userId_albumId: {
          userId,
          albumId,
        },
      },
    })

    return NextResponse.json(
      { hasVoted: !!vote, vote },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error checking user vote:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
