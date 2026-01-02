import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeClient } from '@/lib/sanity/writeClient'
import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

// POST - Create an album directly from user suggestion
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

    // Check if album already exists in Sanity
    const existingAlbum = await client.fetch(
      groq`*[_type == "album" && lower(title) == lower($title) && lower(artist) == lower($artist)][0]`,
      { title: albumTitle.trim(), artist: artistName.trim() }
    )

    if (existingAlbum) {
      return NextResponse.json(
        { error: 'This album already exists in the catalog' },
        { status: 409 }
      )
    }

    // Upload cover image from URL if provided
    let coverImage = null
    if (coverUrl) {
      try {
        const imageResponse = await fetch(coverUrl)
        if (imageResponse.ok) {
          const imageBuffer = await imageResponse.arrayBuffer()
          const asset = await writeClient.assets.upload('image', Buffer.from(imageBuffer), {
            filename: `${artistName.replace(/\s+/g, '_')}_${albumTitle.replace(/\s+/g, '_')}.jpg`,
          })
          coverImage = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: asset._id,
            },
          }
        }
      } catch (imageError) {
        console.error('Error uploading cover image:', imageError)
        // Continue without cover image
      }
    }

    // Create album in Sanity
    const album = await writeClient.create({
      _type: 'album',
      title: albumTitle.trim(),
      artist: artistName.trim(),
      year: year ? parseInt(year) : new Date().getFullYear(),
      genre: 'rock', // Default genre - can be changed by admin
      coverImage: coverImage,
      links: mbid ? {
        musicbrainz: `https://musicbrainz.org/release/${mbid}`,
      } : undefined,
    })

    return NextResponse.json({ success: true, album }, { status: 201 })
  } catch (error) {
    console.error('Error creating album:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Get albums (for compatibility, redirects to regular album list)
export async function GET() {
  try {
    const albums = await client.fetch(
      groq`*[_type == "album"] | order(_createdAt desc) [0...20] {
        _id,
        title,
        artist,
        year,
        coverImage
      }`
    )

    return NextResponse.json({ albums })
  } catch (error) {
    console.error('Error fetching albums:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
