import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'k94gdbik',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-12-23',
  token: 'ske18FVL22axvgxrCUr7Vvhl8uv1xRMYcT55Rd8bLo29EbYqnrDCDgWwIpGkSIVlp5k2nAm33LbPa8Ng2uNnvsNRj9K39zKvAPsqD83YuwSq2EC2Ot3FXItCVNf7vt9JSRltcyH16Rv8TCuDeQigUBscbHUTfKTs9hjPov7PiXPSMeM64SiC'
})

// Album IDs from the query
const albumIds = [
  'GZA8SAwsKh0Q7JjyWiSjNC',
  'GZA8SAwsKh0Q7JjyWiSjtK',
  'GZA8SAwsKh0Q7JjyWiSk9O',
  'GZA8SAwsKh0Q7JjyWiSkPS',
  'GZA8SAwsKh0Q7JjyWiSlNh',
  'GZA8SAwsKh0Q7JjyWiSldl',
  'GZA8SAwsKh0Q7JjyWiSniH',
  'GZA8SAwsKh0Q7JjyWiSp0b',
  'GZA8SAwsKh0Q7JjyWiSpup',
  'NJZLoMez4714Sf01dGtBMx',
  'NJZLoMez4714Sf01dGtDAF',
  'NJZLoMez4714Sf01dGtDwd',
  'NJZLoMez4714Sf01dGtEFz',
  'NJZLoMez4714Sf01dGtFC3',
  'NJZLoMez4714Sf01dGtFyR',
  'NJZLoMez4714Sf01dGtGHn',
  'c7f425fb-ea74-4c05-8c9f-78b0ba5a77dd',
  'g1ucGbtbcNDpm5pEnR5nd1',
  'g1ucGbtbcNDpm5pEnR5ov1',
  'g1ucGbtbcNDpm5pEnR5pF1',
  'g1ucGbtbcNDpm5pEnR5pP1',
  'g1ucGbtbcNDpm5pEnR5po1',
  'g1ucGbtbcNDpm5pEnR5qm1',
  'g1ucGbtbcNDpm5pEnR5rG1',
  'g1ucGbtbcNDpm5pEnR5rV1',
  'g1ucGbtbcNDpm5pEnR5sx1'
]

// Function to generate random price between 30 and 75
function getRandomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function updateAlbumPrices() {
  console.log('🎵 Updating album prices...')

  for (const albumId of albumIds) {
    const price = getRandomPrice(30, 75)

    try {
      await client
        .patch(albumId)
        .set({
          salePrice: price,
          inStock: true
        })
        .commit()

      console.log(`✅ Updated album ${albumId} with price: €${price}`)
    } catch (error) {
      console.error(`❌ Error updating album ${albumId}:`, error)
    }
  }

  console.log('🎉 All albums updated!')
}

updateAlbumPrices()