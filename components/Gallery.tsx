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
  const imageUrl = image.image ? urlForImage(image.image)?.width(1200).url() : null
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
        className="absolute top-4 right-4 text-fg/80 hover:text-fg z-10 p-2"
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
          className="absolute left-4 top-1/2 -translate-y-1/2 text-fg/80 hover:text-fg z-10 p-2"
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
          className="absolute right-4 top-1/2 -translate-y-1/2 text-fg/80 hover:text-fg z-10 p-2"
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
          <p className="text-fg/80 text-center mt-4 text-lg">{caption}</p>
        )}
        {image.session && (
          <p className="text-primary text-center mt-2 text-sm">
            {image.session.album.title} — {image.session.album.artist}
          </p>
        )}
      </div>
    </div>
  )
}

function GalleryCard({ image, onClick }: { image: GalleryImage; onClick: () => void }) {
  const locale = useLocale() as Locale
  const imageUrl = image.image ? urlForImage(image.image)?.width(600).height(600).url() : null
  const caption = image.caption?.[locale] || image.caption?.ca

  return (
    <div
      className="group relative overflow-hidden rounded-xl cursor-pointer aspect-square"
      onClick={onClick}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={caption || 'Gallery image'}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5]">
          <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </div>
      )}

      {/* Overlay on hover */}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {caption && (
            <p className="text-fg text-sm font-medium line-clamp-2">{caption}</p>
          )}
          {image.category && (
            <span className="inline-block mt-2 px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
              {image.category.name[locale] || image.category.name.ca}
            </span>
          )}
        </div>
      </div>

      {/* Instagram badge */}
      {image.instagramUrl && (
        <div className="absolute top-3 left-3 bg-black/60 rounded-full p-1.5">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
        </div>
      )}

      {/* Featured badge */}
      {image.featured && (
        <div className="absolute top-3 right-3">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
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

  const handleCardClick = (index: number) => {
    const image = filteredImages[index]
    if (image.instagramUrl) {
      window.open(image.instagramUrl, '_blank', 'noopener,noreferrer')
      return
    }
    setSelectedImageIndex(index)
  }

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
          <h2 className="text-4xl md:text-5xl font-bold text-fg mb-4">
            {title || t('gallery.title')}
          </h2>
          {subtitle && (
            <p className="text-xl text-fg-muted mb-2">{subtitle}</p>
          )}
          {hashtag && (
            <p className="text-primary font-medium">{hashtag}</p>
          )}
        </div>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === null
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-raised/50 text-fg hover:bg-surface-raised hover:text-fg border border-border/40'
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
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-raised/50 text-fg hover:bg-surface-raised hover:text-fg border border-border/40'
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
              onClick={() => handleCardClick(index)}
            />
          ))}
        </div>

        {/* CTA */}
        {ctaText && (
          <div className="text-center mt-12">
            <p className="text-fg-muted">{ctaText}</p>
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
