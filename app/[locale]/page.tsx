import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { upcomingSessionsQuery, homePageQuery, testimonialsQuery, albumCoversQuery } from '@/lib/sanity/queries'
import type { SessionListItem, HomePage, ExperienceFeature, Testimonial } from '@/lib/sanity/types'
import type { Image as SanityImage } from 'sanity'
import { urlForImage } from '@/lib/sanity/image'
import SessionFilters from '@/components/SessionFilters'
import { getBatchAvailability } from '@/lib/booking'
import HeroAlbumsCarousel from '@/components/HeroAlbumsCarousel'
import HeroVideo from '@/components/HeroVideo'
import TypewriterText from '@/components/TypewriterText'
import NewsletterForm from '@/components/NewsletterForm'
import SessionsCalendar from '@/components/calendar/SessionsCalendar'
import Testimonials from '@/components/Testimonials'
import { getSessionDayKey } from '@/lib/datetime'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations()
  const { locale } = await params
  const typedLocale = locale as 'ca' | 'es' | 'en'

  // Fetch upcoming sessions, home page config, testimonials and album covers from Sanity
  const [sessions, homePageData, testimonials, albumCovers]: [
    SessionListItem[],
    HomePage | null,
    Testimonial[],
    Array<{ _id: string; title: string; artist: string; coverImage: SanityImage }>,
  ] = await Promise.all([
    client.fetch(upcomingSessionsQuery),
    client.fetch(homePageQuery),
    client.fetch(testimonialsQuery),
    client.fetch(albumCoversQuery),
  ])

  // Compute real availability
  const availability = sessions.length > 0
    ? await getBatchAvailability(sessions.map((s) => ({ _id: s._id, totalPlaces: s.totalPlaces })))
    : {}

  // Sessions on the first future Madrid day are featured in the "Propera Sessió"
  // calendar highlight, so exclude them from the "Totes les sessions" grid below.
  const nowMs = Date.now()
  const futureSessions = sessions
    .filter((s) => s.date)
    .map((s) => ({ s, ms: new Date(s.date as string).getTime() }))
    .filter(({ ms }) => ms >= nowMs)
    .sort((a, b) => a.ms - b.ms)
  const nextDayKey = futureSessions[0]
    ? getSessionDayKey(futureSessions[0].s.date as string)
    : null
  const sessionsForGrid = nextDayKey
    ? sessions.filter((s) => !s.date || getSessionDayKey(s.date) !== nextDayKey)
    : sessions

  // Hero background: prefer the video when available, fall back to the image
  const heroVideoUrl = homePageData?.heroBackgroundVideo?.asset?.url || null
  const heroImageUrl = homePageData?.heroBackgroundImage
    ? urlForImage(homePageData.heroBackgroundImage)?.width(1920).url() || null
    : null
  const heroTitleText = homePageData?.heroTitle?.[typedLocale] || t('hero.title')
  const heroSubtitleText =
    homePageData?.heroSubtitle?.[typedLocale] || t('hero.subtitle')

  // Filter features with images and map to safe type
  const featuresWithImages = (homePageData?.experienceFeatures || [])
    .filter((feature) => feature.image)
    .map((feature) => ({
      ...feature,
      image: feature.image!,
    }))


  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background: vídeo de la sala d'escolta (fallback a imatge) */}
        {heroVideoUrl ? (
          <>
            <HeroVideo videoUrl={heroVideoUrl} />
            <div className="absolute inset-0 bg-black/50 z-10" />
          </>
        ) : heroImageUrl ? (
          <>
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${heroImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-black/60 z-10" />
          </>
        ) : null}

        {/* Text a sobre */}
        <div className="max-w-4xl mx-auto relative z-20">
          <div className="mb-6 flex justify-center">
            <Image
              src="/logo-gold.png"
              alt="Sound Deluxe"
              width={440}
              height={120}
              className="h-10 md:h-14 w-auto"
              priority
            />
          </div>
          <h1 className="hero-title italic text-4xl md:text-6xl text-white tracking-tight drop-shadow-lg">
            <TypewriterText text={heroTitleText} speedMs={70} />
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/85 max-w-2xl mx-auto drop-shadow">
            {heroSubtitleText}
          </p>
        </div>
      </section>

      {/* Carrusel de portades de discos */}
      <section className="relative w-full">
        <div className="relative h-[35vh] w-full">
          <HeroAlbumsCarousel albums={albumCovers} />
        </div>
      </section>

      {/* Sessions Section */}
      <section id="sessions" className="pt-2 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-fg mb-4 text-left lg:pl-[calc(33.333%+2rem)]">
            {t('sessions.scheduleTitle')}
          </h2>

          {/* Calendar */}
          {sessions.length > 0 && (
            <div className="mb-12">
              <SessionsCalendar sessions={sessions} availability={availability} />
            </div>
          )}

          {sessions.length === 0 ? (
            <p className="text-center text-fg text-lg">
              {t('sessions.noSessions')}
            </p>
          ) : sessionsForGrid.length > 0 ? (
            <>
              <h3 className="text-3xl md:text-4xl font-bold text-fg mb-8 text-center">
                {t('sessions.allSessions')}
              </h3>
              <SessionFilters sessions={sessionsForGrid} availability={availability} showAlbumSale={false} enableFlip={true} />
            </>
          ) : null}
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-fg mb-4">
              {homePageData?.experienceTitle && homePageData.experienceTitle[typedLocale]
                ? homePageData.experienceTitle[typedLocale]
                : t('experience.title')}
            </h2>
            <p className="text-xl text-fg-muted">
              {homePageData?.experienceSubtitle && homePageData.experienceSubtitle[typedLocale]
                ? homePageData.experienceSubtitle[typedLocale]
                : t('experience.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {featuresWithImages.map((feature, index) => {
              // TypeScript safety: image is guaranteed to exist after filter and map
              if (!feature.image) return null
              const imageBuilder = urlForImage(feature.image)
              if (!imageBuilder) return null
              const imageUrl = imageBuilder.width(800).url()

              const titleText = feature.title?.[typedLocale] || feature.title?.ca || ''
              const descriptionText = feature.description?.[typedLocale] || feature.description?.ca || ''
              const altText = titleText || 'Feature image'

              return (
                <div key={index} className="group relative overflow-hidden rounded-2xl border border-border/40 hover:border-primary/30 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={altText}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-surface/60"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6 bg-surface/50">
                    <h3 className="text-2xl font-bold text-fg mb-3">
                      {titleText}
                    </h3>
                    <p className="text-fg-muted leading-relaxed">
                      {descriptionText}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Newsletter Section */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-fg mb-4">
            {t('newsletter.title')}
          </h2>
          <p className="text-fg-muted text-lg mb-8">
            {t('newsletter.subtitle')}
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  )
}
