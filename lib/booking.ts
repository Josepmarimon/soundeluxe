import { prisma } from '@/lib/prisma'

export async function getAvailablePlaces(
  sessionId: string,
  totalPlaces: number
): Promise<number> {
  const result = await prisma.reserva.aggregate({
    where: {
      sessionId,
      status: 'CONFIRMED',
    },
    _sum: {
      numPlaces: true,
    },
  })

  const bookedPlaces = result._sum.numPlaces || 0
  return Math.max(0, totalPlaces - bookedPlaces)
}

export async function getBatchAvailability(
  sessions: { _id: string; totalPlaces: number }[]
): Promise<Record<string, number>> {
  const sessionIds = sessions.map((s) => s._id)

  const results = await prisma.reserva.groupBy({
    by: ['sessionId'],
    where: {
      sessionId: { in: sessionIds },
      status: 'CONFIRMED',
    },
    _sum: {
      numPlaces: true,
    },
  })

  const bookedMap: Record<string, number> = {}
  for (const r of results) {
    bookedMap[r.sessionId] = r._sum.numPlaces || 0
  }

  const availability: Record<string, number> = {}
  for (const s of sessions) {
    const booked = bookedMap[s._id] || 0
    availability[s._id] = Math.max(0, s.totalPlaces - booked)
  }

  return availability
}
