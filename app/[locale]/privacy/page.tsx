import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export default async function PrivacyPage() {
  const t = await getTranslations('privacy')

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-4">{t('title')}</h1>

        <p className="text-zinc-400 text-sm mb-8">
          {t('lastUpdated')}: 27/12/2024
        </p>

        <div className="prose prose-invert prose-zinc max-w-none">
          {/* Introduction */}
          <p className="text-zinc-300 text-lg mb-8">{t('intro')}</p>

          {/* Data Collected */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('dataCollected.title')}
            </h2>
            <p className="text-zinc-300 mb-4">{t('dataCollected.description')}</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>{t('dataCollected.email')}</li>
              <li>{t('dataCollected.language')}</li>
              <li>{t('dataCollected.consent')}</li>
            </ul>
          </section>

          {/* Purpose */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('purpose.title')}
            </h2>
            <p className="text-zinc-300 mb-4">{t('purpose.description')}</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>{t('purpose.newsletter')}</li>
              <li>{t('purpose.updates')}</li>
              <li>{t('purpose.service')}</li>
            </ul>
          </section>

          {/* Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('rights.title')}
            </h2>
            <p className="text-zinc-300 mb-4">{t('rights.description')}</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>{t('rights.access')}</li>
              <li>{t('rights.rectify')}</li>
              <li>{t('rights.delete')}</li>
              <li>{t('rights.unsubscribe')}</li>
            </ul>
          </section>

          {/* How to unsubscribe */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('unsubscribe.title')}
            </h2>
            <p className="text-zinc-300 mb-4">{t('unsubscribe.description')}</p>
            <ul className="list-disc list-inside text-zinc-300 space-y-2">
              <li>{t('unsubscribe.emailLink')}</li>
              <li>{t('unsubscribe.profile')}</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('retention.title')}
            </h2>
            <p className="text-zinc-300">{t('retention.description')}</p>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">
              {t('contact.title')}
            </h2>
            <p className="text-zinc-300 mb-2">{t('contact.description')}</p>
            <a
              href="mailto:info@soundeluxe.com"
              className="text-[#D4AF37] hover:text-[#F4E5AD] transition-colors"
            >
              info@soundeluxe.com
            </a>
          </section>
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            &larr; {t('title')}
          </Link>
        </div>
      </div>
    </div>
  )
}
