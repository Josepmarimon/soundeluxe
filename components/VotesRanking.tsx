'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { urlForImage } from '@/lib/sanity/image'
import Image from 'next/image'
import { useVoteEvents } from '@/hooks/useVoteEvents'

interface RankingItem {
  position: number
  albumId: string
  voteCount: number
  album: {
    _id: string
    title: string
    artist: string
    year: number
    genre: string
    coverImage: any
  }
}

export default function VotesRanking() {
  const t = useTranslations()
  const [ranking, setRanking] = useState<RankingItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  const fetchRanking = useCallback(async () => {
    try {
      const response = await fetch('/api/votes/ranking?limit=10')
      const data = await response.json()
      setRanking(data.ranking || [])
    } catch (error) {
      console.error('Error fetching ranking:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch ranking on mount
  useEffect(() => {
    fetchRanking()
  }, [fetchRanking])

  // Listen for vote events and refresh ranking
  useVoteEvents(() => {
    fetchRanking()
  })

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-[#0a1929]/80 to-[#1a3a5c]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#D4AF37]/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3v18l7-3 7 3V3H5zm7 11l-3-2 1-1.5 2 1.5 4-4 1 1.5-5 4.5z"/>
          </svg>
          {t('votes.rankingTitle')}
        </h2>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-3 bg-white/5 rounded-xl">
              <div className="w-8 h-8 bg-white/10 rounded-full" />
              <div className="w-12 h-12 bg-white/10 rounded-lg" />
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2" />
                <div className="h-3 bg-white/10 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (ranking.length === 0) {
    return (
      <div className="bg-gradient-to-br from-[#0a1929]/80 to-[#1a3a5c]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#D4AF37]/20">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <svg className="w-7 h-7 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 3v18l7-3 7 3V3H5zm7 11l-3-2 1-1.5 2 1.5 4-4 1 1.5-5 4.5z"/>
          </svg>
          {t('votes.rankingTitle')}
        </h2>
        <p className="text-zinc-400 text-center py-8">{t('votes.noVotesYet')}</p>
      </div>
    )
  }

  const getMedalColor = (position: number) => {
    switch (position) {
      case 1:
        return 'from-[#FFD700] to-[#FFA500]' // Gold
      case 2:
        return 'from-[#C0C0C0] to-[#A0A0A0]' // Silver
      case 3:
        return 'from-[#CD7F32] to-[#8B4513]' // Bronze
      default:
        return 'from-zinc-600 to-zinc-700'
    }
  }

  const getMedalEmoji = (position: number) => {
    switch (position) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return null
    }
  }

  // Split ranking into top 3 and rest
  const topThree = ranking.slice(0, 3)
  const restOfRanking = ranking.slice(3)

  return (
    <div className="bg-gradient-to-br from-[#0a1929]/80 to-[#1a3a5c]/60 backdrop-blur-sm rounded-2xl p-6 border border-[#D4AF37]/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <svg className="w-7 h-7 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 3v18l7-3 7 3V3H5zm7 11l-3-2 1-1.5 2 1.5 4-4 1 1.5-5 4.5z"/>
        </svg>
        {t('votes.rankingTitle')}
      </h2>

      {/* Top 3 - Highlighted in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {topThree.map((item) => {
          const imageUrl = urlForImage(item.album.coverImage)?.width(200).height(200).url()
          const medal = getMedalEmoji(item.position)

          return (
            <div
              key={item.albumId}
              className="relative bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-4 border border-[#D4AF37]/30 hover:border-[#D4AF37]/50 transition-all group"
            >
              {/* Medal badge */}
              <div
                className={`
                  absolute -top-3 -left-3 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                  bg-gradient-to-br ${getMedalColor(item.position)} text-white shadow-lg z-10
                `}
              >
                {medal}
              </div>

              {/* Album Cover */}
              {imageUrl && (
                <div className="relative aspect-square w-full rounded-lg overflow-hidden shadow-lg mb-3 group-hover:shadow-xl transition-shadow">
                  <Image
                    src={imageUrl}
                    alt={item.album.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
              )}

              {/* Album Info */}
              <div className="text-center">
                <h3 className="text-white font-semibold text-sm md:text-base truncate mb-1">
                  {item.album.title}
                </h3>
                <p className="text-zinc-400 text-xs md:text-sm truncate mb-2">
                  {item.album.artist}
                </p>
                {/* Vote Count */}
                <div className="flex items-center justify-center gap-1.5 text-[#D4AF37] font-semibold">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                  </svg>
                  <span className="text-sm">{item.voteCount}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Rest of ranking - Collapsible */}
      {restOfRanking.length > 0 && (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-center gap-3 py-4 text-[#D4AF37] hover:text-[#F4E5AD] transition-colors border-t border-white/10"
          >
            <span className="text-base font-semibold">
              {isExpanded ? t('votes.hideRanking') : t('votes.showMoreRanking', { count: restOfRanking.length })}
            </span>
            {isExpanded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </button>

          {/* Collapsible list */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="space-y-2 pt-3">
              {restOfRanking.map((item) => {
                const imageUrl = urlForImage(item.album.coverImage)?.width(100).height(100).url()

                return (
                  <div
                    key={item.albumId}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    {/* Position */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-zinc-700 text-zinc-300">
                      {item.position}
                    </div>

                    {/* Album Cover */}
                    {imageUrl && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                        <Image
                          src={imageUrl}
                          alt={item.album.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}

                    {/* Album Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold text-sm truncate">
                        {item.album.title}
                      </h3>
                      <p className="text-zinc-400 text-xs truncate">
                        {item.album.artist}
                      </p>
                    </div>

                    {/* Vote Count */}
                    <div className="flex items-center gap-1.5 text-[#D4AF37] font-semibold">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
                      </svg>
                      <span className="text-sm">{item.voteCount}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
