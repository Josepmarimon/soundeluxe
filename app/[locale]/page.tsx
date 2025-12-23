import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { upcomingSessionsQuery } from '@/lib/sanity/queries'
import type { SessionListItem } from '@/lib/sanity/types'
import SessionFilters from '@/components/SessionFilters'

export default async function HomePage() {
  const t = await getTranslations()

  // Fetch upcoming sessions from Sanity
  const sessions: SessionListItem[] = await client.fetch(upcomingSessionsQuery)

  return (
    <div className="min-h-screen bg-black pt-16">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {t('hero.title')}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-300 mb-8">
            {t('hero.subtitle')}
          </p>
          <a
            href="#sessions"
            className="inline-block bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-lg"
          >
            {t('hero.cta')}
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
              {t('experience.title')}
            </h2>
            <p className="text-xl text-zinc-400">
              {t('experience.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Acoustics */}
            <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D4AF37]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center mb-6 group-hover:from-[#D4AF37]/30 group-hover:to-[#D4AF37]/10 transition-all">
                <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('experience.acoustics.title')}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {t('experience.acoustics.description')}
              </p>
            </div>

            {/* Hi-End Equipment */}
            <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D4AF37]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center mb-6 group-hover:from-[#D4AF37]/30 group-hover:to-[#D4AF37]/10 transition-all">
                <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('experience.hiend.title')}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {t('experience.hiend.description')}
              </p>
            </div>

            {/* Minimalist Atmosphere */}
            <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D4AF37]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center mb-6 group-hover:from-[#D4AF37]/30 group-hover:to-[#D4AF37]/10 transition-all">
                <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('experience.atmosphere.title')}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {t('experience.atmosphere.description')}
              </p>
            </div>

            {/* Premium Comfort */}
            <div className="group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-[#D4AF37]/30 transition-all duration-300">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#D4AF37]/5 flex items-center justify-center mb-6 group-hover:from-[#D4AF37]/30 group-hover:to-[#D4AF37]/10 transition-all">
                <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {t('experience.comfort.title')}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {t('experience.comfort.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
