import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { votableAlbumsQuery, genresQuery, artistsQuery } from '@/lib/sanity/queries'
import AlbumCatalog from '@/components/AlbumCatalog'
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
    <div className="min-h-screen bg-transparent pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('votes.title')}
          </h1>
          <p className="text-xl text-zinc-400 mb-6">
            {t('votes.subtitle')}
          </p>

          {/* Info Box */}
          <div className="bg-gradient-to-r from-[#D4AF37]/10 via-[#F4E5AD]/10 to-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-6 max-w-3xl">
            <div className="flex items-start gap-4">
              <svg className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-[#D4AF37] font-semibold mb-2">{t('votes.infoTitle')}</h3>
                <p className="text-zinc-300 text-sm leading-relaxed">{t('votes.infoText')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog with filters - showing vote buttons */}
        <AlbumCatalog albums={albums} genres={genres} artists={artists} showVoteButton={true} />
      </div>
    </div>
  )
}
