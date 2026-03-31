'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface CheckinControlsProps {
  bookingId: string
  attended: boolean
  attendedAt: string | null
  userName: string
  numPlaces: number
}

export default function CheckinControls({
  bookingId,
  attended: initialAttended,
  attendedAt: initialAttendedAt,
  userName,
  numPlaces,
}: CheckinControlsProps) {
  const t = useTranslations('checkin')
  const [attended, setAttended] = useState(initialAttended)
  const [attendedAt, setAttendedAt] = useState(initialAttendedAt)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckin = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t('error'))
        return
      }

      if (data.alreadyCheckedIn) {
        setAttended(true)
        setAttendedAt(data.attendedAt)
        return
      }

      if (data.success) {
        setAttended(true)
        setAttendedAt(data.attendedAt)
      }
    } catch {
      setError(t('error'))
    } finally {
      setLoading(false)
    }
  }

  if (attended) {
    const time = attendedAt
      ? new Date(attendedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      : ''

    return (
      <div className="bg-emerald-900/30 border border-emerald-700 rounded-2xl p-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-4">
          <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-emerald-300 font-semibold text-lg mb-1">
          {t('alreadyCheckedIn', { time })}
        </p>
        <p className="text-zinc-400 text-sm">
          {userName} · {numPlaces} {t('places')}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      <button
        onClick={handleCheckin}
        disabled={loading}
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
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
            {t('confirmCheckin')} — {numPlaces} {t('places')}
          </>
        )}
      </button>
    </div>
  )
}
