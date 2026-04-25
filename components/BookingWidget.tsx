'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

interface BookingWidgetProps {
  sessionId: string
  price: number
  totalPlaces: number
  availablePlaces: number
  locale: string
}

export default function BookingWidget({
  sessionId,
  price,
  totalPlaces,
  availablePlaces,
  locale,
}: BookingWidgetProps) {
  const { data: authSession, status } = useSession()
  const router = useRouter()
  const t = useTranslations('booking')

  const [expanded, setExpanded] = useState(false)
  const [numPlaces, setNumPlaces] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLoggedIn = status === 'authenticated'
  const isSoldOut = availablePlaces === 0
  const maxPlaces = Math.min(4, availablePlaces)
  const total = price * numPlaces

  const handleBookClick = () => {
    if (!isLoggedIn) {
      router.push(`/${locale}/login?callbackUrl=/${locale}/sessions/${sessionId}`)
      return
    }
    setExpanded(true)
  }

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, numPlaces, locale }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409) {
          setError(t('errors.soldOut'))
          return
        }
        if (res.status === 401) {
          router.push(`/${locale}/login?callbackUrl=/${locale}/sessions/${sessionId}`)
          return
        }
        setError(t('errors.generic'))
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch {
      setError(t('errors.generic'))
    } finally {
      setLoading(false)
    }
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
        {isLoggedIn ? t('bookNow') : t('loginToBook')}
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
          <p className="text-red-400 text-xs">{error}</p>
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
