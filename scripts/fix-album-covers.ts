import 'dotenv/config'
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import https from 'https'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Mapa d'àlbums amb les seves URLs de portada (URLs directes d'imatge)
const ALBUM_COVERS: Record<string, string> = {
  'The Dark Side of the Moon': 'https://i.scdn.co/image/ab67616d0000b273ea7caaff71dea1051d49b2fe',
  'Abbey Road': 'https://i.scdn.co/image/ab67616d0000b2735ef4660298ae29ee18799fc2',
  'Thriller': 'https://i.scdn.co/image/ab67616d0000b2735beea2a3b5c5b8fa6cb01d39',
  'Kind of Blue': 'https://i.scdn.co/image/ab67616d0000b273e5d38fd0282c66dd4c0bef51',
  'Nevermind': 'https://i.scdn.co/image/ab67616d0000b273e175a19e530c898d167d39bf',
  'What\'s Going On': 'https://i.scdn.co/image/ab67616d0000b2738c7b84481b2301c9e021f3cb',
  'Pet Sounds': 'https://i.scdn.co/image/ab67616d0000b2737bb0f52cc8ec6bf48e9ac16d',
  'OK Computer': 'https://i.scdn.co/image/ab67616d0000b273c8b444df094279e70d0ed856',
  'The Velvet Underground & Nico': 'https://i.scdn.co/image/ab67616d0000b273b92e5c47d0555f4e29ab22a7',
  'Led Zeppelin IV': 'https://i.scdn.co/image/ab67616d0000b273c8a11e48c91a982d086afc69',
  'The Joshua Tree': 'https://i.scdn.co/image/ab67616d0000b273d8a4c5946a0e580d9ca5ba50',
  'A Love Supreme': 'https://i.scdn.co/image/ab67616d0000b2737c6003e77ba6d69d15d7d407',
  'Blue': 'https://i.scdn.co/image/ab67616d0000b27395e2fd1accb339fa14878190',
  'Back to Black': 'https://i.scdn.co/image/ab67616d0000b273d6378a1d4f71c5839c3e8f8d',
  'The Miseducation of Lauryn Hill': 'https://i.scdn.co/image/ab67616d0000b27362f2db28dfa30a6c49defa70',
  'Rumours': 'https://i.scdn.co/image/ab67616d0000b273e52a59a28efa4773dd2bfe1b',
  'The Rise and Fall of Ziggy Stardust': 'https://i.scdn.co/image/ab67616d0000b2738c8b0e4b8c2c9c7c6e0c8f3a',
  'Purple Rain': 'https://i.scdn.co/image/ab67616d0000b273f894657f0eda8c5cef04dc98',
  'Random Access Memories': 'https://i.scdn.co/image/ab67616d0000b273e5e0e08818e1f8f2b788cf84',
  'Bitches Brew': 'https://i.scdn.co/image/ab67616d0000b273b84b4a9ea3d5836d07f38835',
  'London Calling': 'https://i.scdn.co/image/ab67616d0000b2738b52c118e59d1f951dce4416',
  'Born to Run': 'https://i.scdn.co/image/ab67616d0000b27350b9e01a53b9e8f797a22133',
  'Appetite for Destruction': 'https://i.scdn.co/image/ab67616d0000b2731fa55f524c4b2358e6aa2c19',
  'Innervisions': 'https://i.scdn.co/image/ab67616d0000b273d026ccf1d0aca1ca6cc31f98',
  'The Queen is Dead': 'https://i.scdn.co/image/ab67616d0000b27335f3907c64b3d08b1fffdb04',
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const https = require('https')
    const http = require('http')
    const { URL } = require('url')

    const parsedUrl = new URL(url)
    const client = parsedUrl.protocol === 'https:' ? https : http

    const download = (downloadUrl: string, redirectCount = 0): void => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'))
        return
      }

      const parsedDownloadUrl = new URL(downloadUrl)
      const options = {
        hostname: parsedDownloadUrl.hostname,
        path: parsedDownloadUrl.pathname + parsedDownloadUrl.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      }

      const clientToUse = parsedDownloadUrl.protocol === 'https:' ? https : http

      clientToUse.get(options, (response: any) => {
        // Seguir redireccions
        if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
          const location = response.headers.location
          const redirectUrl = location.startsWith('http') ? location : new URL(location, downloadUrl).href
          download(redirectUrl, redirectCount + 1)
          return
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`))
          return
        }

        // Verificar content-type
        const contentType = response.headers['content-type']
        if (contentType && !contentType.startsWith('image/') && !contentType.includes('octet-stream')) {
          reject(new Error(`Invalid content type: ${contentType} for URL: ${downloadUrl}`))
          return
        }

        const file = fs.createWriteStream(filepath)
        response.pipe(file)

        file.on('finish', () => {
          file.close()
          resolve()
        })

        file.on('error', (err: Error) => {
          fs.unlink(filepath, () => {})
          reject(err)
        })
      }).on('error', (err: Error) => {
        reject(err)
      })
    }

    download(url)
  })
}

async function uploadImageToSanity(filepath: string): Promise<any> {
  const imageBuffer = fs.readFileSync(filepath)
  const asset = await client.assets.upload('image', imageBuffer, {
    filename: path.basename(filepath),
  })
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  }
}

async function main() {
  console.log('🖼️  Fixing album covers...\n')

  // Obtenir àlbums sense portada
  const albums = await client.fetch('*[_type == "album" && !defined(coverImage)]')
  console.log(`Found ${albums.length} albums without covers\n`)

  for (const album of albums) {
    const coverUrl = ALBUM_COVERS[album.title]

    if (!coverUrl) {
      console.log(`⚠️  No cover URL found for "${album.title}"`)
      continue
    }

    try {
      console.log(`\n📥 Processing: ${album.title} by ${album.artist}`)

      // Descarregar imatge
      const tempPath = path.join('/tmp', `${album._id}.jpg`)
      console.log('   Downloading cover...')
      await downloadImage(coverUrl, tempPath)

      // Pujar a Sanity
      console.log('   Uploading to Sanity...')
      const coverImage = await uploadImageToSanity(tempPath)

      // Actualitzar document
      console.log('   Updating document...')
      await client.patch(album._id).set({ coverImage }).commit()

      // Netejar fitxer temporal
      fs.unlinkSync(tempPath)

      console.log('   ✅ Done!')

      // Espera per no sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 1500))

    } catch (error) {
      console.error(`   ❌ Error: ${error}`)
    }
  }

  console.log('\n\n🎉 Finished fixing album covers!')
}

main().catch(console.error)
