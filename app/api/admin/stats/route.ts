import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Granularity = 'day' | 'week' | 'month'

interface TimeBucket {
  date: string
  count: number
}

const RANGE_DAYS: Record<string, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
  '365d': 365,
}

function bucketsFor(start: Date, days: number, granularity: Granularity): Map<string, number> {
  const buckets = new Map<string, number>()
  const cursor = new Date(start)

  while (cursor <= new Date()) {
    buckets.set(bucketKey(cursor, granularity), 0)
    if (granularity === 'day') cursor.setUTCDate(cursor.getUTCDate() + 1)
    else if (granularity === 'week') cursor.setUTCDate(cursor.getUTCDate() + 7)
    else cursor.setUTCMonth(cursor.getUTCMonth() + 1)
    if (buckets.size > days + 12) break
  }
  return buckets
}

function bucketKey(date: Date, granularity: Granularity): string {
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  if (granularity === 'month') return `${y}-${m}`
  if (granularity === 'week') {
    // ISO week start (Monday) in UTC
    const tmp = new Date(Date.UTC(y, date.getUTCMonth(), date.getUTCDate()))
    const day = tmp.getUTCDay() || 7
    tmp.setUTCDate(tmp.getUTCDate() - day + 1)
    return `${tmp.getUTCFullYear()}-${String(tmp.getUTCMonth() + 1).padStart(2, '0')}-${String(tmp.getUTCDate()).padStart(2, '0')}`
  }
  return `${y}-${m}-${d}`
}

function fillSeries(
  rows: { createdAt: Date }[],
  start: Date,
  days: number,
  granularity: Granularity,
): TimeBucket[] {
  const buckets = bucketsFor(start, days, granularity)
  for (const row of rows) {
    const key = bucketKey(row.createdAt, granularity)
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }))
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
    const rangeKey = searchParams.get('range') ?? '30d'
    const days = RANGE_DAYS[rangeKey] ?? 30
    const granularity: Granularity =
      days <= 14 ? 'day' : days <= 120 ? 'day' : 'week'

    const start = new Date()
    start.setUTCHours(0, 0, 0, 0)
    start.setUTCDate(start.getUTCDate() - (days - 1))

    const [
      registrations,
      subscribersAnon,
      subscribersUsers,
      pageViewRows,
      topPages,
    ] = await Promise.all([
      prisma.user.findMany({
        where: { createdAt: { gte: start } },
        select: { createdAt: true },
      }),
      prisma.subscriber.findMany({
        where: {
          confirmedAt: { gte: start, not: null },
          unsubscribedAt: null,
        },
        select: { confirmedAt: true },
      }),
      prisma.user.findMany({
        where: {
          newsletterSubscribed: true,
          newsletterConfirmedAt: { gte: start, not: null },
        },
        select: { newsletterConfirmedAt: true },
      }),
      prisma.pageView.findMany({
        where: { createdAt: { gte: start } },
        select: { createdAt: true },
      }),
      prisma.pageView.groupBy({
        by: ['path'],
        where: { createdAt: { gte: start } },
        _count: { path: true },
        orderBy: { _count: { path: 'desc' } },
        take: 20,
      }),
    ])

    const registrationsSeries = fillSeries(
      registrations,
      start,
      days,
      granularity,
    )

    const subscriberRows = [
      ...subscribersAnon
        .filter((s) => s.confirmedAt !== null)
        .map((s) => ({ createdAt: s.confirmedAt as Date })),
      ...subscribersUsers
        .filter((u) => u.newsletterConfirmedAt !== null)
        .map((u) => ({ createdAt: u.newsletterConfirmedAt as Date })),
    ]
    const subscribersSeries = fillSeries(
      subscriberRows,
      start,
      days,
      granularity,
    )

    const pageViewsSeries = fillSeries(
      pageViewRows,
      start,
      days,
      granularity,
    )

    const totals = {
      registrations: registrations.length,
      subscribers: subscriberRows.length,
      pageViews: pageViewRows.length,
    }

    return NextResponse.json({
      range: rangeKey,
      granularity,
      totals,
      pageViews: pageViewsSeries,
      registrations: registrationsSeries,
      subscribers: subscribersSeries,
      topPages: topPages.map((p) => ({
        path: p.path,
        count: p._count.path,
      })),
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
