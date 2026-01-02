import 'dotenv/config'
import { prisma } from '../lib/prisma'

async function checkSubscribers() {
  console.log('\n📬 Subscriptors del butlletí\n')
  console.log('=' .repeat(60))

  // 1. Subscriptors (usuaris no registrats)
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: 'desc' },
  })

  console.log(`\n📧 Subscribers (no registrats): ${subscribers.length}`)
  console.log('-'.repeat(60))

  if (subscribers.length > 0) {
    for (const sub of subscribers) {
      const status = sub.unsubscribedAt
        ? '❌ Baixa'
        : sub.confirmed
          ? '✅ Confirmat'
          : '⏳ Pendent'
      console.log(`  ${sub.email} | ${sub.language} | ${status} | ${sub.createdAt.toLocaleDateString('ca-ES')}`)
    }
  } else {
    console.log('  (Cap subscriptor)')
  }

  // 2. Usuaris registrats subscrits
  const users = await prisma.user.findMany({
    where: { newsletterSubscribed: true },
    select: {
      email: true,
      name: true,
      language: true,
      newsletterConfirmedAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  console.log(`\n👤 Usuaris registrats subscrits: ${users.length}`)
  console.log('-'.repeat(60))

  if (users.length > 0) {
    for (const user of users) {
      const status = user.newsletterConfirmedAt ? '✅ Confirmat' : '⏳ Pendent'
      console.log(`  ${user.email} | ${user.name} | ${user.language} | ${status}`)
    }
  } else {
    console.log('  (Cap usuari subscrit)')
  }

  // Resum
  const confirmedSubscribers = subscribers.filter(s => s.confirmed && !s.unsubscribedAt).length
  const confirmedUsers = users.filter(u => u.newsletterConfirmedAt).length

  console.log('\n' + '='.repeat(60))
  console.log(`📊 TOTAL ACTIUS: ${confirmedSubscribers + confirmedUsers}`)
  console.log(`   - Subscribers confirmats: ${confirmedSubscribers}`)
  console.log(`   - Usuaris confirmats: ${confirmedUsers}`)
  console.log('='.repeat(60) + '\n')
}

checkSubscribers()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
