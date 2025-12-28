import { getTranslations } from 'next-intl/server'
import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import { upcomingSessionsQuery, homePageQuery, testimonialsQuery } from '@/lib/sanity/queries'
import type { SessionListItem, HomePage, ExperienceFeature, Testimonial } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'
import SessionFilters from '@/components/SessionFilters'
import HeroVideo from '@/components/HeroVideo'
import NewsletterForm from '@/components/NewsletterForm'
import SessionsCalendar from '@/components/calendar/SessionsCalendar'
import Testimonials from '@/components/Testimonials'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations()
  const { locale } = await params
  const typedLocale = locale as 'ca' | 'es' | 'en'

  // Fetch upcoming sessions, home page config, and testimonials from Sanity
  const [sessions, homePageData, testimonials]: [SessionListItem[], HomePage | null, Testimonial[]] = await Promise.all([
    client.fetch(upcomingSessionsQuery),
    client.fetch(homePageQuery),
    client.fetch(testimonialsQuery),
  ])

  // Filter features with images and map to safe type
  const featuresWithImages = (homePageData?.experienceFeatures || [])
    .filter((feature) => feature.image)
    .map((feature) => ({
      ...feature,
      image: feature.image!,
    }))


  return (
    <div className="min-h-screen bg-transparent pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4 overflow-hidden">
        {/* Background Image/Video */}
        {homePageData?.heroBackgroundType === 'image' && homePageData?.heroBackgroundImage && (
          <>
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `url(${urlForImage(homePageData.heroBackgroundImage)?.width(1920).url()})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-black/60 z-10" />
          </>
        )}

        {homePageData?.heroBackgroundType === 'video' && homePageData?.heroBackgroundVideo?.asset?.url && (
          <>
            <HeroVideo videoUrl={homePageData.heroBackgroundVideo.asset.url} />
            <div className="absolute inset-0 bg-black/50 z-10" />
          </>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto relative z-20">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image
              src="/logo.svg"
              alt="Sound Deluxe"
              width={440}
              height={120}
              className="h-20 md:h-28 w-auto"
              priority
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {homePageData?.heroTitle?.[typedLocale] || t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8">
            {homePageData?.heroSubtitle?.[typedLocale] || t('hero.subtitle')}
          </p>
          <a
            href="#sessions"
            className="inline-block bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-lg"
          >
            {homePageData?.heroCta?.[typedLocale] || t('hero.cta')}
          </a>
        </div>
      </section>

      {/* Sessions Section */}
      <section id="sessions" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
            {t('sessions.title')}
          </h2>

          {/* Calendar */}
          {sessions.length > 0 && (
            <div className="mb-12">
              <SessionsCalendar sessions={sessions} />
            </div>
          )}

          {sessions.length === 0 ? (
            <p className="text-center text-zinc-300 text-lg">
              {t('sessions.noSessions')}
            </p>
          ) : (
            <SessionFilters sessions={sessions} showAlbumSale={false} enableFlip={true} />
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-transparent via-[#1a3a5c]/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {homePageData?.experienceTitle && homePageData.experienceTitle[typedLocale]
                ? homePageData.experienceTitle[typedLocale]
                : t('experience.title')}
            </h2>
            <p className="text-xl text-zinc-400">
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
                <div key={index} className="group relative overflow-hidden rounded-2xl border border-[#254a6e]/40 hover:border-[#D4AF37]/30 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={altText}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#102a43] via-[#102a43]/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6 bg-[#102a43]/50">
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {titleText}
                    </h3>
                    <p className="text-zinc-400 leading-relaxed">
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
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('newsletter.title')}
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            {t('newsletter.subtitle')}
          </p>
          <NewsletterForm />
        </div>
      </section>
    </div>
  )
}
