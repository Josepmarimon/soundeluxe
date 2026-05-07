import 'dotenv/config'
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
})

const aboutPageDoc = {
  _id: 'aboutPage',
  _type: 'aboutPage',
  title: {
    ca: 'Sobre nosaltres',
    es: 'Sobre nosotros',
    en: 'About us',
  },
  intro: {
    ca: 'Sound Deluxe neix de la passió per la música i l\'experiència d\'escoltar-la com mai abans.',
    es: 'Sound Deluxe nace de la pasión por la música y la experiencia de escucharla como nunca antes.',
    en: 'Sound Deluxe is born from a passion for music and the experience of listening to it like never before.',
  },
  missionTitle: {
    ca: 'La nostra missió',
    es: 'Nuestra misión',
    en: 'Our mission',
  },
  missionText: {
    ca: 'Oferir experiències audiòfiles úniques en sales d\'alta fidelitat, on cada detall sonor cobra vida. Volem recuperar l\'art d\'escoltar música amb atenció plena, en un ambient dissenyat específicament per maximitzar la qualitat del so.',
    es: 'Ofrecer experiencias audiófilas únicas en salas de alta fidelidad, donde cada detalle sonoro cobra vida. Queremos recuperar el arte de escuchar música con atención plena, en un ambiente diseñado específicamente para maximizar la calidad del sonido.',
    en: 'To offer unique audiophile experiences in high-fidelity rooms, where every sonic detail comes to life. We want to recover the art of listening to music with full attention, in an environment specifically designed to maximize sound quality.',
  },
  experienceTitle: {
    ca: 'L\'experiència Sound Deluxe',
    es: 'La experiencia Sound Deluxe',
    en: 'The Sound Deluxe experience',
  },
  experienceText: {
    ca: 'Cada sessió és curada amb cura: seleccionem àlbums icònics i rareses, reproduïts en vinils originals a través d\'equips d\'alta fidelitat. Els nostres espais estan tractats acústicament per oferir la millor experiència d\'escolta possible.',
    es: 'Cada sesión es curada con cuidado: seleccionamos álbumes icónicos y rarezas, reproducidos en vinilos originales a través de equipos de alta fidelidad. Nuestros espacios están tratados acústicamente para ofrecer la mejor experiencia de escucha posible.',
    en: 'Each session is carefully curated: we select iconic albums and rarities, played on original vinyl through high-fidelity equipment. Our spaces are acoustically treated to offer the best possible listening experience.',
  },
  valuesTitle: {
    ca: 'Els nostres valors',
    es: 'Nuestros valores',
    en: 'Our values',
  },
  valuesList: {
    ca: [
      'Qualitat sonora sense compromisos',
      'Respecte per la música i els artistes',
      'Comunitat d\'audiòfils i melòmans',
      'Autenticitat en cada experiència',
    ],
    es: [
      'Calidad sonora sin compromisos',
      'Respeto por la música y los artistas',
      'Comunidad de audiófilos y melómanos',
      'Autenticidad en cada experiencia',
    ],
    en: [
      'Uncompromising sound quality',
      'Respect for music and artists',
      'Community of audiophiles and music lovers',
      'Authenticity in every experience',
    ],
  },
  ctaTitle: {
    ca: 'Vine a viure l\'experiència',
    es: 'Ven a vivir la experiencia',
    en: 'Come live the experience',
  },
  ctaText: {
    ca: 'Descobreix les nostres properes sessions i reserva la teva plaça.',
    es: 'Descubre nuestras próximas sesiones y reserva tu plaza.',
    en: 'Discover our upcoming sessions and book your spot.',
  },
}

const contactPageDoc = {
  _id: 'contactPage',
  _type: 'contactPage',
  title: {
    ca: 'Contacte',
    es: 'Contacto',
    en: 'Contact',
  },
  subtitle: {
    ca: 'Tens alguna pregunta? Estem aquí per ajudar-te',
    es: '¿Tienes alguna pregunta? Estamos aquí para ayudarte',
    en: 'Have any questions? We\'re here to help',
  },
  hoursTitle: {
    ca: 'Horari d\'atenció',
    es: 'Horario de atención',
    en: 'Opening hours',
  },
  hoursLines: {
    ca: [
      'Dilluns a Divendres: 10:00 - 20:00',
      'Dissabte: 12:00 - 18:00',
      'Diumenge: Tancat',
    ],
    es: [
      'Lunes a Viernes: 10:00 - 20:00',
      'Sábado: 12:00 - 18:00',
      'Domingo: Cerrado',
    ],
    en: [
      'Monday to Friday: 10:00 - 20:00',
      'Saturday: 12:00 - 18:00',
      'Sunday: Closed',
    ],
  },
  emailLabel: {
    ca: 'Correu electrònic',
    es: 'Correo electrónico',
    en: 'Email',
  },
  phoneLabel: {
    ca: 'Telèfon',
    es: 'Teléfono',
    en: 'Phone',
  },
  addressLabel: {
    ca: 'Adreça',
    es: 'Dirección',
    en: 'Address',
  },
}

async function seed() {
  console.log('🌱 Seeding aboutPage...')
  await client.createOrReplace(aboutPageDoc)
  console.log('✅ aboutPage creat/actualitzat')

  console.log('🌱 Seeding contactPage...')
  await client.createOrReplace(contactPageDoc)
  console.log('✅ contactPage creat/actualitzat')

  console.log('\n✨ Seed completat')
}

seed().catch((err) => {
  console.error('❌ Error:', err)
  process.exit(1)
})
