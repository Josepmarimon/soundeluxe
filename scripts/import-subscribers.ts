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
  "Fleetwood Mac — Rumours (1977)": "g1ucGbtbcNDpm5pEnR5qm1",
  "Michael Jackson — Thriller (1982)": "NJZLoMez4714Sf01dGtBMx",
  "Prince — Purple Rain (1984)": "g1ucGbtbcNDpm5pEnR5rV1",
  "David Bowie — Ziggy Stardust (1972)": "g1ucGbtbcNDpm5pEnR5rG1",
  "Marvin Gaye — What's Going On (1971)": "GZA8SAwsKh0Q7JjyWiSkPS",
  "Lauryn Hill — The Miseducation of Lauryn Hill (1998)": "NJZLoMez4714Sf01dGtEFz",
  "Nirvana — Nevermind (1991)": "GZA8SAwsKh0Q7JjyWiSk9O",
  "Radiohead — OK Computer (1997)": "g1ucGbtbcNDpm5pEnR5pF1",
  "Guns N' Roses — Appetite for Destruction (1987)": "GZA8SAwsKh0Q7JjyWiSp0b",
  "Led Zeppelin — Led Zeppelin IV (1971)": "GZA8SAwsKh0Q7JjyWiSldl",
  // Álbumes nuevos creados
  "Stevie Wonder — Songs in the Key of Life (1976)": "1e02ddf8-cdf6-4de0-828e-5c32b309920c",
  "Madonna — Like a Prayer (1989)": "10ebabc9-5473-48ca-a5e7-03c91cfd492a",
  "Michael Jackson — Off the Wall (1979)": "e1c4f903-83db-4405-80e9-b63824f2da7a",
  "Paul Simon — Graceland (1986)": "400d9cca-d3e8-4021-9fb7-66ede50d34ab",
  "Metallica — Master of Puppets (1986)": "60515e65-320b-47fd-916b-54c0e5b7ced1",
  "Massive Attack — Mezzanine (1998)": "2021fed3-aeb8-4752-8243-5d7fa6d6622d",
  "Alanis Morissette — Jagged Little Pill (1995)": "5e28d7f8-6122-4ca9-89d0-d292bf360121",
  "Daft Punk — Homework (1997)": "8439d8f3-c07e-4207-b1e9-f66c9478a0b6",
  "Oasis — (What's the Story) Morning Glory? (1995)": "7dbe8b30-3e60-4183-a70c-dbbe4c05dbe4",
  "The Cure — Disintegration (1989)": "253442bc-aba3-49a6-bbfe-83f29dd2759d",
  "Steely Dan — Aja (1977)": "27903af7-bdcf-4e00-8db1-4d35947badbe",
}

