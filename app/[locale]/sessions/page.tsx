import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { upcomingSessionsQuery } from '@/lib/sanity/queries'
import type { SessionListItem } from '@/lib/sanity/types'
import SessionFilters from '@/components/SessionFilters'

export default async function SessionsPage() {
  const t = await getTranslations()

  // Fetch all upcoming sessions from Sanity
  const sessions: SessionListItem[] = await client.fetch(upcomingSessionsQuery)

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('sessions.title')}
          </h1>
          <p className="text-xl text-zinc-400">
            {t('common.tagline')}
          </p>
        </div>

        {/* Sessions with Filters */}
        {sessions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-lg">
              {t('sessions.noSessions')}
            </p>
          </div>
        ) : (
          <SessionFilters sessions={sessions} />
        )}
      </div>
    </div>
  )
}
