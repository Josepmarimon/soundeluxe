import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface QrPlace {
  placeNumber: number
  qrUrl: string
}

interface BookingConfirmationProps {
  name: string
  language: 'CA' | 'ES' | 'EN'
  albumTitle: string
  albumArtist: string
  sessionDate: string
  venueName: string
  venueAddress: string
  numPlaces: number
  totalAmount: string
  bookingId: string
  // Llista de QRs (un per plaça). Buit/undefined → sense QR (regal al comprador).
  qrPlaces?: QrPlace[]
  invoiceNumber?: string
  // Si és true, oculta els QRs i mostra missatge "has regalat aquesta entrada"
  isGiftPurchaser?: boolean
  recipientName?: string
  // Si present, afegeix CTA per establir contrasenya (lazy registration)
  passwordSetupUrl?: string
}

const translations = {
  CA: {
    preview: 'La teva reserva a Sound Deluxe ha estat confirmada',
    title: 'Reserva confirmada!',
    greeting: (name: string) => `Hola ${name}!`,
    message: 'La teva reserva ha estat confirmada correctament. Aquí tens els detalls:',
    giftMessage: (recipient: string) =>
      `Has regalat aquesta entrada a ${recipient}. Rebrà el seu propi correu amb el codi QR.`,
    album: 'Àlbum',
    artist: 'Artista',
    date: 'Data i hora',
    venue: 'Lloc',
    places: 'Places',
    total: 'Total pagat',
    reference: 'Referència',
    vatNote: 'IVA inclòs',
    cancellation: 'Política de cancel·lació: cancel·lació gratuïta fins 48h abans de la sessió.',
    qrTitle: 'Els teus codis QR',
    qrNote: 'Cada plaça té el seu QR. Cadascú s\'ha de presentar amb el seu QR a l\'entrada.',
    qrPlaceLabel: (n: number, total: number) => `Plaça ${n} de ${total}`,
    button: 'Veure les meves reserves',
    downloadTicket: 'Descarregar entrada / factura',
    invoiceNote: 'Factura simplificada',
    footer: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
    setPasswordTitle: 'Crea una contrasenya',
    setPasswordBody: 'Has comprat com a convidat. Crea una contrasenya per accedir a totes les teves entrades des del teu perfil.',
    setPasswordCta: 'Crear contrasenya',
  },
  ES: {
    preview: 'Tu reserva en Sound Deluxe ha sido confirmada',
    title: '¡Reserva confirmada!',
    greeting: (name: string) => `¡Hola ${name}!`,
    message: 'Tu reserva ha sido confirmada correctamente. Aquí tienes los detalles:',
    giftMessage: (recipient: string) =>
      `Has regalado esta entrada a ${recipient}. Recibirá su propio correo con el código QR.`,
    album: 'Álbum',
    artist: 'Artista',
    date: 'Fecha y hora',
    venue: 'Lugar',
    places: 'Plazas',
    total: 'Total pagado',
    reference: 'Referencia',
    vatNote: 'IVA incluido',
    cancellation: 'Política de cancelación: cancelación gratuita hasta 48h antes de la sesión.',
    qrTitle: 'Tus códigos QR',
    qrNote: 'Cada plaza tiene su QR. Cada persona debe presentarse con el suyo en la entrada.',
    qrPlaceLabel: (n: number, total: number) => `Plaza ${n} de ${total}`,
    button: 'Ver mis reservas',
    downloadTicket: 'Descargar entrada / factura',
    invoiceNote: 'Factura simplificada',
    footer: 'Sound Deluxe - Experiencias audiófilas de alta fidelidad',
    setPasswordTitle: 'Crea una contraseña',
    setPasswordBody: 'Has comprado como invitado. Crea una contraseña para acceder a todas tus entradas desde tu perfil.',
    setPasswordCta: 'Crear contraseña',
  },
  EN: {
    preview: 'Your Sound Deluxe booking has been confirmed',
    title: 'Booking confirmed!',
    greeting: (name: string) => `Hello ${name}!`,
    message: 'Your booking has been confirmed successfully. Here are the details:',
    giftMessage: (recipient: string) =>
      `You have gifted this ticket to ${recipient}. They will receive their own email with the QR code.`,
    album: 'Album',
    artist: 'Artist',
    date: 'Date & time',
    venue: 'Venue',
    places: 'Places',
    total: 'Total paid',
    reference: 'Reference',
    vatNote: 'VAT included',
    cancellation: 'Cancellation policy: free cancellation up to 48h before the session.',
    qrTitle: 'Your QR codes',
    qrNote: 'Each spot has its own QR. Every attendee must present their own QR at the entrance.',
    qrPlaceLabel: (n: number, total: number) => `Spot ${n} of ${total}`,
    button: 'View my bookings',
    downloadTicket: 'Download ticket / invoice',
    invoiceNote: 'Simplified invoice',
    footer: 'Sound Deluxe - High-fidelity audiophile experiences',
    setPasswordTitle: 'Create a password',
    setPasswordBody: 'You purchased as a guest. Create a password to access all your tickets from your profile.',
    setPasswordCta: 'Create password',
  },
}

