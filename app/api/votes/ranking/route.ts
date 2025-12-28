import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

// GET - Get top voted albums with album details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Get vote counts grouped by albumId
    const voteCounts = await prisma.votacion.groupBy({
      by: ['albumId'],
      _count: {
        albumId: true,
      },
      orderBy: {
        _count: {
          albumId: 'desc',
        },
      },
      take: limit,
    })

    if (voteCounts.length === 0) {
      return NextResponse.json({ ranking: [] }, { status: 200 })
    }

    // Get album details from Sanity
    const albumIds = voteCounts.map((v) => v.albumId)
    const albumsQuery = groq`
      *[_type == "album" && _id in $albumIds] {
        _id,
        title,
        artist,
        year,
        genre,
        coverImage
      }
    `
    const albums = await client.fetch(albumsQuery, { albumIds })

    // Combine vote counts with album details
    const ranking = voteCounts.map((vote, index) => {
      const album = albums.find((a: any) => a._id === vote.albumId)
      return {
        position: index + 1,
        albumId: vote.albumId,
        voteCount: vote._count.albumId,
        album: album || null,
      }
    }).filter((item) => item.album !== null)

    return NextResponse.json({ ranking }, { status: 200 })
  } catch (error) {
    console.error('Error getting vote ranking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
