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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            {/* Genre Filter */}
            {genres.length > 1 && (
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
            )}

            {/* Artist Filter */}
            {artists.length > 1 && (
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
            )}

            {/* Clear Filters Button */}
            {(selectedGenre || selectedArtist) && (
              <button
                onClick={() => {
                  setSelectedGenre('')
                  setSelectedArtist('')
                }}
                className="px-6 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors whitespace-nowrap"
              >
                {t('albums.clearFilters')}
              </button>
            )}
          </div>

          {/* Results count */}
          {(selectedGenre || selectedArtist) && (
            <div className="text-zinc-400 text-sm text-center mt-4">
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
