import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { UserRole } from '../app/generated/prisma/client'
import bcrypt from 'bcrypt'
import * as fs from 'fs'
import * as path from 'path'

// Mapeo de álbumes del formulario a IDs de Sanity
const ALBUM_MAP: Record<string, string> = {
  // Álbumes existentes
  "Pink Floyd — The Dark Side of the Moon (1973)": "GZA8SAwsKh0Q7JjyWiSjNC",
  "Michael Jackson — Thriller (1982)": "NJZLoMez4714Sf01dGtBMx",
  "Oasis — (What's the Story) Morning Glory? (1995)": "7dbe8b30-3e60-4183-a70c-dbbe4c05dbe4",
  "Daft Punk — Homework (1997)": "8439d8f3-c07e-4207-b1e9-f66c9478a0b6",
  "Radiohead — OK Computer (1997)": "g1ucGbtbcNDpm5pEnR5pF1",
  "Lauryn Hill — The Miseducation of Lauryn Hill (1998)": "NJZLoMez4714Sf01dGtEFz",
  "Madonna — Like a Prayer (1989)": "10ebabc9-5473-48ca-a5e7-03c91cfd492a",
  "Nirvana — Nevermind (1991)": "GZA8SAwsKh0Q7JjyWiSk9O",
  "Prince — Purple Rain (1984)": "g1ucGbtbcNDpm5pEnR5rV1",
  "Paul Simon — Graceland (1986)": "400d9cca-d3e8-4021-9fb7-66ede50d34ab",
  // Álbumes nuevos
  "Public Enemy — It Takes a Nation of Millions… (1988)": "7bdd5eb8-0ce5-403b-a062-a62568d698f4",
  "N.W.A. — Straight Outta Compton (1988)": "bd265b95-9566-4d07-aacb-8bec3912bee4",
  "Rosalía - Lux (2025)": "7f8d7452-dc8a-4ec3-9eeb-4f461e0e0ab9",
}

interface FormRow {
  index: number
  name: string
  email: string
  phone: string
  city: string
  wantsCalendar: boolean
  wantsPresale: boolean
  selectedAlbums: string[]
  suggestion: string
}

