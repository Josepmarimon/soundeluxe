import 'dotenv/config'
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

const SLUG_TO_ID: Record<string, string> = {
  privacy: 'legalPage-privacy',
  terms: 'legalPage-terms',
  cookies: 'legalPage-cookies',
}

async function main() {
  console.log('🔍 Llegint legalPage existents...')
  const docs = await client.fetch<Array<Record<string, unknown> & { _id: string; slug?: string }>>(
    `*[_type == "legalPage"]{...}`
  )

  for (const doc of docs) {
    const slug = doc.slug
    if (!slug || !(slug in SLUG_TO_ID)) {
      console.log(`⚠️  Saltant ${doc._id}: slug "${slug}" no reconegut`)
      continue
    }
    const targetId = SLUG_TO_ID[slug]
    if (doc._id === targetId) {
      console.log(`✅ ${doc._id} ja té l'ID correcte, saltant`)
      continue
    }

    const existing = await client.fetch<{ _id: string } | null>(
      `*[_id == $id][0]{_id}`,
      { id: targetId }
    )

    if (existing) {
      console.log(`⚠️  ${targetId} ja existeix. Esborro l'antic ${doc._id} per evitar duplicats.`)
      await client.delete(doc._id)
      continue
    }

    console.log(`📝 Creant ${targetId} amb el contingut de ${doc._id}...`)
    const { _id: _oldId, _rev: _rev, _createdAt: _c, _updatedAt: _u, ...rest } = doc as Record<string, unknown> & {
      _id: string; _rev?: string; _createdAt?: string; _updatedAt?: string
    }
    await client.createOrReplace({ _id: targetId, _type: 'legalPage', ...rest })

    console.log(`🗑  Esborrant antic ${doc._id}...`)
    await client.delete(doc._id)
  }

  console.log('\n🎉 Migració completada.')
  const after = await client.fetch<Array<{ _id: string; slug?: string }>>(
    `*[_type == "legalPage"]{_id, slug}`
  )
  console.log('Documents legalPage finals:', after)
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
