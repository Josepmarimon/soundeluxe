import 'dotenv/config'
import dotenv from 'dotenv'
import { createClient } from '@sanity/client'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const DEFAULTS = {
  price: 15,
  totalPlaces: 25,
  isActive: true,
  sessionTypeKey: 'standard',
}

type Album = { _id: string; title: string; artist: string }

async function getStandardSessionTypeId(): Promise<string> {
  const id = await client.fetch<string | null>(
    `*[_type == "sessionType" && key == $key][0]._id`,
    { key: DEFAULTS.sessionTypeKey }
  )
  if (!id) {
    throw new Error(
      `No s'ha trobat cap sessionType amb key="${DEFAULTS.sessionTypeKey}". Crea'l primer al Sanity Studio.`
    )
  }
  return id
}

async function getAllAlbums(): Promise<Album[]> {
  // Exclude drafts: their _id starts with `drafts.` and the public Sanity client
  // can't resolve them, so a session referencing one shows up as album: null in the front.
  return client.fetch<Album[]>(
    `*[_type == "album" && !(_id in path("drafts.**"))] | order(year desc) { _id, title, artist }`
  )
}

async function getAlbumIdsWithSessions(): Promise<Set<string>> {
  const ids = await client.fetch<string[]>(
    `*[_type == "session" && defined(album._ref)].album._ref`
  )
  return new Set(ids)
}

async function createTbdSessions() {
  console.log('🎵 Creant sessions TBD per a cada disc sense sessió...\n')

  const sessionTypeId = await getStandardSessionTypeId()
  const albums = await getAllAlbums()
  const albumsWithSessions = await getAlbumIdsWithSessions()

  console.log(`📀 Total discs: ${albums.length}`)
  console.log(`✓  Discs amb sessió existent: ${albumsWithSessions.size}`)
  console.log(`➕ Discs als quals crearem sessió TBD: ${albums.length - albumsWithSessions.size}\n`)

  let created = 0
  let skipped = 0
  let failed = 0

  for (const album of albums) {
    if (albumsWithSessions.has(album._id)) {
      console.log(`⏭️  Saltat (ja té sessió): ${album.title} — ${album.artist}`)
      skipped++
      continue
    }

    try {
      const doc = await client.create({
        _type: 'session',
        album: { _type: 'reference', _ref: album._id },
        sessionType: { _type: 'reference', _ref: sessionTypeId },
        isActive: DEFAULTS.isActive,
        price: DEFAULTS.price,
        totalPlaces: DEFAULTS.totalPlaces,
      })
      console.log(`✅ Creada (${doc._id}): ${album.title} — ${album.artist}`)
      created++
    } catch (error) {
      console.error(`❌ Error en ${album.title}:`, error)
      failed++
    }
  }

  console.log('\n📊 Resum:')
  console.log(`   ✅ Creades: ${created}`)
  console.log(`   ⏭️  Saltades: ${skipped}`)
  console.log(`   ❌ Errors: ${failed}`)
}

createTbdSessions().catch((err) => {
  console.error('Error fatal:', err)
  process.exit(1)
})
