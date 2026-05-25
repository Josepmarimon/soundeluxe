import 'dotenv/config'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const ORPHAN_ID = '4e917ba7-6603-4c13-a636-bbffef15ef05'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

async function main() {
  const doc = await client.fetch<{ _id: string; contactInfo?: unknown } | null>(
    `*[_id == $id][0]{_id, contactInfo}`,
    { id: ORPHAN_ID }
  )

  if (!doc) {
    console.log(`ℹ️  El document ${ORPHAN_ID} ja no existeix.`)
    return
  }

  console.log('🗑  Esborrant document orfe footerContent:', doc)
  await client.delete(ORPHAN_ID)
  console.log('✅ Esborrat.')
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
