import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { LegalPage } from '@/lib/sanity/types'
import type { Locale } from '@/lib/sanity/types'
import PortableTextContent from './PortableTextContent'

interface LegalPageContentProps {
  page: LegalPage | null
  locale: Locale
  fallbackTitle: string
}

export default async function LegalPageContent({
  page,
  locale,
  fallbackTitle,
}: LegalPageContentProps) {
  const t = await getTranslations('common')

  if (!page) {
    return (
      <div className="min-h-screen bg-transparent pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">{fallbackTitle}</h1>
          <p className="text-zinc-400">Contingut no disponible.</p>
          <div className="mt-12 pt-8 border-t border-zinc-800">
            <Link
              href={`/${locale}`}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              &larr; {t('backToHome')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const title = page.title?.[locale] || fallbackTitle
  const intro = page.intro?.[locale]

  // Format date
  const formattedDate = page.lastUpdated
    ? new Date(page.lastUpdated).toLocaleDateString(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>

        {formattedDate && (
          <p className="text-zinc-400 text-sm mb-8">
            {t('lastUpdated')}: {formattedDate}
          </p>
        )}

        <div className="prose prose-invert prose-zinc max-w-none">
          {/* Introduction */}
          {intro && (
            <p className="text-zinc-300 text-lg mb-8">{intro}</p>
          )}

          {/* Sections */}
          {page.sections?.map((section) => (
            <section key={section._key} className="mb-8">
              {section.title?.[locale] && (
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {section.title[locale]}
                </h2>
              )}
              {section.content?.[locale] && (
                <PortableTextContent value={section.content[locale]} />
              )}
            </section>
          ))}

          {/* Contact */}
          {page.contactEmail && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                {t('contact')}
              </h2>
              <p className="text-zinc-300 mb-2">{t('contactDescription')}</p>
              <a
                href={`mailto:${page.contactEmail}`}
                className="text-[#D4AF37] hover:text-[#F4E5AD] transition-colors"
              >
                {page.contactEmail}
              </a>
            </section>
          )}
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <Link
            href={`/${locale}`}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            &larr; {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
