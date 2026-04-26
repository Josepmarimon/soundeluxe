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

interface GiftReceivedProps {
  recipientName: string
  buyerName: string
  language: 'CA' | 'ES' | 'EN'
  albumTitle: string
  albumArtist: string
  sessionDate: string
  venueName: string
  venueAddress: string
  numPlaces: number
  bookingId: string
  qrPlaces?: QrPlace[]
  giftMessage?: string
}

const translations = {
  CA: {
    preview: 'Tens una entrada de regal a Sound Deluxe',
    title: 'T\'han fet un regal!',
    greeting: (name: string) => `Hola ${name}!`,
    intro: (buyer: string) =>
      `${buyer} t'ha regalat una entrada per a una experiència audiòfila a Sound Deluxe.`,
    messageTitle: 'Missatge del remitent',
    album: 'Àlbum',
    artist: 'Artista',
    date: 'Data i hora',
    venue: 'Lloc',
    places: 'Places',
    reference: 'Referència',
    qrTitle: 'Els teus codis QR',
    qrNote: 'Cada plaça té el seu QR. Cadascú s\'ha de presentar amb el seu QR a l\'entrada.',
    qrPlaceLabel: (n: number, total: number) => `Plaça ${n} de ${total}`,
    button: 'Veure entrada',
    cancellation: 'Si no pots assistir, contacta amb la persona que t\'ha fet el regal.',
    footer: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
  },
  ES: {
    preview: 'Tienes una entrada de regalo en Sound Deluxe',
    title: '¡Te han hecho un regalo!',
    greeting: (name: string) => `¡Hola ${name}!`,
    intro: (buyer: string) =>
      `${buyer} te ha regalado una entrada para una experiencia audiófila en Sound Deluxe.`,
    messageTitle: 'Mensaje del remitente',
    album: 'Álbum',
    artist: 'Artista',
    date: 'Fecha y hora',
    venue: 'Lugar',
    places: 'Plazas',
    reference: 'Referencia',
    qrTitle: 'Tus códigos QR',
    qrNote: 'Cada plaza tiene su QR. Cada persona debe presentarse con el suyo en la entrada.',
    qrPlaceLabel: (n: number, total: number) => `Plaza ${n} de ${total}`,
    button: 'Ver entrada',
    cancellation: 'Si no puedes asistir, contacta con la persona que te ha hecho el regalo.',
    footer: 'Sound Deluxe - Experiencias audiófilas de alta fidelidad',
  },
  EN: {
    preview: 'You have received a gift ticket from Sound Deluxe',
    title: 'You\'ve received a gift!',
    greeting: (name: string) => `Hello ${name}!`,
    intro: (buyer: string) =>
      `${buyer} has gifted you a ticket to a high-fidelity audiophile experience at Sound Deluxe.`,
    messageTitle: 'Message from sender',
    album: 'Album',
    artist: 'Artist',
    date: 'Date & time',
    venue: 'Venue',
    places: 'Places',
    reference: 'Reference',
    qrTitle: 'Your QR codes',
    qrNote: 'Each spot has its own QR. Every attendee must present their own QR at the entrance.',
    qrPlaceLabel: (n: number, total: number) => `Spot ${n} of ${total}`,
    button: 'View ticket',
    cancellation: 'If you cannot attend, please contact the person who gave you this gift.',
    footer: 'Sound Deluxe - High-fidelity audiophile experiences',
  },
}

export default function GiftReceived({
  recipientName,
  buyerName,
  language = 'CA',
  albumTitle,
  albumArtist,
  sessionDate,
  venueName,
  venueAddress,
  numPlaces,
  bookingId,
  qrPlaces,
  giftMessage,
}: GiftReceivedProps) {
  const t = translations[language]
  const lang = language.toLowerCase()
  const ticketUrl = `https://soundeluxe.es/${lang}/ticket/${bookingId}`

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoSection}>
            <Text style={logoText}>SOUND DELUXE</Text>
          </Section>

          <Heading style={heading}>{t.title}</Heading>

          <Text style={paragraph}>{t.greeting(recipientName)}</Text>
          <Text style={paragraph}>{t.intro(buyerName)}</Text>

          {giftMessage && (
            <Section style={messageBox}>
              <Text style={messageLabel}>{t.messageTitle}</Text>
              <Text style={messageText}>{giftMessage}</Text>
            </Section>
          )}

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
          </Section>

          <Text style={referenceText}>{t.reference}: {bookingId}</Text>

          {qrPlaces && qrPlaces.length > 0 && (
            <Section style={qrSection}>
              <Text style={qrTitle}>{t.qrTitle}</Text>
              {qrPlaces.map((place) => (
                <div key={place.placeNumber} style={qrPlaceWrapper}>
                  <Text style={qrPlaceLabel}>
                    {t.qrPlaceLabel(place.placeNumber, qrPlaces.length)}
                  </Text>
                  <Img
                    src={place.qrUrl}
                    width="200"
                    height="200"
                    alt={`QR ${place.placeNumber}/${qrPlaces.length}`}
                    style={qrImage}
                  />
                </div>
              ))}
              <Text style={qrNote}>{t.qrNote}</Text>
            </Section>
          )}

          <Section style={buttonSection}>
            <Button style={button} href={ticketUrl}>
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

const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif',
}
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px' }
const logoSection = { textAlign: 'center' as const, marginBottom: '32px' }
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
const messageBox = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #D4AF37',
  borderRadius: '12px',
  padding: '20px 24px',
  margin: '16px 0 24px',
}
const messageLabel = {
  color: '#D4AF37',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
}
const messageText = {
  color: '#ffffff',
  fontSize: '15px',
  fontStyle: 'italic' as const,
  lineHeight: '24px',
  margin: '0',
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
}
const detailLabel = { color: '#737373', marginRight: '8px' }
const detailValue = { color: '#d4d4d4' }
const referenceText = {
  color: '#737373',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  fontFamily: 'monospace',
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
const qrImage = { margin: '0 auto', borderRadius: '8px' }
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
const buttonSection = { textAlign: 'center' as const, margin: '32px 0' }
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
const cancellationText = {
  color: '#a3a3a3',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
  fontStyle: 'italic' as const,
}
const hr = { borderColor: '#262626', margin: '24px 0' }
const footerBrand = {
  color: '#525252',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
}
