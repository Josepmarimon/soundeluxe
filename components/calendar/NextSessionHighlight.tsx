'use client'

import { useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { parseISO, differenceInDays, differenceInHours } from 'date-fns'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'
import type { Locale, MultilingualText } from '@/lib/sanity/types'
import type { Image as SanityImage } from 'sanity'

interface CalendarSession {
  _id: string
  date: string
  price: number
  totalPlaces: number
  album: {
    _id: string
    title: string
    artist: string
    coverImage?: SanityImage
  }
  sala?: {
    _id: string
    name: MultilingualText
  }
  sessionType?: {
    _id: string
    key: string
    name: MultilingualText
  }
}

interface NextSessionHighlightProps {
  sessions: CalendarSession[]
}

export default function NextSessionHighlight({ sessions }: NextSessionHighlightProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale

  // Find the next upcoming session
  const nextSession = useMemo(() => {
    if (sessions.length === 0) return null

    const now = new Date()
    const futureSessions = sessions
      .filter((s) => parseISO(s.date) >= now)
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())

    return futureSessions[0] || null
  }, [sessions])

  if (!nextSession) return null

  const sessionDate = parseISO(nextSession.date)
  const now = new Date()
  const daysUntil = differenceInDays(sessionDate, now)
  const hoursUntil = differenceInHours(sessionDate, now)

  // Format the countdown
  const getCountdown = () => {
    if (daysUntil > 1) {
      return t('nextSession.inDays', { days: daysUntil })
    } else if (daysUntil === 1) {
      return t('nextSession.tomorrow')
    } else if (hoursUntil > 0) {
      return t('nextSession.inHours', { hours: hoursUntil })
    } else {
      return t('nextSession.today')
    }
  }

  // Format date with weekday
  const formattedDate = sessionDate.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const formattedTime = sessionDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })

  const imageUrl = nextSession.album.coverImage
    ? (urlForImage(nextSession.album.coverImage)?.width(400).height(400).url() ?? '/placeholder-album.jpg')
    : '/placeholder-album.jpg'

  return (
    <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-xl">
      {/* Header badge */}
      <div className="bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-black font-bold text-sm uppercase tracking-wide">
            {t('sessions.upcomingSession')}
          </span>
          <span className="text-black/80 font-semibold text-sm">
            {getCountdown()}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {/* Album cover */}
        <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl}
            alt={`${nextSession.album.title} - ${nextSession.album.artist}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 350px"
          />

          {/* Places badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-block px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              {nextSession.totalPlaces === 1
                ? t('sessions.onePlace')
                : t('sessions.placesAvailable', { count: nextSession.totalPlaces })}
            </span>
          </div>
        </div>

        {/* Album info */}
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-1 line-clamp-2">
            {nextSession.album.title}
          </h3>
          <p className="text-lg text-[#D4AF37] font-medium">
            {nextSession.album.artist}
          </p>
        </div>

        {/* Session metadata */}
        <div className="space-y-3 mb-5">
          {/* Date */}
          <div className="flex items-center gap-3 text-zinc-300">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t('sessions.date')}</p>
              <p className="font-medium capitalize">{formattedDate}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-3 text-zinc-300">
            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-zinc-400">{t('nextSession.time')}</p>
              <p className="font-medium">{formattedTime}</p>
            </div>
          </div>

          {/* Venue */}
          {nextSession.sala && (
            <div className="flex items-center gap-3 text-zinc-300">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t('sessions.venue')}</p>
                <p className="font-medium">{nextSession.sala.name[locale]}</p>
              </div>
            </div>
          )}

          {/* Session Type */}
          {nextSession.sessionType && (
            <div className="flex items-center gap-3 text-zinc-300">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-zinc-400">{t('sessions.sessionType')}</p>
                <p className="font-medium">{nextSession.sessionType.name[locale]}</p>
              </div>
            </div>
          )}
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-700">
          <div>
            <p className="text-sm text-zinc-400">{t('nextSession.priceFrom')}</p>
            <p className="text-3xl font-bold text-white">{nextSession.price}€</p>
          </div>
          <a
            href={`/${locale}/sessions/${nextSession._id}`}
            className="bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-6 py-3 rounded-full font-bold text-sm hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-lg flex items-center gap-2"
          >
            {t('sessions.bookNow')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}
