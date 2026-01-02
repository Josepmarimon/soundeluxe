import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

interface Album {
  _id: string
  title: string
  artist: string
  year: number | null
}

interface MusicBrainzArtist {
  id: string
  name: string
}

interface MusicBrainzReleaseGroup {
  id: string
  title: string
  'first-release-date'?: string
}

// Search for artist on MusicBrainz
async function searchArtist(artistName: string): Promise<MusicBrainzArtist | null> {
  const url = `https://musicbrainz.org/ws/2/artist?query=${encodeURIComponent(artistName)}&fmt=json&limit=5`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'SoundDeluxe/1.0.0 (https://soundeluxe.cat)',
    },
  })

  if (!response.ok) {
    console.error(`Error searching artist ${artistName}:`, response.status)
    return null
  }

  const data = await response.json()

  if (data.artists && data.artists.length > 0) {
    // Try to find exact match first
    const exactMatch = data.artists.find(
      (a: MusicBrainzArtist) => a.name.toLowerCase() === artistName.toLowerCase()
    )
    return exactMatch || data.artists[0]
  }

  return null
}

// Get release groups for an artist
async function getReleaseGroups(artistId: string): Promise<MusicBrainzReleaseGroup[]> {
  const url = `https://musicbrainz.org/ws/2/release-group?artist=${artistId}&type=album&fmt=json&limit=100`

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'SoundDeluxe/1.0.0 (https://soundeluxe.cat)',
    },
  })

  if (!response.ok) {
    console.error(`Error getting release groups for artist ${artistId}:`, response.status)
    return []
  }

  const data = await response.json()
  return data['release-groups'] || []
}

// Find matching release group by title
function findMatchingRelease(
  releaseGroups: MusicBrainzReleaseGroup[],
  albumTitle: string,
  albumYear: number | null
): MusicBrainzReleaseGroup | null {
  const normalizedTitle = albumTitle.toLowerCase().replace(/[^\w\s]/g, '')

  // First try exact match
  let match = releaseGroups.find(
    (rg) => rg.title.toLowerCase().replace(/[^\w\s]/g, '') === normalizedTitle
  )

  if (match) return match

  // Try partial match
  match = releaseGroups.find(
    (rg) => rg.title.toLowerCase().includes(normalizedTitle) ||
            normalizedTitle.includes(rg.title.toLowerCase())
  )

  if (match) return match

  // Try matching by year if we have it
  if (albumYear) {
    match = releaseGroups.find((rg) => {
      const rgYear = rg['first-release-date']?.substring(0, 4)
      return rgYear === String(albumYear)
    })
  }

  return match || null
}

// Download image and upload to Sanity
async function uploadCoverToSanity(coverUrl: string, albumTitle: string): Promise<string | null> {
  try {
    console.log(`    Downloading cover from ${coverUrl}...`)
    const response = await fetch(coverUrl)

    if (!response.ok) {
      console.log(`    Cover not available (${response.status})`)
      return null
    }

    const blob = await response.blob()
    const buffer = Buffer.from(await blob.arrayBuffer())

    console.log(`    Uploading to Sanity...`)
    const asset = await client.assets.upload('image', buffer, {
      filename: `${albumTitle.replace(/[^\w]/g, '-')}-cover.jpg`,
    })

    return asset._id
  } catch (error) {
    console.error(`    Error uploading cover:`, error)
    return null
  }
}

// Update album with cover image
async function updateAlbumCover(albumId: string, assetId: string): Promise<void> {
  const draftId = albumId.startsWith('drafts.') ? albumId : `drafts.${albumId}`
  const publishedId = albumId.replace('drafts.', '')

  // Check if document exists
  const existingDraft = await client.getDocument(draftId)
  const existingPublished = await client.getDocument(publishedId)

  const targetId = existingDraft ? draftId : publishedId

  if (!existingDraft && !existingPublished) {
    console.log(`    Document not found: ${albumId}`)
    return
  }

  await client
    .patch(targetId)
    .set({
      coverImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: assetId,
        },
      },
    })
    .commit()
}

// Main function
async function main() {
  console.log('Fetching albums without covers...\n')

  const albums = await client.fetch<Album[]>(`
    *[_type == "album" && !defined(coverImage) && defined(title) && defined(artist)] {
      _id,
      title,
      artist,
      year
    }
  `)

  console.log(`Found ${albums.length} albums without covers\n`)

  let successCount = 0
  let failCount = 0

  for (const album of albums) {
    console.log(`\n[${album.artist}] ${album.title} (${album.year || 'N/A'})`)

    // Rate limiting - MusicBrainz requires 1 request per second
    await new Promise((resolve) => setTimeout(resolve, 1100))

    // Search for artist
    console.log(`  Searching for artist "${album.artist}"...`)
    const artist = await searchArtist(album.artist)

    if (!artist) {
      console.log(`  ❌ Artist not found`)
      failCount++
      continue
    }

    console.log(`  Found artist: ${artist.name} (${artist.id})`)

    // Rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1100))

    // Get release groups
    console.log(`  Getting albums...`)
    const releaseGroups = await getReleaseGroups(artist.id)

    if (releaseGroups.length === 0) {
      console.log(`  ❌ No albums found`)
      failCount++
      continue
    }

    // Find matching release
    const matchingRelease = findMatchingRelease(releaseGroups, album.title, album.year)

    if (!matchingRelease) {
      console.log(`  ❌ No matching album found. Available albums:`)
      releaseGroups.slice(0, 5).forEach((rg) => {
        console.log(`     - ${rg.title}`)
      })
      failCount++
      continue
    }

    console.log(`  Found matching album: ${matchingRelease.title} (${matchingRelease.id})`)

    // Get cover from Cover Art Archive
    const coverUrl = `https://coverartarchive.org/release-group/${matchingRelease.id}/front-500`

    // Upload cover to Sanity
    const assetId = await uploadCoverToSanity(coverUrl, album.title)

    if (!assetId) {
      console.log(`  ❌ Could not get cover image`)
      failCount++
      continue
    }

    // Update album
    console.log(`  Updating album...`)
    await updateAlbumCover(album._id, assetId)

    console.log(`  ✅ Cover added successfully!`)
    successCount++
  }

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Done! Success: ${successCount}, Failed: ${failCount}`)
}

main().catch(console.error)
