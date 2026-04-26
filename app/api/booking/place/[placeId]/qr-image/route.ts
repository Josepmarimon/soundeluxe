import { NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { prisma } from '@/lib/prisma'
import { APP_URL } from '@/lib/resend'

// GET /api/booking/place/[placeId]/qr-image?locale=ca
// Retorna el PNG del QR per a una plaça concreta. Públic.
// El QR codifica una URL d'admin checkin per plaça.
export async function GET(
  request: Request,
  { params }: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await params
  const url = new URL(request.url)
  const locale = url.searchParams.get('locale') || 'ca'

  const place = await prisma.reservaPlace.findUnique({
    where: { id: placeId },
    select: {
      id: true,
      reserva: { select: { status: true } },
    },
  })

  if (!place || place.reserva.status !== 'CONFIRMED') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const checkinUrl = `${APP_URL}/${locale}/admin/checkin/place/${place.id}`

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
