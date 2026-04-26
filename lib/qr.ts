import QRCode from 'qrcode'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://soundeluxe.vercel.app'

const QR_OPTIONS = {
  width: 300,
  margin: 2,
  color: { dark: '#000000', light: '#FFFFFF' },
  errorCorrectionLevel: 'M' as const,
}

export async function generateQRDataURL(
  bookingId: string,
  locale: string = 'ca'
): Promise<string> {
  const checkinUrl = `${APP_URL}/${locale}/admin/checkin/${bookingId}`
  return QRCode.toDataURL(checkinUrl, QR_OPTIONS)
}

export async function generatePlaceQRDataURL(
  placeId: string,
  locale: string = 'ca'
): Promise<string> {
  const checkinUrl = `${APP_URL}/${locale}/admin/checkin/place/${placeId}`
  return QRCode.toDataURL(checkinUrl, QR_OPTIONS)
}
