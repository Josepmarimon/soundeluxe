import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import { salaByIdQuery, sessionsBySalaQuery } from '@/lib/sanity/queries'
import type { Sala, Locale, MultilingualText } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'
import type { Image as SanityImage } from 'sanity'
import SessionsCalendar from '@/components/calendar/SessionsCalendar'

interface SalaSession {
  _id: string
  date: string
  price: number
  totalPlaces: number
  album: {
    _id: string
    title: string
    artist: string
    coverImage: SanityImage
  }
  sessionType: {
    _id: string
    key: string
    name: MultilingualText
  }
}

interface SalaPageProps {
  params: Promise<{
    locale: Locale
    id: string
  }>
}

export default async function SalaPage({ params }: SalaPageProps) {
  const { locale, id } = await params
  const t = await getTranslations()

  // Fetch sala and sessions in parallel
  const [sala, sessions]: [Sala | null, SalaSession[]] = await Promise.all([
    client.fetch(salaByIdQuery, { id }),
    client.fetch(sessionsBySalaQuery, { salaId: id }),
  ])

  if (!sala) {
    notFound()
  }

  const now = new Date()
  const futureSessions = sessions.filter((s) => new Date(s.date) > now).reverse()
  const pastSessions = sessions.filter((s) => new Date(s.date) <= now)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(locale, {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Back button */}
        <Link
          href={`/${locale}/salas`}
          className="inline-flex items-center text-fg hover:text-fg mb-8 transition-colors text-base md:text-sm"
        >
          ← {t('salas.backToList')}
        </Link>

        {/* Sala Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Photos Gallery */}
          <div>
            {sala.photos && sala.photos.length > 0 ? (
              <div className="space-y-4">
                {/* Main photo */}
                <div className="aspect-video relative rounded-xl overflow-hidden">
                  <Image
                    src={urlForImage(sala.photos[0])?.width(800).height(450).url() || ''}
                    alt={sala.name[locale]}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Thumbnail grid */}
                {sala.photos.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {sala.photos.slice(1, 5).map((photo, index) => {
                      const photoUrl = urlForImage(photo)?.width(200).height(150).url()
                      return photoUrl ? (
                        <div
                          key={index}
                          className="aspect-video relative rounded-lg overflow-hidden"
                        >
                          <Image
                            src={photoUrl}
                            alt={`${sala.name[locale]} - ${index + 2}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : null
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-video bg-surface-raised rounded-xl flex items-center justify-center">
                <span className="text-fg-subtle text-8xl">🎧</span>
              </div>
            )}
          </div>

          {/* Sala Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-fg mb-6">
              {sala.name[locale]}
            </h1>

            <div className="space-y-6">
              {/* Address */}
              <div>
                <h3 className="text-sm font-medium text-fg-muted mb-2">
                  {t('venue.address')}
                </h3>
                <p className="text-fg text-lg">
                  {sala.address.street}
                </p>
                <p className="text-fg">
                  {sala.address.postalCode} {sala.address.city}, {sala.address.country}
                </p>
                {sala.address.googleMapsUrl && (
                  <a
                    href={sala.address.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-primary hover:underline"
                  >
                    📍 {t('venue.viewOnMap')}
                  </a>
                )}
              </div>

              {/* Capacity */}
              <div>
                <h3 className="text-sm font-medium text-fg-muted mb-2">
                  {t('venue.capacity')}
                </h3>
                <p className="text-fg text-lg">
                  {sala.capacity} {t('salas.places')}
                </p>
              </div>

              {/* Accessibility */}
              {sala.accessibility?.[locale] && (
                <div>
                  <h3 className="text-sm font-medium text-fg-muted mb-2">
                    {t('venue.accessibility')}
                  </h3>
                  <p className="text-fg">
                    {sala.accessibility[locale]}
                  </p>
                </div>
              )}

              {/* Schedule */}
              {sala.schedule?.[locale] && (
                <div>
                  <h3 className="text-sm font-medium text-fg-muted mb-2">
                    {t('venue.schedule')}
                  </h3>
                  <p className="text-fg whitespace-pre-line">
                    {sala.schedule[locale]}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Calendar */}
        {sessions.length > 0 && (
          <div className="mb-12">
            <SessionsCalendar sessions={sessions} title={t('calendar.title')} />
          </div>
        )}

        {/* Sessions Section */}
        <div className="space-y-12">
          {/* Future Sessions */}
          <section>
            <h2 className="text-2xl font-bold text-fg mb-6">
              {t('salas.futureSessions')}
            </h2>
            {futureSessions.length === 0 ? (
              <p className="text-fg-muted py-8 text-center bg-bg/50 rounded-xl border border-border/30">
                {t('salas.noFutureSessions')}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {futureSessions.map((session) => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    locale={locale}
                    formatDate={formatDate}
                    isPast={false}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Past Sessions */}
          <section>
            <h2 className="text-2xl font-bold text-fg mb-6">
              {t('salas.pastSessions')}
            </h2>
            {pastSessions.length === 0 ? (
              <p className="text-fg-muted py-8 text-center bg-bg/50 rounded-xl border border-border/30">
                {t('salas.noPastSessions')}
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastSessions.map((session) => (
                  <SessionCard
                    key={session._id}
                    session={session}
                    locale={locale}
                    formatDate={formatDate}
                    isPast={true}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

function SessionCard({
  session,
  locale,
  formatDate,
  isPast,
}: {
  session: SalaSession
  locale: Locale
  formatDate: (date: string) => string
  isPast: boolean
}) {
  const coverUrl = session.album.coverImage
    ? urlForImage(session.album.coverImage)?.width(400).height(400).url()
    : null

  return (
    <Link
      href={`/${locale}/sessions/${session._id}`}
      className={`group bg-bg/80 rounded-xl overflow-hidden border border-border/30 hover:border-primary/50 transition-all duration-300 ${
        isPast ? 'opacity-70 hover:opacity-100' : ''
      }`}
    >
      <div className="flex gap-4 p-4">
        {/* Album Cover */}
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden relative">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={session.album.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-raised flex items-center justify-center">
              <span className="text-2xl">💿</span>
            </div>
          )}
        </div>

        {/* Session Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-fg truncate group-hover:text-primary transition-colors">
            {session.album.title}
          </h3>
          <p className="text-fg-muted text-sm truncate">
            {session.album.artist}
          </p>
          <p className="text-fg-subtle text-sm mt-2">
            {formatDate(session.date)}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs px-2 py-1 bg-surface-raised rounded-full text-fg">
              {session.sessionType.name[locale]}
            </span>
            <span className="text-primary font-bold">
              {session.price}€
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
