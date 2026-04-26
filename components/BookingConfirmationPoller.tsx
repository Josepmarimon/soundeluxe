'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface BookingData {
  id: string
  sessionId: string
  numPlaces: number
  totalAmount: string
  status: string
  paymentMethod: string
  session?: {
    _id: string
    date: string
    price: number
    album: {
      title: string
      artist: string
      coverImage?: any
    }
    sala: {
      name: Record<string, string>
      address: { street: string; city: string }
    }
  }
}

interface BookingConfirmationPollerProps {
  stripeSessionId: string
  locale: string
}

export default function BookingConfirmationPoller({
  stripeSessionId,
  locale,
}: BookingConfirmationPollerProps) {
  const t = useTranslations('booking.confirmation')
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [buyerEmail, setBuyerEmail] = useState<string | null>(null)
  const [passwordSetupToken, setPasswordSetupToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 15 // 30 seconds total
    let cancelled = false

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/booking/by-checkout?session_id=${encodeURIComponent(stripeSessionId)}`
        )
        if (res.ok) {
          const data = await res.json()
          if (data.booking && !cancelled) {
            setBooking(data.booking)
            setBuyerEmail(data.buyerEmail || null)
            setPasswordSetupToken(data.passwordSetupToken || null)
            setLoading(false)
            return
          }
        }
      } catch {
        // Continue polling
      }

      attempts++
      if (attempts >= maxAttempts) {
        if (!cancelled) setLoading(false)
        return
      }

      if (!cancelled) setTimeout(poll, 2000)
    }

    poll()

    return () => {
      cancelled = true
    }
  }, [stripeSessionId])

  // Loading/polling state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <svg className="animate-spin w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-fg mb-2">{t('processing')}</h2>
        <p className="text-fg-muted">{t('processingNote')}</p>
      </div>
    )
  }

  // Booking not found after timeout
  if (!booking) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-6">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-fg mb-2">{t('title')}</h2>
        <p className="text-fg-muted mb-8">{t('processingNote')}</p>
        {buyerEmail && (
          <p className="text-fg-subtle text-sm mb-8">
            {t('emailSent', { email: buyerEmail })}
          </p>
        )}
      </div>
    )
  }

  // Booking confirmed
  const sessionDate = booking.session?.date
    ? new Date(booking.session.date).toLocaleDateString(
        locale === 'ca' ? 'ca-ES' : locale === 'es' ? 'es-ES' : 'en-GB',
        {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      )
    : ''

  const setPasswordCta =
    locale === 'ca'
      ? 'Crea una contrasenya per accedir a les teves entrades'
      : locale === 'es'
      ? 'Crea una contraseña para acceder a tus entradas'
      : 'Create a password to access your tickets'

  const setPasswordButton =
    locale === 'ca' ? 'Crear contrasenya' : locale === 'es' ? 'Crear contraseña' : 'Create password'

  return (
    <div className="text-center py-12">
      {/* Success icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
        <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-fg mb-2">{t('title')}</h2>
      <p className="text-fg-muted mb-8">{t('subtitle')}</p>

      {/* Booking details card */}
      <div className="bg-card-raised/80 rounded-2xl p-6 border border-outline text-left max-w-md mx-auto mb-8">
        <h3 className="text-lg font-semibold text-fg mb-4">{t('details')}</h3>

        <div className="space-y-3">
          {booking.session?.album && (
            <>
              <div className="flex justify-between">
                <span className="text-fg-subtle">{t('album')}</span>
                <span className="text-fg font-medium">{booking.session.album.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-subtle">{t('artist')}</span>
                <span className="text-fg">{booking.session.album.artist}</span>
              </div>
            </>
          )}

          {sessionDate && (
            <div className="flex justify-between">
              <span className="text-fg-subtle">{t('date')}</span>
              <span className="text-fg text-right text-sm">{sessionDate}</span>
            </div>
          )}

          {booking.session?.sala && (
            <div className="flex justify-between">
              <span className="text-fg-subtle">{t('venue')}</span>
              <span className="text-fg">
                {booking.session.sala.name[locale] || booking.session.sala.name.ca}
              </span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-fg-subtle">{t('places')}</span>
            <span className="text-fg">{booking.numPlaces}</span>
          </div>

          <div className="border-t border-outline pt-3 flex justify-between">
            <span className="text-fg-muted font-semibold">{t('total')}</span>
            <span className="text-primary font-bold text-lg">{booking.totalAmount}€</span>
          </div>
        </div>
      </div>

      {/* Reference */}
      <p className="text-fg-dim text-xs font-mono mb-2">
        {t('bookingRef', { ref: booking.id })}
      </p>

      {/* Email notification */}
      {buyerEmail && (
        <p className="text-fg-subtle text-sm mb-8">
          {t('emailSent', { email: buyerEmail })}
        </p>
      )}

      {/* CTA per crear contrasenya si és comprador convidat */}
      {passwordSetupToken && (
        <div className="max-w-md mx-auto mb-8 bg-primary/10 border border-primary rounded-2xl p-6">
          <p className="text-fg mb-4">{setPasswordCta}</p>
          <Link
            href={`/${locale}/set-password?token=${passwordSetupToken}`}
            className="inline-block bg-primary text-on-primary px-6 py-2.5 rounded-full font-bold hover:bg-primary-dark transition-all"
          >
            {setPasswordButton}
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/${locale}/ticket/${booking.id}`}
          className="inline-block bg-primary text-on-primary px-8 py-3 rounded-full font-bold hover:bg-primary-dark transition-all"
        >
          {locale === 'ca'
            ? 'Veure entrada'
            : locale === 'es'
            ? 'Ver entrada'
            : 'View ticket'}
        </Link>
        <Link
          href={`/${locale}/sessions`}
          className="inline-block border border-outline-strong text-fg px-8 py-3 rounded-full font-medium hover:border-zinc-400 hover:text-fg transition-all"
        >
          {t('backToSessions')}
        </Link>
      </div>
    </div>
  )
}
