'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { Album } from '@/lib/sanity/types'
import AlbumCard from '@/components/AlbumCard'

interface AlbumCatalogProps {
  albums: Album[]
  genres: string[]
  artists: string[]
}

export default function AlbumCatalog({ albums, genres, artists }: AlbumCatalogProps) {
  const t = useTranslations()
  const [selectedGenre, setSelectedGenre] = useState<string>('')
  const [selectedArtist, setSelectedArtist] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filter albums based on selected filters
  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const matchesGenre = !selectedGenre || album.genre === selectedGenre
      const matchesArtist = !selectedArtist || album.artist === selectedArtist
      const matchesSearch =
        !searchQuery ||
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesGenre && matchesArtist && matchesSearch
    })
  }, [albums, selectedGenre, selectedArtist, searchQuery])

  // Get genre display name
  const getGenreName = (genre: string) => {
    const genreMap: Record<string, string> = {
      rock: 'Rock',
      jazz: 'Jazz',
      soul: 'Soul',
      clasica: 'Clàssica',
      electronica: 'Electrònica',
      pop: 'Pop',
      hiphop: 'Hip-Hop',
    }
    return genreMap[genre] || genre
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder={t('albums.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-800 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Genre Filter */}
          <div className="flex-1">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-800 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
            >
              <option value="">{t('albums.allGenres')}</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {getGenreName(genre)}
                </option>
              ))}
            </select>
          </div>

          {/* Artist Filter */}
          <div className="flex-1">
            <select
              value={selectedArtist}
              onChange={(e) => setSelectedArtist(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 text-white rounded-lg border border-zinc-800 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20"
            >
              <option value="">{t('albums.allArtists')}</option>
              {artists.map((artist) => (
                <option key={artist} value={artist}>
                  {artist}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(selectedGenre || selectedArtist || searchQuery) && (
            <button
              onClick={() => {
                setSelectedGenre('')
                setSelectedArtist('')
                setSearchQuery('')
              }}
              className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
            >
              {t('albums.clearFilters')}
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="text-zinc-400 text-sm">
          {filteredAlbums.length === albums.length
            ? t('albums.showingAll', { count: albums.length })
            : t('albums.showingFiltered', {
                count: filteredAlbums.length,
                total: albums.length,
              })}
        </div>
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg">{t('albums.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => (
            <AlbumCard key={album._id} album={album} />
          ))}
        </div>
      )}
    </div>
  )
}
