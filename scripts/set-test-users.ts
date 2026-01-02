import 'dotenv/config'
import { prisma } from '../lib/prisma'

// Emails de usuarios de test que pueden recibir emails aunque estén pausados
const TEST_USER_EMAILS = [
  'josepmarimon@gmail.com',
  // Añade más emails aquí si quieres
]

async function main() {
  console.log('=== Configurando usuarios de test ===\n')

  for (const email of TEST_USER_EMAILS) {
    try {
      const user = await prisma.user.update({
        where: { email: email.toLowerCase() },
        data: { isTestUser: true }
      })
      console.log(`✅ ${user.name} (${user.email}) marcado como usuario de test`)
    } catch (error) {
      console.log(`⚠️  Usuario no encontrado: ${email}`)
    }
  }

  // Mostrar todos los usuarios de test
  const testUsers = await prisma.user.findMany({
    where: { isTestUser: true },
    select: { name: true, email: true }
  })

  console.log(`\n📋 Usuarios de test activos: ${testUsers.length}`)
  testUsers.forEach(u => console.log(`   - ${u.name} (${u.email})`))
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
