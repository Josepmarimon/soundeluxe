import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { prisma } from '@/lib/prisma'
import { APP_URL } from '@/lib/resend'

// GET /api/booking/[id]/qr-image?locale=ca
// Endpoint públic que retorna el QR com a PNG perquè els clients de correu
// (Gmail, Outlook, etc.) puguin carregar-lo. Els clients no carreguen data:URL.
// Seguretat: el booking ID és un cuid no enumerable (mateixa pràctica que el ticket).
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const url = new URL(request.url)
  const locale = url.searchParams.get('locale') || 'ca'

  const reserva = await prisma.reserva.findUnique({
    where: { id },
    select: { id: true, status: true },
  })

  if (!reserva || reserva.status !== 'CONFIRMED') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const checkinUrl = `${APP_URL}/${locale}/admin/checkin/${reserva.id}`

  const buffer = await QRCode.toBuffer(checkinUrl, {
    width: 400,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
    errorCorrectionLevel: 'M',
  })

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
