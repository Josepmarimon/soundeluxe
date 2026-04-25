'use client'

import { useEffect, useState } from 'react'
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
  durationMinutes?: number
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
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(
    sessions.length === 1 ? 0 : null
  )

  useEffect(() => {
    setSelectedSessionIndex(sessions.length === 1 ? 0 : null)
  }, [sessions])

  if (sessions.length === 0 || !selectedDate) {
    return (
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-outline-subtle p-8 h-full flex items-center justify-center">
        <p className="text-fg-subtle text-center">{t('calendar.selectDate')}</p>
      </div>
    )
  }

  const hasSelection = selectedSessionIndex !== null
  const safeIndex =
    selectedSessionIndex !== null ? Math.min(selectedSessionIndex, sessions.length - 1) : 0
  const session = sessions[safeIndex]
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
    <div className="session-highlight-card bg-card/90 backdrop-blur-sm rounded-2xl border border-primary/30 overflow-hidden shadow-xl h-full">
      {/* Header badge */}
      <div className="bg-primary px-4 py-2.5">
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

            </div>
          </div>

          {/* Info - Right side */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Album info */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-fg mb-2 line-clamp-2">
                {session.album.title}
              </h3>
              <p className="text-xl text-primary font-medium mb-4">
                {session.album.artist}
              </p>

              {/* Session metadata - Grid layout */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Date */}
                <div className="flex items-center gap-2.5 text-fg">
                  <div className="w-8 h-8 rounded-full bg-card-raised flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-fg-subtle">{t('sessions.date')}</p>
                    <p className="text-sm font-medium capitalize">{formattedDate}</p>
                  </div>
                </div>

                {/* Time / Session selector */}
                <div className={`flex items-start gap-2.5 text-fg ${sessions.length > 1 ? 'col-span-2' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-card-raised flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-fg-subtle">
                      {sessions.length > 1 ? t('calendar.pickSession') : t('nextSession.time')}
                    </p>
                    {sessions.length > 1 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {sessions.map((s, idx) => {
                          const sTime = parseISO(s.date).toLocaleTimeString(locale, {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                          const isActive = hasSelection && idx === safeIndex
                          return (
                            <button
                              key={s._id}
                              type="button"
                              onClick={() => setSelectedSessionIndex(idx)}
                              aria-pressed={isActive}
                              className={`session-pill flex flex-col items-start px-3 py-1 rounded-lg border transition-all ${
                                isActive
                                  ? 'border-primary bg-primary/15'
                                  : 'border-outline hover:bg-card-hover/50'
                              }`}
                            >
                              <span className={`session-pill-time text-sm font-bold leading-tight ${isActive ? 'text-primary' : 'text-fg'}`}>
                                {sTime}
                              </span>
                              <span className="text-[10px] text-fg-muted leading-tight">
                                {s.durationMinutes ? `${s.durationMinutes} min · ` : ''}
                                {t('sessions.placesShort', { count: s.totalPlaces })}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium">{formattedTime}</p>
                        <p className="text-xs text-fg-muted">
                          {session.durationMinutes ? `${session.durationMinutes} min · ` : ''}
                          {t('sessions.placesShort', { count: session.totalPlaces })}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Venue */}
                {hasSelection && session.sala && (
                  <div className="flex items-center gap-2.5 text-fg">
                    <div className="w-8 h-8 rounded-full bg-card-raised flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-fg-subtle">{t('sessions.venue')}</p>
                      <p className="text-sm font-medium">{session.sala.name[locale]}</p>
                    </div>
                  </div>
                )}

                {/* Session Type */}
                {hasSelection && session.sessionType && (
                  <div className="flex items-center gap-2.5 text-fg">
                    <div className="w-8 h-8 rounded-full bg-card-raised flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-fg-subtle">{t('sessions.sessionType')}</p>
                      <p className="text-sm font-medium">{session.sessionType.name[locale]}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-outline">
              <div>
                <p className="text-xs text-fg-subtle">{t('nextSession.priceFrom')}</p>
                <p className="text-3xl font-bold text-fg">{hasSelection ? `${session.price}€` : '—'}</p>
              </div>
              {hasSelection ? (
                <a
                  key={session._id}
                  href={`/${locale}/sessions/${session._id}`}
                  className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-dark transition-all shadow-lg flex items-center gap-2"
                >
                  {t('sessions.bookNow')}
                  {sessions.length > 1 && (
                    <span className="font-semibold opacity-80">· {formattedTime}</span>
                  )}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  aria-disabled="true"
                  className="bg-card-muted text-fg-muted px-6 py-3 rounded-full font-bold text-sm shadow-lg flex items-center gap-2 cursor-not-allowed opacity-70"
                >
                  {t('calendar.selectSessionFirst')}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
