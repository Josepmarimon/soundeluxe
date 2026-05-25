import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale, type Locale } from './i18n'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: false,
})

function detectLocale(request: NextRequest): Locale {
  const accept = request.headers.get('accept-language') ?? ''
  const primary = accept.split(',')[0]?.trim().toLowerCase() ?? ''
  if (primary.startsWith('es')) return 'es'
  return defaultLocale
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasLocalePrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  )

  if (!hasLocalePrefix) {
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value as
      | Locale
      | undefined
    const target =
      cookieLocale && locales.includes(cookieLocale)
        ? cookieLocale
        : detectLocale(request)

    if (target !== defaultLocale) {
      const url = request.nextUrl.clone()
      url.pathname = `/${target}${pathname}`
      return NextResponse.redirect(url)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: ['/', '/(ca|es|en)/:path*', '/((?!_next|_vercel|studio|api|.*\\..*).*)'],
}
