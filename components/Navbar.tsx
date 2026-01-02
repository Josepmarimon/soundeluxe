'use client'

import { useState, useRef, useEffect } from 'react'
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
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
              href={`/${locale}/gallery`}
              className="text-zinc-300 hover:text-white transition-colors"
            >
              {t('navigation.gallery')}
            </Link>
          </div>

          {/* Language Selector & Auth */}
          <div className="flex items-center gap-4">
            {/* Language Selector - only show when not logged in */}
            {!session && (
              <div className="flex items-center bg-[#1a3a5c]/50 rounded-full">
                {locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => changeLocale(loc)}
                    className={`px-2 py-1 text-xs font-medium transition-colors ${
                      locale === loc
                        ? 'bg-[#D4AF37] text-black rounded-full'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {loc.toUpperCase()}
                  </button>
                ))}
              </div>
            )}

            {/* Auth Buttons */}
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-[#1a3a5c] animate-pulse" />
            ) : session ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors text-sm"
                >
                  <span>{session.user?.name || t('navigation.profile')}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#0a1929] border border-[#254a6e]/50 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href={`/${locale}/profile`}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-[#1a3a5c] transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('navigation.profile')}
                    </Link>
                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        signOut({ callbackUrl: `/${locale}` })
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-[#1a3a5c] transition-colors"
                    >
                      {t('navigation.logout')}
                    </button>
                  </div>
                )}
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
