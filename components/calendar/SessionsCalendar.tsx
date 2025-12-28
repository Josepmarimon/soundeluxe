'use client'

import { useState, useMemo, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { DayPicker } from 'react-day-picker'
import { ca, es, enUS } from 'date-fns/locale'
import { format, parseISO } from 'date-fns'
import type { Locale, MultilingualText } from '@/lib/sanity/types'
import type { Image as SanityImage } from 'sanity'
import SessionHighlight from './SessionHighlight'
import './calendarStyles.css'

const dateFnsLocales: Record<string, typeof ca> = {
  ca: ca,
  es: es,
  en: enUS,
}

export interface CalendarSession {
  _id: string
  date: string
  price: number
  totalPlaces: number
  album: {
    _id: string
    title: string
    artist: string
    coverImage?: SanityImage
  }
  sala?: {
    _id: string
    name: MultilingualText
  }
  sessionType?: {
    _id: string
    key: string
    name: MultilingualText
  }
}

interface SessionsCalendarProps {
  sessions: CalendarSession[]
  title?: string
}

export default function SessionsCalendar({ sessions, title }: SessionsCalendarProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale

  const dateFnsLocale = dateFnsLocales[locale] || enUS

  // Create a map of dates that have sessions
  const sessionDates = useMemo(() => {
    const dateMap = new Map<string, CalendarSession[]>()

    sessions.forEach((session) => {
      const dateKey = format(parseISO(session.date), 'yyyy-MM-dd')
      const existing = dateMap.get(dateKey) || []
      dateMap.set(dateKey, [...existing, session])
    })

    return dateMap
  }, [sessions])

  // Get the first future session date
  const firstFutureSessionDate = useMemo(() => {
    if (sessions.length === 0) return undefined

    const now = new Date()
    const futureSessions = sessions
      .filter((s) => parseISO(s.date) >= now)
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())

    if (futureSessions.length > 0) {
      return parseISO(futureSessions[0].date)
    }

    return undefined
  }, [sessions])

  // Initialize selected date with the first future session date
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(firstFutureSessionDate)

  // Update selected date when firstFutureSessionDate changes
  useEffect(() => {
    if (firstFutureSessionDate && !selectedDate) {
      setSelectedDate(firstFutureSessionDate)
    }
  }, [firstFutureSessionDate, selectedDate])

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return sessionDates.get(dateKey) || []
  }

  // Check if a date has sessions
  const hasSessionsOnDate = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd')
    return sessionDates.has(dateKey)
  }

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
    if (sessions.length === 0) return new Date()

    const dates = sessions.map((s) => parseISO(s.date))
    return new Date(Math.min(...dates.map((d) => d.getTime())))
  }, [sessions, selectedDate, firstFutureSessionDate])

  // Get sessions for the currently selected date
  const selectedSessions = useMemo(() => {
    if (!selectedDate) return []
    return getSessionsForDate(selectedDate)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, sessionDates])

  // Check if selected date is the "next" session (first future session)
  const isNextSession = useMemo(() => {
    if (!selectedDate || !firstFutureSessionDate) return false
    return format(selectedDate, 'yyyy-MM-dd') === format(firstFutureSessionDate, 'yyyy-MM-dd')
  }, [selectedDate, firstFutureSessionDate])

  if (sessions.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {title && (
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      )}

      {/* Layout: Calendar 1/3 + Session Highlight 2/3 */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        {/* Calendar section - 1/3 */}
        <div className="w-full lg:w-1/3 flex flex-col">
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-zinc-800 p-4 flex flex-col items-center">
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
            <div className="flex items-center justify-center gap-4 text-xs text-zinc-400 mt-4 pt-4 border-t border-zinc-800 w-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F4E5AD]" />
                <span>{t('calendar.hasSession')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#D4AF37] rounded" />
                <span>{t('calendar.today')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Session Highlight - 2/3 */}
        <div className="w-full lg:w-2/3">
          <SessionHighlight
            sessions={selectedSessions}
            isNextSession={isNextSession}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  )
}
