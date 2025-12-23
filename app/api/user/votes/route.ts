import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

// GET - Get all votes from the current user with album details
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id

    // Get user's votes from Prisma
    const votes = await prisma.votacion.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (votes.length === 0) {
      return NextResponse.json({ votes: [] })
    }

    // Get album details from Sanity
    const albumIds = votes.map((vote) => vote.albumId)

    const albumsQuery = groq`
      *[_type == "album" && _id in $albumIds] {
        _id,
        title,
        artist,
        year,
        genre,
        coverImage,
        duration,
        links
      }
    `

    const albums = await client.fetch(albumsQuery, { albumIds })

    // Merge votes with album details
    const votesWithAlbums = votes.map((vote) => {
      const album = albums.find((a: any) => a._id === vote.albumId)
      return {
        id: vote.id,
        albumId: vote.albumId,
        createdAt: vote.createdAt,
        album,
      }
    })

    return NextResponse.json({ votes: votesWithAlbums })
  } catch (error) {
    console.error('Error fetching user votes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
