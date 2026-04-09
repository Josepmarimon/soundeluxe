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
                  <div className="absolute right-0 mt-2 w-48 bg-[#0a1929] border border-[#254a6e]/50 rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href={`/${locale}/profile`}
                      className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-[#1a3a5c] transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      {t('navigation.profile')}
                    </Link>
                    {((session.user as any)?.role === 'ADMIN' || (session.user as any)?.role === 'EDITOR') && (
                      <>
                        <div className="border-t border-[#254a6e]/50 my-1" />
                        <div className="px-4 py-1">
                          <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]/60 font-medium">Admin</span>
                        </div>
                        <Link
                          href={`/${locale}/admin/scanner`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#D4AF37] hover:text-white hover:bg-[#1a3a5c] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
                          {t('navigation.scanner')}
                        </Link>
                        <Link
                          href={`/${locale}/admin/attendance`}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#D4AF37] hover:text-white hover:bg-[#1a3a5c] transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                          {t('navigation.attendance')}
                        </Link>
                        {(session.user as any)?.role === 'ADMIN' && (
                          <Link
                            href={`/${locale}/admin/comercial`}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[#D4AF37] hover:text-white hover:bg-[#1a3a5c] transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            Gestió Comercial
                          </Link>
                        )}
                        <div className="border-t border-[#254a6e]/50 my-1" />
                      </>
                    )}
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
