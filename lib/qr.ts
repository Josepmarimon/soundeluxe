import QRCode from 'qrcode'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://soundeluxe.vercel.app'

export async function generateQRDataURL(
  bookingId: string,
  locale: string = 'ca'
): Promise<string> {
  const checkinUrl = `${APP_URL}/${locale}/admin/checkin/${bookingId}`

  return QRCode.toDataURL(checkinUrl, {
    width: 300,
    margin: 2,
    color: {
      dark: '#0a1929',
      light: '#FFFFFF',
    },
    errorCorrectionLevel: 'M',
  })
}
