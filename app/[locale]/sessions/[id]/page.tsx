import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import type { Session, Locale } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'
import PortableTextContent from '@/components/PortableTextContent'
import AlbumCarousel from '@/components/AlbumCarousel'
import BookingWidget from '@/components/BookingWidget'
import { getAvailablePlaces } from '@/lib/booking'

interface SessionPageProps {
  params: Promise<{
    locale: Locale
    id: string
  }>
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { locale, id } = await params
  const t = await getTranslations()

  const session: Session | null = await client.fetch(sessionByIdQuery, { id })

  if (!session) {
    notFound()
  }

  const availablePlaces = await getAvailablePlaces(session._id, session.totalPlaces)

  const date = new Date(session.date)

  const weekday = date.toLocaleDateString(locale, { weekday: 'long' })
  const day = date.toLocaleDateString(locale, { day: '2-digit' })
  const month = date.toLocaleDateString(locale, { month: 'short' }).replace('.', '')
  const year = date.toLocaleDateString(locale, { year: 'numeric' })
  const time = date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="min-h-screen bg-transparent">
      {/* Top: back link */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <a
          href={`/${locale}`}
          className="inline-flex items-center text-fg-subtle hover:text-fg transition-colors text-xs"
        >
          ← {t('navigation.home')}
        </a>
      </div>

      {/* HERO — full width above the grid */}
      <header className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 text-primary uppercase tracking-[0.18em] text-[10px] font-bold">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            {t('sessions.upcomingSession')}
          </span>
          <span className="text-fg-subtle/50 text-[10px]">·</span>
          <span className="text-fg-subtle uppercase tracking-[0.18em] text-[10px] font-bold">
            {session.sessionType.name[locale]}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-fg leading-[0.95] tracking-tight">
          {session.album.title}
        </h1>
        <p className="mt-1.5 text-lg md:text-xl text-fg/75 font-light">
          {session.album.artist}
          <span className="text-fg-subtle ml-3 text-sm">
            {session.album.year} · <span className="capitalize">{session.album.genre}</span>
            {session.album.duration && ` · ${session.album.duration} min`}
            {session.album.recordLabel && ` · ${session.album.recordLabel}`}
          </span>
        </p>

        {session.album.awards && session.album.awards[locale] && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-primary">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {session.album.awards[locale]}
          </p>
        )}

      </header>

      {/* GRID — cover (left) aligned with booking card (right) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-6 lg:gap-8 items-start">
          {/* LEFT — cover + links + description */}
          <div className="min-w-0">
            <div className="rounded-2xl overflow-hidden shadow-2xl ring-1 ring-outline/50 max-w-[360px]">
              <AlbumCarousel
                coverImage={session.album.coverImage}
                additionalImages={session.album.additionalImages}
                albumTitle={session.album.title}
                artist={session.album.artist}
                showThumbnails={true}
              />
            </div>

