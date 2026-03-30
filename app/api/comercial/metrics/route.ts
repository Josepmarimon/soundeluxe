import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import type { CommercialMetrics } from '@/lib/types/commercial'

export async function GET() {
  try {
    const now = new Date()
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch Prisma metrics in parallel
    const [
      totalUsers,
      totalReservas,
      totalRessenyes,
      avgRatingResult,
      usersThisMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.reserva.count({ where: { status: 'CONFIRMED' } }),
      prisma.ressenya.count({ where: { isPublic: true } }),
      prisma.ressenya.aggregate({ _avg: { rating: true }, where: { isPublic: true } }),
      prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    ])

    // Fetch Sanity metrics (sessions and albums)
    const [totalSessions, totalAlbums] = await Promise.all([
      client.fetch<number>(`count(*[_type == "session"])`).catch(() => 0),
      client.fetch<number>(`count(*[_type == "album"])`).catch(() => 0),
    ])

    const metrics: CommercialMetrics = {
      platform: {
        totalUsers,
        totalSessions,
        totalReservas,
        totalAlbums,
        totalRessenyes,
        avgRating: avgRatingResult._avg.rating || 0,
        usersThisMonth,
      },
      hardcoded: {
        instagram: {
          followers: 850,
        },
      },
      timestamp: now.toISOString(),
    }

    return NextResponse.json(metrics)
  } catch (error) {
    console.error('Error fetching commercial metrics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
