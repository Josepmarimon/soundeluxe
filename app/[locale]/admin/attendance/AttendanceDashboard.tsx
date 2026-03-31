'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'

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

  const dateLocaleMap: Record<string, string> = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB' }

  return (
    <div>
      {/* Session selector */}
      <div className="mb-8">
        <label className="text-sm text-zinc-400 mb-2 block">{t('selectSession')}</label>
        <select
          value={selectedSessionId}
          onChange={(e) => setSelectedSessionId(e.target.value)}
          className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
        >
          <option value="">{t('selectSession')}...</option>
          {sessions.map((s) => {
            const date = new Date(s.date).toLocaleDateString(dateLocaleMap[locale], {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })
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
          <svg className="animate-spin w-8 h-8 text-[#D4AF37] mx-auto" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {data && (
        <>
          {/* Summary bar */}
          <div className="bg-zinc-800/80 rounded-2xl p-6 border border-zinc-700 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-zinc-400">{t('checkedIn')}</span>
              <span className="text-white font-bold text-2xl">
                {data.summary.checkedInPlaces} / {data.summary.totalPlaces}
              </span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-3">
              <div
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: data.summary.totalPlaces > 0
                    ? `${(data.summary.checkedInPlaces / data.summary.totalPlaces) * 100}%`
                    : '0%',
                }}
              />
            </div>
            <p className="text-zinc-500 text-sm mt-2">
              {data.summary.totalBookings} {t('totalBookings')}
            </p>
          </div>

          {/* Bookings list */}
          {data.bookings.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">{t('noBookings')}</p>
          ) : (
            <div className="space-y-3">
              {data.bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    booking.attended
                      ? 'bg-emerald-900/20 border-emerald-800'
                      : 'bg-zinc-800/50 border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${booking.attended ? 'bg-emerald-400' : 'bg-zinc-600'}`} />
                    <div>
                      <p className="text-white font-medium text-sm">{booking.userName}</p>
                      <p className="text-zinc-500 text-xs">{booking.userEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-zinc-400 text-sm">
                      {booking.numPlaces} {t('places')}
                    </span>
                    {booking.attended ? (
                      <span className="text-emerald-400 text-xs">
                        {booking.attendedAt && new Date(booking.attendedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    ) : (
                      <span className="text-zinc-600 text-xs">—</span>
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
