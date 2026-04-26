'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { formatSessionDateTime, resolveSessionLocale } from '@/lib/datetime'

interface SessionOption {
  _id: string
  date: string
  album: { title: string; artist: string }
  sala: { name: Record<string, string> }
}

interface BookingEntry {
  id: string
  userName: string
  userEmail: string
  numPlaces: number
  attended: boolean
  attendedAt: string | null
  paymentMethod: string
}

interface AttendanceData {
  bookings: BookingEntry[]
  summary: {
    totalBookings: number
    totalPlaces: number
    checkedInPlaces: number
  }
}

interface AttendanceDashboardProps {
  sessions: SessionOption[]
  locale: string
}

export default function AttendanceDashboard({ sessions, locale }: AttendanceDashboardProps) {
  const t = useTranslations('attendance')
  const [selectedSessionId, setSelectedSessionId] = useState<string>('')
  const [data, setData] = useState<AttendanceData | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchAttendance = useCallback(async (sessionId: string) => {
    if (!sessionId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/attendance?sessionId=${sessionId}`)
      if (res.ok) {
        const result = await res.json()
        setData(result)
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedSessionId) {
      fetchAttendance(selectedSessionId)
      // Auto-refresh every 30 seconds
      const interval = setInterval(() => fetchAttendance(selectedSessionId), 30000)
      return () => clearInterval(interval)
    }
  }, [selectedSessionId, fetchAttendance])

  const sessionLocale = resolveSessionLocale(locale)

  return (
    <div>
      {/* Session selector */}
      <div className="mb-8">
        <label className="text-sm text-fg-muted mb-2 block">{t('selectSession')}</label>
        <select
          value={selectedSessionId}
          onChange={(e) => setSelectedSessionId(e.target.value)}
          className="w-full bg-card-raised border border-outline text-fg rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
        >
          <option value="">{t('selectSession')}...</option>
          {sessions.map((s) => {
            const date = s.date
              ? formatSessionDateTime(s.date, sessionLocale, {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                })
              : t('dateTbd')
            return (
              <option key={s._id} value={s._id}>
                {s.album.title} — {s.album.artist} ({date})
              </option>
            )
          })}
        </select>
      </div>

      {loading && !data && (
        <div className="text-center py-12">
          <svg className="animate-spin w-8 h-8 text-primary mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {data && (
        <>
          {/* Summary bar */}
          <div className="bg-card-raised/80 rounded-2xl p-6 border border-outline mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-fg-muted">{t('checkedIn')}</span>
              <span className="text-fg font-bold text-2xl">
                {data.summary.checkedInPlaces} / {data.summary.totalPlaces}
              </span>
            </div>
            <div className="w-full bg-card-hover rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: data.summary.totalPlaces > 0
                    ? `${(data.summary.checkedInPlaces / data.summary.totalPlaces) * 100}%`
                    : '0%',
                }}
              />
            </div>
            <p className="text-fg-subtle text-sm mt-2">
              {data.summary.totalBookings} {t('totalBookings')}
            </p>
          </div>

          {/* Bookings list */}
          {data.bookings.length === 0 ? (
            <p className="text-fg-subtle text-center py-8">{t('noBookings')}</p>
          ) : (
            <div className="space-y-3">
              {data.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    booking.attended
                      ? 'bg-emerald-900/20 border-emerald-800'
                      : 'bg-card-raised/50 border-outline'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${booking.attended ? 'bg-emerald-400' : 'bg-card-muted'}`} />
                    <div>
                      <p className="text-fg font-medium text-sm">{booking.userName}</p>
                      <p className="text-fg-subtle text-xs">{booking.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-fg-muted text-sm">
                      {booking.numPlaces} {t('places')}
                    </span>
                    {booking.attended ? (
                      <span className="text-emerald-400 text-xs">
                        {booking.attendedAt && formatSessionDateTime(booking.attendedAt, sessionLocale, { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </span>
                    ) : (
                      <span className="text-fg-dim text-xs">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
