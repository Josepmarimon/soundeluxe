import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import type { Session, Locale } from '@/lib/sanity/types'
import PlaceCheckinControls from './PlaceCheckinControls'

interface PageProps {
  params: Promise<{ locale: Locale; placeId: string }>
}

export default async function PlaceCheckinPage({ params }: PageProps) {
  const { locale, placeId } = await params
  const t = await getTranslations()

  const authSession = await auth()

  if (!authSession?.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/admin/checkin/place/${placeId}`)
  }

  const userRole = (authSession.user as any).role

  // Si no és staff, mostra un missatge per fer-li ensenyar el QR al staff
  if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-fg mb-4">{t('checkin.showToStaff')}</h1>
          <p className="text-fg-muted">{t('checkin.showToStaffNote')}</p>
        </div>
      </div>
    )
  }

  const place = await prisma.reservaPlace.findUnique({
    where: { id: placeId },
    include: {
      reserva: {
        include: {
          user: { select: { name: true, email: true } },
          places: { select: { id: true, attended: true } },
        },
      },
    },
  })

  if (!place) {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-400">{t('checkin.bookingNotFound')}</h1>
        </div>
      </div>
    )
  }

  if (place.reserva.status !== 'CONFIRMED') {
    return (
      <div className="min-h-screen bg-bg pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-red-400">{t('checkin.invalidBooking')}</h1>
          <p className="text-fg-muted mt-2">Status: {place.reserva.status}</p>
        </div>
      </div>
    )
  }

  const sessionData: Session | null = await client.fetch(sessionByIdQuery, {
    id: place.reserva.sessionId,
  })

  const userName = place.reserva.user.name || place.reserva.user.email
  const sessionDate = sessionData
    ? new Date(sessionData.date).toLocaleDateString(
        locale === 'ca' ? 'ca-ES' : locale === 'es' ? 'es-ES' : 'en-GB',
        {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          hour: '2-digit',
          minute: '2-digit',
        }
      )
    : ''

  const attendedCount = place.reserva.places.filter((p) => p.attended).length

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold text-fg mb-2 text-center">
          {t('checkin.placeOf', { current: place.placeNumber, total: place.reserva.numPlaces })}
        </h1>
        <p className="text-fg-muted text-sm text-center mb-6">
          {attendedCount} / {place.reserva.numPlaces} {t('checkin.places')}
        </p>

        <div className="bg-card-raised/80 rounded-2xl p-6 border border-outline mb-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-fg font-semibold text-lg">{userName}</p>
              <p className="text-fg-muted text-sm">{place.reserva.user.email}</p>
            </div>
          </div>

          {sessionData && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-fg-subtle">{t('checkin.album')}</span>
                <span className="text-fg font-medium">{sessionData.album.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-subtle">{t('checkin.artist')}</span>
                <span className="text-fg">{sessionData.album.artist}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-subtle">{t('checkin.date')}</span>
                <span className="text-fg text-right text-xs">{sessionDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fg-subtle">{t('checkin.venue')}</span>
                <span className="text-fg">{sessionData.sala.name[locale] || sessionData.sala.name.ca}</span>
              </div>
            </div>
          )}
        </div>

        <PlaceCheckinControls
          placeId={place.id}
          placeNumber={place.placeNumber}
          numPlaces={place.reserva.numPlaces}
          bookingId={place.reservaId}
          locale={locale}
          attended={place.attended}
          attendedAt={place.attendedAt?.toISOString() || null}
        />
      </div>
    </div>
  )
}
