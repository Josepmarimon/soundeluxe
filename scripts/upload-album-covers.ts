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

// Directory where covers are saved
const COVERS_DIR = path.join(process.cwd(), 'album-covers')

async function uploadAlbumCovers() {
  console.log('📤 Uploading album covers to Sanity...\n')

  // Check if directory exists
  if (!fs.existsSync(COVERS_DIR)) {
    console.error(`❌ Directory not found: ${COVERS_DIR}`)
    console.error('Please run download-album-covers.ts first')
    process.exit(1)
  }

  // Get all jpg files from the directory
  const files = fs.readdirSync(COVERS_DIR).filter(file => file.endsWith('.jpg'))

  console.log(`Found ${files.length} cover images to upload\n`)

  let successCount = 0
  let failCount = 0

  for (const file of files) {
    const documentId = file.replace('.jpg', '')
    const filePath = path.join(COVERS_DIR, file)

    try {
      // Get album info
      const album = await client.fetch(
        `*[_id == $id][0]{_id, title, artist}`,
        { id: documentId }
      )

      if (!album) {
        console.log(`✗ Album not found: ${documentId}`)
        failCount++
        continue
      }

      console.log(`📀 Uploading cover for: ${album.artist} - ${album.title}`)

      // Upload image to Sanity
      const imageAsset = await client.assets.upload('image', fs.createReadStream(filePath), {
        filename: file,
      })

      console.log(`  ✓ Image uploaded: ${imageAsset._id}`)

      // Update the album document with the image reference
      await client
        .patch(documentId)
        .set({
          coverImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imageAsset._id,
            },
          },
        })
        .commit()

      console.log(`  ✓ Album updated with cover image\n`)
      successCount++

      // Wait a bit between uploads
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      console.error(`✗ Error uploading ${file}:`, error)
      failCount++
    }
  }

  console.log(`\n✅ Summary:`)
  console.log(`   Uploaded: ${successCount}`)
  console.log(`   Failed: ${failCount}`)
}

// Run the script
uploadAlbumCovers().catch(console.error)
