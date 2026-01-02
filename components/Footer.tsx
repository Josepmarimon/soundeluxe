'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { locales, type Locale } from '@/i18n'
import type { FooterContent } from '@/lib/sanity/types'

interface FooterProps {
  footerData: FooterContent | null
}

export default function Footer({ footerData }: FooterProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const pathname = usePathname()

  const changeLocale = (newLocale: Locale) => {
    const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/'
    const newPath = `/${newLocale}${pathnameWithoutLocale}`
    window.location.href = newPath
  }

  // Get text with fallback to JSON translations
  const description = footerData?.description?.[locale] || t('footer.description')
  const linksTitle = footerData?.sectionTitles?.links?.[locale] || t('footer.links')
  const legalTitle = footerData?.sectionTitles?.legal?.[locale] || t('footer.legal')
  const contactTitle = footerData?.sectionTitles?.contact?.[locale] || t('footer.contact')

  // Copyright with year substitution
  const copyrightTemplate = footerData?.copyrightText?.[locale] || '© {year} Sound Deluxe. All rights reserved.'
  const copyright = copyrightTemplate.replace('{year}', new Date().getFullYear().toString())

  // Social links - only show those that have URLs
  const socialLinks = [
    { name: 'Instagram', url: footerData?.socialLinks?.instagram },
    { name: 'Facebook', url: footerData?.socialLinks?.facebook },
    { name: 'Twitter', url: footerData?.socialLinks?.twitter },
    { name: 'YouTube', url: footerData?.socialLinks?.youtube },
    { name: 'Spotify', url: footerData?.socialLinks?.spotify },
  ].filter(link => link.url)

  // Contact info
  const hasContactInfo = footerData?.contactInfo?.phone ||
                         footerData?.contactInfo?.email ||
                         footerData?.contactInfo?.address?.[locale]

  return (
    <footer className="bg-[#0a1929] border-t border-[#254a6e]/30">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">SD</span>
              </div>
              <span className="text-white font-bold text-xl">
                {t('common.soundDeluxe')}
              </span>
            </div>
            <p className="text-zinc-300 max-w-md">
              {description}
            </p>

            {/* Contact Info */}
            {hasContactInfo && (
              <div className="mt-6 space-y-2">
                {footerData?.contactInfo?.phone && (
                  <a
                    href={`tel:${footerData.contactInfo.phone.replace(/\s/g, '')}`}
                    className="block text-zinc-300 hover:text-white transition-colors"
                  >
                    {footerData.contactInfo.phone}
                  </a>
                )}
                {footerData?.contactInfo?.email && (
                  <a
                    href={`mailto:${footerData.contactInfo.email}`}
                    className="block text-zinc-300 hover:text-white transition-colors"
                  >
                    {footerData.contactInfo.email}
                  </a>
                )}
                {footerData?.contactInfo?.address?.[locale] && (
                  <p className="text-zinc-400 text-sm">
                    {footerData.contactInfo.address[locale]}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {linksTitle}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {t('navigation.home')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/sessions`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {t('navigation.sessions')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {t('navigation.about')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {t('navigation.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {legalTitle}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/cookies`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {t('footer.cookies')}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/faq`}
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  {t('footer.faq')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-[#254a6e]/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-400 text-sm">
              {copyright}
            </p>
            <div className="flex items-center gap-6">
              {/* Language Selector */}
              <div className="flex items-center gap-1">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => changeLocale(loc)}
                    className={`px-2 py-1 text-xs font-medium transition-colors rounded ${
                      locale === loc
                        ? 'text-[#D4AF37]'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {loc.toUpperCase()}
                  </button>
                ))}
              </div>
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