            {session.album.links && (
              <div className="flex flex-wrap gap-2 mt-4">
                {session.album.links.spotify && (
                  <a
                    href={session.album.links.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card-raised hover:bg-card-hover text-fg rounded-full text-xs font-medium transition-colors"
                  >
                    Spotify →
                  </a>
                )}
                {session.album.links.appleMusic && (
                  <a
                    href={session.album.links.appleMusic}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card-raised hover:bg-card-hover text-fg rounded-full text-xs font-medium transition-colors"
                  >
                    Apple Music →
                  </a>
                )}
                {session.album.links.youtube && (
                  <a
                    href={session.album.links.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card-raised hover:bg-card-hover text-fg rounded-full text-xs font-medium transition-colors"
                  >
                    YouTube →
                  </a>
                )}
              </div>
            )}

            {session.album.salePrice && session.album.inStock && (
              <div className="mt-4 max-w-[520px] flex items-center gap-3 p-3 rounded-xl bg-primary/8 border border-primary/30">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" strokeWidth={2} />
                    <circle cx="12" cy="12" r="3" strokeWidth={2} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-fg-subtle font-bold">
                    {t('sessions.discPrice')}
                  </p>
                  <p className="text-base font-bold text-fg">
                    {session.album.salePrice}€
                    <span className="ml-2 text-[11px] text-primary font-semibold">· En stock</span>
                  </p>
                </div>
                <a
                  href={`mailto:info@sounddeluxe.com?subject=Compra%20vinilo%20${encodeURIComponent(session.album.title)}`}
                  className="flex-shrink-0 px-4 py-2 bg-primary text-on-primary rounded-full text-xs font-bold hover:bg-primary-hover transition-colors"
                >
                  {t('sessions.buyDisc')}
                </a>
              </div>
            )}

            {session.album.description && (
              <div className="mt-5 max-w-prose text-sm text-fg/85 leading-relaxed">
                <PortableTextContent value={session.album.description[locale]} />
              </div>
            )}

            {session.sessionType.description && session.sessionType.description[locale] && (
              <p className="mt-5 max-w-2xl text-sm text-fg-subtle leading-relaxed">
                {session.sessionType.description[locale]}
              </p>
            )}
          </div>

          {/* RIGHT — sticky booking card */}
          <aside className="lg:sticky lg:top-20 lg:self-start">
            <div className="bg-card rounded-2xl overflow-hidden border border-outline shadow-2xl">
              {/* Date */}
              <div className="p-4 border-b border-outline">
                <p className="text-[10px] uppercase tracking-wider text-primary font-bold mb-1.5">
                  <span className="capitalize">{weekday}</span> · {day} {month} {year}
                </p>
                <p className="text-3xl font-black text-fg leading-none">
                  {time}
                  <span className="text-base text-fg-subtle font-bold ml-1">h</span>
                  {session.durationMinutes && (
                    <span className="text-sm text-fg-subtle font-medium ml-2">
                      · {session.durationMinutes} min
                    </span>
                  )}
                </p>
              </div>

              {/* Venue */}
              <div className="p-4 border-b border-outline">
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <p className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold">
                    {t('sessions.venue')}
                  </p>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${session.sala.address.street}, ${session.sala.address.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-card-raised hover:bg-card-hover text-fg rounded-full text-[10px] font-semibold transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    {t('venue.viewOnMap')}
                  </a>
                </div>
                <p className="text-base font-bold text-fg truncate">
                  {session.sala.name[locale]}
                </p>
                <p className="text-xs text-fg-subtle mt-0.5 truncate">
                  {session.sala.address.street}, {session.sala.address.city}
                </p>
                {session.sala.capacity && (
                  <p className="inline-flex items-center gap-1 mt-2 text-[11px] text-fg-subtle">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {t('venue.capacity')} {session.sala.capacity}
                  </p>
                )}
              </div>

              {/* Price + CTA */}
              <div className="p-4">
                <p className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1">
                  Precio · {t('booking.vatIncluded')}
                </p>
                <p className="text-4xl font-black text-fg leading-none mb-3">
                  {session.price}
                  <span className="text-xl text-fg-subtle font-bold ml-0.5">€</span>
                </p>

                <BookingWidget
                  sessionId={session._id}
                  price={session.price}
                  totalPlaces={session.totalPlaces}
                  availablePlaces={availablePlaces}
                  locale={locale}
                />

                <div className="flex items-center justify-center gap-3 mt-3 text-[10px] text-fg-subtle">
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Pago seguro
                  </span>
                  <span className="text-fg-subtle/50">·</span>
                  <span className="inline-flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cancela 48h antes
                  </span>
                </div>
              </div>

              {/* Extra info */}
              {((session.vinylInfo && session.vinylInfo[locale]) ||
                (session.specialNotes && session.specialNotes[locale])) && (
                <div className="border-t border-outline px-4 py-3 space-y-2 bg-card-raised/30">
                  {session.vinylInfo && session.vinylInfo[locale] && (
                    <p className="text-xs text-fg/85">
                      <span className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mr-1.5">
                        {t('sessions.vinyl')}:
                      </span>
                      {session.vinylInfo[locale]}
                    </p>
                  )}
                  {session.specialNotes && session.specialNotes[locale] && (
                    <p className="text-xs text-fg/85">
                      {session.specialNotes[locale]}
                    </p>
                  )}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Venue section: photos + details */}
        {((session.sala.photos && session.sala.photos.length > 0) ||
          (session.sala.accessibility && session.sala.accessibility[locale]) ||
          (session.sala.schedule && session.sala.schedule[locale])) && (
          <section className="mt-10">
            <h2 className="text-lg font-bold text-fg mb-3">
              {t('venue.theSpace')} · {session.sala.name[locale]}
            </h2>

            {session.sala.photos && session.sala.photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-4">
                {session.sala.photos.slice(0, 4).map((photo, index) => {
                  const photoUrl = urlForImage(photo)?.width(600).height(450).url()
                  return photoUrl ? (
                    <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden ring-1 ring-outline/50">
                      <Image
                        src={photoUrl}
                        alt={`${session.sala.name[locale]} ${index + 1}`}
                        width={600}
                        height={450}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : null
                })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 max-w-3xl">
              {session.sala.accessibility && session.sala.accessibility[locale] && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1">
                    {t('venue.accessibility')}
                  </p>
                  <p className="text-sm text-fg/85 leading-relaxed">
                    {session.sala.accessibility[locale]}
                  </p>
                </div>
              )}
              {session.sala.schedule && session.sala.schedule[locale] && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1">
                    {t('venue.schedule')}
                  </p>
                  <p className="text-sm text-fg/85 leading-relaxed">
                    {session.sala.schedule[locale]}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
