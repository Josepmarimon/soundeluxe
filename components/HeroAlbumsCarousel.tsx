'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import type { Image as SanityImage } from 'sanity'
import type { Locale } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'

interface AlbumCover {
  _id: string
  title: string
  artist: string
  coverImage: SanityImage
}

interface HeroAlbumsCarouselProps {
  albums: AlbumCover[]
}

const BASE_PX_PER_SECOND = 30

export default function HeroAlbumsCarousel({ albums }: HeroAlbumsCarouselProps) {
  const t = useTranslations('hero')
  const locale = useLocale() as Locale
  const trackRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(0)
  const velocityRef = useRef(BASE_PX_PER_SECOND)
  const targetVelocityRef = useRef(BASE_PX_PER_SECOND)
  const halfWidthRef = useRef(0)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)

    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      // Ease current velocity toward target (deceleration / acceleration)
      const ease = 1 - Math.exp(-dt * 4)
      velocityRef.current += (targetVelocityRef.current - velocityRef.current) * ease
      positionRef.current += velocityRef.current * dt
      const half = halfWidthRef.current
      if (half > 0) {
        if (positionRef.current >= half) positionRef.current -= half
        else if (positionRef.current < 0) positionRef.current += half
      }
      track.style.transform = `translate3d(${-positionRef.current}px,0,0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])

  if (!albums || albums.length === 0) return null

  const loop = [...albums, ...albums]

  const handleEnter = () => {
    targetVelocityRef.current = 0
  }
  const handleLeave = () => {
    targetVelocityRef.current = BASE_PX_PER_SECOND
    setHoveredKey(null)
  }

  return (
    <div
      className="absolute inset-0 z-0 overflow-hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        ref={trackRef}
        className="flex h-full w-max items-center gap-4 px-4 will-change-transform"
      >
        {loop.map((album, index) => {
          const url = urlForImage(album.coverImage)?.width(600).height(600).url()
          if (!url) return null
          const key = `${album._id}-${index}`
          const isFlipped = hoveredKey === key
          return (
            <div
              key={key}
              className="hero-flip relative aspect-square h-[80%] flex-shrink-0"
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              <div className={`hero-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="hero-flip-face hero-flip-front overflow-hidden rounded-md shadow-2xl">
                  <Image
                    src={url}
                    alt={`${album.artist} - ${album.title}`}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                    priority={index < 4}
                  />
                </div>
                <div className="hero-flip-face hero-flip-back rounded-md shadow-2xl bg-bg p-4 flex flex-col items-center justify-center text-center gap-3">
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase tracking-wide text-fg-muted line-clamp-1">
                      {album.artist}
                    </p>
                    <p className="text-sm font-bold text-fg line-clamp-2">
                      {album.title}
                    </p>
                  </div>
                  <a
                    href={`/${locale}/register`}
                    className="bg-primary text-on-primary text-[11px] md:text-xs font-bold rounded-full px-3 py-2 hover:bg-primary-dark transition-colors leading-snug"
                  >
                    {t('loveDisc')}
                  </a>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .hero-flip {
          perspective: 1000px;
        }
        .hero-flip-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .hero-flip-inner.is-flipped {
          transform: rotateY(180deg);
        }
        .hero-flip-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .hero-flip-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  )
}
