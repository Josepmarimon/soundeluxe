'use client'

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

interface SessionHighlightProps {
  sessions: CalendarSession[]
  isNextSession: boolean
  selectedDate?: Date
}

export default function SessionHighlight({ sessions, isNextSession, selectedDate }: SessionHighlightProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale

  if (sessions.length === 0 || !selectedDate) {
    return (
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 h-full flex items-center justify-center">
        <p className="text-zinc-500 text-center">{t('calendar.selectDate')}</p>
      </div>
    )
  }

  // Use first session for main display
  const session = sessions[0]
  const sessionDate = parseISO(session.date)
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

  const imageUrl = session.album.coverImage
    ? (urlForImage(session.album.coverImage)?.width(500).height(500).url() ?? '/placeholder-album.jpg')
    : '/placeholder-album.jpg'

  return (
    <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-xl h-full">
      {/* Header badge */}
      <div className="bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] px-4 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-black font-bold text-sm uppercase tracking-wide">
            {isNextSession ? t('sessions.upcomingSession') : t('calendar.sessionsOnDate')}
          </span>
          {isNextSession && (
            <span className="text-black/80 font-semibold text-sm">
              {getCountdown()}
            </span>
          )}
          {sessions.length > 1 && (
            <span className="text-black/70 text-sm">
              {t('calendar.sessionsCount', { count: sessions.length })}
            </span>
          )}
        </div>
      </div>

      {/* Content - Horizontal layout */}
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Album cover - Left side */}
          <div className="w-full md:w-2/5 flex-shrink-0">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src={imageUrl}
                alt={`${session.album.title} - ${session.album.artist}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />

              {/* Places badge */}
              <div className="absolute top-3 right-3">
                <span className="inline-block px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {session.totalPlaces === 1
                    ? t('sessions.onePlace')
                    : t('sessions.placesAvailable', { count: session.totalPlaces })}
                </span>
              </div>
            </div>
          </div>

          {/* Info - Right side */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Album info */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 line-clamp-2">
                {session.album.title}
              </h3>
              <p className="text-xl text-[#D4AF37] font-medium mb-4">
                {session.album.artist}
              </p>

              {/* Session metadata - Grid layout */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Date */}
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">{t('sessions.date')}</p>
                    <p className="text-sm font-medium capitalize">{formattedDate}</p>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-2.5 text-zinc-300">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">{t('nextSession.time')}</p>
                    <p className="text-sm font-medium">{formattedTime}</p>
                  </div>
                </div>

                {/* Venue */}
                {session.sala && (
                  <div className="flex items-center gap-2.5 text-zinc-300">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">{t('sessions.venue')}</p>
                      <p className="text-sm font-medium">{session.sala.name[locale]}</p>
                    </div>
                  </div>
                )}

                {/* Session Type */}
                {session.sessionType && (
                  <div className="flex items-center gap-2.5 text-zinc-300">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500">{t('sessions.sessionType')}</p>
                      <p className="text-sm font-medium">{session.sessionType.name[locale]}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-zinc-700">
              <div>
                <p className="text-xs text-zinc-500">{t('nextSession.priceFrom')}</p>
                <p className="text-3xl font-bold text-white">{session.price}€</p>
              </div>
              <a
                href={`/${locale}/sessions/${session._id}`}
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

        {/* Additional sessions on the same date */}
        {sessions.length > 1 && (
          <div className="mt-6 pt-5 border-t border-zinc-700">
            <p className="text-sm text-zinc-400 mb-3">{t('calendar.moreSessions')}</p>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {sessions.slice(1).map((s) => {
                const sImageUrl = s.album.coverImage
                  ? (urlForImage(s.album.coverImage)?.width(100).height(100).url() ?? '/placeholder-album.jpg')
                  : '/placeholder-album.jpg'
                const sTime = parseISO(s.date).toLocaleTimeString(locale, {
                  hour: '2-digit',
                  minute: '2-digit',
                })

                return (
                  <a
                    key={s._id}
                    href={`/${locale}/sessions/${s._id}`}
                    className="flex-shrink-0 flex items-center gap-3 bg-zinc-800/50 rounded-lg p-2 hover:bg-zinc-700/50 transition-colors"
                  >
                    <div className="relative w-12 h-12 rounded overflow-hidden">
                      <Image
                        src={sImageUrl}
                        alt={s.album.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate max-w-[120px]">{s.album.title}</p>
                      <p className="text-xs text-zinc-400">{sTime} · {s.price}€</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
