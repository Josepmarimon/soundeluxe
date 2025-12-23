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

  const formattedDate = date.toLocaleDateString(locale, {
    weekday: 'long',
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

          {/* Available spots badge - positioned at top */}
          <div className="absolute top-4 left-4 z-10">
            <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black text-xs font-semibold rounded-full shadow-md">
              {session.totalPlaces === 1
                ? t('sessions.onePlace')
                : t('sessions.placesAvailable', { count: session.totalPlaces })}
            </span>
          </div>
        </div>
      </a>

      {/* Session Info */}
      <div className="p-6">
        {/* Album & Artist */}
        <h3 className="text-xl font-bold text-black mb-1">
          {session.album.title}
        </h3>
        <p className="text-zinc-700 mb-4">{session.album.artist}</p>

        {/* Date & Venue */}
        <div className="space-y-2 mb-4 text-sm">
          <p className="text-zinc-800">{formattedDate}</p>
          <p className="text-zinc-700">{session.sala.name[locale]}</p>
        </div>

        {/* Price & Booking */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-black">
            {session.price}€
          </span>
          <button className="bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-6 py-2 rounded-full font-semibold hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-md">
            {t('sessions.bookNow')}
          </button>
        </div>
      </div>
    </article>
  )
}
