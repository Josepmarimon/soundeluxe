'use client'

import { useLocale, useTranslations } from 'next-intl'
import type { PortableTextBlock } from 'sanity'
import type { SessionListItem, Locale } from '@/lib/sanity/types'
import AlbumCarousel from '@/components/AlbumCarousel'
import { formatSessionDateTime } from '@/lib/datetime'

interface SessionCardProps {
  session: SessionListItem
  availablePlaces?: number
  showAlbumSale?: boolean
  enableFlip?: boolean
  isFlipped?: boolean
  onFlip?: () => void
}

function richTextToPlainText(blocks?: PortableTextBlock[]): string {
  if (!blocks || blocks.length === 0) return ''
  return blocks
    .map((block) => {
      if (block._type !== 'block' || !Array.isArray(block.children)) return ''
      return (block.children as Array<{ text?: string }>)
        .map((c) => c.text ?? '')
        .join('')
    })
    .filter(Boolean)
    .join(' ')
    .trim()
}

export default function SessionCard({ session, availablePlaces, showAlbumSale = true, enableFlip = false, isFlipped = false, onFlip }: SessionCardProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const isSoldOut = availablePlaces !== undefined && availablePlaces === 0
  const hasDate = Boolean(session.date)
  const hasVenue = Boolean(session.sala)
  const isBookable = hasDate && hasVenue && !isSoldOut

  const dateIso = hasDate ? (session.date as string) : null

  // Format with weekday for desktop
  const formattedDateDesktop = dateIso
    ? formatSessionDateTime(dateIso, locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : t('sessions.dateTbd')

  // Format without weekday for mobile
  const formattedDateMobile = dateIso
    ? formatSessionDateTime(dateIso, locale, {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : t('sessions.dateTbdShort')

  const venueLabel = session.sala ? session.sala.name[locale] : t('sessions.venueTbdShort')

  if (enableFlip) {
    return (
      <article
        className="session-card-flip"
        onClick={onFlip}
      >
        <div className={`session-card-inner ${isFlipped ? 'session-card-flipped' : ''}`}>
          {/* Front Side */}
          <div className="session-card-front">
            <div className="bg-surface-alt rounded-lg overflow-hidden shadow-md h-full flex flex-col">
              {/* Album Cover Carousel */}
              <div className="relative aspect-square overflow-hidden">
                <AlbumCarousel
                  coverImage={session.album.coverImage}
                  additionalImages={session.album.additionalImages}
                  albumTitle={session.album.title}
                  artist={session.album.artist}
                />

                {/* Sold-out badge (no available-places info shown) */}
                {isSoldOut && (
                  <div className="hidden md:block absolute top-3 left-3 z-10">
                    <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full shadow-md bg-card-muted text-fg">
                      {t('booking.soldOut')}
                    </span>
                  </div>
                )}
              </div>

              {/* Session Info */}
              <div className="p-3 md:p-4 flex-1 flex flex-col">
                <a
                  href={`/${locale}/sessions/${session._id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:underline"
                >
                  <h3 className="text-sm md:text-base font-bold text-black mb-0.5 line-clamp-2">
                    {session.album.title}
                  </h3>
                </a>
                <p className="text-xs md:text-sm text-zinc-700 mb-2 md:mb-3 line-clamp-1">{session.album.artist}</p>

                <div className="space-y-0.5 md:space-y-1 text-[11px] md:text-xs">
                  <p className="text-zinc-800 line-clamp-1 md:hidden">{formattedDateMobile}</p>
                  <p className="text-zinc-800 line-clamp-1 hidden md:block">{formattedDateDesktop}</p>
                </div>

                <div className="mt-auto pt-2">
                  <span className="text-lg md:text-xl font-bold text-black">{session.price}€</span>
                </div>
              </div>
            </div>
          </div>

            {/* Back Side */}
            <div className="session-card-back">
              <div className="bg-primary rounded-lg shadow-md h-full p-3 md:p-4 flex flex-col">
                <div className="flex-shrink-0 mb-2 md:mb-3">
                  <h3 className="text-sm md:text-base font-bold text-black leading-tight line-clamp-2">
                    {session.album.title}
                  </h3>
                  <p className="text-xs md:text-sm text-zinc-800 line-clamp-1">
                    {session.album.artist}
                  </p>
                </div>

                <div className="flex-shrink-0 flex flex-wrap gap-1.5 mb-2 md:mb-3">
                  {session.album.year && (
                    <span className="text-[10px] md:text-[11px] font-semibold text-black bg-black/10 rounded-full px-2 py-0.5">
                      {session.album.year}
                    </span>
                  )}
                  {session.album.genre && (
                    <span className="text-[10px] md:text-[11px] font-semibold text-black bg-black/10 rounded-full px-2 py-0.5 line-clamp-1">
                      {session.album.genre}
                    </span>
                  )}
                </div>

                {session.album.description?.[locale] && (
                  <p className="text-[11px] md:text-xs text-black/85 leading-snug line-clamp-6 md:line-clamp-7">
                    {richTextToPlainText(session.album.description[locale])}
                  </p>
                )}

                <div className="flex-1" />

                <div className="flex-shrink-0 pt-2 md:pt-3">
                  <a
                    href={`/${locale}/sessions/${session._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="block w-full bg-bg text-fg py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm text-center shadow-lg hover:bg-surface-raised transition-colors"
                  >
                    {t('sessions.moreInfo')}
                  </a>
                </div>
              </div>
            </div>
          </div>
      </article>
    )
  }

  return (
    <article className="group bg-surface-alt rounded-lg overflow-hidden hover:bg-surface-alt-hover transition-colors shadow-md">
      <a href={`/${locale}/sessions/${session._id}`}>
        {/* Album Cover Carousel */}
        <div className="relative aspect-square overflow-hidden">
          <AlbumCarousel
            coverImage={session.album.coverImage}
            additionalImages={session.album.additionalImages}
            albumTitle={session.album.title}
            artist={session.album.artist}
          />

          {/* Sold-out badge (no available-places info shown) */}
          {isSoldOut && (
            <div className="hidden md:block absolute top-3 left-3 z-10">
              <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full shadow-md bg-card-muted text-fg">
                {t('booking.soldOut')}
              </span>
            </div>
          )}
        </div>
      </a>

      {/* Session Info - responsive sizing */}
      <div className="p-3 md:p-4">
        {/* Album & Artist */}
        <h3 className="text-sm md:text-base font-bold text-black mb-0.5 line-clamp-2">
          {session.album.title}
        </h3>
        <p className="text-xs md:text-sm text-zinc-700 mb-2 md:mb-3 line-clamp-1">{session.album.artist}</p>

        {/* Date & Venue */}
        <div className="space-y-0.5 md:space-y-1 mb-2 md:mb-3 text-[11px] md:text-xs">
          {/* Show different date format for mobile and desktop */}
          <p className="text-zinc-800 line-clamp-2 md:hidden">{formattedDateMobile}</p>
          <p className="text-zinc-800 line-clamp-2 hidden md:block">{formattedDateDesktop}</p>
          {/* Venue - only show on desktop */}
          <p className={`hidden md:block line-clamp-1 ${session.sala ? 'text-zinc-700' : 'text-zinc-500 italic'}`}>{venueLabel}</p>
        </div>

        {/* Session Price & Booking */}
        <div className="flex flex-row items-center justify-between gap-1.5 mb-2">
          <span className="text-lg md:text-xl font-bold text-black">
            {session.price}€
          </span>
          <button
            disabled={!isBookable}
            className={`px-2 md:px-4 py-1 md:py-1.5 rounded-full font-semibold text-[10px] md:text-xs transition-all shadow-md ${
              isSoldOut
                ? 'bg-card-muted text-fg cursor-not-allowed'
                : !isBookable
                ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed'
                : 'bg-primary text-on-primary hover:bg-primary-dark'
            }`}
          >
            {isSoldOut
              ? t('booking.soldOut')
              : !isBookable
              ? t('sessions.dateTbdShort')
              : t('sessions.book')}
          </button>
        </div>

        {/* Album Sale - if price is available */}
        {showAlbumSale && session.album.salePrice && session.album.inStock && (
          <div className="border-t border-zinc-300 pt-2">
            <div className="flex flex-row items-center justify-between gap-1.5">
              <div className="flex flex-col">
                <span className="text-[10px] md:text-xs text-fg-dim">
                  {t('sessions.discPrice')}
                </span>
                <span className="text-base md:text-lg font-bold text-black">
                  {session.album.salePrice}€
                </span>
              </div>
              <a
                href={`/${locale}/albums?search=${encodeURIComponent(session.album.title)}`}
                onClick={(e) => e.stopPropagation()}
                className="bg-bg text-fg px-2 md:px-4 py-1 md:py-1.5 rounded-full font-semibold text-[10px] md:text-xs hover:bg-surface-raised transition-all shadow-md"
              >
                {t('sessions.buyDisc')}
              </a>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