const RAW_DATA: FormRow[] = [
  { index: 9, name: "Martí Marimon Capdevila", email: "martimarimon2005@gmail.com", phone: "+34683573638", city: "Barcelona", wantsCalendar: false, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Daft Punk — Homework (1997)", "Radiohead — OK Computer (1997)"], suggestion: "Currents - Tame impala" },
  { index: 10, name: "Adrià Marimon Capdevila", email: "adriamarimon2005@gmail.com", phone: "+34696721483", city: "Barcelona", wantsCalendar: true, wantsPresale: false, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Michael Jackson — Thriller (1982)", "Oasis — (What's the Story) Morning Glory? (1995)"], suggestion: "Definitely Maybe (1994)" },
  { index: 11, name: "Joel Munne Carbonell", email: "joelmunnee@gmail.com", phone: "+34644434685", city: "Barcelona", wantsCalendar: false, wantsPresale: false, selectedAlbums: ["Lauryn Hill — The Miseducation of Lauryn Hill (1998)", "Public Enemy — It Takes a Nation of Millions… (1988)", "N.W.A. — Straight Outta Compton (1988)"], suggestion: "Ni idea" },
  { index: 12, name: "Erin Marimon Capdevila", email: "marimon.erin@gmail.com", phone: "+34686819255", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Madonna — Like a Prayer (1989)", "Oasis — (What's the Story) Morning Glory? (1995)", "Nirvana — Nevermind (1991)"], suggestion: "Motomami, Rosalia" },
  { index: 13, name: "Eduardo García Canet", email: "edug1958@gmail.com", phone: "+34646828449", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Prince — Purple Rain (1984)", "Paul Simon — Graceland (1986)"], suggestion: "The Who - Quadrophenia (1973)" },
  { index: 14, name: "Diego Jiménez Ibañez", email: "diegoibanez2003@gmail.com", phone: "+34657589368", city: "Barcelona", wantsCalendar: true, wantsPresale: false, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Lauryn Hill — The Miseducation of Lauryn Hill (1998)", "Rosalía - Lux (2025)"], suggestion: "Kaz Hawkins, Don't you know" },
]

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

async function main() {
  console.log('=== Importación Batch 2 ===\n')

  const outputDir = path.join(__dirname, 'output')
  const createdUsers: { name: string; email: string; password: string }[] = []
  const suggestions: { name: string; email: string; suggestion: string }[] = []

  let votesCreated = 0
  let usersCreated = 0
  let usersSkipped = 0

  for (const row of RAW_DATA) {
    const email = row.email.toLowerCase().trim()
    const tempPassword = generatePassword()

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      let userId: string

      if (existingUser) {
        console.log(`⏭️  Usuario ya existe: ${email}`)
        userId = existingUser.id
        usersSkipped++
      } else {
        const hashedPassword = await bcrypt.hash(tempPassword, 10)
        const newsletterSubscribed = row.wantsCalendar || row.wantsPresale

        const newUser = await prisma.user.create({
          data: {
            email,
            name: row.name,
            password: hashedPassword,
            role: UserRole.REGISTERED,
            newsletterSubscribed,
            newsletterConfirmedAt: newsletterSubscribed ? new Date() : null,
          }
        })

        userId = newUser.id
        usersCreated++
        createdUsers.push({ name: row.name, email, password: tempPassword })
        console.log(`✅ Usuario creado: ${row.name} (${email})`)
      }

      // Crear votos
      for (const albumName of row.selectedAlbums) {
        const albumId = ALBUM_MAP[albumName]
        if (!albumId) {
          console.log(`⚠️  Álbum no encontrado: "${albumName}"`)
          continue
        }

        const existingVote = await prisma.votacion.findUnique({
          where: { userId_albumId: { userId, albumId } }
        })

        if (!existingVote) {
          await prisma.votacion.create({
            data: { userId, albumId }
          })
          votesCreated++
        }
      }

      // Guardar sugerencia
      if (row.suggestion && row.suggestion !== '-' && row.suggestion.toLowerCase() !== 'ni idea') {
        suggestions.push({ name: row.name, email, suggestion: row.suggestion })
      }

    } catch (error) {
      console.error(`❌ Error procesando ${email}: ${error}`)
    }
  }

  // Append a archivos existentes
  if (createdUsers.length > 0) {
    const existingUsers = fs.existsSync(path.join(outputDir, 'usuarios-creados.csv'))
      ? fs.readFileSync(path.join(outputDir, 'usuarios-creados.csv'), 'utf-8')
      : 'Nombre,Email,Contraseña temporal'

    const newLines = createdUsers.map(u => `"${u.name}","${u.email}","${u.password}"`).join('\n')
    fs.writeFileSync(path.join(outputDir, 'usuarios-creados.csv'), existingUsers + '\n' + newLines)
    console.log(`\n📄 Usuarios añadidos a: scripts/output/usuarios-creados.csv`)
  }

  if (suggestions.length > 0) {
    const existingSuggestions = fs.existsSync(path.join(outputDir, 'sugerencias-vinilos.csv'))
      ? fs.readFileSync(path.join(outputDir, 'sugerencias-vinilos.csv'), 'utf-8')
      : 'Nombre,Email,Sugerencia'

    const newLines = suggestions.map(s => `"${s.name}","${s.email}","${s.suggestion}"`).join('\n')
    fs.writeFileSync(path.join(outputDir, 'sugerencias-vinilos.csv'), existingSuggestions + '\n' + newLines)
    console.log(`📄 Sugerencias añadidas a: scripts/output/sugerencias-vinilos.csv`)
  }

  console.log('\n=== RESUMEN ===')
  console.log(`👤 Usuarios creados: ${usersCreated}`)
  console.log(`⏭️  Usuarios existentes: ${usersSkipped}`)
  console.log(`🗳️  Votos creados: ${votesCreated}`)
  console.log(`💡 Sugerencias: ${suggestions.length}`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
