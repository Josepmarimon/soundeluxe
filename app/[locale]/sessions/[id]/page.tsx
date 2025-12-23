import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import type { Session, Locale } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'
import PortableTextContent from '@/components/PortableTextContent'
import AlbumCarousel from '@/components/AlbumCarousel'
import VoteButton from '@/components/VoteButton'

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
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Back button */}
        <a
          href={`/${locale}`}
          className="inline-flex items-center text-zinc-300 hover:text-white mb-8 transition-colors"
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

              {/* Vote Button */}
              <div className="pt-4">
                <VoteButton albumId={session.album._id} showCount={true} />
              </div>

              {/* Streaming Links */}
              {session.album.links && (
                <div className="flex flex-wrap gap-3 pt-4">
                  {session.album.links.spotify && (
                    <a
                      href={session.album.links.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors text-sm"
                    >
                      Spotify
                    </a>
                  )}
                  {session.album.links.appleMusic && (
                    <a
                      href={session.album.links.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors text-sm"
                    >
                      Apple Music
                    </a>
                  )}
                  {session.album.links.youtube && (
                    <a
                      href={session.album.links.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-black text-white rounded-full hover:bg-zinc-800 transition-colors text-sm"
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
            <div className="bg-[#F5F1E8] rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-black mb-6">
                {t('sessions.upcomingSession')}
              </h2>

              {/* Session Type */}
              <div className="mb-6">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black rounded-full text-sm font-medium shadow-md">
                  {session.sessionType.name[locale]}
                </span>
              </div>

              {/* Session Details */}
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-zinc-600 text-sm mb-1">{t('sessions.date')}</p>
                  <p className="text-black text-lg">{formattedDate}</p>
                </div>

                <div>
                  <p className="text-zinc-600 text-sm mb-1">{t('sessions.venue')}</p>
                  <p className="text-black text-lg">{session.sala.name[locale]}</p>
                  <p className="text-zinc-700 text-sm">
                    {session.sala.address.street}, {session.sala.address.city}
                  </p>
                </div>

                {session.vinylInfo && (
                  <div>
                    <p className="text-zinc-600 text-sm mb-1">{t('sessions.vinyl')}</p>
                    <p className="text-black">{session.vinylInfo[locale]}</p>
                  </div>
                )}

                <div>
                  <p className="text-zinc-600 text-sm mb-1">
                    {t('sessions.placesAvailable', { count: session.totalPlaces })}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] bg-clip-text text-transparent">{session.price}€</span>
                    <span className="text-zinc-700 text-sm">/ {t('booking.places').toLowerCase()}</span>
                  </div>
                </div>
              </div>

              {/* Booking Button */}
              <button className="w-full bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black py-4 rounded-full font-semibold text-lg hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-lg">
                {t('sessions.bookNow')}
              </button>

              {session.specialNotes && session.specialNotes[locale] && (
                <div className="mt-6 p-4 bg-[#EDE8DC] rounded-lg border border-[#D4AF37]/20">
                  <p className="text-zinc-700 text-sm">{session.specialNotes[locale]}</p>
                </div>
              )}
            </div>

            {/* Venue Info */}
            {session.sala.photos && session.sala.photos.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">{t('venue.capacity')}</h3>
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
