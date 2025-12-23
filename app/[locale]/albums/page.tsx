import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { albumsQuery, genresQuery, artistsQuery } from '@/lib/sanity/queries'
import AlbumCatalog from '@/components/AlbumCatalog'
import type { Album } from '@/lib/sanity/types'

export default async function AlbumsPage() {
  const t = await getTranslations()

  // Fetch albums, genres, and artists
  const [albums, genresData, artistsData] = await Promise.all([
    client.fetch<Album[]>(albumsQuery),
    client.fetch<{ genres: string[] }>(genresQuery),
    client.fetch<{ artists: string[] }>(artistsQuery),
  ])

  const genres = genresData?.genres || []
  const artists = artistsData?.artists || []

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('albums.title')}
          </h1>
          <p className="text-xl text-zinc-400">
            {t('albums.subtitle')}
          </p>
        </div>

        {/* Catalog with filters */}
        <AlbumCatalog albums={albums} genres={genres} artists={artists} />
      </div>
    </div>
  )
}
