import { config } from 'dotenv'
config({ path: '.env.local' })

import { prisma } from '../lib/prisma'

async function main() {
  const suggestions = await prisma.albumSuggestion.findMany({
    include: { user: { select: { id: true, name: true, email: true } } }
  })

  console.log('=== Suggerències a la BD ===')
  console.log('Total:', suggestions.length)

  for (const s of suggestions) {
    console.log('\n---')
    console.log('ID:', s.id)
    console.log('Usuari:', s.user.name, `(${s.user.email})`)
    console.log('UserId:', s.userId)
    console.log('Artista:', s.artistName)
    console.log('Àlbum:', s.albumTitle)
    console.log('Any:', s.year)
    console.log('Estat:', s.status)
    console.log('Creat:', s.createdAt)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
