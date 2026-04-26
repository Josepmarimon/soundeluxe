'use client'

import { useState, useMemo, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { DayPicker } from 'react-day-picker'
import { ca, es, enUS } from 'date-fns/locale'
import { AnimatePresence, motion } from 'framer-motion'
import type { Locale, MultilingualText } from '@/lib/sanity/types'
import type { Image as SanityImage } from 'sanity'
import SessionHighlight from './SessionHighlight'
import { getSessionDayKey } from '@/lib/datetime'
import './calendarStyles.css'

const dateFnsLocales: Record<string, typeof ca> = {
  ca: ca,
  es: es,
  en: enUS,
}

export interface CalendarSession {
  _id: string
  date?: string
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

interface SessionsCalendarProps {
  sessions: CalendarSession[]
  availability?: Record<string, number>
  title?: string
}

export default function SessionsCalendar({ sessions, availability, title }: SessionsCalendarProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale

  const dateFnsLocale = dateFnsLocales[locale] || enUS

  // Calendar can only display sessions with a confirmed date.
  type DatedSession = CalendarSession & { date: string }
  const datedSessions = useMemo(
    () => sessions.filter((s): s is DatedSession => Boolean(s.date)),
    [sessions]
  )

  // Group sessions by Madrid calendar day (string key) so a session at
  // 23:30 UTC near midnight always lands on the right Spanish day.
  const sessionDates = useMemo(() => {
    const dateMap = new Map<string, DatedSession[]>()

    datedSessions.forEach((session) => {
      const dateKey = getSessionDayKey(session.date)
      const existing = dateMap.get(dateKey) || []
      dateMap.set(dateKey, [...existing, session])
    })

    return dateMap
  }, [datedSessions])

  // Get the first future session date.
  // Uses absolute time comparison (TZ-agnostic via getTime).
  const firstFutureSessionDate = useMemo(() => {
    if (datedSessions.length === 0) return undefined

    const nowMs = Date.now()
    const futureSessions = datedSessions
      .map((s) => ({ s, ms: new Date(s.date).getTime() }))
      .filter(({ ms }) => ms >= nowMs)
      .sort((a, b) => a.ms - b.ms)

    if (futureSessions.length === 0) return undefined

    // Return the Date that DayPicker should highlight: the Madrid day of the
    // first upcoming session, anchored at local midnight so the calendar grid
    // (which renders in browser TZ) selects the visually correct cell.
    const dayKey = getSessionDayKey(futureSessions[0].s.date)
    const [y, m, d] = dayKey.split('-').map(Number)
    return new Date(y, m - 1, d)
  }, [datedSessions])

  // Initialize selected date with the first future session date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(firstFutureSessionDate)

  // Update selected date when firstFutureSessionDate changes
  useEffect(() => {
    if (firstFutureSessionDate && !selectedDate) {
      setSelectedDate(firstFutureSessionDate)
    }
  }, [firstFutureSessionDate, selectedDate])

  // DayPicker passes a Date anchored at local midnight for each cell.
  // We bucket sessions by Madrid calendar day, so we look them up by the
  // YYYY-MM-DD that the user actually sees on the calendar UI.
  const localDayKey = (date: Date) => {
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const d = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const getSessionsForDate = (date: Date) => sessionDates.get(localDayKey(date)) || []
  const hasSessionsOnDate = (date: Date) => sessionDates.has(localDayKey(date))

  // Handle day click - update selected date instead of opening modal
  const handleDayClick = (date: Date) => {
    if (hasSessionsOnDate(date)) {
      setSelectedDate(date)
    }
  }

  // Get modifiers for days with sessions
  const modifiers = {
    hasSessions: (date: Date) => hasSessionsOnDate(date),
  }

  const modifiersClassNames = {
    hasSessions: 'has-sessions',
  }

  // Get the month to display (based on selected date or first future session)
  const defaultMonth = useMemo(() => {
    if (selectedDate) return selectedDate
    if (firstFutureSessionDate) return firstFutureSessionDate
    if (datedSessions.length === 0) return new Date()

    const earliestKey = datedSessions
      .map((s) => getSessionDayKey(s.date))
      .sort()[0]
    const [y, m, d] = earliestKey.split('-').map(Number)
    return new Date(y, m - 1, d)
  }, [datedSessions, selectedDate, firstFutureSessionDate])

  // Get sessions for the currently selected date
  const selectedSessions = useMemo(() => {
    if (!selectedDate) return []
    return getSessionsForDate(selectedDate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, sessionDates])

  // Check if selected date is the "next" session (first future session)
  const isNextSession = useMemo(() => {
    if (!selectedDate || !firstFutureSessionDate) return false
    return localDayKey(selectedDate) === localDayKey(firstFutureSessionDate)
  }, [selectedDate, firstFutureSessionDate])

  if (datedSessions.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {title && (
        <h3 className="text-xl font-semibold text-fg">{title}</h3>
      )}

      {/* Layout: Calendar 1/3 + Session Highlight 2/3 */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        {/* Calendar section - 1/3 */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-outline-subtle p-4 flex flex-col items-center">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onDayClick={handleDayClick}
              locale={dateFnsLocale}
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              showOutsideDays
              defaultMonth={defaultMonth}
            />

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs text-fg-muted mt-4 pt-4 border-t border-outline-subtle w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>{t('calendar.hasSession')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary rounded" />
                <span>{t('calendar.today')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Highlight - 2/3 */}
        <div className="w-full lg:w-2/3 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate ? localDayKey(selectedDate) : 'empty'}
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
                duration: 0.3
              }}
            >
              <SessionHighlight
                sessions={selectedSessions}
                availability={availability}
                isNextSession={isNextSession}
                selectedDate={selectedDate}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
