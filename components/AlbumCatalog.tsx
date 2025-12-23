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
      <div className="mb-12">
        {/* Search */}
        <div className="mb-6 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder={t('albums.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-3 bg-[#F5F1E8] text-black placeholder:text-zinc-600 rounded-full font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black transition-colors"
          />
        </div>

        {/* Genre Filter - Toggle Buttons */}
        {genres.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-sm font-medium mb-3 text-center">
              {t('albums.allGenres')}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {/* All Genres Button */}
              <button
                onClick={() => setSelectedGenre('')}
                className={`px-6 py-2.5 rounded-full font-medium transition-all shadow-md ${
                  selectedGenre === ''
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black'
                    : 'bg-[#F5F1E8] text-black hover:bg-[#EDE8DC]'
                }`}
              >
                {t('albums.allGenres')}
              </button>

              {/* Individual Genre Buttons */}
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-2.5 rounded-full font-medium transition-all shadow-md ${
                    selectedGenre === genre
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black'
                      : 'bg-[#F5F1E8] text-black hover:bg-[#EDE8DC]'
                  }`}
                >
                  {getGenreName(genre)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Artist Filter - Styled Select */}
        {artists.length > 0 && (
          <div className="mb-6">
            <h3 className="text-white text-sm font-medium mb-3 text-center">
              {t('albums.allArtists')}
            </h3>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <select
                  value={selectedArtist}
                  onChange={(e) => setSelectedArtist(e.target.value)}
                  className="w-full px-6 py-3 bg-[#F5F1E8] text-black rounded-full font-medium shadow-md appearance-none cursor-pointer hover:bg-[#EDE8DC] transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black"
                >
                  <option value="">{t('albums.allArtists')}</option>
                  {artists.map((artist) => (
                    <option key={artist} value={artist}>
                      {artist}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        {(selectedGenre || selectedArtist || searchQuery) && (
          <div className="text-center mb-4">
            <button
              onClick={() => {
                setSelectedGenre('')
                setSelectedArtist('')
                setSearchQuery('')
              }}
              className="px-8 py-2.5 bg-zinc-800 text-white rounded-full font-medium hover:bg-zinc-700 transition-colors shadow-md"
            >
              {t('albums.clearFilters')}
            </button>
          </div>
        )}

        {/* Results count */}
        <div className="text-zinc-400 text-sm text-center">
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
