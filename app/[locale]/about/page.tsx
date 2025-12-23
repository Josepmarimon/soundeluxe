import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/sanity/types'

interface AboutPageProps {
  params: Promise<{
    locale: Locale
  }>
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  const t = await getTranslations()

  const content = {
    ca: {
      title: 'Sobre nosaltres',
      intro: 'Sound Deluxe neix de la passió per la música i l\'experiència d\'escoltar-la com mai abans.',
      mission: 'La nostra missió',
      missionText: 'Oferir experiències audiòfiles úniques en sales d\'alta fidelitat, on cada detall sonor cobra vida. Volem recuperar l\'art d\'escoltar música amb atenció plena, en un ambient dissenyat específicament per maximitzar la qualitat del so.',
      experience: 'L\'experiència Sound Deluxe',
      experienceText: 'Cada sessió és curada amb cura: seleccionem àlbums icònics i rareses, reproduïts en vinils originals a través d\'equips d\'alta fidelitat. Els nostres espais estan tractats acústicament per oferir la millor experiència d\'escolta possible.',
      values: 'Els nostres valors',
      valuesList: [
        'Qualitat sonora sense compromisos',
        'Respecte per la música i els artistes',
        'Comunitat d\'audiòfils i melòmans',
        'Autenticitat en cada experiència',
      ],
    },
    es: {
      title: 'Sobre nosotros',
      intro: 'Sound Deluxe nace de la pasión por la música y la experiencia de escucharla como nunca antes.',
      mission: 'Nuestra misión',
      missionText: 'Ofrecer experiencias audiófila únicas en salas de alta fidelidad, donde cada detalle sonoro cobra vida. Queremos recuperar el arte de escuchar música con atención plena, en un ambiente diseñado específicamente para maximizar la calidad del sonido.',
      experience: 'La experiencia Sound Deluxe',
      experienceText: 'Cada sesión es curada con cuidado: seleccionamos álbumes icónicos y rarezas, reproducidos en vinilos originales a través de equipos de alta fidelidad. Nuestros espacios están tratados acústicamente para ofrecer la mejor experiencia de escucha posible.',
      values: 'Nuestros valores',
      valuesList: [
        'Calidad sonora sin compromisos',
        'Respeto por la música y los artistas',
        'Comunidad de audiófilos y melómanos',
        'Autenticidad en cada experiencia',
      ],
    },
    en: {
      title: 'About us',
      intro: 'Sound Deluxe is born from a passion for music and the experience of listening to it like never before.',
      mission: 'Our mission',
      missionText: 'To offer unique audiophile experiences in high-fidelity rooms, where every sonic detail comes to life. We want to recover the art of listening to music with full attention, in an environment specifically designed to maximize sound quality.',
      experience: 'The Sound Deluxe experience',
      experienceText: 'Each session is carefully curated: we select iconic albums and rarities, played on original vinyl through high-fidelity equipment. Our spaces are acoustically treated to offer the best possible listening experience.',
      values: 'Our values',
      valuesList: [
        'Uncompromising sound quality',
        'Respect for music and artists',
        'Community of audiophiles and music lovers',
        'Authenticity in every experience',
      ],
    },
  }

  const pageContent = content[locale]

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">
          {pageContent.title}
        </h1>

        <div className="space-y-12 text-zinc-300">
          <p className="text-xl leading-relaxed">
            {pageContent.intro}
          </p>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              {pageContent.mission}
            </h2>
            <p className="text-lg leading-relaxed">
              {pageContent.missionText}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              {pageContent.experience}
            </h2>
            <p className="text-lg leading-relaxed">
              {pageContent.experienceText}
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-white mb-4">
              {pageContent.values}
            </h2>
            <ul className="space-y-3">
              {pageContent.valuesList.map((value, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-white">•</span>
                  <span className="text-lg">{value}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-[#F5F1E8] p-8 rounded-lg mt-12 shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-4">
              {locale === 'ca'
                ? 'Vine a viure l\'experiència'
                : locale === 'es'
                  ? 'Ven a vivir la experiencia'
                  : 'Come live the experience'}
            </h2>
            <p className="text-zinc-700 mb-6">
              {locale === 'ca'
                ? 'Descobreix les nostres properes sessions i reserva la teva plaça.'
                : locale === 'es'
                  ? 'Descubre nuestras próximas sesiones y reserva tu plaza.'
                  : 'Discover our upcoming sessions and book your spot.'}
            </p>
            <a
              href={`/${locale}/sessions`}
              className="inline-block bg-[#D4AF37] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#C5A028] transition-colors"
            >
              {t('navigation.sessions')}
            </a>
          </section>
        </div>
      </div>
    </div>
  )
}
