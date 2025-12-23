'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { SessionListItem } from '@/lib/sanity/types'
import SessionCard from '@/components/SessionCard'

interface SessionFiltersProps {
  sessions: SessionListItem[]
  showAlbumSale?: boolean
  enableFlip?: boolean
}

interface SessionCardsGridProps {
  sessions: SessionListItem[]
  showAlbumSale?: boolean
  enableFlip?: boolean
}

function SessionCardsGrid({ sessions, showAlbumSale = true, enableFlip = false }: SessionCardsGridProps) {
  const [flippedCard, setFlippedCard] = useState<string | null>(null)

  const handleCardFlip = (sessionId: string) => {
    setFlippedCard(flippedCard === sessionId ? null : sessionId)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
      {sessions.map((session) => (
        <SessionCard
          key={session._id}
          session={session}
          showAlbumSale={showAlbumSale}
          enableFlip={enableFlip}
          isFlipped={flippedCard === session._id}
          onFlip={() => handleCardFlip(session._id)}
        />
      ))}
    </div>
  )
}

export default function SessionFilters({ sessions, showAlbumSale = true, enableFlip = false }: SessionFiltersProps) {
  const t = useTranslations()
  const [selectedGenre, setSelectedGenre] = useState<string>('')
  const [artistSearch, setArtistSearch] = useState<string>('')
  const [genresOpen, setGenresOpen] = useState<boolean>(false)

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
      const matchesArtist =
        !artistSearch ||
        session.album.artist.toLowerCase().includes(artistSearch.toLowerCase())

      return matchesGenre && matchesArtist
    })
  }, [sessions, selectedGenre, artistSearch])

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
      {/* Filters - only visible on desktop, hidden on mobile */}
      {(genres.length > 1 || artists.length > 1) && (
        <div className="mb-8 hidden md:block">
          <div className="flex flex-wrap justify-center items-center gap-2 max-w-5xl mx-auto">
            {/* Genre Buttons */}
            {genres.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedGenre('')}
                  className={`px-4 py-1.5 text-sm rounded-full font-medium shadow-md transition-all ${
                    !selectedGenre
                      ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black'
                      : 'bg-[#F5F1E8] text-black hover:bg-[#EDE8DC]'
                  }`}
                >
                  {t('albums.allGenres')}
                </button>
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-4 py-1.5 text-sm rounded-full font-medium shadow-md transition-all ${
                      selectedGenre === genre
                        ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black'
                        : 'bg-[#F5F1E8] text-black hover:bg-[#EDE8DC]'
                    }`}
                  >
                    {getGenreName(genre)}
                  </button>
                ))}
              </>
            )}

            {/* Artist Search */}
            {artists.length > 1 && (
              <div className="relative w-48">
                <input
                  type="text"
                  placeholder={t('albums.searchArtist')}
                  value={artistSearch}
                  onChange={(e) => setArtistSearch(e.target.value)}
                  className="w-full px-4 py-1.5 text-sm bg-[#F5F1E8] text-black placeholder:text-zinc-600 rounded-full font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black transition-colors"
                />
                {artistSearch && (
                  <button
                    onClick={() => setArtistSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-black transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Results count */}
          {(selectedGenre || artistSearch) && (
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
        <SessionCardsGrid sessions={filteredSessions} showAlbumSale={showAlbumSale} enableFlip={enableFlip} />
      )}
    </div>
  )
}
