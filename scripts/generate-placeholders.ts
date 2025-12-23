import 'dotenv/config'
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Generar SVG placeholder per a l'àlbum
function generateAlbumPlaceholder(title: string, artist: string, genre: string): string {
  const colors: Record<string, string> = {
    'rock': '#E74C3C',
    'jazz': '#3498DB',
    'soul': '#9B59B6',
    'pop': '#E91E63',
    'hiphop': '#FF9800',
    'electronica': '#00BCD4',
    'clasica': '#795548',
  }

  const bgColor = colors[genre] || '#34495E'

  return `
    <svg width="640" height="640" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:0.8" />
        </linearGradient>
      </defs>
      <rect width="640" height="640" fill="url(#grad)"/>
      <circle cx="320" cy="220" r="80" fill="rgba(255,255,255,0.1)"/>
      <circle cx="320" cy="220" r="60" fill="rgba(255,255,255,0.05)"/>
      <circle cx="320" cy="220" r="20" fill="rgba(0,0,0,0.3)"/>
      <text x="320" y="380" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="white" text-anchor="middle">${escapeXml(title.substring(0, 30))}</text>
      <text x="320" y="420" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">${escapeXml(artist.substring(0, 30))}</text>
    </svg>
  `.trim()
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function uploadSvgToSanity(svgContent: string, filename: string): Promise<any> {
  const buffer = Buffer.from(svgContent)
  const asset = await client.assets.upload('image', buffer, {
    filename: filename,
    contentType: 'image/svg+xml',
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
  console.log('🎨 Generating placeholder covers...\n')

  const albums = await client.fetch('*[_type == "album" && !defined(coverImage)]')
  console.log(`Found ${albums.length} albums without covers\n`)

  for (const album of albums) {
    try {
      console.log(`\n🎵 Processing: ${album.title} by ${album.artist}`)

      const svg = generateAlbumPlaceholder(album.title, album.artist, album.genre)
      const filename = `${album.artist.replace(/\s+/g, '_')}_${album.title.replace(/\s+/g, '_')}.svg`

      console.log('   📤 Uploading placeholder...')
      const coverImage = await uploadSvgToSanity(svg, filename)

      console.log('   💾 Updating document...')
      await client.patch(album._id).set({ coverImage }).commit()

      console.log('   ✅ Done!')

      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      console.error(`   ❌ Error: ${error}`)
    }
  }

  console.log('\n\n🎉 Finished generating placeholders!')
}

main().catch(console.error)
