import { NextRequest, NextResponse } from 'next/server'

interface MusicBrainzRelease {
  id: string
  title: string
  date?: string
  'primary-type'?: string
  'secondary-types'?: string[]
  'first-release-date'?: string
}

interface MusicBrainzReleaseGroup {
  id: string
  title: string
  'primary-type'?: string
  'secondary-types'?: string[]
  'first-release-date'?: string
}

interface MusicBrainzReleaseGroupResponse {
  'release-groups': MusicBrainzReleaseGroup[]
}

// GET /api/musicbrainz/releases?artistId=<mbid>
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const artistId = searchParams.get('artistId')

  if (!artistId) {
    return NextResponse.json({ error: 'artistId is required' }, { status: 400 })
  }

  try {
    // Fetch release groups (albums) for the artist
    // We use release-groups instead of releases to get unique albums
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release-group?artist=${artistId}&type=album&fmt=json&limit=100`,
      {
        headers: {
          'User-Agent': 'SoundDeluxe/1.0.0 (https://soundeluxe.cat)',
        },
      }
    )

    if (!response.ok) {
      console.error('MusicBrainz API error:', response.status)
      return NextResponse.json({ releases: [] })
    }

    const data: MusicBrainzReleaseGroupResponse = await response.json()

    // Filter only albums (not singles, EPs, compilations, etc.)
    // and sort by release date
    const releases = data['release-groups']
      .filter((rg) => {
        const primaryType = rg['primary-type']?.toLowerCase()
        const secondaryTypes = rg['secondary-types'] || []
        // Only include albums, exclude compilations and live albums
        return (
          primaryType === 'album' &&
          !secondaryTypes.includes('Compilation') &&
          !secondaryTypes.includes('Live') &&
          !secondaryTypes.includes('Remix')
        )
      })
      .map((rg) => ({
        id: rg.id,
        title: rg.title,
        year: rg['first-release-date']
          ? parseInt(rg['first-release-date'].substring(0, 4))
          : null,
        releaseDate: rg['first-release-date'] || null,
        // Cover art from Cover Art Archive
        coverUrl: `https://coverartarchive.org/release-group/${rg.id}/front-250`,
      }))
      .sort((a, b) => {
        // Sort by year ascending (oldest first)
        if (!a.year) return 1
        if (!b.year) return -1
        return a.year - b.year
      })

    return NextResponse.json({ releases })
  } catch (error) {
    console.error('Error fetching releases from MusicBrainz:', error)
    return NextResponse.json({ releases: [] })
  }
}
