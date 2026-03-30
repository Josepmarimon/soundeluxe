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

interface CommercialProposalProps {
  recipientName: string
  recipientCompany?: string | null
  proposalUrl: string
  language: 'CA' | 'ES' | 'EN'
}

const translations = {
  CA: {
    preview: 'Proposta de col·laboració de Sound Deluxe',
    title: 'Proposta de Col·laboració',
    greeting: (name: string) => `Benvolgut/da ${name},`,
    intro: 'Des de Sound Deluxe, organitzem experiències exclusives d\'escolta d\'alta fidelitat a Barcelona. Sessions íntimes on melòmans i audiòfils gaudeixen de música en vinil i bobina oberta amb equips d\'alta gamma.',
    whyYou: 'Creiem que una col·laboració amb vosaltres podria ser molt enriquidora per a les dues parts. Hem preparat una proposta personalitzada amb tots els detalls.',
    button: 'Veure la Proposta',
    confidential: 'Aquesta proposta és confidencial i personalitzada.',
    contact: 'Per a qualsevol consulta, no dubteu en contactar-nos.',
    footer: 'Sound Deluxe — Experiències audiòfiles d\'alta fidelitat',
  },
  ES: {
    preview: 'Propuesta de colaboración de Sound Deluxe',
    title: 'Propuesta de Colaboración',
    greeting: (name: string) => `Estimado/a ${name},`,
    intro: 'Desde Sound Deluxe, organizamos experiencias exclusivas de escucha en alta fidelidad en Barcelona. Sesiones íntimas donde melómanos y audiófilos disfrutan de música en vinilo y bobina abierta con equipos de alta gama.',
    whyYou: 'Creemos que una colaboración con vosotros podría ser muy enriquecedora para ambas partes. Hemos preparado una propuesta personalizada con todos los detalles.',
    button: 'Ver la Propuesta',
    confidential: 'Esta propuesta es confidencial y personalizada.',
    contact: 'Para cualquier consulta, no dudéis en contactarnos.',
    footer: 'Sound Deluxe — Experiencias audiófilas de alta fidelidad',
  },
  EN: {
    preview: 'Collaboration proposal from Sound Deluxe',
    title: 'Collaboration Proposal',
    greeting: (name: string) => `Dear ${name},`,
    intro: 'At Sound Deluxe, we organize exclusive high-fidelity listening experiences in Barcelona. Intimate sessions where music lovers and audiophiles enjoy vinyl and reel-to-reel music on high-end equipment.',
    whyYou: 'We believe a collaboration could be very rewarding for both sides. We have prepared a personalized proposal with all the details.',
    button: 'View the Proposal',
    confidential: 'This proposal is confidential and personalized.',
    contact: 'For any questions, please don\'t hesitate to contact us.',
    footer: 'Sound Deluxe — High-fidelity audiophile experiences',
  },
}

export default function CommercialProposal({
  recipientName,
  recipientCompany,
  proposalUrl,
  language = 'CA',
}: CommercialProposalProps) {
  const t = translations[language]
  const displayName = recipientCompany ? `${recipientName} (${recipientCompany})` : recipientName

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

          <Text style={paragraph}>{t.greeting(displayName)}</Text>

          <Text style={paragraph}>{t.intro}</Text>

          <Text style={paragraph}>{t.whyYou}</Text>

          <Section style={buttonSection}>
            <Button style={button} href={proposalUrl}>
              {t.button}
            </Button>
          </Section>

          <Text style={smallText}>{t.confidential}</Text>

          <Hr style={hr} />

          <Text style={footerText}>{t.contact}</Text>
          <Text style={footerContact}>info@soundeluxe.es</Text>

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
  margin: '0 0 4px',
  textAlign: 'center' as const,
}

const footerContact = {
  color: '#D4AF37',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0 0 8px',
}

const footerBrand = {
  color: '#525252',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
}
