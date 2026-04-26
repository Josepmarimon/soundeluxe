'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { parseISO, differenceInDays, differenceInHours } from 'date-fns'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'
import type { Locale, MultilingualText } from '@/lib/sanity/types'
import type { Image as SanityImage } from 'sanity'
import GiftModal from '@/components/GiftModal'
import GuestCheckoutForm from '@/components/GuestCheckoutForm'
import { formatSessionDateTime } from '@/lib/datetime'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
    address?: {
      street: string
      city: string
      postalCode?: string
      country?: string
      googleMapsUrl?: string
      coordinates?: {
        lat: number
        lng: number
      }
    }
  }
  sessionType?: {
    _id: string
    key: string
    name: MultilingualText
  }
}

interface SessionHighlightProps {
  sessions: CalendarSession[]
  availability?: Record<string, number>
  isNextSession: boolean
  selectedDate?: Date
}

export default function SessionHighlight({ sessions, availability, isNextSession, selectedDate }: SessionHighlightProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const { status } = useSession()
  const router = useRouter()
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number | null>(null)

  const [numPlaces, setNumPlaces] = useState(1)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [accountExists, setAccountExists] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  useEffect(() => {
    if (sessions.length === 0) {
      setSelectedSessionIndex(null)
    } else if (isNextSession && sessions.length > 1) {
      setSelectedSessionIndex(null)
    } else {
      setSelectedSessionIndex(0)
    }
    setNumPlaces(1)
    setCheckoutError(null)
    setAccountExists(false)
    setGiftOpen(false)
  }, [sessions, isNextSession])

  useEffect(() => {
    setNumPlaces(1)
    setCheckoutError(null)
    setAccountExists(false)
    setGiftOpen(false)
  }, [selectedSessionIndex])

  if (sessions.length === 0 || !selectedDate) {
    return (
      <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-outline-subtle p-8 h-full flex items-center justify-center">
        <p className="text-fg-subtle text-center">{t('calendar.selectDate')}</p>
      </div>
    )
  }

  const safeIndex = Math.min(Math.max(selectedSessionIndex ?? 0, 0), sessions.length - 1)
  const session = sessions[safeIndex]
  const hasSelection = selectedSessionIndex !== null
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

  // Format date with weekday — always in Madrid TZ.
  const formattedDate = formatSessionDateTime(sessionDate, locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const formattedTime = formatSessionDateTime(sessionDate, locale, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  const imageUrl = session.album.coverImage
    ? (urlForImage(session.album.coverImage)?.width(500).height(500).url() ?? '/placeholder-album.jpg')
    : '/placeholder-album.jpg'

  const sessionAvailable = availability?.[session._id] ?? session.totalPlaces
  const isSoldOut = sessionAvailable === 0
  const hasVenue = Boolean(session.sala)
  const isBookable = hasVenue && !isSoldOut
  const maxPlaces = Math.min(4, sessionAvailable)
  const total = session.price * numPlaces

  const isLoggedIn = status === 'authenticated'

  const goToLoginWithEmail = () => {
    const callback = `/${locale}/sessions/${session._id}`
    const params = new URLSearchParams({ callbackUrl: callback })
    if (guestEmail.trim()) params.set('email', guestEmail.trim().toLowerCase())
    router.push(`/${locale}/login?${params.toString()}`)
  }

  const handleCheckout = async () => {
    setCheckoutError(null)
    setAccountExists(false)

    let trimmedEmail = ''
    let trimmedName = ''
    if (!isLoggedIn) {
      trimmedEmail = guestEmail.trim().toLowerCase()
      trimmedName = guestName.trim()
      if (!trimmedEmail || !trimmedName) {
        setCheckoutError(t('booking.guest.errors.missingFields'))
        return
      }
      if (!EMAIL_RE.test(trimmedEmail)) {
        setCheckoutError(t('booking.guest.errors.invalidEmail'))
        return
      }
    }

    setCheckoutLoading(true)
    try {
      const payload: Record<string, unknown> = { sessionId: session._id, numPlaces, locale }
      if (!isLoggedIn) {
        payload.guestEmail = trimmedEmail
        payload.guestName = trimmedName
      }
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        if (res.status === 409 && data?.code === 'ACCOUNT_EXISTS') {
          setAccountExists(true)
          setCheckoutError(t('booking.errors.accountExists'))
          return
        }
        if (res.status === 409) {
          setCheckoutError(t('booking.errors.soldOut'))
          return
        }
        if (res.status === 401) {
          router.push(`/${locale}/login?callbackUrl=/${locale}/sessions/${session._id}`)
          return
        }
        setCheckoutError(t('booking.errors.generic'))
        return
      }
      window.location.href = data.url
    } catch {
      setCheckoutError(t('booking.errors.generic'))
    } finally {
      setCheckoutLoading(false)
    }
  }

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
                <div className="flex items-center gap-2.5 text-fg col-span-2 sm:col-span-1">
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

                {/* Venue */}
                {session.sala && (() => {
                  const street = session.sala.address?.street
                  const city = session.sala.address?.city
                  const coords = session.sala.address?.coordinates
                  const mapsUrl = session.sala.address?.googleMapsUrl
                  const query = coords
                    ? `${coords.lat},${coords.lng}`
                    : [street, city].filter(Boolean).join(', ')
                  const venueHref =
                    mapsUrl ||
                    (query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null)
                  const venueName = session.sala.name[locale]

                  return (
                    <div className="flex items-center gap-2.5 text-fg col-span-2 sm:col-span-1">
                      <div className="w-8 h-8 rounded-full bg-card-raised flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-fg-subtle">{t('sessions.venue')}</p>
                        {venueHref ? (
                          <a
                            href={venueHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:underline line-clamp-1"
                          >
                            {venueName}
                          </a>
                        ) : (
                          <p className="text-sm font-medium">{venueName}</p>
                        )}
                      </div>
                    </div>
                  )
                })()}

                {/* Session Type */}
                {session.sessionType && (
                  <div className="flex items-center gap-2.5 text-fg col-span-2 sm:col-span-1">
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

                {/* Time / Session selector */}
                <div className={`flex items-start gap-2.5 text-fg ${sessions.length > 1 ? 'col-span-2' : 'col-span-2 sm:col-span-1'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    !hasSelection && sessions.length > 1 ? 'bg-primary/20 ring-2 ring-primary' : 'bg-card-raised'
                  }`}>
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className={`min-w-0 flex-1 transition-all ${
                    !hasSelection && sessions.length > 1
                      ? 'rounded-lg ring-2 ring-primary/60 bg-primary/5 p-3 -m-1'
                      : ''
                  }`}>
                    <p className={`${
                      !hasSelection && sessions.length > 1
                        ? 'text-sm font-bold text-primary'
                        : 'text-xs text-fg-subtle'
                    }`}>
                      {sessions.length > 1 ? t('calendar.pickSession') : t('nextSession.time')}
                    </p>
                    {sessions.length > 1 ? (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {sessions.map((s, idx) => {
                          const sTime = formatSessionDateTime(s.date, locale, {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                          })
                          const isActive = idx === selectedSessionIndex
                          return (
                            <button
                              key={s._id}
                              type="button"
                              onClick={() => setSelectedSessionIndex(idx)}
                              aria-pressed={isActive}
                              className={`session-pill flex flex-col items-start px-3 py-1 rounded-lg border transition-all ${
                                isActive
                                  ? 'border-primary bg-primary/15'
                                  : !hasSelection
                                  ? 'border-primary/60 bg-card hover:bg-primary/10 hover:border-primary'
                                  : 'border-outline hover:bg-card-hover/50'
                              }`}
                            >
                              <span className={`session-pill-time text-sm font-bold leading-tight ${isActive ? 'text-primary' : 'text-fg'}`}>
                                {sTime}
                              </span>
                              {s.durationMinutes ? (
                                <span className="text-[10px] text-fg-muted leading-tight">
                                  {s.durationMinutes} min
                                </span>
                              ) : null}
                            </button>
                          )
                        })}
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium">{formattedTime}</p>
                        {session.durationMinutes ? (
                          <p className="text-xs text-fg-muted">{session.durationMinutes} min</p>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: guest fields (if not logged in) + place selector + total + buy/gift */}
            <div className="pt-4 border-t border-outline space-y-3">
              {!isLoggedIn && isBookable && hasSelection && (
                <div className="rounded-xl border border-primary/40 bg-primary/5 p-3 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs font-semibold text-fg">
                      {t('booking.guest.subtitle')}
                    </p>
                  </div>
                  <GuestCheckoutForm
                    name={guestName}
                    email={guestEmail}
                    onNameChange={setGuestName}
                    onEmailChange={setGuestEmail}
                    disabled={checkoutLoading}
                    variant="compact"
                  />
                  <p className="text-[11px] text-fg-subtle">
                    {t('booking.guest.loginHint')}{' '}
                    <button
                      type="button"
                      onClick={goToLoginWithEmail}
                      className="text-fg underline hover:text-primary"
                    >
                      {t('booking.guest.loginInstead')}
                    </button>
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1">{t('booking.selectPlaces')}</p>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setNumPlaces(Math.max(1, numPlaces - 1))}
                      disabled={numPlaces <= 1 || isSoldOut}
                      className="w-9 h-9 rounded-full border border-outline-strong text-fg flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
                    >
                      −
                    </button>
                    <span className="text-xl font-black text-fg w-7 text-center">{numPlaces}</span>
                    <button
                      type="button"
                      onClick={() => setNumPlaces(Math.min(maxPlaces, numPlaces + 1))}
                      disabled={numPlaces >= maxPlaces || isSoldOut}
                      className="w-9 h-9 rounded-full border border-outline-strong text-fg flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1">{t('booking.total')}</p>
                  <p className="text-3xl font-black text-fg">
                    {total.toFixed(2)}<span className="text-base font-bold text-fg-subtle">€</span>
                  </p>
                </div>
              </div>

              {checkoutError && (
                <div className="space-y-1">
                  <p className="text-red-400 text-xs">{checkoutError}</p>
                  {accountExists && (
                    <button
                      type="button"
                      onClick={goToLoginWithEmail}
                      className="text-fg underline text-xs hover:text-primary"
                    >
                      {t('booking.guest.loginInstead')}
                    </button>
                  )}
                </div>
              )}

              {isSoldOut ? (
                <div className="w-full bg-card-muted text-fg-muted px-6 py-3 rounded-full font-bold text-sm shadow-lg text-center">
                  {t('booking.soldOut')}
                </div>
              ) : !isBookable ? (
                <div className="w-full bg-card-raised text-fg-subtle px-6 py-3 rounded-full font-semibold text-xs text-center border border-outline">
                  {t('sessions.bookingUnavailable')}
                </div>
              ) : !hasSelection ? (
                <div
                  aria-disabled="true"
                  className="w-full bg-card-muted text-fg-subtle px-6 py-3 rounded-full font-semibold text-sm text-center border border-outline cursor-not-allowed"
                >
                  ↑ {t('calendar.selectSessionFirst')}
                </div>
              ) : (
                <div className="flex w-full bg-primary text-on-primary rounded-full shadow-lg overflow-hidden divide-x divide-on-primary/30">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={checkoutLoading || !hasSelection}
                    className="flex-1 px-4 py-3 font-bold text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {checkoutLoading ? t('booking.processing') : t('booking.bookNow')}
                    {!checkoutLoading && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGiftOpen(true)}
                    disabled={checkoutLoading || !hasSelection}
                    className="px-4 py-3 font-bold text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    {t('booking.gift.cta')}
                  </button>
                </div>
              )}
            </div>

            <GiftModal
              open={giftOpen}
              onClose={() => setGiftOpen(false)}
              sessionId={session._id}
              numPlaces={numPlaces}
              total={total}
              locale={locale}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
