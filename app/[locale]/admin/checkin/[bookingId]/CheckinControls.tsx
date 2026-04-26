'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { formatSessionDateTime, resolveSessionLocale } from '@/lib/datetime'

interface PlaceState {
  id: string
  placeNumber: number
  attended: boolean
  attendedAt: string | null
}

interface CheckinControlsProps {
  bookingId: string
  attended: boolean
  attendedAt: string | null
  userName: string
  numPlaces: number
  places: PlaceState[]
}

export default function CheckinControls({
  bookingId,
  attended: initialAttended,
  attendedAt: initialAttendedAt,
  userName,
  numPlaces,
  places: initialPlaces,
}: CheckinControlsProps) {
  const t = useTranslations('checkin')
  const sessionLocale = resolveSessionLocale(useLocale())
  const [places, setPlaces] = useState(initialPlaces)
  const [groupAttendedAt, setGroupAttendedAt] = useState(initialAttendedAt)
  const [groupAttended, setGroupAttended] = useState(initialAttended)
  const [busyPlaceId, setBusyPlaceId] = useState<string | null>(null)
  const [busyAll, setBusyAll] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const attendedCount = places.filter((p) => p.attended).length

  const checkinPlace = async (placeId: string) => {
    setBusyPlaceId(placeId)
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

      setPlaces((prev) =>
        prev.map((p) =>
          p.id === placeId
            ? { ...p, attended: true, attendedAt: data.attendedAt || new Date().toISOString() }
            : p
        )
      )

      if (data.reserva?.attendedPlaces === numPlaces) {
        setGroupAttended(true)
        setGroupAttendedAt(data.attendedAt || new Date().toISOString())
      }
    } catch {
      setError(t('error'))
    } finally {
      setBusyPlaceId(null)
    }
  }

  const checkinAll = async () => {
    setBusyAll(true)
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

      const now = data.attendedAt || new Date().toISOString()
      setPlaces((prev) => prev.map((p) => ({ ...p, attended: true, attendedAt: now })))
      setGroupAttended(true)
      setGroupAttendedAt(now)
    } catch {
      setError(t('error'))
    } finally {
      setBusyAll(false)
    }
  }

  const time = (iso: string | null) =>
    iso ? formatSessionDateTime(iso, sessionLocale, { hour: '2-digit', minute: '2-digit', hour12: false }) : ''

  return (
    <div className="space-y-4">
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      {/* Resum del grup */}
      {groupAttended && (
        <div className="bg-emerald-900/30 border border-emerald-700 rounded-2xl p-4 text-center">
          <p className="text-emerald-300 font-semibold">
            {t('alreadyCheckedIn', { time: time(groupAttendedAt) })}
          </p>
          <p className="text-fg-muted text-sm mt-1">
            {userName} · {numPlaces} {t('places')}
          </p>
        </div>
      )}

      {!groupAttended && (
        <div className="bg-card-raised/80 rounded-2xl p-4 border border-outline">
          <p className="text-fg-muted text-sm text-center mb-3">
            {attendedCount} / {numPlaces} {t('places')}
          </p>
          <button
            onClick={checkinAll}
            disabled={busyAll || busyPlaceId !== null}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-fg py-3 rounded-2xl font-bold text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {busyAll ? (
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {t('confirmCheckin')} — {numPlaces} {t('places')}
          </button>
        </div>
      )}

      {/* Llistat de places individuals */}
      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-fg-subtle font-bold mb-2">
          {t('places')}
        </p>
        {places.map((place) => (
          <div
            key={place.id}
            className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border transition-colors ${
              place.attended
                ? 'bg-emerald-900/20 border-emerald-800/50'
                : 'bg-card-raised/60 border-outline'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${
                  place.attended ? 'bg-emerald-500/30 text-emerald-300' : 'bg-card text-fg-muted'
                }`}
              >
                {place.placeNumber}
              </div>
              <div className="min-w-0">
                <p className="text-fg text-sm font-medium">
                  {t('placeOf', { current: place.placeNumber, total: numPlaces })}
                </p>
                {place.attended && place.attendedAt && (
                  <p className="text-emerald-400 text-xs">{time(place.attendedAt)}</p>
                )}
              </div>
            </div>

            {place.attended ? (
              <span className="text-emerald-400 flex-shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </span>
            ) : (
              <button
                onClick={() => checkinPlace(place.id)}
                disabled={busyPlaceId !== null || busyAll}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-fg font-semibold text-xs disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              >
                {busyPlaceId === place.id ? t('processing') : t('validate')}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
