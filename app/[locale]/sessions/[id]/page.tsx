import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import type { Session, Locale } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'
import PortableTextContent from '@/components/PortableTextContent'
import AlbumCarousel from '@/components/AlbumCarousel'

interface SessionPageProps {
  params: Promise<{
    locale: Locale
    id: string
  }>
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { locale, id } = await params
  const t = await getTranslations()

  // Fetch session from Sanity
  const session: Session | null = await client.fetch(sessionByIdQuery, { id })

  if (!session) {
    notFound()
  }

  const date = new Date(session.date)

  const formattedDate = date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-transparent pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Back button */}
        <a
          href={`/${locale}`}
          className="inline-flex items-center text-zinc-300 hover:text-white mb-8 transition-colors text-base md:text-sm"
        >
          ← {t('navigation.home')}
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Album Info */}
          <div>
            {/* Album Cover Carousel */}
            <div className="mb-6">
              <AlbumCarousel
                coverImage={session.album.coverImage}
                additionalImages={session.album.additionalImages}
                albumTitle={session.album.title}
                artist={session.album.artist}
                showThumbnails={true}
              />
            </div>

            {/* Album Details */}
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {session.album.title}
                </h1>
                <p className="text-2xl text-zinc-300">{session.album.artist}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-zinc-300">
                <span>{session.album.year}</span>
                <span>•</span>
                <span>{session.album.genre}</span>
                {session.album.duration && (
                  <>
                    <span>•</span>
                    <span>{session.album.duration} min</span>
                  </>
                )}
              </div>

              {session.album.description && (
                <div className="max-w-none">
                  <PortableTextContent value={session.album.description[locale]} />
                </div>
              )}

              {/* Streaming Links */}
              {session.album.links && (
                <div className="flex flex-wrap gap-3 pt-4">
                  {session.album.links.spotify && (
                    <a
                      href={session.album.links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#0a1929] text-white rounded-full hover:bg-[#1a3a5c] transition-colors text-sm"
                    >
                      Spotify
                    </a>
                  )}
                  {session.album.links.appleMusic && (
                    <a
                      href={session.album.links.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#0a1929] text-white rounded-full hover:bg-[#1a3a5c] transition-colors text-sm"
                    >
                      Apple Music
                    </a>
                  )}
                  {session.album.links.youtube && (
                    <a
                      href={session.album.links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#0a1929] text-white rounded-full hover:bg-[#1a3a5c] transition-colors text-sm"
                    >
                      YouTube
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Session Info */}
          <div>
            <div className="bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 backdrop-blur-sm rounded-2xl border border-[#D4AF37]/30 overflow-hidden shadow-xl">
              {/* Header badge */}
              <div className="bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] px-6 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-black font-bold text-base uppercase tracking-wide">
                    {t('sessions.upcomingSession')}
                  </span>
                  <span className="inline-block px-4 py-1.5 bg-black/20 text-black rounded-full text-sm font-semibold">
                    {session.sessionType.name[locale]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Session metadata - Grid layout */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* Date */}
                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">{t('sessions.date')}</p>
                      <p className="text-base font-semibold capitalize">{formattedDate}</p>
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">{t('sessions.venue')}</p>
                      <p className="text-base font-semibold">{session.sala.name[locale]}</p>
                    </div>
                  </div>

                  {/* Places available */}
                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">{t('sessions.placesAvailable', { count: session.totalPlaces })}</p>
                      <p className="text-base font-semibold">{session.totalPlaces} places</p>
                    </div>
                  </div>

                  {/* Session Type */}
                  <div className="flex items-center gap-4 text-zinc-300">
                    <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                      <svg className="w-7 h-7 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">{t('sessions.sessionType')}</p>
                      <p className="text-base font-semibold">{session.sessionType.name[locale]}</p>
                    </div>
                  </div>
                </div>

                {/* Address with Map button */}
                <div className="mb-8 p-5 bg-zinc-800/50 rounded-xl">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-zinc-300 text-base font-medium">
                          {session.sala.address.street}
                        </p>
                        <p className="text-zinc-500 text-sm">
                          {session.sala.address.city}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${session.sala.address.street}, ${session.sala.address.city}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-3 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full text-sm font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      {t('venue.viewOnMap')}
                    </a>
                  </div>
                </div>

                {session.vinylInfo && session.vinylInfo[locale] && (
                  <div className="mb-8 p-5 bg-zinc-800/50 rounded-xl">
                    <p className="text-sm text-zinc-500 mb-1">{t('sessions.vinyl')}</p>
                    <p className="text-zinc-300 text-base">{session.vinylInfo[locale]}</p>
                  </div>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between gap-4 pt-6 border-t border-zinc-700">
                  <div>
                    <p className="text-sm text-zinc-500">{t('sessions.price', { price: '' }).replace('€', '')}</p>
                    <p className="text-5xl font-bold text-white">{session.price}€</p>
                  </div>
                  <button className="bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-10 py-5 rounded-full font-bold text-lg hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-lg flex items-center gap-2">
                    {t('sessions.bookNow')}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {session.specialNotes && session.specialNotes[locale] && (
                  <div className="mt-8 p-5 bg-zinc-800/50 rounded-xl border border-[#D4AF37]/20">
                    <p className="text-zinc-300 text-base">{session.specialNotes[locale]}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Venue Info */}
            {session.sala.photos && session.sala.photos.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">{t('venue.theSpace')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {session.sala.photos.slice(0, 4).map((photo, index) => {
                    const photoUrl = urlForImage(photo)?.width(400).height(300).url()
                    return photoUrl ? (
                      <div key={index} className="aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={photoUrl}
                          alt={`Sala ${index + 1}`}
                          width={400}
                          height={300}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
