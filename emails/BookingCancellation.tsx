import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface BookingCancellationProps {
  name: string
  language: 'CA' | 'ES' | 'EN'
  albumTitle: string
  albumArtist: string
  sessionDate: string
  venueName: string
  numPlaces: number
  refundAmount: string
  bookingId: string
  invoiceNumber?: string
}

const translations = {
  CA: {
    preview: 'La teva reserva a Sound Deluxe ha estat cancel·lada',
    title: 'Reserva cancel·lada',
    greeting: (name: string) => `Hola ${name},`,
    message: 'La teva reserva ha estat cancel·lada correctament. El reemborsament s\'ha iniciat.',
    album: 'Àlbum',
    artist: 'Artista',
    date: 'Data i hora',
    venue: 'Lloc',
    places: 'Places',
    refund: 'Import reemborsat',
    reference: 'Referència',
    refundNote: 'El reemborsament pot trigar entre 5 i 10 dies laborables en aparèixer al teu compte, depenent del teu banc.',
    button: 'Veure les meves reserves',
    newBooking: 'Reservar una altra sessió',
    invoiceNote: 'Factura simplificada',
    footer: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
  },
  ES: {
    preview: 'Tu reserva en Sound Deluxe ha sido cancelada',
    title: 'Reserva cancelada',
    greeting: (name: string) => `Hola ${name},`,
    message: 'Tu reserva ha sido cancelada correctamente. El reembolso se ha iniciado.',
    album: 'Álbum',
    artist: 'Artista',
    date: 'Fecha y hora',
    venue: 'Lugar',
    places: 'Plazas',
    refund: 'Importe reembolsado',
    reference: 'Referencia',
    refundNote: 'El reembolso puede tardar entre 5 y 10 días laborables en aparecer en tu cuenta, dependiendo de tu banco.',
    button: 'Ver mis reservas',
    newBooking: 'Reservar otra sesión',
    invoiceNote: 'Factura simplificada',
    footer: 'Sound Deluxe - Experiencias audiófilas de alta fidelidad',
  },
  EN: {
    preview: 'Your Sound Deluxe booking has been cancelled',
    title: 'Booking cancelled',
    greeting: (name: string) => `Hello ${name},`,
    message: 'Your booking has been cancelled successfully. The refund has been initiated.',
    album: 'Album',
    artist: 'Artist',
    date: 'Date & time',
    venue: 'Venue',
    places: 'Places',
    refund: 'Refund amount',
    reference: 'Reference',
    refundNote: 'The refund may take 5 to 10 business days to appear in your account, depending on your bank.',
    button: 'View my bookings',
    newBooking: 'Book another session',
    invoiceNote: 'Simplified invoice',
    footer: 'Sound Deluxe - High-fidelity audiophile experiences',
  },
}

export default function BookingCancellation({
  name,
  language = 'CA',
  albumTitle,
  albumArtist,
  sessionDate,
  venueName,
  numPlaces,
  refundAmount,
  bookingId,
  invoiceNumber,
}: BookingCancellationProps) {
  const t = translations[language]
  const lang = language.toLowerCase()
  const profileUrl = `https://soundeluxe.es/${lang}/profile`
  const sessionsUrl = `https://soundeluxe.es/${lang}/sessions`

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
            <Text style={detailRow}>
              <span style={detailLabel}>{t.places}</span>
              <span style={detailValue}>{numPlaces}</span>
            </Text>
            <Hr style={hrCard} />
            <Text style={detailRowTotal}>
              <span style={detailLabel}>{t.refund}</span>
              <span style={refundValue}>{refundAmount}</span>
            </Text>
          </Section>

          <Text style={referenceText}>
            {t.reference}: {bookingId}
            {invoiceNumber && (
              <> · {t.invoiceNote}: {invoiceNumber}</>
            )}
          </Text>

          <Text style={refundNote}>{t.refundNote}</Text>

          <Section style={buttonSection}>
            <Button style={button} href={sessionsUrl}>
              {t.newBooking}
            </Button>
          </Section>

          <Section style={secondaryButtonSection}>
            <Button style={secondaryButton} href={profileUrl}>
              {t.button}
            </Button>
          </Section>

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

const refundValue = {
  color: '#D4AF37',
  fontSize: '18px',
  fontWeight: 'bold' as const,
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

const refundNote = {
  color: '#a3a3a3',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  fontStyle: 'italic' as const,
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

const hr = {
  borderColor: '#262626',
  margin: '24px 0',
}

const footerBrand = {
  color: '#525252',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
}
