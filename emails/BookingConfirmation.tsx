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
  qrDataUrl?: string
  invoiceNumber?: string
}

const translations = {
  CA: {
    preview: 'La teva reserva a Sound Deluxe ha estat confirmada',
    title: 'Reserva confirmada!',
    greeting: (name: string) => `Hola ${name}!`,
    message: 'La teva reserva ha estat confirmada correctament. Aquí tens els detalls:',
    album: 'Àlbum',
    artist: 'Artista',
    date: 'Data i hora',
    venue: 'Lloc',
    places: 'Places',
    total: 'Total pagat',
    reference: 'Referència',
    vatNote: 'IVA inclòs',
    cancellation: 'Política de cancel·lació: cancel·lació gratuïta fins 48h abans de la sessió.',
    qrTitle: 'El teu codi QR d\'entrada',
    qrNote: 'Mostra aquest codi a l\'entrada de la sessió',
    button: 'Veure les meves reserves',
    downloadTicket: 'Descarregar entrada / factura',
    invoiceNote: 'Factura simplificada',
    footer: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
  },
  ES: {
    preview: 'Tu reserva en Sound Deluxe ha sido confirmada',
    title: '¡Reserva confirmada!',
    greeting: (name: string) => `¡Hola ${name}!`,
    message: 'Tu reserva ha sido confirmada correctamente. Aquí tienes los detalles:',
    album: 'Álbum',
    artist: 'Artista',
    date: 'Fecha y hora',
    venue: 'Lugar',
    places: 'Plazas',
    total: 'Total pagado',
    reference: 'Referencia',
    vatNote: 'IVA incluido',
    cancellation: 'Política de cancelación: cancelación gratuita hasta 48h antes de la sesión.',
    qrTitle: 'Tu código QR de entrada',
    qrNote: 'Muestra este código en la entrada de la sesión',
    button: 'Ver mis reservas',
    downloadTicket: 'Descargar entrada / factura',
    invoiceNote: 'Factura simplificada',
    footer: 'Sound Deluxe - Experiencias audiófilas de alta fidelidad',
  },
  EN: {
    preview: 'Your Sound Deluxe booking has been confirmed',
    title: 'Booking confirmed!',
    greeting: (name: string) => `Hello ${name}!`,
    message: 'Your booking has been confirmed successfully. Here are the details:',
    album: 'Album',
    artist: 'Artist',
    date: 'Date & time',
    venue: 'Venue',
    places: 'Places',
    total: 'Total paid',
    reference: 'Reference',
    vatNote: 'VAT included',
    cancellation: 'Cancellation policy: free cancellation up to 48h before the session.',
    qrTitle: 'Your entry QR code',
    qrNote: 'Show this code at the session entrance',
    button: 'View my bookings',
    downloadTicket: 'Download ticket / invoice',
    invoiceNote: 'Simplified invoice',
    footer: 'Sound Deluxe - High-fidelity audiophile experiences',
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
  qrDataUrl,
  invoiceNumber,
}: BookingConfirmationProps) {
  const t = translations[language]
  const lang = language.toLowerCase()
  const profileUrl = `https://soundeluxe.es/${lang}/profile`
  const ticketUrl = `https://soundeluxe.es/${lang}/ticket/${bookingId}`

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Text style={logoText}>SOUND DELUXE</Text>
          </Section>

          <Heading style={heading}>{t.title}</Heading>

          <Text style={paragraph}>{t.greeting(name)}</Text>

          <Text style={paragraph}>{t.message}</Text>

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

          {/* QR Code */}
          {qrDataUrl && (
            <Section style={qrSection}>
              <Text style={qrTitle}>{t.qrTitle}</Text>
              <Img
                src={qrDataUrl}
                width="200"
                height="200"
                alt="QR Code"
                style={qrImage}
              />
              <Text style={qrNote}>{t.qrNote}</Text>
            </Section>
          )}

          <Section style={buttonSection}>
            <Button style={button} href={ticketUrl}>
              {t.downloadTicket}
            </Button>
          </Section>

          <Section style={secondaryButtonSection}>
            <Button style={secondaryButton} href={profileUrl}>
              {t.button}
            </Button>
          </Section>

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
