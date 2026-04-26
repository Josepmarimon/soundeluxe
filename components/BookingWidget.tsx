'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import GuestCheckoutForm from './GuestCheckoutForm'

interface BookingWidgetProps {
  sessionId: string
  price: number
  totalPlaces: number
  availablePlaces: number
  locale: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function BookingWidget({
  sessionId,
  price,
  totalPlaces,
  availablePlaces,
  locale,
}: BookingWidgetProps) {
  const { status } = useSession()
  const router = useRouter()
  const t = useTranslations('booking')

  const [expanded, setExpanded] = useState(false)
  const [numPlaces, setNumPlaces] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountExists, setAccountExists] = useState(false)

  const [guestEmail, setGuestEmail] = useState('')
  const [guestName, setGuestName] = useState('')

  const isLoggedIn = status === 'authenticated'
  const isSoldOut = availablePlaces === 0
  const maxPlaces = Math.min(4, availablePlaces)
  const total = price * numPlaces

  const handleBookClick = () => {
    setExpanded(true)
  }

  const handleCheckout = async () => {
    setError(null)
    setAccountExists(false)

    if (!isLoggedIn) {
      const trimmedEmail = guestEmail.trim().toLowerCase()
      const trimmedName = guestName.trim()
      if (!trimmedEmail || !trimmedName) {
        setError(t('guest.errors.missingFields'))
        return
      }
      if (!EMAIL_RE.test(trimmedEmail)) {
        setError(t('guest.errors.invalidEmail'))
        return
      }
    }

    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        sessionId,
        numPlaces,
        locale,
      }
      if (!isLoggedIn) {
        payload.guestEmail = guestEmail.trim().toLowerCase()
        payload.guestName = guestName.trim()
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
          setError(t('errors.accountExists'))
          return
        }
        if (res.status === 409) {
          setError(t('errors.soldOut'))
          return
        }
        setError(t('errors.generic'))
        return
      }

      window.location.href = data.url
    } catch {
      setError(t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  const goToLoginWithEmail = () => {
    const callback = `/${locale}/sessions/${sessionId}`
    const params = new URLSearchParams({ callbackUrl: callback })
    if (guestEmail.trim()) params.set('email', guestEmail.trim().toLowerCase())
    router.push(`/${locale}/login?${params.toString()}`)
  }

  // Sold out state
  if (isSoldOut) {
    return (
      <div className="w-full">
        <span className="w-full flex items-center justify-center text-fg-muted font-semibold text-base border border-outline-strong rounded-full py-4">
          {t('soldOut')}
        </span>
      </div>
    )
  }

  // Collapsed state - just the button
  if (!expanded) {
    return (
      <button
        onClick={handleBookClick}
        className="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-sm hover:bg-primary-hover transition-all shadow-lg flex items-center justify-center gap-1.5 group"
      >
        {t('bookNow')}
        <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }

  // Expanded state - place selector + checkout
  return (
    <div className="w-full">
      <div className="space-y-3">
        {/* Guest fields when not logged in */}
        {!isLoggedIn && (
          <div className="space-y-2">
            <p className="text-xs text-fg-muted">{t('guest.subtitle')}</p>
            <GuestCheckoutForm
              email={guestEmail}
              name={guestName}
              onEmailChange={setGuestEmail}
              onNameChange={setGuestName}
              disabled={loading}
            />
            <p className="text-[11px] text-fg-subtle">
              {t('guest.loginHint')}{' '}
              <button
                type="button"
                onClick={goToLoginWithEmail}
                className="text-fg underline hover:text-primary"
              >
                {t('guest.loginInstead')}
              </button>
            </p>
          </div>
        )}

        {/* Place selector */}
        <div>
          <label className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1.5 block">{t('selectPlaces')}</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNumPlaces(Math.max(1, numPlaces - 1))}
              disabled={numPlaces <= 1}
              className="w-8 h-8 rounded-full border border-outline-strong text-fg flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="text-lg font-bold text-fg w-6 text-center">{numPlaces}</span>
            <button
              onClick={() => setNumPlaces(Math.min(maxPlaces, numPlaces + 1))}
              disabled={numPlaces >= maxPlaces}
              className="w-8 h-8 rounded-full border border-outline-strong text-fg flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-baseline justify-between pt-2.5 border-t border-outline">
          <span className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold">{t('total')}</span>
          <span className="text-2xl font-black text-fg">{total.toFixed(2)}<span className="text-base text-fg-subtle font-bold">€</span></span>
        </div>

        {/* Error message */}
        {error && (
          <div className="space-y-2">
            <p className="text-red-400 text-xs">{error}</p>
            {accountExists && (
              <button
                type="button"
                onClick={goToLoginWithEmail}
                className="text-fg underline text-xs hover:text-primary"
              >
                {t('guest.loginInstead')}
              </button>
            )}
          </div>
        )}

        {/* Checkout button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-primary text-on-primary py-3 rounded-full font-bold text-sm hover:bg-primary-hover transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
        >
          {loading ? (
            <>
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('processing')}
            </>
          ) : (
            <>
              {t('proceedToPayment')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
