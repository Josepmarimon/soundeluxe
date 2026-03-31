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
      <div className="flex items-center gap-3">
        <span className="text-zinc-400 font-semibold text-lg border border-zinc-600 rounded-full px-8 py-4">
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
        className="bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-10 py-5 rounded-full font-bold text-lg hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-lg flex items-center gap-2"
      >
        {isLoggedIn ? t('bookNow') : t('loginToBook')}
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    )
  }

  // Expanded state - place selector + checkout
  return (
    <div className="w-full">
      <div className="bg-zinc-800/80 rounded-2xl p-6 border border-zinc-700 space-y-5">
        {/* Place selector */}
        <div>
          <label className="text-sm text-zinc-400 mb-2 block">{t('selectPlaces')}</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNumPlaces(Math.max(1, numPlaces - 1))}
              disabled={numPlaces <= 1}
              className="w-10 h-10 rounded-full border border-zinc-600 text-white flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              -
            </button>
            <span className="text-2xl font-bold text-white w-8 text-center">{numPlaces}</span>
            <button
              onClick={() => setNumPlaces(Math.min(maxPlaces, numPlaces + 1))}
              disabled={numPlaces >= maxPlaces}
              className="w-10 h-10 rounded-full border border-zinc-600 text-white flex items-center justify-center hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              +
            </button>
            <span className="text-sm text-zinc-500">
              {availablePlaces} {t('available')}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-baseline justify-between pt-3 border-t border-zinc-700">
          <span className="text-zinc-400">{t('total')}</span>
          <div className="text-right">
            <span className="text-3xl font-bold text-white">{total.toFixed(2)}€</span>
            <p className="text-xs text-zinc-500 mt-1">{t('vatIncluded')}</p>
          </div>
        </div>

        {/* Cancellation note */}
        <p className="text-xs text-zinc-500 italic">
          {t('cancellationNote')}
        </p>

        {/* Error message */}
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        {/* Checkout button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black py-4 rounded-full font-bold text-lg hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
