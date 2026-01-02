import { config } from 'dotenv'
config({ path: '.env.local' })

import { PrismaClient } from '../app/generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws
const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaNeon({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Checking users...')
  const users = await prisma.user.findMany({ take: 5, select: { id: true, email: true, name: true } })
  console.log('Users:', JSON.stringify(users, null, 2))

  console.log('\nLooking for user cmjiik6s4000004l8i45hnpm8...')
  const user = await prisma.user.findUnique({ where: { id: 'cmjiik6s4000004l8i45hnpm8' } })
  console.log('Found:', user)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
