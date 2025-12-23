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
    <article className="group bg-zinc-900 rounded-lg overflow-hidden hover:bg-zinc-800 transition-colors">
      <a href={`/${locale}/sessions/${session._id}`}>
        {/* Album Cover Carousel */}
        <div className="relative aspect-square overflow-hidden">
          <AlbumCarousel
            coverImage={session.album.coverImage}
            additionalImages={session.album.additionalImages}
            albumTitle={session.album.title}
            artist={session.album.artist}
          />
        </div>
      </a>

      {/* Session Info */}
      <div className="p-6">
        {/* Session Type Badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-full">
            {session.sessionType.name[locale]}
          </span>
        </div>

        {/* Album & Artist */}
        <h3 className="text-xl font-bold text-white mb-1">
          {session.album.title}
        </h3>
        <p className="text-zinc-300 mb-4">{session.album.artist}</p>

        {/* Date & Venue */}
        <div className="space-y-2 mb-4 text-sm">
          <p className="text-zinc-200">{formattedDate}</p>
          <p className="text-zinc-300">{session.sala.name[locale]}</p>
        </div>

        {/* Price & Booking */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">
            {session.price}€
          </span>
          <button className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-zinc-200 transition-colors">
            {t('sessions.bookNow')}
          </button>
        </div>

        {/* Available spots */}
        <p className="text-zinc-400 text-xs mt-3">
          {session.totalPlaces === 1
            ? t('sessions.onePlace')
            : t('sessions.placesAvailable', { count: session.totalPlaces })}
        </p>
      </div>
    </article>
  )
}
