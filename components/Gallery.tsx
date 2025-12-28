'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import type { GalleryImage, GalleryCategory, Locale } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'

interface GalleryProps {
  images: GalleryImage[]
  categories: GalleryCategory[]
  title?: string
  subtitle?: string
  ctaText?: string
  hashtag?: string
}

function ImageModal({
  image,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext
}: {
  image: GalleryImage
  onClose: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}) {
  const locale = useLocale() as Locale
  const imageUrl = urlForImage(image.image)?.width(1200).url()
  const caption = image.caption?.[locale] || image.caption?.ca

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && hasPrev) onPrev()
    if (e.key === 'ArrowRight' && hasNext) onNext()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2"
        aria-label="Close"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation arrows */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); onPrev() }}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 p-2"
          aria-label="Previous"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); onNext() }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 p-2"
          aria-label="Next"
        >
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Image container */}
      <div
        className="max-w-5xl max-h-[90vh] mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={caption || 'Gallery image'}
            className="max-w-full max-h-[80vh] object-contain rounded-lg"
          />
        )}
        {caption && (
          <p className="text-white/80 text-center mt-4 text-lg">{caption}</p>
        )}
        {image.session && (
          <p className="text-[#D4AF37] text-center mt-2 text-sm">
            {image.session.album.title} — {image.session.album.artist}
          </p>
        )}
      </div>
    </div>
  )
}

function GalleryCard({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  const locale = useLocale() as Locale
  const imageUrl = urlForImage(image.image)?.width(600).height(600).url()
  const caption = image.caption?.[locale] || image.caption?.ca

  return (
    <div
      className="group relative overflow-hidden rounded-xl cursor-pointer aspect-square"
      onClick={onClick}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={caption || 'Gallery image'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {caption && (
            <p className="text-white text-sm font-medium line-clamp-2">{caption}</p>
          )}
          {image.category && (
            <span className="inline-block mt-2 px-2 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-xs rounded-full">
              {image.category.name[locale] || image.category.name.ca}
            </span>
          )}
        </div>
      </div>

      {/* Featured badge */}
      {image.featured && (
        <div className="absolute top-3 right-3">
          <svg className="w-5 h-5 text-[#D4AF37]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      )}
    </div>
  )
}

export default function Gallery({
  images,
  categories,
  title,
  subtitle,
  ctaText,
  hashtag
}: GalleryProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)

  // Filter images by category
  const filteredImages = selectedCategory
    ? images.filter(img => img.category?.slug === selectedCategory)
    : images

  const handlePrev = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < filteredImages.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  if (images.length === 0) return null

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title || t('gallery.title')}
          </h2>
          {subtitle && (
            <p className="text-xl text-zinc-400 mb-2">{subtitle}</p>
          )}
          {hashtag && (
            <p className="text-[#D4AF37] font-medium">{hashtag}</p>
          )}
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black'
                  : 'bg-[#1a3a5c]/50 text-zinc-300 hover:bg-[#1a3a5c] hover:text-white border border-[#254a6e]/40'
              }`}
            >
              {t('gallery.all')}
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black'
                    : 'bg-[#1a3a5c]/50 text-zinc-300 hover:bg-[#1a3a5c] hover:text-white border border-[#254a6e]/40'
                }`}
              >
                {category.name[locale] || category.name.ca}
              </button>
            ))}
          </div>
        )}

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <GalleryCard
              key={image._id}
              image={image}
              onClick={() => setSelectedImageIndex(index)}
            />
          ))}
        </div>

        {/* CTA */}
        {ctaText && (
          <div className="text-center mt-12">
            <p className="text-zinc-400">{ctaText}</p>
          </div>
        )}

        {/* Modal */}
        {selectedImageIndex !== null && filteredImages[selectedImageIndex] && (
          <ImageModal
            image={filteredImages[selectedImageIndex]}
            onClose={() => setSelectedImageIndex(null)}
            onPrev={handlePrev}
            onNext={handleNext}
            hasPrev={selectedImageIndex > 0}
            hasNext={selectedImageIndex < filteredImages.length - 1}
          />
        )}
      </div>
    </section>
  )
}