// Datos del formulario
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
  // Fila 1 - Sin datos personales, solo votos - DESCARTADA
  // Fila 2
  { index: 2, name: "max", email: "maxgarciacastello@gmail.com", phone: "692120211", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Fleetwood Mac — Rumours (1977)", "Stevie Wonder — Songs in the Key of Life (1976)"], suggestion: "Queen" },
  // Fila 3 - Email duplicado de fila 2, votos diferentes
  { index: 3, name: "Max", email: "maxgarciacastello@gmail.com", phone: "692120211", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Fleetwood Mac — Rumours (1977)", "Michael Jackson — Thriller (1982)", "Michael Jackson — Off the Wall (1979)"], suggestion: "Queen" },
  // Fila 4
  { index: 4, name: "Txell", email: "Txell@baula.es", phone: "660989193", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Fleetwood Mac — Rumours (1977)", "Michael Jackson — Thriller (1982)", "Madonna — Like a Prayer (1989)"], suggestion: "Whitney Houston" },
  // Fila 5
  { index: 5, name: "Maria Gonzalez Sanchez", email: "mariababio70@gmail.com", phone: "678708626", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Michael Jackson — Thriller (1982)", "Paul Simon — Graceland (1986)", "Metallica — Master of Puppets (1986)"], suggestion: "Elvis Presley/Boulevard,Memphis,Tennessee" },
  // Fila 6
  { index: 6, name: "Ferran", email: "Ferranmarsol@hotmail.com", phone: "661655247", city: "Barcelona", wantsCalendar: false, wantsPresale: false, selectedAlbums: ["Madonna — Like a Prayer (1989)"], suggestion: "tina turner" },
  // Fila 7
  { index: 7, name: "Neus", email: "Neusgomis@gmail.com", phone: "600448930", city: "Barcelona", wantsCalendar: true, wantsPresale: false, selectedAlbums: ["Fleetwood Mac — Rumours (1977)", "Michael Jackson — Thriller (1982)", "Prince — Purple Rain (1984)"], suggestion: "The midnight" },
  // Fila 8
  { index: 8, name: "Martina", email: "martinacastello@gmail.com", phone: "606720888", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Fleetwood Mac — Rumours (1977)", "Michael Jackson — Thriller (1982)", "Madonna — Like a Prayer (1989)"], suggestion: "Rosalía - LUX - 2025" },
  // Fila 9
  { index: 9, name: "Sigrid", email: "sigridohligerlopez@gmail.com", phone: "618927777", city: "Sant Cugat del Vallès", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Stevie Wonder — Songs in the Key of Life (1976)", "Madonna — Like a Prayer (1989)", "Massive Attack — Mezzanine (1998)"], suggestion: "Tash Sultana Jungle" },
  // Fila 10
  { index: 10, name: "Bernardí Sanchis Mendez", email: "kimbanaska@hotmail.com", phone: "653507733", city: "Hospitalet de Llobregat", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Stevie Wonder — Songs in the Key of Life (1976)", "Steely Dan — Aja (1977)"], suggestion: "Elton John - Goodbye Yellow Brick Road" },
  // Fila 11
  { index: 11, name: "Frank Cortes", email: "frank_cortes@hotmail.com", phone: "+31682551333", city: "Amsterdam", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Massive Attack — Mezzanine (1998)", "Lauryn Hill — The Miseducation of Lauryn Hill (1998)", "Alanis Morissette — Jagged Little Pill (1995)"], suggestion: "Portishead - Dummy" },
  // Fila 12
  { index: 12, name: "Rafael Vilella i Cortada", email: "rafelvilella@icloud.com", phone: "630036605", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Michael Jackson — Thriller (1982)", "Daft Punk — Homework (1997)"], suggestion: "The Beatles - Magical mystery tour - 27/11/1967 (US LP) 8/12/1967 (UK EP)" },
  // Fila 13
  { index: 13, name: "Antonio", email: "armartin@eacomsa.com", phone: "618412463", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Fleetwood Mac — Rumours (1977)"], suggestion: "Jazz at the Pownshop" },
  // Fila 14
  { index: 14, name: "Andrea", email: "andrea.millaruelo@hotmail.es", phone: "673641281", city: "Badalona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Michael Jackson — Thriller (1982)", "Madonna — Like a Prayer (1989)"], suggestion: "-" },
  // Fila 15
  { index: 15, name: "Raúl Broceño", email: "raul.broceno@gmail.com", phone: "663364102", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Fleetwood Mac — Rumours (1977)", "Paul Simon — Graceland (1986)", "Massive Attack — Mezzanine (1998)"], suggestion: "Peter Gabriel - So (1986)" },
  // Fila 16
  { index: 16, name: "Josep Lluis Pérez", email: "josep@feridesfer.cat", phone: "609858975", city: "Sabadell", wantsCalendar: true, wantsPresale: false, selectedAlbums: ["Oasis — (What's the Story) Morning Glory? (1995)", "Nirvana — Nevermind (1991)", "The Cure — Disintegration (1989)"], suggestion: "Dire Straits - Calling Elvis - 1991" },
  // Fila 17
  { index: 17, name: "Gianfranco", email: "gmaceratesi@gmail.com", phone: "603489965", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Michael Jackson — Thriller (1982)", "Daft Punk — Homework (1997)", "Lauryn Hill — The Miseducation of Lauryn Hill (1998)"], suggestion: "Tame Impala - Currents / Parcels - Parcels / Jungle - Volcano" },
  // Fila 18
  { index: 18, name: "Quim Duran", email: "quimdm@gmail.com", phone: "665886258", city: "Badalona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Fleetwood Mac — Rumours (1977)", "Michael Jackson — Thriller (1982)", "Madonna — Like a Prayer (1989)"], suggestion: "Spandau ballet - Through the Barricades (1986)" },
  // Fila 19
  { index: 19, name: "joshi ballestereo", email: "joshi.ballestereo@icloud.com", phone: "666", city: "Manresa", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Fleetwood Mac — Rumours (1977)", "Madonna — Like a Prayer (1989)", "Nirvana — Nevermind (1991)"], suggestion: "Metallica Disco Negro" },
  // Fila 20
  { index: 20, name: "monica", email: "crazyrainbowserpent@gmail.com", phone: "+34600011820", city: "Hamburg", wantsCalendar: true, wantsPresale: false, selectedAlbums: ["Oasis — (What's the Story) Morning Glory? (1995)", "Nirvana — Nevermind (1991)", "Radiohead — OK Computer (1997)"], suggestion: "Muse - Absolution 2003" },
  // Fila 21
  { index: 21, name: "Belen Martin", email: "Belenmartinlozano@gmail.com", phone: "615072940", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Michael Jackson — Thriller (1982)", "Prince — Purple Rain (1984)", "Alanis Morissette — Jagged Little Pill (1995)"], suggestion: "George Michael Careless Whisper, Father Figure" },
  // Fila 22
  { index: 22, name: "Eva", email: "evaherreroruiz@hotmail.com", phone: "607910280", city: "Getxo", wantsCalendar: false, wantsPresale: false, selectedAlbums: ["David Bowie — Ziggy Stardust (1972)", "Marvin Gaye — What's Going On (1971)", "Lauryn Hill — The Miseducation of Lauryn Hill (1998)"], suggestion: "Jamiroquai - Travelling without moving (1996)" },
  // Fila 23
  { index: 23, name: "Amandine", email: "amandineperrier@hotmail.com", phone: "655084427", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Madonna — Like a Prayer (1989)", "Michael Jackson — Off the Wall (1979)", "Daft Punk — Homework (1997)"], suggestion: "X" },
  // Fila 24
  { index: 24, name: "Sara", email: "Sararias1978@gmail.com", phone: "669362270", city: "Barcelona", wantsCalendar: false, wantsPresale: true, selectedAlbums: ["Guns N' Roses — Appetite for Destruction (1987)", "Metallica — Master of Puppets (1986)", "Nirvana — Nevermind (1991)"], suggestion: "Angeles del infierno" },
  // Fila 25
  { index: 25, name: "Jordi G.F", email: "jordigolferrer@gmail.com", phone: "637916255", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Prince — Purple Rain (1984)", "Daft Punk — Homework (1997)"], suggestion: "Ondara - Tales of America" },
  // Fila 26
  { index: 26, name: "Angel Diaz", email: "andiroc@hotmail.com", phone: "629446724", city: "Salou (Tarragona)", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Fleetwood Mac — Rumours (1977)", "David Bowie — Ziggy Stardust (1972)"], suggestion: "Mike Oldfield - Tubular Bells (O cualquier otro de su discografía (" },
  // Fila 27
  { index: 27, name: "Albert busoms", email: "albert@procesos.com", phone: "637427291", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Fleetwood Mac — Rumours (1977)"], suggestion: "tothom et proposa un adicional perque es un camp obligatori" },
  // Fila 28
  { index: 28, name: "Josep Maria", email: "josepmarimon@gmail.com", phone: "600942086", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Massive Attack — Mezzanine (1998)", "Radiohead — OK Computer (1997)"], suggestion: "Songs of distant earth . Mike Olfield (1992)" },
  // Fila 29
  { index: 29, name: "Carlos Franco", email: "cafranco86@gmail.com", phone: "677109763", city: "Badalona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Fleetwood Mac — Rumours (1977)", "Michael Jackson — Thriller (1982)", "Daft Punk — Homework (1997)"], suggestion: "ionnalee ¦ iamamiwhoami - STILL BLUE (2025)" },
  // Fila 30
  { index: 30, name: "Eduardo Garcia Canet", email: "edug1958@gmail.com", phone: "646 828 449", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Prince — Purple Rain (1984)", "Paul Simon — Graceland (1986)"], suggestion: "The Who - Quadrophenia (1973)" },
  // Fila 31
  { index: 31, name: "Augusto", email: "augumart@hotmail.com", phone: "617 88 83 31", city: "Barcelona", wantsCalendar: true, wantsPresale: false, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Daft Punk — Homework (1997)", "Metallica — Master of Puppets (1986)"], suggestion: "pnk Floyd - atom heart mother 1970" },
  // Fila 32
  { index: 32, name: "Ricardo", email: "Rgrmam@gmail.com", phone: "678080169", city: "Segovia", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Pink Floyd — The Dark Side of the Moon (1973)", "Paul Simon — Graceland (1986)"], suggestion: "Keith Jarrett- The Köln Concert" },
  // Fila 33 - DATOS FALSOS "Hola" - DESCARTADA
  // Fila 34
  { index: 34, name: "Máximo", email: "maximo46@me.com", phone: "644312477", city: "El Masnou", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["David Bowie — Ziggy Stardust (1972)", "Michael Jackson — Off the Wall (1979)", "Steely Dan — Aja (1977)"], suggestion: "Paquito D'Rivera — HABANA CAFE — 1992" },
  // Fila 35
  { index: 35, name: "Noelia", email: "noavargas@gmail.com", phone: "670415038", city: "Barcelona", wantsCalendar: true, wantsPresale: true, selectedAlbums: ["Marvin Gaye — What's Going On (1971)", "Prince — Purple Rain (1984)", "Madonna — Like a Prayer (1989)"], suggestion: "Red hoy Chilli peppers, Californication 1989" },
]

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

async function main() {
  console.log('=== Importación de Suscriptores ===\n')

  const outputDir = path.join(__dirname, 'output')

  // Deduplicar por email (quedarse con el último registro)
  const emailMap = new Map<string, FormRow>()
  for (const row of RAW_DATA) {
    const email = row.email.toLowerCase().trim()
    if (isValidEmail(email)) {
      emailMap.set(email, row)
    } else {
      console.log(`⚠️  Fila ${row.index}: Email inválido "${row.email}" - DESCARTADO`)
    }
  }

  const uniqueUsers = Array.from(emailMap.values())
  console.log(`\n📊 Usuarios únicos a importar: ${uniqueUsers.length}`)

  const createdUsers: { name: string; email: string; password: string }[] = []
  const suggestions: { name: string; email: string; suggestion: string }[] = []
  const errors: string[] = []

  let votesCreated = 0
  let usersCreated = 0
  let usersSkipped = 0

  for (const row of uniqueUsers) {
    const email = row.email.toLowerCase().trim()
    const tempPassword = generatePassword()

    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      let userId: string

      if (existingUser) {
        console.log(`⏭️  Usuario ya existe: ${email}`)
        userId = existingUser.id
        usersSkipped++
      } else {
        // Crear usuario
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
          errors.push(`Álbum no encontrado: "${albumName}" (usuario: ${email})`)
          continue
        }

        // Verificar si el voto ya existe
        const existingVote = await prisma.votacion.findUnique({
          where: {
            userId_albumId: { userId, albumId }
          }
        })

        if (!existingVote) {
          await prisma.votacion.create({
            data: { userId, albumId }
          })
          votesCreated++
        }
      }

      // Guardar sugerencia si es válida
      if (row.suggestion && row.suggestion !== '-' && row.suggestion !== 'X' && !row.suggestion.includes('camp obligatori')) {
        suggestions.push({ name: row.name, email, suggestion: row.suggestion })
      }

    } catch (error) {
      const errorMsg = `Error procesando ${email}: ${error}`
      errors.push(errorMsg)
      console.error(`❌ ${errorMsg}`)
    }
  }

  // Generar archivos de salida

  // 1. Usuarios creados con contraseñas
  if (createdUsers.length > 0) {
    const usersCSV = [
      'Nombre,Email,Contraseña temporal',
      ...createdUsers.map(u => `"${u.name}","${u.email}","${u.password}"`)
    ].join('\n')
    fs.writeFileSync(path.join(outputDir, 'usuarios-creados.csv'), usersCSV)
    console.log(`\n📄 Archivo generado: scripts/output/usuarios-creados.csv`)
  }

  // 2. Sugerencias de vinilos
  if (suggestions.length > 0) {
    const suggestionsCSV = [
      'Nombre,Email,Sugerencia',
      ...suggestions.map(s => `"${s.name}","${s.email}","${s.suggestion}"`)
    ].join('\n')
    fs.writeFileSync(path.join(outputDir, 'sugerencias-vinilos.csv'), suggestionsCSV)
    console.log(`📄 Archivo generado: scripts/output/sugerencias-vinilos.csv`)
  }

  // 3. Errores
  if (errors.length > 0) {
    fs.writeFileSync(path.join(outputDir, 'errores.log'), errors.join('\n'))
    console.log(`📄 Archivo generado: scripts/output/errores.log`)
  }

  // Resumen
  console.log('\n=== RESUMEN ===')
  console.log(`👤 Usuarios creados: ${usersCreated}`)
  console.log(`⏭️  Usuarios existentes (saltados): ${usersSkipped}`)
  console.log(`🗳️  Votos creados: ${votesCreated}`)
  console.log(`💡 Sugerencias guardadas: ${suggestions.length}`)
  if (errors.length > 0) {
    console.log(`⚠️  Errores: ${errors.length}`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
