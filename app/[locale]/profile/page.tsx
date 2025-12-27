'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity/image'

interface Vote {
  id: string
  albumId: string
  createdAt: string
  album: {
    _id: string
    title: string
    artist: string
    year: number
    genre: string
    coverImage: any
    duration?: number
    links?: any
  }
}

interface Booking {
  id: string
  sessionId: string
  numPlaces: number
  totalAmount: string
  status: string
  paymentMethod: string
  attended: boolean
  attendedAt: string | null
  cancelledAt: string | null
  createdAt: string
  session: {
    _id: string
    date: string
    price: number
    album: {
      _id: string
      title: string
      artist: string
      coverImage: any
    }
    sala: {
      _id: string
      name: any
      address: any
    }
    sessionType: {
      _id: string
      key: string
      name: any
    }
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations()

  const [votes, setVotes] = useState<Vote[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'votes' | 'bookings' | 'preferences'>('bookings')
  const [isLoading, setIsLoading] = useState(true)

  // Newsletter preferences
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false)
  const [savingPreferences, setSavingPreferences] = useState(false)
  const [preferencesSaved, setPreferencesSaved] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/login`)
    }
  }, [status, router, locale])

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return

      try {
        setIsLoading(true)

        const [votesRes, bookingsRes, newsletterRes] = await Promise.all([
          fetch('/api/user/votes'),
          fetch('/api/user/bookings'),
          fetch('/api/user/newsletter'),
        ])

        const votesData = await votesRes.json()
        const bookingsData = await bookingsRes.json()
        const newsletterData = await newsletterRes.json()

        setVotes(votesData.votes || [])
        setBookings(bookingsData.bookings || [])
        setNewsletterSubscribed(newsletterData.subscribed || false)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session?.user) {
      fetchUserData()
    }
  }, [session])

  // Handle newsletter toggle
  const handleNewsletterToggle = async () => {
    setSavingPreferences(true)
    setPreferencesSaved(false)

    try {
      const response = await fetch('/api/user/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscribed: !newsletterSubscribed }),
      })

      if (response.ok) {
        setNewsletterSubscribed(!newsletterSubscribed)
        setPreferencesSaved(true)
        setTimeout(() => setPreferencesSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error updating newsletter preferences:', error)
    } finally {
      setSavingPreferences(false)
    }
  }

  // Handle vote removal
  const handleRemoveVote = async (albumId: string) => {
    try {
      const response = await fetch(`/api/votes?albumId=${albumId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setVotes((prev) => prev.filter((vote) => vote.albumId !== albumId))
      }
    } catch (error) {
      console.error('Error removing vote:', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-transparent pt-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="min-h-screen bg-transparent pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('profile.title')}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] flex items-center justify-center text-black font-bold text-2xl">
              {session.user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">{session.user.name}</p>
              <p className="text-zinc-400">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[#254a6e]">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-4 px-6 font-semibold transition-colors ${
              activeTab === 'bookings'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t('profile.myBookings')} ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('votes')}
            className={`pb-4 px-6 font-semibold transition-colors ${
              activeTab === 'votes'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t('profile.myVotes')} ({votes.length})
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`pb-4 px-6 font-semibold transition-colors ${
              activeTab === 'preferences'
                ? 'text-[#D4AF37] border-b-2 border-[#D4AF37]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {t('profilePreferences.communicationTitle')}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'bookings' && (
          <div>
            {bookings.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-400 text-lg mb-6">{t('profile.noBookings')}</p>
                <a
                  href={`/${locale}/sessions`}
                  className="inline-block px-8 py-3 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black font-semibold rounded-full hover:shadow-lg transition-shadow"
                >
                  {t('profile.browseSessions')}
                </a>
              </div>
            ) : (
              <div className="grid gap-6">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-velvet-card rounded-lg overflow-hidden hover:bg-[#1a3a5c]/60 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      {/* Album Cover */}
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                          <Image
                            src={urlForImage(booking.session.album.coverImage)?.width(128).height(128).url() || ''}
                            alt={booking.session.album.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-white mb-1">
                          {booking.session.album.title}
                        </h3>
                        <p className="text-zinc-400 mb-3">{booking.session.album.artist}</p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-zinc-500">{t('sessions.date')}</span>
                            <p className="text-white font-medium">
                              {new Date(booking.session.date).toLocaleDateString(locale, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                          <div>
                            <span className="text-zinc-500">{t('booking.places')}</span>
                            <p className="text-white font-medium">{booking.numPlaces}</p>
                          </div>
                          <div>
                            <span className="text-zinc-500">{t('booking.total')}</span>
                            <p className="text-white font-medium">€{booking.totalAmount}</p>
                          </div>
                          <div>
                            <span className="text-zinc-500">{t('profile.status')}</span>
                            <p className={`font-medium ${
                              booking.status === 'CONFIRMED' ? 'text-green-500' :
                              booking.status === 'CANCELLED' ? 'text-red-500' :
                              'text-yellow-500'
                            }`}>
                              {t(`profile.bookingStatus.${booking.status.toLowerCase()}`)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'votes' && (
          <div>
            {votes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-400 text-lg mb-6">{t('profile.noVotes')}</p>
                <a
                  href={`/${locale}/votes`}
                  className="inline-block px-8 py-3 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black font-semibold rounded-full hover:shadow-lg transition-shadow"
                >
                  {t('profile.voteForAlbums')}
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {votes.map((vote) => (
                  <div
                    key={vote.id}
                    className="bg-[#F5F1E8] rounded-lg overflow-hidden hover:bg-[#EDE8DC] transition-colors group relative"
                  >
                    {/* Album Cover */}
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={urlForImage(vote.album.coverImage)?.width(400).height(400).url() || ''}
                        alt={vote.album.title}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Album Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-black mb-1 line-clamp-2">
                        {vote.album.title}
                      </h3>
                      <p className="text-zinc-700 mb-2">{vote.album.artist}</p>
                      <div className="flex items-center gap-3 text-sm text-zinc-600 mb-4">
                        <span>{vote.album.year}</span>
                        {vote.album.duration && (
                          <>
                            <span>•</span>
                            <span>{vote.album.duration} min</span>
                          </>
                        )}
                      </div>

                      {/* Remove Vote Button */}
                      <button
                        onClick={() => handleRemoveVote(vote.albumId)}
                        className="w-full px-4 py-2 bg-[#0a1929] text-white hover:bg-[#1a3a5c] rounded-full font-medium transition-colors text-sm"
                      >
                        {t('profile.removeVote')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'preferences' && (
          <div className="max-w-xl">
            <div className="bg-velvet-card rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                {t('profilePreferences.communicationTitle')}
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">
                    {t('profilePreferences.newsletterLabel')}
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    {newsletterSubscribed
                      ? t('profilePreferences.newsletterEnabled')
                      : t('profilePreferences.newsletterDisabled')}
                  </p>
                </div>

                <button
                  onClick={handleNewsletterToggle}
                  disabled={savingPreferences}
                  className={`relative w-14 h-8 rounded-full transition-colors ${
                    newsletterSubscribed ? 'bg-[#D4AF37]' : 'bg-zinc-600'
                  } ${savingPreferences ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-transform ${
                      newsletterSubscribed ? 'left-7' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {preferencesSaved && (
                <p className="mt-4 text-sm text-green-500">
                  {t('profilePreferences.saved')}
                </p>
              )}

              {savingPreferences && (
                <p className="mt-4 text-sm text-zinc-400">
                  {t('profilePreferences.saving')}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
