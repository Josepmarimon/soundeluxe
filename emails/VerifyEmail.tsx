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

interface VerifyEmailProps {
  verifyUrl: string
  name: string
  language: 'CA' | 'ES' | 'EN'
}

const translations = {
  CA: {
    preview: 'Verifica el teu email per activar el teu compte a Sound Deluxe',
    title: 'Verifica el teu email',
    greeting: (name: string) => `Hola ${name}!`,
    message: 'Gràcies per registrar-te a Sound Deluxe. Clica el botó per verificar el teu email i activar el teu compte.',
    button: 'Verificar email',
    expires: 'Aquest enllaç caduca en 24 hores.',
    ignore: 'Si no has creat aquest compte, pots ignorar aquest correu.',
    footer: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
  },
  ES: {
    preview: 'Verifica tu email para activar tu cuenta en Sound Deluxe',
    title: 'Verifica tu email',
    greeting: (name: string) => `¡Hola ${name}!`,
    message: 'Gracias por registrarte en Sound Deluxe. Haz clic en el botón para verificar tu email y activar tu cuenta.',
    button: 'Verificar email',
    expires: 'Este enlace caduca en 24 horas.',
    ignore: 'Si no has creado esta cuenta, puedes ignorar este correo.',
    footer: 'Sound Deluxe - Experiencias audiófilas de alta fidelidad',
  },
  EN: {
    preview: 'Verify your email to activate your Sound Deluxe account',
    title: 'Verify your email',
    greeting: (name: string) => `Hello ${name}!`,
    message: 'Thanks for signing up to Sound Deluxe. Click the button below to verify your email and activate your account.',
    button: 'Verify email',
    expires: 'This link expires in 24 hours.',
    ignore: 'If you did not create this account, you can ignore this email.',
    footer: 'Sound Deluxe - High-fidelity audiophile experiences',
  },
}

export default function VerifyEmail({
  verifyUrl,
  name,
  language = 'CA',
}: VerifyEmailProps) {
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

          <Text style={paragraph}>{t.greeting(name)}</Text>

          <Text style={paragraph}>{t.message}</Text>

          <Section style={buttonSection}>
            <Button style={button} href={verifyUrl}>
              {t.button}
            </Button>
          </Section>

          <Text style={smallText}>{t.expires}</Text>

          <Hr style={hr} />

          <Text style={footerText}>{t.ignore}</Text>

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
