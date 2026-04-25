'use client'

import { useEffect, useRef } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { format } from 'date-fns'
import { ca, es, enUS } from 'date-fns/locale'
import Link from 'next/link'
import Image from 'next/image'
import type { Locale, MultilingualText } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'
import type { Image as SanityImage } from 'sanity'

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
  sessionType?: {
    _id: string
    key: string
    name: MultilingualText
  }
}

interface SessionsModalProps {
  isOpen: boolean
  onClose: () => void
  date: Date | undefined
  sessions: CalendarSession[]
}

export default function SessionsModal({ isOpen, onClose, date, sessions }: SessionsModalProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const modalRef = useRef<HTMLDivElement>(null)
  const dateFnsLocale = dateFnsLocales[locale] || enUS

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !date) return null

  const formattedDate = format(date, 'PPPP', { locale: dateFnsLocale })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-bg border border-border/50 rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-xl font-bold text-surface-alt capitalize">
              {formattedDate}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-fg-muted hover:text-fg hover:bg-border/30 rounded-full transition-colors"
              aria-label={t('common.close')}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-1 text-sm text-fg-muted">
            {sessions.length === 1
              ? t('calendar.oneSession')
              : t('calendar.sessionsCount', { count: sessions.length })}
          </p>
        </div>

        {/* Sessions List */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {sessions.map((session) => {
            const coverUrl = session.album?.coverImage
              ? urlForImage(session.album.coverImage)?.width(120).height(120).url()
              : null

            const sessionTime = format(new Date(session.date), 'HH:mm', { locale: dateFnsLocale })

            return (
              <Link
                key={session._id}
                href={`/${locale}/sessions/${session._id}`}
                className="flex gap-4 p-3 bg-surface/50 rounded-xl border border-border/30 hover:border-primary/50 hover:bg-surface transition-all group"
                onClick={onClose}
              >
                {/* Album Cover */}
                <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-raised relative">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={session.album.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                      CD
                    </div>
                  )}
                </div>

                {/* Session Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-fg group-hover:text-primary transition-colors truncate">
                    {session.album.title}
                  </h3>
                  <p className="text-sm text-fg-muted truncate">
                    {session.album.artist}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs">
                    <span className="text-primary font-medium">
                      {sessionTime}
                    </span>
                    {session.sessionType && (
                      <span className="px-2 py-0.5 bg-surface-raised rounded-full text-fg">
                        {session.sessionType.name[locale]}
                      </span>
                    )}
                    <span className="font-bold text-fg">
                      {session.price}EUR
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-border/30 bg-bg">
          <button
            onClick={onClose}
            className="w-full py-2 text-sm text-fg-muted hover:text-fg transition-colors"
          >
            {t('calendar.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
