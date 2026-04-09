import { prisma } from '../lib/prisma'

prisma.user.findMany({ select: { id: true, email: true, name: true, role: true } })
  .then(users => { console.log(JSON.stringify(users, null, 2)); process.exit(0) })
  .catch(e => { console.error(e); process.exit(1) })
