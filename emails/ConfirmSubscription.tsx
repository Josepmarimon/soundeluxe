import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ConfirmSubscriptionEmailProps {
  confirmUrl: string
  language: 'CA' | 'ES' | 'EN'
}

const translations = {
  CA: {
    preview: 'Confirma la teva subscripció al butlletí de Sound Deluxe',
    title: 'Confirma la teva subscripció',
    greeting: 'Gràcies per subscriure\'t!',
    message: 'Clica el botó per confirmar la teva subscripció al butlletí de Sound Deluxe. Rebràs informació sobre noves sessions i novetats exclusives.',
    button: 'Confirmar subscripció',
    expires: 'Aquest enllaç caduca en 24 hores.',
    ignore: 'Si no has sol·licitat aquesta subscripció, pots ignorar aquest correu.',
    footer: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
    unsubscribe: 'Pots donar-te de baixa en qualsevol moment.',
  },
  ES: {
    preview: 'Confirma tu suscripción al boletín de Sound Deluxe',
    title: 'Confirma tu suscripción',
    greeting: '¡Gracias por suscribirte!',
    message: 'Haz clic en el botón para confirmar tu suscripción al boletín de Sound Deluxe. Recibirás información sobre nuevas sesiones y novedades exclusivas.',
    button: 'Confirmar suscripción',
    expires: 'Este enlace caduca en 24 horas.',
    ignore: 'Si no has solicitado esta suscripción, puedes ignorar este correo.',
    footer: 'Sound Deluxe - Experiencias audiófilas de alta fidelidad',
    unsubscribe: 'Puedes darte de baja en cualquier momento.',
  },
  EN: {
    preview: 'Confirm your Sound Deluxe newsletter subscription',
    title: 'Confirm your subscription',
    greeting: 'Thanks for subscribing!',
    message: 'Click the button below to confirm your Sound Deluxe newsletter subscription. You\'ll receive information about new sessions and exclusive updates.',
    button: 'Confirm subscription',
    expires: 'This link expires in 24 hours.',
    ignore: 'If you did not request this subscription, you can ignore this email.',
    footer: 'Sound Deluxe - High-fidelity audiophile experiences',
    unsubscribe: 'You can unsubscribe at any time.',
  },
}

export default function ConfirmSubscriptionEmail({
  confirmUrl,
  language = 'CA',
}: ConfirmSubscriptionEmailProps) {
  const t = translations[language]

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

          <Text style={paragraph}>{t.greeting}</Text>

          <Text style={paragraph}>{t.message}</Text>

          <Section style={buttonSection}>
            <Button style={button} href={confirmUrl}>
              {t.button}
            </Button>
          </Section>

          <Text style={smallText}>{t.expires}</Text>

          <Hr style={hr} />

          <Text style={footerText}>{t.ignore}</Text>

          <Text style={footerText}>{t.unsubscribe}</Text>

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

const smallText = {
  color: '#a3a3a3',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}

const hr = {
  borderColor: '#262626',
  margin: '24px 0',
}

const footerText = {
  color: '#737373',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0 0 8px',
  textAlign: 'center' as const,
}

const footerBrand = {
  color: '#525252',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
}
