'use client'

import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { locales, type Locale } from '@/i18n'

interface NavbarProps {
  showShop?: boolean
}

export default function Navbar({ showShop = true }: NavbarProps) {
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1929]/95 backdrop-blur-sm border-b border-[#254a6e]/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Sound Deluxe"
              width={220}
              height={60}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href={`/${locale}`}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              {t('navigation.home')}
            </Link>
            {showShop && (
              <Link
                href={`/${locale}/albums`}
                className="text-zinc-300 hover:text-white transition-colors"
              >
                {t('navigation.albums')}
              </Link>
            )}
            <Link
              href={`/${locale}/votes`}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              {t('navigation.votes')}
            </Link>
            <Link
              href={`/${locale}/salas`}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              {t('navigation.salas')}
            </Link>
            <Link
              href={`/${locale}/about`}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              {t('navigation.about')}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              {t('navigation.contact')}
            </Link>
          </div>

          {/* Language Selector & Auth */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-[#1a3a5c] rounded-full p-1">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => changeLocale(loc)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    locale === loc
                      ? 'bg-white text-black'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {loc.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Auth Buttons */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-[#1a3a5c] animate-pulse" />
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/profile`}
                  className="text-zinc-300 hover:text-white transition-colors text-sm hidden sm:inline"
                >
                  {session.user?.name || t('navigation.profile')}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="text-zinc-300 hover:text-white transition-colors text-sm"
                >
                  {t('navigation.logout')}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href={`/${locale}/login`}
                  className="text-zinc-300 hover:text-white transition-colors text-sm hidden sm:inline"
                >
                  {t('navigation.login')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-4 py-2 rounded-full font-semibold hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all shadow-md text-sm"
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
