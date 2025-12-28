import { getTranslations } from 'next-intl/server'
import { client } from '@/lib/sanity/client'
import { galleryImagesQuery, galleryCategoriesQuery, galleryPageQuery } from '@/lib/sanity/queries'
import type { GalleryImage, GalleryCategory, GalleryPage } from '@/lib/sanity/types'
import Gallery from '@/components/Gallery'

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations()
  const { locale } = await params
  const typedLocale = locale as 'ca' | 'es' | 'en'

  // Fetch gallery data from Sanity
  const [images, categories, pageConfig]: [GalleryImage[], GalleryCategory[], GalleryPage | null] = await Promise.all([
    client.fetch(galleryImagesQuery),
    client.fetch(galleryCategoriesQuery),
    client.fetch(galleryPageQuery),
  ])

  return (
    <div className="min-h-screen bg-transparent pt-24">
      <Gallery
        images={images}
        categories={categories}
        title={pageConfig?.title?.[typedLocale] || t('gallery.title')}
        subtitle={pageConfig?.subtitle?.[typedLocale] || t('gallery.subtitle')}
        ctaText={pageConfig?.ctaText?.[typedLocale] || t('gallery.share')}
        hashtag={pageConfig?.hashtag}
      />
    </div>
  )
}
