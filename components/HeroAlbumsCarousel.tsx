'use client'

import Image from 'next/image'
import type { Image as SanityImage } from 'sanity'
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

export default function HeroAlbumsCarousel({ albums }: HeroAlbumsCarouselProps) {
  if (!albums || albums.length === 0) return null

  // Duplicate so the marquee loops seamlessly
  const loop = [...albums, ...albums]

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="hero-marquee flex h-full w-max items-center gap-4 px-4">
        {loop.map((album, index) => {
          const url = urlForImage(album.coverImage)?.width(600).height(600).url()
          if (!url) return null
          return (
            <div
              key={`${album._id}-${index}`}
              className="relative aspect-square h-[80%] flex-shrink-0 overflow-hidden rounded-md shadow-2xl"
            >
              <Image
                src={url}
                alt={`${album.artist} - ${album.title}`}
                width={600}
                height={600}
                className="h-full w-full object-cover"
                priority={index < 4}
              />
            </div>
          )
        })}
      </div>

      <style jsx>{`
        .hero-marquee {
          animation: hero-scroll 60s linear infinite;
        }
        @keyframes hero-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
