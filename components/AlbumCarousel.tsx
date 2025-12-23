'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { Image as SanityImage } from 'sanity'
import { urlForImage } from '@/lib/sanity/image'

interface AlbumCarouselProps {
  coverImage: SanityImage
  additionalImages?: SanityImage[]
  albumTitle: string
  artist: string
}

export default function AlbumCarousel({
  coverImage,
  additionalImages = [],
  albumTitle,
  artist,
}: AlbumCarouselProps) {
  const allImages = [coverImage, ...(additionalImages || [])]
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    )
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    )
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const currentImageUrl = urlForImage(allImages[currentIndex])?.width(800).height(800).url()

  // If there's only one image, show it without controls
  if (allImages.length === 1) {
    return (
      <div className="aspect-square rounded-lg overflow-hidden">
        {currentImageUrl && (
          <Image
            src={currentImageUrl}
            alt={`${artist} - ${albumTitle}`}
            width={800}
            height={800}
            className="object-cover w-full h-full"
          />
        )}
      </div>
    )
  }

  return (
    <div className="relative group">
      {/* Main Image */}
      <div className="aspect-square rounded-lg overflow-hidden">
        {currentImageUrl && (
          <Image
            src={currentImageUrl}
            alt={`${artist} - ${albumTitle} - Image ${currentIndex + 1}`}
            width={800}
            height={800}
            className="object-cover w-full h-full"
          />
        )}
      </div>

      {/* Previous Button */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Previous image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Next image"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {allImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? 'bg-white w-6'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Image Counter */}
      <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {allImages.length}
      </div>
    </div>
  )
}
