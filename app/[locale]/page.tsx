import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { upcomingSessionsQuery, homePageQuery } from '@/lib/sanity/queries'
import type { SessionListItem, HomePage, ExperienceFeature } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'
import SessionFilters from '@/components/SessionFilters'

export default async function HomePage({ params }: { params: { locale: string } }) {
  const t = await getTranslations()
  const locale = params.locale as 'ca' | 'es' | 'en'

  // Fetch upcoming sessions and home page config from Sanity
  const [sessions, homePageData]: [SessionListItem[], HomePage | null] = await Promise.all([
    client.fetch(upcomingSessionsQuery),
    client.fetch(homePageQuery),
  ])

  // Filter features with images and map to safe type
  const featuresWithImages = (homePageData?.experienceFeatures || [])
    .filter((feature) => feature.image)
    .map((feature) => ({
      ...feature,
      image: feature.image!,
    }))


  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {homePageData?.heroTitle?.[locale] || t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8">
            {homePageData?.heroSubtitle?.[locale] || t('hero.subtitle')}
          </p>
          <a
            href="#sessions"
            className="inline-block bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-lg"
          >
            {homePageData?.heroCta?.[locale] || t('hero.cta')}
          </a>
        </div>
      </section>

      {/* Sessions Section */}
      <section id="sessions" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">
            {t('sessions.title')}
          </h2>

          {sessions.length === 0 ? (
            <p className="text-center text-zinc-300 text-lg">
              {t('sessions.noSessions')}
            </p>
          ) : (
            <SessionFilters sessions={sessions} />
          )}
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-zinc-900 to-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {homePageData?.experienceTitle && homePageData.experienceTitle[locale]
                ? homePageData.experienceTitle[locale]
                : t('experience.title')}
            </h2>
            <p className="text-xl text-zinc-400">
              {homePageData?.experienceSubtitle && homePageData.experienceSubtitle[locale]
                ? homePageData.experienceSubtitle[locale]
                : t('experience.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuresWithImages.map((feature, index) => {
              // TypeScript safety: image is guaranteed to exist after filter and map
              if (!feature.image) return null
              const imageBuilder = urlForImage(feature.image)
              if (!imageBuilder) return null
              const imageUrl = imageBuilder.width(800).url()

              const titleText = feature.title?.[locale] || feature.title?.ca || ''
              const descriptionText = feature.description?.[locale] || feature.description?.ca || ''
              const altText = titleText || 'Feature image'

              return (
                <div key={index} className="group relative overflow-hidden rounded-2xl border border-zinc-800 hover:border-[#D4AF37]/30 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={altText}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                      </svg>
                    </div>
                  </div>
                  <div className="p-6 bg-zinc-900/50">
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
    </div>
  )
}
