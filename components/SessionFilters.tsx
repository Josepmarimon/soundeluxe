'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { SessionListItem } from '@/lib/sanity/types'
import SessionCard from '@/components/SessionCard'

interface SessionFiltersProps {
  sessions: SessionListItem[]
}

export default function SessionFilters({ sessions }: SessionFiltersProps) {
  const t = useTranslations()
  const [selectedGenre, setSelectedGenre] = useState<string>('')
  const [selectedArtist, setSelectedArtist] = useState<string>('')

  // Extract unique genres and artists from sessions
  const { genres, artists } = useMemo(() => {
    const genreSet = new Set<string>()
    const artistSet = new Set<string>()

    sessions.forEach((session) => {
      if (session.album.genre) genreSet.add(session.album.genre)
      if (session.album.artist) artistSet.add(session.album.artist)
    })

    return {
      genres: Array.from(genreSet).sort(),
      artists: Array.from(artistSet).sort(),
    }
  }, [sessions])

  // Filter sessions based on selected filters
  const filteredSessions = useMemo(() => {
    return sessions.filter((session) => {
      const matchesGenre = !selectedGenre || session.album.genre === selectedGenre
      const matchesArtist = !selectedArtist || session.album.artist === selectedArtist

      return matchesGenre && matchesArtist
    })
  }, [sessions, selectedGenre, selectedArtist])

  // Get genre display name
  const getGenreName = (genre: string) => {
    const genreMap: Record<string, string> = {
      rock: 'Rock',
      jazz: 'Jazz',
      soul: 'Soul',
      clasica: t('albums.genres.classical'),
      electronica: t('albums.genres.electronic'),
      pop: 'Pop',
      hiphop: 'Hip-Hop',
    }
    return genreMap[genre] || genre
  }

  return (
    <div>
      {/* Filters */}
      {(genres.length > 1 || artists.length > 1) && (
        <div className="mb-12">
          {/* Genre Filter - Toggle Buttons */}
          {genres.length > 1 && (
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
          {artists.length > 1 && (
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
          {(selectedGenre || selectedArtist) && (
            <div className="text-center mb-4">
              <button
                onClick={() => {
                  setSelectedGenre('')
                  setSelectedArtist('')
                }}
                className="px-8 py-2.5 bg-zinc-800 text-white rounded-full font-medium hover:bg-zinc-700 transition-colors shadow-md"
              >
                {t('albums.clearFilters')}
              </button>
            </div>
          )}

          {/* Results count */}
          {(selectedGenre || selectedArtist) && (
            <div className="text-zinc-400 text-sm text-center">
              {filteredSessions.length === sessions.length
                ? t('albums.showingAll', { count: sessions.length })
                : t('albums.showingFiltered', {
                    count: filteredSessions.length,
                    total: sessions.length,
                  })}
            </div>
          )}
        </div>
      )}

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-zinc-300 text-lg">{t('albums.noResults')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSessions.map((session) => (
            <SessionCard key={session._id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}
