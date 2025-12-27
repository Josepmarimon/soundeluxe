import sharp from 'sharp'
import path from 'path'
import fs from 'fs'

const BACKGROUND_COLOR = '#0a1929'
const WIDTH = 1200
const HEIGHT = 630

async function generateOgImage() {
  const logoPath = path.join(process.cwd(), 'public', 'logo.svg')
  const outputPath = path.join(process.cwd(), 'public', 'og-image.png')

  // Read the SVG logo
  const logoSvg = fs.readFileSync(logoPath, 'utf-8')

  // Calculate logo size (about 40% of the height)
  const logoHeight = Math.round(HEIGHT * 0.5)
  const logoWidth = logoHeight // Assuming square-ish logo

  // Convert SVG to PNG buffer with desired size
  const logoBuffer = await sharp(Buffer.from(logoSvg))
    .resize(logoWidth, logoHeight, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer()

  // Create the background and composite the logo
  await sharp({
    create: {
      width: WIDTH,
      height: HEIGHT,
      channels: 4,
      background: BACKGROUND_COLOR,
    },
  })
    .composite([
      {
        input: logoBuffer,
        gravity: 'center',
      },
    ])
    .png()
    .toFile(outputPath)

  console.log(`OG image generated: ${outputPath}`)
  console.log(`Dimensions: ${WIDTH}x${HEIGHT}`)
}

generateOgImage().catch(console.error)
