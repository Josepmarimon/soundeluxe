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

const SINGLETONS = ['faqPage', 'galleryPage', 'siteSettings'] as const

async function migrate(type: string) {
  const docs = await client.fetch<Array<Record<string, unknown> & { _id: string }>>(
    `*[_type == $type]{...}`,
    { type }
  )

  if (docs.length === 0) {
    console.log(`[${type}] cap document, saltant`)
    return
  }

  const correct = docs.find((d) => d._id === type)
  if (correct && docs.length === 1) {
    console.log(`[${type}] ✅ ja correcte (1 doc amb _id correcte)`)
    return
  }

  if (correct) {
    console.log(`[${type}] ⚠️  hi ha ${docs.length} docs i un ja té l'ID correcte. Esborro els altres.`)
    for (const d of docs) {
      if (d._id !== type) {
        console.log(`[${type}]   🗑  esborrant ${d._id}`)
        await client.delete(d._id)
      }
    }
    return
  }

  // Cap doc té l'ID correcte. Migrem el primer (més recent).
  docs.sort((a, b) => String(b._updatedAt || '').localeCompare(String(a._updatedAt || '')))
  const source = docs[0]
  console.log(`[${type}] 📝 migrant ${source._id} → ${type}`)
  const { _id: _oid, _rev: _r, _createdAt: _c, _updatedAt: _u, ...rest } = source as Record<string, unknown> & {
    _id: string; _rev?: string; _createdAt?: string; _updatedAt?: string
  }
  await client.createOrReplace({ _id: type, _type: type, ...rest })

  for (const d of docs) {
    console.log(`[${type}]   🗑  esborrant antic ${d._id}`)
    await client.delete(d._id)
  }
}

async function main() {
  for (const type of SINGLETONS) {
    await migrate(type)
  }

  console.log('\n🎉 Tots els singletons migrats.')
  const summary = await client.fetch<Array<{ _type: string; _id: string }>>(
    `*[_type in $types]{_type, _id} | order(_type)`,
    { types: SINGLETONS }
  )
  console.log('Estat final:', summary)
}

main().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
