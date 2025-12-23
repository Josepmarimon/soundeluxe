import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { upcomingSessionsQuery } from '@/lib/sanity/queries'
import type { SessionListItem } from '@/lib/sanity/types'
import SessionCard from '@/components/SessionCard'

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
            className="inline-block bg-[#D4AF37] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#C5A028] transition-colors"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sessions.map((session) => (
                <SessionCard key={session._id} session={session} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
