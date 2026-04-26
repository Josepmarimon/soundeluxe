'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { SessionListItem, Locale } from '@/lib/sanity/types'
import AlbumCarousel from '@/components/AlbumCarousel'
import GiftModal from '@/components/GiftModal'
import GuestCheckoutForm from '@/components/GuestCheckoutForm'
import { formatSessionDateTime } from '@/lib/datetime'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface SessionCardProps {
  session: SessionListItem
  availablePlaces?: number
  showAlbumSale?: boolean
  enableFlip?: boolean
  isFlipped?: boolean
  onFlip?: () => void
}

export default function SessionCard({ session, availablePlaces, showAlbumSale = true, enableFlip = false, isFlipped = false, onFlip }: SessionCardProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const { status } = useSession()
  const router = useRouter()
  const isSoldOut = availablePlaces !== undefined && availablePlaces === 0
  const hasDate = Boolean(session.date)
  const hasVenue = Boolean(session.sala)
  const isBookable = hasDate && hasVenue && !isSoldOut

  const [numPlaces, setNumPlaces] = useState(1)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  const [accountExists, setAccountExists] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestEmail, setGuestEmail] = useState('')

  const isLoggedIn = status === 'authenticated'
  const maxPlaces = Math.min(4, availablePlaces ?? 4)
  const total = session.price * numPlaces

  useEffect(() => {
    if (!isFlipped) {
      setNumPlaces(1)
      setCheckoutError(null)
      setAccountExists(false)
      setGiftOpen(false)
    }
  }, [isFlipped])

  const goToLoginWithEmail = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const callback = `/${locale}/sessions/${session._id}`
    const params = new URLSearchParams({ callbackUrl: callback })
    if (guestEmail.trim()) params.set('email', guestEmail.trim().toLowerCase())
    router.push(`/${locale}/login?${params.toString()}`)
  }

  const handleCheckout = async (e: React.MouseEvent) => {
    e.stopPropagation()
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

  const dateIso = hasDate ? (session.date as string) : null

  // Format with weekday for desktop
  const formattedDateDesktop = dateIso
    ? formatSessionDateTime(dateIso, locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : t('sessions.dateTbd')

  // Format without weekday for mobile
  const formattedDateMobile = dateIso
    ? formatSessionDateTime(dateIso, locale, {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : t('sessions.dateTbdShort')

  const venueLabel = session.sala ? session.sala.name[locale] : t('sessions.venueTbdShort')

  if (enableFlip) {
    return (
      <article
        className="session-card-flip"
        onClick={onFlip}
      >
        <div className={`session-card-inner ${isFlipped ? 'session-card-flipped' : ''}`}>
          {/* Front Side */}
          <div className="session-card-front">
            <div className="bg-surface-alt rounded-lg overflow-hidden shadow-md h-full flex flex-col">
              {/* Album Cover Carousel */}
              <div className="relative aspect-square overflow-hidden">
                <AlbumCarousel
                  coverImage={session.album.coverImage}
                  additionalImages={session.album.additionalImages}
                  albumTitle={session.album.title}
                  artist={session.album.artist}
                />

                {/* Sold-out badge (no available-places info shown) */}
                {isSoldOut && (
                  <div className="hidden md:block absolute top-3 left-3 z-10">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full shadow-md bg-card-muted text-fg">
                      {t('booking.soldOut')}
                    </span>
                  </div>
                )}
              </div>

              {/* Session Info */}
              <div className="p-3 md:p-4 flex-1 flex flex-col">
                <a
                  href={`/${locale}/sessions/${session._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:underline"
                >
                  <h3 className="text-sm md:text-base font-bold text-black mb-0.5 line-clamp-2">
                    {session.album.title}
                  </h3>
                </a>
                <p className="text-xs md:text-sm text-zinc-700 mb-2 md:mb-3 line-clamp-1">{session.album.artist}</p>

                <div className="space-y-0.5 md:space-y-1 text-[11px] md:text-xs">
                  <p className="text-zinc-800 line-clamp-1 md:hidden">{formattedDateMobile}</p>
                  <p className="text-zinc-800 line-clamp-1 hidden md:block">{formattedDateDesktop}</p>
                </div>

                <div className="mt-auto pt-2">
                  <span className="text-lg md:text-xl font-bold text-black">{session.price}€</span>
                </div>
              </div>
            </div>
          </div>

            {/* Back Side */}
            <div className="session-card-back">
              <div
                className="bg-primary rounded-lg shadow-md h-full p-3 md:p-4 flex flex-col"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex-shrink-0 mb-2 md:mb-3">
                  <h3 className="text-sm md:text-base font-bold text-black leading-tight line-clamp-2">
                    {session.album.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-800 line-clamp-1">
                    {session.album.artist}
                  </p>
                </div>

                {isLoggedIn || !isBookable ? (
                  <div className="flex-shrink-0 space-y-1 md:space-y-1.5 text-[10px] md:text-[11px] mb-3">
                    <div className="flex items-start gap-1.5">
                      <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-black hidden md:block">{formattedDateDesktop}</span>
                      <span className="text-black md:hidden">{formattedDateMobile}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className={`line-clamp-1 ${session.sala ? 'text-black' : 'text-black/60 italic'}`}>{venueLabel}</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-black flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      <span className="text-black line-clamp-1">{session.sessionType.name[locale]}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex-shrink-0 mb-3 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-black flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <p className="text-[11px] md:text-xs font-bold text-black">
                        {t('booking.guest.subtitle')}
                      </p>
                    </div>
                    <GuestCheckoutForm
                      name={guestName}
                      email={guestEmail}
                      onNameChange={setGuestName}
                      onEmailChange={setGuestEmail}
                      disabled={checkoutLoading}
                      variant="oncolor"
                    />
                    <p className="text-[10px] text-black/70">
                      {t('booking.guest.loginHint')}{' '}
                      <button
                        type="button"
                        onClick={goToLoginWithEmail}
                        className="text-black underline font-semibold hover:text-black/80"
                      >
                        {t('booking.guest.loginInstead')}
                      </button>
                    </p>
                  </div>
                )}

                {/* Spacer pushes checkout block to the bottom (only when metadata shown) */}
                {(isLoggedIn || !isBookable) && <div className="flex-1" />}

                <div className="flex-shrink-0 border-t border-black/20 pt-2 md:pt-3 space-y-2 md:space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 md:gap-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setNumPlaces(Math.max(1, numPlaces - 1)) }}
                        disabled={numPlaces <= 1 || isSoldOut}
                        aria-label="−"
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-black text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-primary transition-colors text-sm md:text-base font-bold"
                      >
                        −
                      </button>
                      <span className="text-base md:text-lg font-black text-black w-5 md:w-6 text-center">{numPlaces}</span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setNumPlaces(Math.min(maxPlaces, numPlaces + 1)) }}
                        disabled={numPlaces >= maxPlaces || isSoldOut}
                        aria-label="+"
                        className="w-7 h-7 md:w-8 md:h-8 rounded-full border-2 border-black text-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-primary transition-colors text-sm md:text-base font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-lg md:text-xl font-black text-black">
                      {total.toFixed(0)}<span className="text-sm md:text-base font-bold">€</span>
                    </span>
                  </div>

                  {checkoutError && (
                    <div className="space-y-0.5">
                      <p className="text-red-700 text-[10px] md:text-[11px]">{checkoutError}</p>
                      {accountExists && (
                        <button
                          type="button"
                          onClick={goToLoginWithEmail}
                          className="text-black underline text-[10px] md:text-[11px] font-semibold hover:text-black/80"
                        >
                          {t('booking.guest.loginInstead')}
                        </button>
                      )}
                    </div>
                  )}

                  {isSoldOut ? (
                    <div className="w-full bg-card-muted text-fg py-1.5 md:py-2 rounded-full font-semibold text-xs md:text-sm text-center">
                      {t('booking.soldOut')}
                    </div>
                  ) : !isBookable ? (
                    <div className="w-full bg-black/10 text-black py-1.5 md:py-2 rounded-full font-semibold text-[10px] md:text-xs text-center px-2">
                      {t('sessions.bookingUnavailable')}
                    </div>
                  ) : (
                    <div className="flex w-full bg-bg text-fg rounded-full shadow-lg overflow-hidden divide-x divide-fg/15">
                      <button
                        type="button"
                        onClick={handleCheckout}
                        disabled={checkoutLoading}
                        className="flex-1 py-1.5 md:py-2 px-2 font-bold text-xs md:text-sm hover:bg-surface-raised transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {checkoutLoading ? t('booking.processing') : t('booking.bookNow')}
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setGiftOpen(true) }}
                        disabled={checkoutLoading}
                        className="py-1.5 md:py-2 px-3 md:px-4 font-bold text-xs md:text-sm hover:bg-surface-raised transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        aria-label={t('booking.gift.cta')}
                      >
                        <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                        </svg>
                        <span className="hidden sm:inline">{t('booking.gift.cta')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <GiftModal
            open={giftOpen}
            onClose={() => setGiftOpen(false)}
            sessionId={session._id}
            numPlaces={numPlaces}
            total={total}
            locale={locale}
          />
      </article>
    )
  }

  return (
    <article className="group bg-surface-alt rounded-lg overflow-hidden hover:bg-surface-alt-hover transition-colors shadow-md">
      <a href={`/${locale}/sessions/${session._id}`}>
        {/* Album Cover Carousel */}
        <div className="relative aspect-square overflow-hidden">
          <AlbumCarousel
            coverImage={session.album.coverImage}
            additionalImages={session.album.additionalImages}
            albumTitle={session.album.title}
            artist={session.album.artist}
          />

          {/* Sold-out badge (no available-places info shown) */}
          {isSoldOut && (
            <div className="hidden md:block absolute top-3 left-3 z-10">
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full shadow-md bg-card-muted text-fg">
                {t('booking.soldOut')}
              </span>
            </div>
          )}
        </div>
      </a>

      {/* Session Info - responsive sizing */}
      <div className="p-3 md:p-4">
        {/* Album & Artist */}
        <h3 className="text-sm md:text-base font-bold text-black mb-0.5 line-clamp-2">
          {session.album.title}
        </h3>
        <p className="text-xs md:text-sm text-zinc-700 mb-2 md:mb-3 line-clamp-1">{session.album.artist}</p>

        {/* Date & Venue */}
        <div className="space-y-0.5 md:space-y-1 mb-2 md:mb-3 text-[11px] md:text-xs">
          {/* Show different date format for mobile and desktop */}
          <p className="text-zinc-800 line-clamp-2 md:hidden">{formattedDateMobile}</p>
          <p className="text-zinc-800 line-clamp-2 hidden md:block">{formattedDateDesktop}</p>
          {/* Venue - only show on desktop */}
          <p className={`hidden md:block line-clamp-1 ${session.sala ? 'text-zinc-700' : 'text-zinc-500 italic'}`}>{venueLabel}</p>
        </div>

        {/* Session Price & Booking */}
        <div className="flex flex-row items-center justify-between gap-1.5 mb-2">
          <span className="text-lg md:text-xl font-bold text-black">
            {session.price}€
          </span>
          <button
            disabled={!isBookable}
            className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full font-semibold text-[10px] md:text-xs transition-all shadow-md ${
              isSoldOut
                ? 'bg-card-muted text-fg cursor-not-allowed'
                : !isBookable
                ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                : 'bg-primary text-on-primary hover:bg-primary-dark'
            }`}
          >
            {isSoldOut
              ? t('booking.soldOut')
              : !isBookable
              ? t('sessions.dateTbdShort')
              : t('sessions.book')}
          </button>
        </div>

        {/* Album Sale - if price is available */}
        {showAlbumSale && session.album.salePrice && session.album.inStock && (
          <div className="border-t border-zinc-300 pt-2">
            <div className="flex flex-row items-center justify-between gap-1.5">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs text-fg-dim">
                  {t('sessions.discPrice')}
                </span>
                <span className="text-base md:text-lg font-bold text-black">
                  {session.album.salePrice}€
                </span>
              </div>
              <button className="bg-bg text-fg px-2 md:px-4 py-1 md:py-1.5 rounded-full font-semibold text-[10px] md:text-xs hover:bg-surface-raised transition-all shadow-md">
                {t('sessions.buyDisc')}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
