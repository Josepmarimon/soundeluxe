import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import type { Session, Locale } from '@/lib/sanity/types'
import CheckinControls from './CheckinControls'

interface CheckinPageProps {
  params: Promise<{ locale: Locale; bookingId: string }>
}

export default async function CheckinPage({ params }: CheckinPageProps) {
  const { locale, bookingId } = await params
  const t = await getTranslations()

  const authSession = await auth()

  if (!authSession?.user) {
    redirect(`/${locale}/login`)
  }

  const userRole = (authSession.user as any).role

  // Non-staff users see a message to show the QR to staff
  if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
    return (
      <div className="min-h-screen bg-[#0a1929] pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#D4AF37]/20 mb-6">
            <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">{t('checkin.showToStaff')}</h1>
          <p className="text-zinc-400">{t('checkin.showToStaffNote')}</p>
        </div>
      </div>
    )
  }

  // Fetch booking
  const reserva = await prisma.reserva.findUnique({
    where: { id: bookingId },
    include: { user: { select: { name: true, email: true } } },
  })

  if (!reserva) {
    return (
      <div className="min-h-screen bg-[#0a1929] pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-400">{t('checkin.bookingNotFound')}</h1>
        </div>
      </div>
    )
  }

  if (reserva.status !== 'CONFIRMED') {
    return (
      <div className="min-h-screen bg-[#0a1929] pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-400">{t('checkin.invalidBooking')}</h1>
          <p className="text-zinc-400 mt-2">Status: {reserva.status}</p>
        </div>
      </div>
    )
  }

  // Fetch session data from Sanity
  const sessionData: Session | null = await client.fetch(sessionByIdQuery, { id: reserva.sessionId })

  const userName = reserva.user.name || reserva.user.email
  const sessionDate = sessionData
    ? new Date(sessionData.date).toLocaleDateString(locale === 'ca' ? 'ca-ES' : locale === 'es' ? 'es-ES' : 'en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div className="min-h-screen bg-[#0a1929] pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">{t('checkin.title')}</h1>

        {/* Booking details */}
        <div className="bg-zinc-800/80 rounded-2xl p-6 border border-zinc-700 mb-6">
          {/* Guest info */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{userName}</p>
              <p className="text-zinc-400 text-sm">{reserva.user.email}</p>
            </div>
          </div>

          {/* Session details */}
          {sessionData && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('checkin.album')}</span>
                <span className="text-white font-medium">{sessionData.album.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('checkin.artist')}</span>
                <span className="text-zinc-300">{sessionData.album.artist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('checkin.date')}</span>
                <span className="text-zinc-300 text-right text-xs">{sessionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">{t('checkin.venue')}</span>
                <span className="text-zinc-300">{sessionData.sala.name[locale] || sessionData.sala.name.ca}</span>
              </div>
              <div className="border-t border-zinc-700 pt-3 flex justify-between">
                <span className="text-zinc-400 font-semibold">{t('checkin.places')}</span>
                <span className="text-[#D4AF37] font-bold text-lg">{reserva.numPlaces}</span>
              </div>
            </div>
          )}
        </div>

        {/* Check-in controls */}
        <CheckinControls
          bookingId={reserva.id}
          attended={reserva.attended}
          attendedAt={reserva.attendedAt?.toISOString() || null}
          userName={userName!}
          numPlaces={reserva.numPlaces}
        />
      </div>
    </div>
  )
}