export default function BookingConfirmation({
  name,
  language = 'CA',
  albumTitle,
  albumArtist,
  sessionDate,
  venueName,
  venueAddress,
  numPlaces,
  totalAmount,
  bookingId,
  qrPlaces,
  invoiceNumber,
  isGiftPurchaser = false,
  recipientName,
  passwordSetupUrl,
}: BookingConfirmationProps) {
  const t = translations[language]
  const lang = language.toLowerCase()
  const appOrigin = process.env.NEXT_PUBLIC_APP_URL || 'https://www.soundeluxe.es'
  const profileUrl = `${appOrigin}/${lang}/profile`
  const ticketUrl = `${appOrigin}/${lang}/ticket/${bookingId}`
  const showQrs = !isGiftPurchaser && qrPlaces && qrPlaces.length > 0
  const showTicketButton = !isGiftPurchaser

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img
              src={`${appOrigin}/logo-gold.png`}
              alt="Sound Deluxe"
              height="40"
              style={logoImage}
            />
          </Section>

          <Heading style={heading}>{t.title}</Heading>

          <Text style={paragraph}>{t.greeting(name)}</Text>

          <Text style={paragraph}>{t.message}</Text>

          {isGiftPurchaser && recipientName && (
            <Section style={giftNoticeBox}>
              <Text style={giftNoticeText}>{t.giftMessage(recipientName)}</Text>
            </Section>
          )}

          {/* Booking details card */}
          <Section style={detailsCard}>
            <Text style={detailRow}>
              <span style={detailLabel}>{t.album}</span>
              <span style={detailValue}>{albumTitle}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>{t.artist}</span>
              <span style={detailValue}>{albumArtist}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>{t.date}</span>
              <span style={detailValue}>{sessionDate}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>{t.venue}</span>
              <span style={detailValue}>{venueName}</span>
            </Text>
            <Text style={detailRowSmall}>
              <span style={detailValue}>{venueAddress}</span>
            </Text>
            <Text style={detailRow}>
              <span style={detailLabel}>{t.places}</span>
              <span style={detailValue}>{numPlaces}</span>
            </Text>
            <Hr style={hrCard} />
            <Text style={detailRowTotal}>
              <span style={detailLabel}>{t.total}</span>
              <span style={totalValue}>{totalAmount}€</span>
            </Text>
            <Text style={vatText}>{t.vatNote}</Text>
          </Section>

          <Text style={referenceText}>
            {t.reference}: {bookingId}
            {invoiceNumber && (
              <> · {t.invoiceNote}: {invoiceNumber}</>
            )}
          </Text>

          {/* QR Codes — un per plaça */}
          {showQrs && (
            <Section style={qrSection}>
              <Text style={qrTitle}>{t.qrTitle}</Text>
              {qrPlaces!.map((place) => (
                <div key={place.placeNumber} style={qrPlaceWrapper}>
                  <Text style={qrPlaceLabel}>
                    {t.qrPlaceLabel(place.placeNumber, qrPlaces!.length)}
                  </Text>
                  <Img
                    src={place.qrUrl}
                    width="200"
                    height="200"
                    alt={`QR ${place.placeNumber}/${qrPlaces!.length}`}
                    style={qrImage}
                  />
                </div>
              ))}
              <Text style={qrNote}>{t.qrNote}</Text>
            </Section>
          )}

          {showTicketButton && (
            <Section style={buttonSection}>
              <Button style={button} href={ticketUrl}>
                {t.downloadTicket}
              </Button>
            </Section>
          )}

          <Section style={secondaryButtonSection}>
            <Button style={secondaryButton} href={profileUrl}>
              {t.button}
            </Button>
          </Section>

          {passwordSetupUrl && (
            <Section style={setPasswordSection}>
              <Text style={setPasswordTitle}>{t.setPasswordTitle}</Text>
              <Text style={setPasswordBody}>{t.setPasswordBody}</Text>
              <Button style={button} href={passwordSetupUrl}>
                {t.setPasswordCta}
              </Button>
            </Section>
          )}

          <Text style={cancellationText}>{t.cancellation}</Text>

          <Hr style={hr} />

          <Text style={footerBrand}>{t.footer}</Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
}

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
}

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold' as const,
  color: '#D4AF37',
  letterSpacing: '4px',
  margin: '0',
}

