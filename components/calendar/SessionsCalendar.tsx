'use client'

import { useState, useMemo } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { DayPicker } from 'react-day-picker'
import { ca, es, enUS } from 'date-fns/locale'
import { format, parseISO } from 'date-fns'
import type { Locale, MultilingualText } from '@/lib/sanity/types'
import type { Image as SanityImage } from 'sanity'
import SessionsModal from './SessionsModal'
import NextSessionHighlight from './NextSessionHighlight'
import './calendarStyles.css'

const dateFnsLocales: Record<string, typeof ca> = {
  ca: ca,
  es: es,
  en: enUS,
}

interface CalendarSession {
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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  // Handle day click
  const handleDayClick = (date: Date) => {
    if (hasSessionsOnDate(date)) {
      setSelectedDate(date)
      setIsModalOpen(true)
    }
  }

  // Get modifiers for days with sessions
  const modifiers = {
    hasSessions: (date: Date) => hasSessionsOnDate(date),
  }

  const modifiersClassNames = {
    hasSessions: 'has-sessions',
  }

  // Get the first month that has sessions
  const defaultMonth = useMemo(() => {
    if (sessions.length === 0) return new Date()

    const dates = sessions.map((s) => parseISO(s.date))
    const now = new Date()

    // Find the first future session date, or the first session date if all are past
    const futureDates = dates.filter((d) => d >= now)
    if (futureDates.length > 0) {
      return new Date(Math.min(...futureDates.map((d) => d.getTime())))
    }

    return new Date(Math.min(...dates.map((d) => d.getTime())))
  }, [sessions])

  if (sessions.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      {title && (
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      )}

      {/* Layout: Calendar + Next Session side by side on desktop */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start justify-center">
        {/* Calendar section */}
        <div className="flex flex-col items-center space-y-4">
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
          <div className="flex items-center justify-center gap-6 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F4E5AD]" />
              <span>{t('calendar.hasSession')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-[#D4AF37] rounded-lg" />
              <span>{t('calendar.today')}</span>
            </div>
          </div>
        </div>

        {/* Next Session Highlight */}
        <div className="w-full lg:w-[380px] flex-shrink-0">
          <NextSessionHighlight sessions={sessions} />
        </div>
      </div>

      {/* Sessions Modal */}
      <SessionsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        sessions={selectedDate ? getSessionsForDate(selectedDate) : []}
      />
    </div>
  )
}
