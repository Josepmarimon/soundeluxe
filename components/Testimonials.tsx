'use client'

import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import type { Testimonial, Locale } from '@/lib/sanity/types'
import { urlForImage } from '@/lib/sanity/image'

interface TestimonialsProps {
  testimonials: Testimonial[]
  title?: string
  subtitle?: string
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-[#D4AF37]' : 'text-zinc-600'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  const locale = useLocale() as Locale

  const photoUrl = testimonial.photo
    ? urlForImage(testimonial.photo)?.width(80).height(80).url()
    : null

  const quote = testimonial.quote[locale] || testimonial.quote.ca
  const sessionInfo = testimonial.session
    ? `${testimonial.session.title} — ${testimonial.session.artist}`
    : testimonial.sessionText

  return (
    <div className="bg-[#F5F1E8] rounded-2xl p-6 flex flex-col h-full">
      {/* Header with photo and info */}
      <div className="flex items-center gap-4 mb-4">
        {/* Photo or initials */}
        <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-[#D4AF37] to-[#F4E5AD] flex items-center justify-center flex-shrink-0">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={testimonial.name}
              width={56}
              height={56}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[#0a1929] font-bold text-lg">
              {testimonial.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          )}
        </div>

        {/* Name and profession */}
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#0a1929] truncate">{testimonial.name}</h4>
          <p className="text-sm text-zinc-600 truncate">{testimonial.profession}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="mb-3">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Quote */}
      <blockquote className="text-[#0a1929] text-sm leading-relaxed flex-1 mb-4">
        "{quote}"
      </blockquote>

      {/* Session info */}
      {sessionInfo && (
        <div className="pt-4 border-t border-[#D4AF37]/20">
          <p className="text-xs text-zinc-500">
            <span className="text-[#D4AF37]">♫</span> {sessionInfo}
          </p>
        </div>
      )}
    </div>
  )
}

export default function Testimonials({ testimonials, title, subtitle }: TestimonialsProps) {
  const t = useTranslations()

  if (testimonials.length === 0) return null

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {title || t('testimonials.title')}
          </h2>
          {subtitle && (
            <p className="text-xl text-zinc-400">{subtitle}</p>
          )}
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial._id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
