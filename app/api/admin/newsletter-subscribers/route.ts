import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type SubscriberStatus = 'CONFIRMED' | 'PENDING' | 'UNSUBSCRIBED'
type SubscriberSource = 'ANONYMOUS' | 'USER'

interface UnifiedSubscriber {
  id: string
  source: SubscriberSource
  email: string
  name: string | null
  language: string
  status: SubscriberStatus
  confirmedAt: string | null
  unsubscribedAt: string | null
  createdAt: string
  isTestUser?: boolean
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
      select: { role: true },
    })

    if (adminUser?.role !== 'ADMIN' && adminUser?.role !== 'EDITOR') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as SubscriberStatus | null

    const [subscribers, users] = await Promise.all([
      prisma.subscriber.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.findMany({
        where: { newsletterSubscribed: true },
        select: {
          id: true,
          email: true,
          name: true,
          language: true,
          newsletterConfirmedAt: true,
          createdAt: true,
          isTestUser: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    const unified: UnifiedSubscriber[] = [
      ...subscribers.map((s): UnifiedSubscriber => ({
        id: s.id,
        source: 'ANONYMOUS',
        email: s.email,
        name: null,
        language: s.language,
        status: s.unsubscribedAt
          ? 'UNSUBSCRIBED'
          : s.confirmed
          ? 'CONFIRMED'
          : 'PENDING',
        confirmedAt: s.confirmedAt?.toISOString() ?? null,
        unsubscribedAt: s.unsubscribedAt?.toISOString() ?? null,
        createdAt: s.createdAt.toISOString(),
      })),
      ...users.map((u): UnifiedSubscriber => ({
        id: u.id,
        source: 'USER',
        email: u.email,
        name: u.name,
        language: u.language,
        status: u.newsletterConfirmedAt ? 'CONFIRMED' : 'PENDING',
        confirmedAt: u.newsletterConfirmedAt?.toISOString() ?? null,
        unsubscribedAt: null,
        createdAt: u.createdAt.toISOString(),
        isTestUser: u.isTestUser,
      })),
    ]

    unified.sort((a, b) => b.createdAt.localeCompare(a.createdAt))

    const filtered = status
      ? unified.filter((s) => s.status === status)
      : unified

    const stats = {
      total: unified.length,
      confirmed: unified.filter((s) => s.status === 'CONFIRMED').length,
      pending: unified.filter((s) => s.status === 'PENDING').length,
      unsubscribed: unified.filter((s) => s.status === 'UNSUBSCRIBED').length,
      anonymous: unified.filter((s) => s.source === 'ANONYMOUS').length,
      users: unified.filter((s) => s.source === 'USER').length,
    }

    return NextResponse.json({ subscribers: filtered, stats })
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
