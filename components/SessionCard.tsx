'use client'

import { useLocale, useTranslations } from 'next-intl'
import type { SessionListItem, Locale } from '@/lib/sanity/types'
import AlbumCarousel from '@/components/AlbumCarousel'

interface SessionCardProps {
  session: SessionListItem
}

export default function SessionCard({ session }: SessionCardProps) {
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
        {session.album.salePrice && session.album.inStock && (
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
