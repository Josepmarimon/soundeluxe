import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { client } from '@/lib/sanity/client'
import { faqPageQuery } from '@/lib/sanity/queries'
import type { FAQPage } from '@/lib/sanity/types'
import FAQAccordion from '@/components/FAQAccordion'
import PortableTextContent from '@/components/PortableTextContent'

export default async function FAQPageRoute({ params }: { params: Promise<{ locale: string }> }) {
  const t = await getTranslations('faq')
  const { locale } = await params
  const typedLocale = locale as 'ca' | 'es' | 'en'

  // Fetch FAQ data from Sanity
  const pageConfig: FAQPage | null = await client.fetch(faqPageQuery)

  // Default values if no content in Sanity
  const title = pageConfig?.title?.[typedLocale] || t('title')
  const subtitle = pageConfig?.subtitle?.[typedLocale] || t('subtitle')

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{title}</h1>
          {subtitle && (
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </header>

        {/* FAQ Accordion */}
        {pageConfig?.faqs && pageConfig.faqs.length > 0 && (
          <section className="mb-16">
            <FAQAccordion faqs={pageConfig.faqs} locale={typedLocale} />
          </section>
        )}

        {/* Cancellation Policy */}
        {pageConfig?.cancellationPolicy?.[typedLocale] && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-zinc-700">
              {pageConfig.cancellationTitle?.[typedLocale] || t('cancellationTitle')}
            </h2>
            <div className="prose prose-invert prose-zinc max-w-none">
              <PortableTextContent value={pageConfig.cancellationPolicy[typedLocale]} />
            </div>
          </section>
        )}

        {/* Additional Policies */}
        {pageConfig?.additionalPolicies && pageConfig.additionalPolicies.length > 0 && (
          <>
            {pageConfig.additionalPolicies.map((policy) => (
              <section key={policy._key} className="mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 pb-2 border-b border-zinc-700">
                  {policy.sectionTitle?.[typedLocale]}
                </h2>
                {policy.content?.[typedLocale] && (
                  <div className="prose prose-invert prose-zinc max-w-none">
                    <PortableTextContent value={policy.content[typedLocale]} />
                  </div>
                )}
              </section>
            ))}
          </>
        )}

        {/* Contact Info */}
        {pageConfig?.contactInfo?.[typedLocale] && (
          <section className="mt-12 p-6 bg-zinc-900/50 rounded-lg border border-zinc-800">
            <p className="text-zinc-300">{pageConfig.contactInfo[typedLocale]}</p>
            <a
              href="mailto:info@soundeluxe.com"
              className="inline-block mt-2 text-[#D4AF37] hover:text-[#F4E5AD] transition-colors font-medium"
            >
              info@soundeluxe.com
            </a>
          </section>
        )}

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            &larr; {t('backToHome')}
          </Link>
        </div>
      </div>
    </div>
  )
}
