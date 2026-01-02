import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-12-23',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

interface Album {
  _id: string
  title: string
  artist: string
  year: number
}

// Directory to save downloaded covers
const COVERS_DIR = path.join(process.cwd(), 'album-covers')

// Create directory if it doesn't exist
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true })
}

// Function to search MusicBrainz for album
async function searchMusicBrainz(artist: string, album: string): Promise<string | null> {
  const searchUrl = `https://musicbrainz.org/ws/2/release/?query=artist:"${encodeURIComponent(artist)}" AND release:"${encodeURIComponent(album)}"&fmt=json`

  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'SoundDeluxe/1.0.0 (contact@soundeluxe.com)',
      },
    })

    if (!response.ok) {
      console.error(`MusicBrainz search failed for ${artist} - ${album}`)
      return null
    }

    const data = await response.json()

    if (data.releases && data.releases.length > 0) {
      // Get the first release ID
      return data.releases[0].id
    }

    return null
  } catch (error) {
    console.error(`Error searching MusicBrainz: ${error}`)
    return null
  }
}

// Function to download cover art from Cover Art Archive using fetch
async function downloadCoverArt(releaseId: string, outputPath: string): Promise<boolean> {
  const coverUrl = `https://coverartarchive.org/release/${releaseId}/front`

  try {
    const response = await fetch(coverUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'SoundDeluxe/1.0.0 (contact@soundeluxe.com)',
      },
    })

    if (!response.ok) {
      console.error(`✗ Cover not found (${response.status})`)
      return false
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    fs.writeFileSync(outputPath, buffer)
    console.log(`✓ Downloaded: ${path.basename(outputPath)}`)
    return true
  } catch (error) {
    console.error(`✗ Download error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return false
  }
}

// Main function
async function downloadAlbumCovers() {
  console.log('🔍 Fetching albums without covers from Sanity...\n')

  // Query Sanity for ALL albums (we'll replace covers with originals)
  const albums: Album[] = await client.fetch(
    `*[_type == "album"]{_id, title, artist, year}`
  )

  console.log(`Found ${albums.length} albums total\n`)

  let successCount = 0
  let failCount = 0

  for (const album of albums) {
    console.log(`\n📀 Processing: ${album.artist} - ${album.title} (${album.year})`)

    // Search MusicBrainz for the release ID
    const releaseId = await searchMusicBrainz(album.artist, album.title)

    if (!releaseId) {
      console.log(`✗ Could not find release in MusicBrainz`)
      failCount++
      continue
    }

    console.log(`  Found MusicBrainz ID: ${releaseId}`)

    // Download the cover art
    const sanitizedFilename = `${album._id}.jpg`
    const outputPath = path.join(COVERS_DIR, sanitizedFilename)

    // Wait a bit to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 1000))

    const success = await downloadCoverArt(releaseId, outputPath)

    if (success) {
      successCount++
    } else {
      failCount++
    }
  }

  console.log(`\n\n✅ Summary:`)
  console.log(`   Downloaded: ${successCount}`)
  console.log(`   Failed: ${failCount}`)
  console.log(`\n📁 Covers saved to: ${COVERS_DIR}`)
}

// Run the script
downloadAlbumCovers().catch(console.error)
