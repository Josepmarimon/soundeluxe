import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import ComercialManagementClient from './ComercialManagementClient'

export default async function ComercialAdminPage() {
  const session = await auth()

  if (!session?.user) {
    return redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
    select: { role: true },
  })

  if (user?.role !== 'ADMIN') {
    return redirect('/')
  }

  return <ComercialManagementClient currentUserId={(session.user as { id: string }).id} />
}