const logoImage = {
  margin: '0 auto',
  height: '40px',
  width: 'auto' as const,
}

const heading = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const paragraph = {
  color: '#d4d4d4',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 16px',
}

const detailsCard = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  border: '1px solid #262626',
  padding: '24px',
  margin: '24px 0',
}

const detailRow = {
  color: '#d4d4d4',
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 8px',
}

const detailRowSmall = {
  color: '#a3a3a3',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '-4px 0 8px',
  paddingLeft: '0',
}

const detailRowTotal = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  lineHeight: '24px',
  margin: '0 0 4px',
}

const detailLabel = {
  color: '#737373',
  marginRight: '8px',
}

const detailValue = {
  color: '#d4d4d4',
}

const totalValue = {
  color: '#D4AF37',
  fontSize: '18px',
  fontWeight: 'bold' as const,
}

const vatText = {
  color: '#737373',
  fontSize: '12px',
  margin: '0',
}

const hrCard = {
  borderColor: '#333333',
  margin: '12px 0',
}

const referenceText = {
  color: '#737373',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  fontFamily: 'monospace',
}

const buttonSection = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#D4AF37',
  borderRadius: '9999px',
  color: '#000000',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 32px',
}

const qrSection = {
  textAlign: 'center' as const,
  margin: '24px 0',
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
}

const qrTitle = {
  color: '#0a1929',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  margin: '0 0 16px',
  textAlign: 'center' as const,
}

const qrImage = {
  margin: '0 auto',
  borderRadius: '8px',
}

const qrPlaceWrapper = {
  margin: '0 0 24px',
  paddingBottom: '16px',
  borderBottom: '1px dashed #e5e5e5',
}

const qrPlaceLabel = {
  color: '#0a1929',
  fontSize: '13px',
  fontWeight: 'bold' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '1px',
  margin: '0 0 8px',
  textAlign: 'center' as const,
}

const qrNote = {
  color: '#737373',
  fontSize: '13px',
  margin: '12px 0 0',
  textAlign: 'center' as const,
}

const cancellationText = {
  color: '#a3a3a3',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  fontStyle: 'italic' as const,
}

const hr = {
  borderColor: '#262626',
  margin: '24px 0',
}

const secondaryButtonSection = {
  textAlign: 'center' as const,
  margin: '0 0 32px',
}

const secondaryButton = {
  backgroundColor: 'transparent',
  borderRadius: '9999px',
  border: '1px solid #525252',
  color: '#d4d4d4',
  fontSize: '14px',
  fontWeight: 'normal' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '10px 24px',
}

const footerBrand = {
  color: '#525252',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
}

const giftNoticeBox = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #D4AF37',
  borderRadius: '12px',
  padding: '16px 20px',
  margin: '0 0 16px',
}

const giftNoticeText = {
  color: '#D4AF37',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0',
  textAlign: 'center' as const,
}

const setPasswordSection = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  border: '1px solid #262626',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const setPasswordTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold' as const,
  margin: '0 0 8px',
}

const setPasswordBody = {
  color: '#a3a3a3',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 16px',
}
