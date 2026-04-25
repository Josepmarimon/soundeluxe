import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { votableAlbumsQuery, genresQuery, artistsQuery } from '@/lib/sanity/queries'
import VotesRanking from '@/components/VotesRanking'
import VotesCatalogWithSuggestion from '@/components/VotesCatalogWithSuggestion'
import type { Album } from '@/lib/sanity/types'

export default async function VotesPage() {
  const t = await getTranslations()

  // Fetch votable albums, genres, and artists
  const [albums, genresData, artistsData] = await Promise.all([
    client.fetch<Album[]>(votableAlbumsQuery),
    client.fetch<{ genres: string[] }>(genresQuery),
    client.fetch<{ artists: string[] }>(artistsQuery),
  ])

  const genres = genresData?.genres || []
  const artists = artistsData?.artists || []

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-fg mb-4">
            {t('votes.title')}
          </h1>
          <p className="text-xl text-fg-muted">
            {t('votes.subtitle')}
          </p>
        </div>

        {/* Ranking Section */}
        <div className="mb-12">
          <VotesRanking />
        </div>

        {/* Catalog + Suggestion Form: form expands to 2x width when active */}
        <VotesCatalogWithSuggestion albums={albums} genres={genres} artists={artists} />
      </div>
    </div>
  )
}
