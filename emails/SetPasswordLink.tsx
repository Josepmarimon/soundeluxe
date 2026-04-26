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

interface SetPasswordLinkProps {
  setupUrl: string
  name: string
  language: 'CA' | 'ES' | 'EN'
}

const translations = {
  CA: {
    preview: 'Estableix la teva contrasenya a Sound Deluxe',
    title: 'Crea la teva contrasenya',
    greeting: (name: string) => `Hola ${name}!`,
    message: 'Has comprat com a convidat a Sound Deluxe. Crea una contrasenya per accedir a totes les teves entrades des del teu perfil.',
    button: 'Crear contrasenya',
    expires: 'Aquest enllaç caduca en 7 dies.',
    ignore: 'Si no has demanat establir contrasenya, pots ignorar aquest correu.',
    footer: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
  },
  ES: {
    preview: 'Establece tu contraseña en Sound Deluxe',
    title: 'Crea tu contraseña',
    greeting: (name: string) => `¡Hola ${name}!`,
    message: 'Has comprado como invitado en Sound Deluxe. Crea una contraseña para acceder a todas tus entradas desde tu perfil.',
    button: 'Crear contraseña',
    expires: 'Este enlace caduca en 7 días.',
    ignore: 'Si no has solicitado establecer contraseña, puedes ignorar este correo.',
    footer: 'Sound Deluxe - Experiencias audiófilas de alta fidelidad',
  },
  EN: {
    preview: 'Set your Sound Deluxe password',
    title: 'Create your password',
    greeting: (name: string) => `Hello ${name}!`,
    message: 'You purchased as a guest at Sound Deluxe. Create a password to access all your tickets from your profile.',
    button: 'Create password',
    expires: 'This link expires in 7 days.',
    ignore: 'If you did not request to set a password, you can ignore this email.',
    footer: 'Sound Deluxe - High-fidelity audiophile experiences',
  },
}

export default function SetPasswordLink({
  setupUrl,
  name,
  language = 'CA',
}: SetPasswordLinkProps) {
  const t = translations[language]

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

          <Text style={paragraph}>{t.greeting(name)}</Text>
          <Text style={paragraph}>{t.message}</Text>

          <Section style={buttonSection}>
            <Button style={button} href={setupUrl}>
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
const smallText = {
  color: '#a3a3a3',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0 0 24px',
}
const hr = { borderColor: '#262626', margin: '24px 0' }
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
