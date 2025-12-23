'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { Album } from '@/lib/sanity/types'
import AlbumCard from '@/components/AlbumCard'

interface AlbumCatalogProps {
  albums: Album[]
  genres: string[]
  artists: string[]
  showVoteButton?: boolean
}

export default function AlbumCatalog({ albums, genres, artists, showVoteButton = false }: AlbumCatalogProps) {
  const t = useTranslations()
  const [selectedGenre, setSelectedGenre] = useState<string>('')
  const [artistSearch, setArtistSearch] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [genresOpen, setGenresOpen] = useState<boolean>(false)

  // Filter albums based on selected filters
  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const matchesGenre = !selectedGenre || album.genre === selectedGenre
      const matchesArtist =
        !artistSearch || album.artist.toLowerCase().includes(artistSearch.toLowerCase())
      const matchesSearch =
        !searchQuery ||
        album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        album.artist.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesGenre && matchesArtist && matchesSearch
    })
  }, [albums, selectedGenre, artistSearch, searchQuery])

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
      <div className="mb-8">
        {/* Search by Title */}
        <div className="mb-4 max-w-3xl mx-auto">
          <input
            type="text"
            placeholder={t('albums.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 bg-[#F5F1E8] text-black placeholder:text-zinc-600 rounded-full font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black transition-colors"
          />
        </div>

        {/* Genre & Artist Filters */}
        <div className="flex flex-col sm:flex-row gap-4 max-w-3xl mx-auto">
          {/* Genre Dropdown */}
          {genres.length > 0 && (
            <div className="relative flex-1">
              <button
                onClick={() => setGenresOpen(!genresOpen)}
                className={`w-full px-6 py-3 rounded-full font-medium shadow-md transition-all flex items-center justify-between ${
                  selectedGenre
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black'
                    : 'bg-[#F5F1E8] text-black hover:bg-[#EDE8DC]'
                }`}
              >
                <span>{selectedGenre ? getGenreName(selectedGenre) : t('albums.allGenres')}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${genresOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Genre Dropdown Menu */}
              {genresOpen && (
                <div className="absolute z-10 w-full mt-2 bg-[#F5F1E8] rounded-2xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => {
                      setSelectedGenre('')
                      setGenresOpen(false)
                    }}
                    className="w-full px-6 py-3 text-left text-black hover:bg-[#EDE8DC] transition-colors font-medium"
                  >
                    {t('albums.allGenres')}
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => {
                        setSelectedGenre(genre)
                        setGenresOpen(false)
                      }}
                      className="w-full px-6 py-3 text-left text-black hover:bg-[#EDE8DC] transition-colors font-medium"
                    >
                      {getGenreName(genre)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Artist Search */}
          {artists.length > 0 && (
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t('albums.searchArtist')}
                value={artistSearch}
                onChange={(e) => setArtistSearch(e.target.value)}
                className="w-full px-6 py-3 bg-[#F5F1E8] text-black placeholder:text-zinc-600 rounded-full font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black transition-colors"
              />
              {artistSearch && (
                <button
                  onClick={() => setArtistSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        {(selectedGenre || artistSearch || searchQuery) && (
          <div className="text-zinc-400 text-sm text-center mt-4">
            {filteredAlbums.length === albums.length
              ? t('albums.showingAll', { count: albums.length })
              : t('albums.showingFiltered', {
                  count: filteredAlbums.length,
                  total: albums.length,
                })}
          </div>
        )}
      </div>

      {/* Albums Grid */}
      {filteredAlbums.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-400 text-lg">{t('albums.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => (
            <AlbumCard key={album._id} album={album} showVoteButton={showVoteButton} />
          ))}
        </div>
      )}
    </div>
  )
}
