import { NextRequest, NextResponse } from 'next/server'

interface MusicBrainzArtist {
  id: string
  name: string
  'sort-name': string
  disambiguation?: string
  country?: string
}

interface MusicBrainzSearchResponse {
  created: string
  count: number
  offset: number
  artists: MusicBrainzArtist[]
}

// GET /api/musicbrainz/artists?q=<query>
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 2) {
    return NextResponse.json({ artists: [] })
  }

  try {
    // MusicBrainz API requires a user-agent header
    const response = await fetch(
      `https://musicbrainz.org/ws/2/artist?query=${encodeURIComponent(query)}&fmt=json&limit=10`,
      {
        headers: {
          'User-Agent': 'SoundDeluxe/1.0.0 (https://soundeluxe.cat)',
        },
      }
    )

    if (!response.ok) {
      console.error('MusicBrainz API error:', response.status)
      return NextResponse.json({ artists: [] })
    }

    const data: MusicBrainzSearchResponse = await response.json()

    // Map to simpler format
    const artists = data.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      sortName: artist['sort-name'],
      disambiguation: artist.disambiguation,
      country: artist.country,
    }))

    return NextResponse.json({ artists })
  } catch (error) {
    console.error('Error fetching artists from MusicBrainz:', error)
    return NextResponse.json({ artists: [] })
  }
}
