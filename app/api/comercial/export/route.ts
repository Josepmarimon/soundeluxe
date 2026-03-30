import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as { id: string }).id },
      select: { role: true },
    })

    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const links = await prisma.commercialLink.findMany({
      where: { deletedAt: null },
      include: { visits: { orderBy: { visitedAt: 'desc' } } },
      orderBy: { createdAt: 'desc' },
    })

    const headers = [
      'ID', 'Token', 'Email', 'Nom', 'Empresa', 'Estat',
      'Primera Obertura', 'Última Obertura', 'Total Obertures',
      'Temps Mitjà (seg)', 'Scroll Mitjà (%)', 'Països',
      'Dispositius', 'Data Creació', 'Notes',
    ]

    const rows = links.map((link) => {
      const visits = link.visits
      const avgTime = visits.length > 0
        ? visits.reduce((sum, v) => sum + (v.timeOnPageSeconds || 0), 0) / visits.length
        : 0
      const avgScroll = visits.length > 0
        ? visits.reduce((sum, v) => sum + (v.scrollDepthPercent || 0), 0) / visits.length
        : 0
      const countries = [...new Set(visits.map((v) => v.country).filter(Boolean))].join(', ')
      const devices = [...new Set(visits.map((v) => v.deviceType).filter(Boolean))].join(', ')

      return [
        link.id, link.token, link.recipientEmail, link.recipientName,
        link.recipientCompany || '', link.status,
        link.firstOpenedAt?.toISOString() || '', link.lastOpenedAt?.toISOString() || '',
        link.openCount.toString(), avgTime.toFixed(1), avgScroll.toFixed(1),
        countries, devices, link.createdAt.toISOString(),
        (link.notes || '').replace(/"/g, '""'),
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const bom = '\uFEFF'
    return new NextResponse(bom + csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="enllacos-comercials-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Error in export:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
