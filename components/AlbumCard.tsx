'use client'

import { useLocale, useTranslations } from 'next-intl'
import type { Album, Locale } from '@/lib/sanity/types'
import AlbumCarousel from '@/components/AlbumCarousel'
import VoteCount from '@/components/VoteCount'
import VoteButton from '@/components/VoteButton'

interface AlbumCardProps {
  album: Album
  showVoteButton?: boolean
}

export default function AlbumCard({ album, showVoteButton = false }: AlbumCardProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale

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
    <article className="group bg-[#64748B] rounded-lg overflow-hidden hover:bg-[#54637A] transition-colors shadow-md">
      {/* Album Cover Carousel */}
      <div className="relative aspect-square overflow-hidden">
        <AlbumCarousel
          coverImage={album.coverImage}
          additionalImages={album.additionalImages}
          albumTitle={album.title}
          artist={album.artist}
        />
      </div>

      {/* Album Info */}
      <div className="p-6">
        {/* Genre Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black text-xs font-medium rounded-full shadow-md">
            {getGenreName(album.genre)}
          </span>
        </div>

        {/* Album Title & Artist */}
        <h3 className="text-xl font-bold text-black mb-1 group-hover:text-[#D4AF37] transition-colors">
          {album.title}
        </h3>
        <p className="text-zinc-700 mb-4">{album.artist}, {album.year}</p>

        {/* Price and Purchase Button */}
        {album.salePrice && (
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-black">
                {album.salePrice.toFixed(2)} €
              </div>
              {album.inStock ? (
                <button className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black font-semibold rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all">
                  {t('albums.buyNow')}
                </button>
              ) : (
                <span className="text-sm text-zinc-500 italic">
                  {t('albums.outOfStock')}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Vote Section */}
        {showVoteButton && (
          <div className="mt-4">
            <VoteButton albumId={album._id} showCount={true} />
          </div>
        )}

        {/* Links */}
        {album.links && (
          <div className="mt-4 flex gap-2">
            {album.links.spotify && (
              <a
                href={album.links.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-[#1DB954] transition-colors"
                title="Spotify"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            )}
            {album.links.youtube && (
              <a
                href={album.links.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-[#FF0000] transition-colors"
                title="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            )}
            {album.links.appleMusic && (
              <a
                href={album.links.appleMusic}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-600 hover:text-[#FA243C] transition-colors"
                title="Apple Music"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.877-.726 10.487 10.487 0 0 0-1.957-.114c-.992 0-1.987.014-2.98.014-3.004 0-6.008-.014-9.012.014-.918 0-1.838.04-2.734.244-1.336.305-2.46 1.04-3.195 2.267A5.78 5.78 0 0 0 .125 5.107 11.26 11.26 0 0 0 0 6.876v10.249c0 1.027.052 2.057.26 3.063.276 1.338 1.04 2.46 2.268 3.195a5.78 5.78 0 0 0 2.518.695c.787.055 1.574.078 2.362.078 2.98 0 5.96-.014 8.94-.014 1.117 0 2.236-.027 3.35-.172 1.27-.166 2.347-.76 3.154-1.902.6-.852.93-1.807 1.03-2.844.08-.827.088-1.656.088-2.486V6.124zm-7.82 5.278l-5.443 2.765c-.31.157-.63.263-.957.263-.43 0-.854-.162-1.19-.498-.467-.467-.607-1.126-.354-1.67.065-.14.15-.27.257-.388.19-.21.43-.377.697-.497l5.442-2.765c.31-.157.63-.263.957-.263.43 0 .854.162 1.19.498.467.467.607 1.126.354 1.67-.065.14-.15.27-.257.388-.19.21-.43.377-.697.497z"/>
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
