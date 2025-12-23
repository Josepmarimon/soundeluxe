import 'dotenv/config'
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import https from 'https'

// Carregar variables d'entorn del .env.local
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// 25 àlbums més importants de la història amb varietat de gèneres
// Utilitzem imatges de Wikimedia Commons (domini públic)
const ICONIC_ALBUMS = [
  { title: 'The Dark Side of the Moon', artist: 'Pink Floyd', year: 1973, genre: 'rock', duration: 43, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png' },
  { title: 'Abbey Road', artist: 'The Beatles', year: 1969, genre: 'rock', duration: 47, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' },
  { title: 'Thriller', artist: 'Michael Jackson', year: 1982, genre: 'pop', duration: 42, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
  { title: 'Kind of Blue', artist: 'Miles Davis', year: 1959, genre: 'jazz', duration: 46, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg' },
  { title: 'Nevermind', artist: 'Nirvana', year: 1991, genre: 'rock', duration: 49, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg' },
  { title: 'What\'s Going On', artist: 'Marvin Gaye', year: 1971, genre: 'soul', duration: 35, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b6/Marvin_Gaye_-_What%27s_Going_On.png' },
  { title: 'Pet Sounds', artist: 'The Beach Boys', year: 1966, genre: 'rock', duration: 36, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/bb/PetSoundsCover.jpg' },
  { title: 'OK Computer', artist: 'Radiohead', year: 1997, genre: 'rock', duration: 53, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Radioheadokcomputer.png' },
  { title: 'The Velvet Underground & Nico', artist: 'The Velvet Underground', year: 1967, genre: 'rock', duration: 48, coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Velvet_Underground_and_Nico.jpg' },
  { title: 'Led Zeppelin IV', artist: 'Led Zeppelin', year: 1971, genre: 'rock', duration: 42, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/2/26/Led_Zeppelin_-_Led_Zeppelin_IV.jpg' },
  { title: 'The Joshua Tree', artist: 'U2', year: 1987, genre: 'rock', duration: 50, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/6/6b/The_Joshua_Tree.png' },
  { title: 'A Love Supreme', artist: 'John Coltrane', year: 1965, genre: 'jazz', duration: 33, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/7/7d/A_Love_Supreme.jpg' },
  { title: 'Blue', artist: 'Joni Mitchell', year: 1971, genre: 'pop', duration: 36, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b2/Joni_Mitchell_-_Blue.jpg' },
  { title: 'Back to Black', artist: 'Amy Winehouse', year: 2006, genre: 'soul', duration: 35, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/3/32/Amy_Winehouse_-_Back_to_Black.png' },
  { title: 'The Miseducation of Lauryn Hill', artist: 'Lauryn Hill', year: 1998, genre: 'hiphop', duration: 77, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/d/df/Lauryn_Hill_-_The_Miseducation_of_Lauryn_Hill.png' },
  { title: 'Rumours', artist: 'Fleetwood Mac', year: 1977, genre: 'rock', duration: 40, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG' },
  { title: 'The Rise and Fall of Ziggy Stardust', artist: 'David Bowie', year: 1972, genre: 'rock', duration: 38, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/01/ZiggyStardust.jpg' },
  { title: 'Purple Rain', artist: 'Prince', year: 1984, genre: 'pop', duration: 43, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/96/Prince_and_the_Revolution-Purple_Rain_%28album%29.jpg' },
  { title: 'Random Access Memories', artist: 'Daft Punk', year: 2013, genre: 'electronica', duration: 75, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg' },
  { title: 'Bitches Brew', artist: 'Miles Davis', year: 1970, genre: 'jazz', duration: 94, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/c/c4/BitchesBrew.jpg' },
  { title: 'London Calling', artist: 'The Clash', year: 1979, genre: 'rock', duration: 65, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/00/TheClashLondonCallingalbumcover.jpg' },
  { title: 'Born to Run', artist: 'Bruce Springsteen', year: 1975, genre: 'rock', duration: 39, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Bruce_Springsteen_-_Born_to_Run.jpg' },
  { title: 'Appetite for Destruction', artist: 'Guns N\' Roses', year: 1987, genre: 'rock', duration: 53, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Appetite_for_Destruction.jpg' },
  { title: 'Innervisions', artist: 'Stevie Wonder', year: 1973, genre: 'soul', duration: 44, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/0/02/Innervisionscover.jpg' },
  { title: 'The Queen is Dead', artist: 'The Smiths', year: 1986, genre: 'rock', duration: 36, coverUrl: 'https://upload.wikimedia.org/wikipedia/en/9/90/The_Smiths-The_Queen_is_Dead.PNG' },
]

// Generar dissabtes d'hivern i primavera 2026
function generateSaturdays(): Date[] {
  const saturdays: Date[] = []
  const start = new Date('2026-01-03') // Primer dissabte de gener 2026
  const end = new Date('2026-06-20') // Final de primavera 2026

  let current = new Date(start)
  while (current <= end) {
    if (current.getDay() === 6) { // 6 = Dissabte
      saturdays.push(new Date(current))
    }
    current.setDate(current.getDate() + 1)
  }

  return saturdays
}

async function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath)
    https.get(url, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      fs.unlink(filepath, () => {})
      reject(err)
    })
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

async function createDefaultSala() {
  const sala = {
    _type: 'sala',
    name: {
      ca: 'Sala Sound Deluxe Barcelona',
      es: 'Sala Sound Deluxe Barcelona',
      en: 'Sound Deluxe Room Barcelona',
    },
    address: {
      street: 'Carrer de la Música, 123',
      city: 'Barcelona',
      postalCode: '08001',
      country: 'España',
    },
    capacity: 25,
  }

  return await client.create(sala)
}

async function createStandardSessionType() {
  const sessionType = {
    _type: 'sessionType',
    key: 'standard',
    name: {
      ca: 'Sessió Estàndard',
      es: 'Sesión Estándar',
      en: 'Standard Session',
    },
    description: {
      ca: 'Escolta immersiva d\'un àlbum complet en vinil',
      es: 'Escucha inmersiva de un álbum completo en vinilo',
      en: 'Immersive listening of a complete album on vinyl',
    },
  }

  return await client.create(sessionType)
}

async function downloadAlbumCover(album: typeof ICONIC_ALBUMS[0]): Promise<string | null> {
  try {
    const tempPath = path.join('/tmp', `${album.artist.replace(/\s+/g, '_')}_${album.title.replace(/\s+/g, '_')}.jpg`)
    await downloadImage(album.coverUrl, tempPath)
    return tempPath
  } catch (error) {
    console.error(`Error downloading cover for ${album.title}:`, error)
    return null
  }
}

async function createAlbumInSanity(album: typeof ICONIC_ALBUMS[0], imagePath: string | null) {
  let coverImage = null

  if (imagePath) {
    try {
      coverImage = await uploadImageToSanity(imagePath)
      fs.unlinkSync(imagePath) // Cleanup temp file
    } catch (error) {
      console.error(`Error uploading cover for ${album.title}:`, error)
    }
  }

  const albumDoc = {
    _type: 'album',
    title: album.title,
    artist: album.artist,
    year: album.year,
    genre: album.genre,
    duration: album.duration,
    coverImage,
    description: {
      ca: [{
        _type: 'block',
        children: [{
          _type: 'span',
          text: `Un dels àlbums més influents de la història de la música. ${album.title} de ${album.artist} (${album.year}) va marcar una època i continua sent una referència.`,
        }],
        markDefs: [],
        style: 'normal',
      }],
      es: [{
        _type: 'block',
        children: [{
          _type: 'span',
          text: `Uno de los álbumes más influyentes de la historia de la música. ${album.title} de ${album.artist} (${album.year}) marcó una época y sigue siendo una referencia.`,
        }],
        markDefs: [],
        style: 'normal',
      }],
      en: [{
        _type: 'block',
        children: [{
          _type: 'span',
          text: `One of the most influential albums in music history. ${album.title} by ${album.artist} (${album.year}) defined an era and remains a landmark recording.`,
        }],
        markDefs: [],
        style: 'normal',
      }],
    },
  }

  return await client.create(albumDoc)
}

async function createSession(
  albumId: string,
  salaId: string,
  sessionTypeId: string,
  date: Date,
  price: number
) {
  const session = {
    _type: 'session',
    date: date.toISOString(),
    price,
    totalPlaces: 20,
    isActive: true,
    album: {
      _type: 'reference',
      _ref: albumId,
    },
    sala: {
      _type: 'reference',
      _ref: salaId,
    },
    sessionType: {
      _type: 'reference',
      _ref: sessionTypeId,
    },
    vinylInfo: {
      ca: 'Vinil original remasteritzat',
      es: 'Vinilo original remasterizado',
      en: 'Original remastered vinyl',
    },
  }

  return await client.create(session)
}

async function main() {
  console.log('🎵 Starting Sound Deluxe seed script...\n')

  // 1. Crear sala per defecte
  console.log('📍 Creating default venue...')
  const sala = await createDefaultSala()
  console.log(`✅ Sala created: ${sala._id}\n`)

  // 2. Crear session type estàndard
  console.log('🎭 Creating standard session type...')
  const sessionType = await createStandardSessionType()
  console.log(`✅ Session type created: ${sessionType._id}\n`)

  // 3. Generar dissabtes
  const saturdays = generateSaturdays()
  console.log(`📅 Generated ${saturdays.length} Saturdays for 2026\n`)

  // 4. Crear àlbums i sessions
  console.log('💿 Creating albums and sessions...\n')

  for (let i = 0; i < Math.min(ICONIC_ALBUMS.length, saturdays.length); i++) {
    const album = ICONIC_ALBUMS[i]
    const saturday = saturdays[i]

    console.log(`\n${i + 1}. Processing: ${album.title} by ${album.artist}`)

    // Descarregar caràtula
    console.log('   📥 Downloading cover art...')
    const imagePath = await downloadAlbumCover(album)

    // Crear àlbum a Sanity
    console.log('   💾 Creating album in Sanity...')
    const albumDoc = await createAlbumInSanity(album, imagePath)
    console.log(`   ✅ Album created: ${albumDoc._id}`)

    // Crear sessió
    console.log(`   📅 Creating session for ${saturday.toLocaleDateString('ca-ES')}...`)
    const price = 25 + Math.floor(Math.random() * 20) // 25-45€
    const session = await createSession(
      albumDoc._id,
      sala._id,
      sessionType._id,
      saturday,
      price
    )
    console.log(`   ✅ Session created: ${session._id}`)

    // Espera entre requests per no sobrecarregar les APIs
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  console.log('\n\n🎉 Seed completed successfully!')
  console.log(`✨ Created ${Math.min(ICONIC_ALBUMS.length, saturdays.length)} albums and sessions`)
}

main().catch(console.error)
