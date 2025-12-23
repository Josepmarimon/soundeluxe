'use client'

import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { locales, type Locale } from '@/i18n'

export default function Navbar() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const { data: session, status } = useSession()

  // Remove locale prefix from pathname to get the base path
  const pathnameWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

  const changeLocale = (newLocale: Locale) => {
    // Construct new path with new locale
    const newPath = `/${newLocale}${pathnameWithoutLocale}`
    window.location.href = newPath
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">SD</span>
            </div>
            <span className="text-white font-bold text-xl hidden sm:inline">
              {t('common.soundDeluxe')}
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={`/${locale}`}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {t('navigation.home')}
            </Link>
            <Link
              href={`/${locale}/sessions`}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {t('navigation.sessions')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {t('navigation.about')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              {t('navigation.contact')}
            </Link>
          </div>

          {/* Language Selector & Auth */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-zinc-900 rounded-full p-1">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => changeLocale(loc)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    locale === loc
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/profile`}
                  className="text-zinc-400 hover:text-white transition-colors text-sm hidden sm:inline"
                >
                  {session.user?.name || t('navigation.profile')}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="text-zinc-400 hover:text-white transition-colors text-sm hidden sm:inline"
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-zinc-200 transition-colors text-sm"
                >
                  {t('navigation.register')}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
