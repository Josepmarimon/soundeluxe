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

/**
 * Migra les dades del camp `contactPage` del document `footerContent`
 * al nou document independent `contactPage`.
 *
 * Després de córrer aquest script i verificar que funciona,
 * el camp antic ja s'ha eliminat del schema. Les dades antigues
 * no es perdran de Sanity (només deixaran de ser editables al studio).
 */
async function migrate() {
  console.log('🔍 Cercant dades antigues a footerContent.contactPage...')

  const footer = await client.fetch<{
    contactPage?: {
      title?: { ca?: string; es?: string; en?: string }
      subtitle?: { ca?: string; es?: string; en?: string }
      hoursTitle?: { ca?: string; es?: string; en?: string }
      hoursLines?: { ca?: string[]; es?: string[]; en?: string[] }
      emailLabel?: { ca?: string; es?: string; en?: string }
      phoneLabel?: { ca?: string; es?: string; en?: string }
      addressLabel?: { ca?: string; es?: string; en?: string }
    }
  } | null>(`*[_type == "footerContent"][0] { contactPage }`)

  const old = footer?.contactPage

  if (!old) {
    console.log('ℹ️  No hi ha dades antigues a migrar. Es crearà un document buit amb els valors per defecte.')
  }

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == "contactPage" && _id == "contactPage"][0] { _id }`
  )

  if (existing) {
    console.log('⚠️  Ja existeix un document "contactPage". Aquest script no sobreescriu res.')
    console.log('    Si vols re-importar, esborra primer el document al Studio.')
    return
  }

  const doc = {
    _id: 'contactPage',
    _type: 'contactPage',
    ...(old?.title && { title: old.title }),
    ...(old?.subtitle && { subtitle: old.subtitle }),
    ...(old?.emailLabel && { emailLabel: old.emailLabel }),
    ...(old?.phoneLabel && { phoneLabel: old.phoneLabel }),
    ...(old?.addressLabel && { addressLabel: old.addressLabel }),
    ...(old?.hoursTitle && { hoursTitle: old.hoursTitle }),
    ...(old?.hoursLines && { hoursLines: old.hoursLines }),
  }

  console.log('📝 Creant document contactPage...')
  await client.createIfNotExists(doc)
  console.log('✅ Document contactPage creat correctament.')

  if (old) {
    console.log('🧹 Netejant camp antic footerContent.contactPage...')
    await client
      .patch(`*[_type == "footerContent"][0]._id`)
      .unset(['contactPage'])
      .commit()
      .catch(async () => {
        const f = await client.fetch<{ _id: string } | null>(`*[_type == "footerContent"][0] { _id }`)
        if (f) {
          await client.patch(f._id).unset(['contactPage']).commit()
        }
      })
    console.log('✅ Camp antic eliminat.')
  }

  console.log('\n🎉 Migració completada.')
}

migrate().catch((err) => {
  console.error('❌ Error durant la migració:', err)
  process.exit(1)
})
