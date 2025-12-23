'use client'

import { useLocale, useTranslations } from 'next-intl'
import type { SessionListItem, Locale } from '@/lib/sanity/types'
import AlbumCarousel from '@/components/AlbumCarousel'
import PortableTextContent from '@/components/PortableTextContent'

interface SessionCardProps {
  session: SessionListItem
  showAlbumSale?: boolean
  enableFlip?: boolean
  isFlipped?: boolean
  onFlip?: () => void
}

export default function SessionCard({ session, showAlbumSale = true, enableFlip = false, isFlipped = false, onFlip }: SessionCardProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale

  const date = new Date(session.date)

  // Format with weekday for desktop
  const formattedDateDesktop = date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Format without weekday for mobile
  const formattedDateMobile = date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })

  if (enableFlip) {
    return (
      <article
        className="session-card-flip"
        onClick={onFlip}
      >
        <div className={`session-card-inner ${isFlipped ? 'session-card-flipped' : ''}`}>
          {/* Front Side */}
          <div className="session-card-front">
            <div className="bg-[#F5F1E8] rounded-lg overflow-hidden shadow-md h-full flex flex-col">
              {/* Album Cover Carousel */}
              <div className="relative aspect-square overflow-hidden">
                <AlbumCarousel
                  coverImage={session.album.coverImage}
                  additionalImages={session.album.additionalImages}
                  albumTitle={session.album.title}
                  artist={session.album.artist}
                />

                {/* Available spots badge */}
                <div className="hidden md:block absolute top-4 left-4 z-10">
                  <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black text-xs font-semibold rounded-full shadow-md">
                    {session.totalPlaces === 1
                      ? t('sessions.onePlace')
                      : t('sessions.placesAvailable', { count: session.totalPlaces })}
                  </span>
                </div>
              </div>

              {/* Session Info */}
              <div className="p-4 md:p-6 flex-1 flex flex-col">
                <a
                  href={`/${locale}/sessions/${session._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:underline"
                >
                  <h3 className="text-base md:text-xl font-bold text-black mb-1 line-clamp-2">
                    {session.album.title}
                  </h3>
                </a>
                <p className="text-sm md:text-base text-zinc-700 mb-3 md:mb-4 line-clamp-1">{session.album.artist}</p>

                <div className="space-y-1 md:space-y-2 text-xs md:text-sm">
                  <p className="text-zinc-800 line-clamp-2 md:hidden">{formattedDateMobile}</p>
                  <p className="text-zinc-800 line-clamp-2 hidden md:block">{formattedDateDesktop}</p>
                </div>
              </div>
            </div>
          </div>

            {/* Back Side */}
            <div className="session-card-back">
              <div className="bg-gradient-to-br from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] rounded-lg shadow-md h-full p-4 md:p-6 flex flex-col">
                <div className="flex-shrink-0">
                  <h3 className="text-lg md:text-2xl font-bold text-black mb-2 md:mb-3">
                    {session.album.title}
                  </h3>
                  <p className="text-base md:text-lg text-zinc-800 mb-1">
                    {session.album.artist}
                  </p>
                  <p className="text-sm md:text-base text-zinc-700 mb-3 md:mb-4">
                    {session.album.year}
                  </p>
                </div>

                {/* Album description with scroll */}
                {session.album.description && session.album.description[locale] && (
                  <div className="flex-1 overflow-y-auto mb-3 md:mb-4 text-xs md:text-sm prose prose-sm max-w-none [&_*]:text-black">
                    <PortableTextContent value={session.album.description[locale]} />
                  </div>
                )}

                <div className="flex-shrink-0">
                  <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm mb-3 md:mb-4">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-black hidden md:block">{formattedDateDesktop}</span>
                      <span className="text-black md:hidden">{formattedDateMobile}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-black">{session.sala.name[locale]}</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-black">{session.sessionType.name[locale]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-row items-center justify-between gap-2 mt-4">
                  <span className="text-2xl md:text-3xl font-bold text-black">
                    {session.price}€
                  </span>
                  <a
                    href={`/${locale}/sessions/${session._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-black text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold text-sm md:text-base shadow-lg inline-block hover:bg-zinc-800 transition-colors"
                  >
                    {t('sessions.book')}
                  </a>
                </div>
              </div>
            </div>
          </div>
      </article>
    )
  }

  return (
    <article className="group bg-[#F5F1E8] rounded-lg overflow-hidden hover:bg-[#EDE8DC] transition-colors shadow-md">
      <a href={`/${locale}/sessions/${session._id}`}>
        {/* Album Cover Carousel */}
        <div className="relative aspect-square overflow-hidden">
          <AlbumCarousel
            coverImage={session.album.coverImage}
            additionalImages={session.album.additionalImages}
            albumTitle={session.album.title}
            artist={session.album.artist}
          />

          {/* Available spots badge - only on desktop, over image */}
          <div className="hidden md:block absolute top-4 left-4 z-10">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black text-xs font-semibold rounded-full shadow-md">
              {session.totalPlaces === 1
                ? t('sessions.onePlace')
                : t('sessions.placesAvailable', { count: session.totalPlaces })}
            </span>
          </div>
        </div>
      </a>

      {/* Session Info - responsive sizing */}
      <div className="p-4 md:p-6">
        {/* Album & Artist */}
        <h3 className="text-base md:text-xl font-bold text-black mb-1 line-clamp-2">
          {session.album.title}
        </h3>
        <p className="text-sm md:text-base text-zinc-700 mb-3 md:mb-4 line-clamp-1">{session.album.artist}</p>

        {/* Date & Venue */}
        <div className="space-y-1 md:space-y-2 mb-3 md:mb-4 text-xs md:text-sm">
          {/* Show different date format for mobile and desktop */}
          <p className="text-zinc-800 line-clamp-2 md:hidden">{formattedDateMobile}</p>
          <p className="text-zinc-800 line-clamp-2 hidden md:block">{formattedDateDesktop}</p>
          {/* Venue - only show on desktop */}
          <p className="hidden md:block text-zinc-700 line-clamp-1">{session.sala.name[locale]}</p>
        </div>

        {/* Session Price & Booking */}
        <div className="flex flex-row items-center justify-between gap-2 mb-3">
          <span className="text-xl md:text-2xl font-bold text-black">
            {session.price}€
          </span>
          <button className="bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-3 md:px-6 py-1.5 md:py-2 rounded-full font-semibold text-xs md:text-base hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-md">
            {t('sessions.book')} ({session.totalPlaces})
          </button>
        </div>

        {/* Album Sale - if price is available */}
        {showAlbumSale && session.album.salePrice && session.album.inStock && (
          <div className="border-t border-zinc-300 pt-3">
            <div className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="text-xs md:text-sm text-zinc-600">
                  {t('sessions.discPrice')}
                </span>
                <span className="text-lg md:text-xl font-bold text-black">
                  {session.album.salePrice}€
                </span>
              </div>
              <button className="bg-black text-white px-3 md:px-6 py-1.5 md:py-2 rounded-full font-semibold text-xs md:text-base hover:bg-zinc-800 transition-all shadow-md">
                {t('sessions.buyDisc')}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
