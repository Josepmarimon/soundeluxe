'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { formatSessionDateTime, resolveSessionLocale } from '@/lib/datetime'

interface Props {
  placeId: string
  placeNumber: number
  numPlaces: number
  bookingId: string
  locale: string
  attended: boolean
  attendedAt: string | null
}

export default function PlaceCheckinControls({
  placeId,
  placeNumber,
  numPlaces,
  bookingId,
  locale,
  attended: initialAttended,
  attendedAt: initialAttendedAt,
}: Props) {
  const t = useTranslations('checkin')
  const [attended, setAttended] = useState(initialAttended)
  const [attendedAt, setAttendedAt] = useState(initialAttendedAt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckin = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/checkin/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t('error'))
        return
      }

      setAttended(true)
      setAttendedAt(data.attendedAt || new Date().toISOString())
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  const scanNextHref = `/${locale}/admin/scanner`

  if (attended) {
    const time = attendedAt
      ? formatSessionDateTime(attendedAt, resolveSessionLocale(locale), { hour: '2-digit', minute: '2-digit', hour12: false })
      : ''

    return (
      <div className="space-y-3">
        <div className="bg-emerald-900/30 border border-emerald-700 rounded-2xl p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
            <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-emerald-300 font-semibold text-lg mb-1">
            {t('alreadyCheckedIn', { time })}
          </p>
          <p className="text-fg-muted text-sm">
            {t('placeOf', { current: placeNumber, total: numPlaces })}
          </p>
        </div>

        <Link
          href={scanNextHref}
          className="w-full bg-primary text-on-primary py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-primary-dark transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          {t('scanNext')}
        </Link>

        <Link
          href={`/${locale}/admin/checkin/${bookingId}`}
          className="block text-center text-fg-muted hover:text-fg text-sm py-2"
        >
          {t('viewAllPlaces', { count: numPlaces })}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        onClick={handleCheckin}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-fg py-4 rounded-2xl font-bold text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {t('processing')}
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t('validate')} — {t('placeOf', { current: placeNumber, total: numPlaces })}
          </>
        )}
      </button>

      <Link
        href={scanNextHref}
        className="block text-center text-fg-muted hover:text-fg text-sm py-2"
      >
        {t('cancel')}
      </Link>
    </div>
  )
}
