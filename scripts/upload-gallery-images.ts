import 'dotenv/config'
import { createClient } from '@sanity/client'
import { promises as fs } from 'fs'
import path from 'path'

// Load from .env.local
import { config } from 'dotenv'
config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'k94gdbik',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

interface ImageConfig {
  filename: string
  categoryId: string
  caption: {
    ca: string
    es: string
    en: string
  }
  featured: boolean
  order: number
}

const CATEGORY_IDS = {
  comunitat: '0357a336-1144-4b52-8d70-1b40ac908000',
  equipament: '4e16fbe3-f9a4-48e7-b2b4-dee8f59c39ab',
  espais: '56725e90-b284-4ba9-b997-bb193b67e7f5',
  vinils: 'd4f73da5-dcc2-44fa-ac1a-4975971a9375',
  sessions: 'f51e0805-d649-4343-9130-42bf5447f694',
}

const IMAGES_CONFIG: ImageConfig[] = [
  {
    filename: 'vinyl1.jpg',
    categoryId: CATEGORY_IDS.vinils,
    caption: {
      ca: 'Vinil original en perfecte estat de conservació',
      es: 'Vinilo original en perfecto estado de conservación',
      en: 'Original vinyl in perfect condition',
    },
    featured: true,
    order: 1,
  },
  {
    filename: 'vinyl2.jpg',
    categoryId: CATEGORY_IDS.vinils,
    caption: {
      ca: 'Col·lecció de vinils clàssics',
      es: 'Colección de vinilos clásicos',
      en: 'Classic vinyl collection',
    },
    featured: false,
    order: 2,
  },
  {
    filename: 'equipment1.jpg',
    categoryId: CATEGORY_IDS.equipament,
    caption: {
      ca: 'Amplificador de vàlvules Hi-End',
      es: 'Amplificador de válvulas Hi-End',
      en: 'Hi-End tube amplifier',
    },
    featured: true,
    order: 3,
  },
  {
    filename: 'equipment2.jpg',
    categoryId: CATEGORY_IDS.equipament,
    caption: {
      ca: 'Sistema d\'altaveus de referència',
      es: 'Sistema de altavoces de referencia',
      en: 'Reference speaker system',
    },
    featured: false,
    order: 4,
  },
  {
    filename: 'sessions1.jpg',
    categoryId: CATEGORY_IDS.sessions,
    caption: {
      ca: 'Moment màgic durant una sessió d\'escolta',
      es: 'Momento mágico durante una sesión de escucha',
      en: 'Magical moment during a listening session',
    },
    featured: true,
    order: 5,
  },
  {
    filename: 'sessions2.jpg',
    categoryId: CATEGORY_IDS.sessions,
    caption: {
      ca: 'Preparant l\'equipament per a la sessió',
      es: 'Preparando el equipo para la sesión',
      en: 'Setting up equipment for the session',
    },
    featured: false,
    order: 6,
  },
  {
    filename: 'community1.jpg',
    categoryId: CATEGORY_IDS.comunitat,
    caption: {
      ca: 'La nostra comunitat d\'audiòfils',
      es: 'Nuestra comunidad de audiófilos',
      en: 'Our audiophile community',
    },
    featured: true,
    order: 7,
  },
  {
    filename: 'community2.jpg',
    categoryId: CATEGORY_IDS.comunitat,
    caption: {
      ca: 'Compartint la passió per la música',
      es: 'Compartiendo la pasión por la música',
      en: 'Sharing the passion for music',
    },
    featured: false,
    order: 8,
  },
  {
    filename: 'space1.jpg',
    categoryId: CATEGORY_IDS.espais,
    caption: {
      ca: 'Sala d\'escolta amb tractament acústic',
      es: 'Sala de escucha con tratamiento acústico',
      en: 'Listening room with acoustic treatment',
    },
    featured: true,
    order: 9,
  },
  {
    filename: 'space2.jpg',
    categoryId: CATEGORY_IDS.espais,
    caption: {
      ca: 'Detall de l\'ambient minimalista',
      es: 'Detalle del ambiente minimalista',
      en: 'Detail of the minimalist atmosphere',
    },
    featured: false,
    order: 10,
  },
]

async function uploadImage(filePath: string): Promise<string> {
  const buffer = await fs.readFile(filePath)
  const asset = await client.assets.upload('image', buffer, {
    filename: path.basename(filePath),
  })
  console.log(`  Uploaded: ${path.basename(filePath)} -> ${asset._id}`)
  return asset._id
}

async function createGalleryImage(config: ImageConfig, assetId: string, index: number) {
  const docId = `gallery-image-${index}`
  const doc = await client.createOrReplace({
    _id: docId,
    _type: 'galleryImage',
    image: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: assetId,
      },
    },
    caption: config.caption,
    featured: config.featured,
    order: config.order,
    category: {
      _type: 'reference',
      _ref: config.categoryId,
    },
    date: new Date().toISOString().split('T')[0],
  })
  console.log(`  Created document: ${doc._id}`)
  return doc._id
}

async function main() {
  const imagesDir = path.join(process.cwd(), 'gallery-images')

  console.log('Starting gallery image upload...\n')
  console.log(`Images directory: ${imagesDir}`)

  let index = 1
  for (const config of IMAGES_CONFIG) {
    const filePath = path.join(imagesDir, config.filename)

    try {
      console.log(`Processing: ${config.filename}`)

      // Check if file exists
      await fs.access(filePath)

      // Upload image
      const assetId = await uploadImage(filePath)

      // Create gallery document (published directly)
      await createGalleryImage(config, assetId, index)

      console.log(`  Done!\n`)
      index++
    } catch (error) {
      console.error(`Error processing ${config.filename}:`, error)
    }
  }

  console.log('\nDone! All images uploaded and documents created.')
}

main().catch(console.error)
