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
  userEmail: string
}

export default function BookingConfirmationPoller({
  stripeSessionId,
  locale,
  userEmail,
}: BookingConfirmationPollerProps) {
  const t = useTranslations('booking.confirmation')
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 15 // 30 seconds total

    const poll = async () => {
      try {
        const res = await fetch('/api/user/bookings')
        if (res.ok) {
          const data = await res.json()
          // Find the most recent booking (the one just created)
          const latest = data.bookings?.[0]
          if (latest && latest.status === 'CONFIRMED') {
            setBooking(latest)
            setLoading(false)
            return
          }
        }
      } catch {
        // Continue polling
      }

      attempts++
      if (attempts >= maxAttempts) {
        setLoading(false)
        return
      }

      setTimeout(poll, 2000)
    }

    poll()
  }, [stripeSessionId])

  // Loading/polling state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/20 mb-6">
          <svg className="animate-spin w-8 h-8 text-[#D4AF37]" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('processing')}</h2>
        <p className="text-zinc-400">{t('processingNote')}</p>
      </div>
    )
  }

  // Booking not found after timeout
  if (!booking) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/20 mb-6">
          <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('title')}</h2>
        <p className="text-zinc-400 mb-8">{t('processingNote')}</p>
        <p className="text-zinc-500 text-sm mb-8">
          {t('emailSent', { email: userEmail })}
        </p>
        <Link
          href={`/${locale}/profile`}
          className="inline-block bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-8 py-3 rounded-full font-bold hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all"
        >
          {t('viewBookings')}
        </Link>
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

  return (
    <div className="text-center py-12">
      {/* Success icon */}
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D4AF37]/20 mb-6">
        <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-3xl font-bold text-white mb-2">{t('title')}</h2>
      <p className="text-zinc-400 mb-8">{t('subtitle')}</p>

      {/* Booking details card */}
      <div className="bg-zinc-800/80 rounded-2xl p-6 border border-zinc-700 text-left max-w-md mx-auto mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">{t('details')}</h3>

        <div className="space-y-3">
          {booking.session?.album && (
            <>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('album')}</span>
                <span className="text-white font-medium">{booking.session.album.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('artist')}</span>
                <span className="text-zinc-300">{booking.session.album.artist}</span>
              </div>
            </>
          )}

          {sessionDate && (
            <div className="flex justify-between">
              <span className="text-zinc-500">{t('date')}</span>
              <span className="text-zinc-300 text-right text-sm">{sessionDate}</span>
            </div>
          )}

          {booking.session?.sala && (
            <div className="flex justify-between">
              <span className="text-zinc-500">{t('venue')}</span>
              <span className="text-zinc-300">{booking.session.sala.name[locale] || booking.session.sala.name.ca}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-zinc-500">{t('places')}</span>
            <span className="text-zinc-300">{booking.numPlaces}</span>
          </div>

          <div className="border-t border-zinc-700 pt-3 flex justify-between">
            <span className="text-zinc-400 font-semibold">{t('total')}</span>
            <span className="text-[#D4AF37] font-bold text-lg">{booking.totalAmount}€</span>
          </div>
        </div>
      </div>

      {/* Reference */}
      <p className="text-zinc-600 text-xs font-mono mb-2">
        {t('bookingRef', { ref: booking.id })}
      </p>

      {/* Email notification */}
      <p className="text-zinc-500 text-sm mb-8">
        {t('emailSent', { email: userEmail })}
      </p>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/${locale}/profile`}
          className="inline-block bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-8 py-3 rounded-full font-bold hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all"
        >
          {t('viewBookings')}
        </Link>
        <Link
          href={`/${locale}/sessions`}
          className="inline-block border border-zinc-600 text-zinc-300 px-8 py-3 rounded-full font-medium hover:border-zinc-400 hover:text-white transition-all"
        >
          {t('backToSessions')}
        </Link>
      </div>
    </div>
  )
}
