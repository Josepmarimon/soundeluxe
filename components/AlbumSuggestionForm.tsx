'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface Artist {
  id: string
  name: string
  sortName: string
  disambiguation?: string
  country?: string
}

interface Release {
  id: string
  title: string
  year: number | null
  releaseDate: string | null
  coverUrl: string
}

export default function AlbumSuggestionForm() {
  const t = useTranslations()
  const { data: session, status } = useSession()

  // Artist search state
  const [artistQuery, setArtistQuery] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [showArtistDropdown, setShowArtistDropdown] = useState(false)
  const [loadingArtists, setLoadingArtists] = useState(false)

  // Releases state
  const [releases, setReleases] = useState<Release[]>([])
  const [loadingReleases, setLoadingReleases] = useState(false)
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null)

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Refs
  const artistInputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced artist search
  const searchArtists = useCallback(async (query: string) => {
    if (query.length < 2) {
      setArtists([])
      return
    }

    setLoadingArtists(true)
    try {
      const response = await fetch(`/api/musicbrainz/artists?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setArtists(data.artists || [])
    } catch (error) {
      console.error('Error searching artists:', error)
      setArtists([])
    } finally {
      setLoadingArtists(false)
    }
  }, [])

  // Handle artist query change with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (artistQuery.length >= 2 && !selectedArtist) {
      debounceRef.current = setTimeout(() => {
        searchArtists(artistQuery)
      }, 300)
    } else {
      setArtists([])
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [artistQuery, selectedArtist, searchArtists])

  // Fetch releases when artist is selected
  useEffect(() => {
    if (!selectedArtist) {
      setReleases([])
      return
    }

    const fetchReleases = async () => {
      setLoadingReleases(true)
      try {
        const response = await fetch(`/api/musicbrainz/releases?artistId=${selectedArtist.id}`)
        const data = await response.json()
        setReleases(data.releases || [])
      } catch (error) {
        console.error('Error fetching releases:', error)
        setReleases([])
      } finally {
        setLoadingReleases(false)
      }
    }

    fetchReleases()
  }, [selectedArtist])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowArtistDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle artist selection
  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist)
    setArtistQuery(artist.name)
    setShowArtistDropdown(false)
    setSelectedRelease(null)
  }

  // Handle release selection
  const handleSelectRelease = (release: Release) => {
    setSelectedRelease(release)
  }

  // Clear selection
  const handleClearArtist = () => {
    setSelectedArtist(null)
    setArtistQuery('')
    setReleases([])
    setSelectedRelease(null)
    artistInputRef.current?.focus()
  }

  // Submit suggestion
  const handleSubmit = async () => {
    if (!selectedArtist || !selectedRelease) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const response = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artistName: selectedArtist.name,
          albumTitle: selectedRelease.title,
          mbid: selectedRelease.id,
          coverUrl: selectedRelease.coverUrl,
          year: selectedRelease.year,
        }),
      })

      if (response.ok) {
        setSubmitSuccess(true)
        setSelectedArtist(null)
        setArtistQuery('')
        setReleases([])
        setSelectedRelease(null)

        // Hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000)
      } else {
        const data = await response.json()
        if (response.status === 409) {
          setSubmitError(t('votes.suggestion.alreadySuggested'))
        } else {
          setSubmitError(data.error || t('votes.suggestion.error'))
        }
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error)
      setSubmitError(t('votes.suggestion.error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  // Don't render if not authenticated
  if (status === 'loading') {
    return null
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="bg-zinc-900/70 rounded-2xl p-6 md:p-8 border border-[#D4AF37]/30 shadow-xl shadow-black/20">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
        {t('votes.suggestion.title')}
      </h3>
      <p className="text-zinc-400 mb-6">
        {t('votes.suggestion.subtitle')}
      </p>

      {/* Success message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-xl text-green-400">
          {t('votes.suggestion.success')}
        </div>
      )}

      {/* Error message */}
      {submitError && (
        <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-400">
          {submitError}
        </div>
      )}

      {/* Step 1: Artist search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          {t('votes.suggestion.artistLabel')}
        </label>
        <div className="relative" ref={dropdownRef}>
          <input
            ref={artistInputRef}
            type="text"
            value={artistQuery}
            onChange={(e) => {
              setArtistQuery(e.target.value)
              if (selectedArtist) {
                setSelectedArtist(null)
                setReleases([])
                setSelectedRelease(null)
              }
              setShowArtistDropdown(true)
            }}
            onFocus={() => {
              if (artistQuery.length >= 2 && !selectedArtist) {
                setShowArtistDropdown(true)
              }
            }}
            placeholder={t('votes.suggestion.artistPlaceholder')}
            className="w-full px-4 py-3 bg-zinc-800 text-white placeholder:text-zinc-500 rounded-xl border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-colors"
          />

          {/* Clear button */}
          {selectedArtist && (
            <button
              onClick={handleClearArtist}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Loading indicator */}
          {loadingArtists && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 animate-spin text-[#D4AF37]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          )}

          {/* Artist dropdown */}
          {showArtistDropdown && artists.length > 0 && !selectedArtist && (
            <div className="absolute z-20 w-full mt-2 bg-zinc-800 rounded-xl shadow-xl border border-zinc-700 overflow-hidden max-h-60 overflow-y-auto">
              {artists.map((artist) => (
                <button
                  key={artist.id}
                  onClick={() => handleSelectArtist(artist)}
                  className="w-full px-4 py-3 text-left hover:bg-zinc-700 transition-colors flex items-center gap-3"
                >
                  <div className="w-10 h-10 bg-zinc-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-white font-medium">{artist.name}</div>
                    {(artist.disambiguation || artist.country) && (
                      <div className="text-sm text-zinc-400">
                        {[artist.disambiguation, artist.country].filter(Boolean).join(' · ')}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Album selection */}
      {selectedArtist && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            {t('votes.suggestion.albumLabel')}
          </label>

          {loadingReleases ? (
            <div className="flex items-center justify-center py-12">
              <svg className="w-8 h-8 animate-spin text-[#D4AF37]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : releases.length === 0 ? (
            <div className="text-center py-8 text-zinc-400">
              {t('votes.suggestion.noAlbums')}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
              {releases.map((release) => (
                <button
                  key={release.id}
                  onClick={() => handleSelectRelease(release)}
                  className={`group relative aspect-square rounded-lg overflow-hidden transition-all ${
                    selectedRelease?.id === release.id
                      ? 'ring-4 ring-[#D4AF37] ring-offset-2 ring-offset-zinc-900 scale-105'
                      : 'hover:ring-2 hover:ring-zinc-500 hover:ring-offset-1 hover:ring-offset-zinc-900'
                  }`}
                >
                  <Image
                    src={release.coverUrl}
                    alt={release.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Fallback for missing cover art
                      const target = e.target as HTMLImageElement
                      target.src = '/placeholder-album.png'
                    }}
                    unoptimized
                  />
                  {/* Overlay with title and year */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <div className="text-white text-xs font-medium line-clamp-2">{release.title}</div>
                    {release.year && (
                      <div className="text-zinc-400 text-xs">{release.year}</div>
                    )}
                  </div>
                  {/* Selected indicator */}
                  {selectedRelease?.id === release.id && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected album preview */}
      {selectedRelease && (
        <div className="mb-6 p-4 bg-zinc-800/50 rounded-xl border border-zinc-700 flex items-center gap-4">
          <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={selectedRelease.coverUrl}
              alt={selectedRelease.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <div className="text-white font-medium">{selectedRelease.title}</div>
            <div className="text-zinc-400 text-sm">
              {selectedArtist?.name} {selectedRelease.year && `· ${selectedRelease.year}`}
            </div>
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedArtist || !selectedRelease || isSubmitting}
        className={`w-full py-3 px-6 rounded-xl font-medium transition-all ${
          selectedArtist && selectedRelease && !isSubmitting
            ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black hover:shadow-lg hover:shadow-[#D4AF37]/20'
            : 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('votes.suggestion.submitting')}
          </span>
        ) : (
          t('votes.suggestion.submit')
        )}
      </button>
    </div>
  )
}
