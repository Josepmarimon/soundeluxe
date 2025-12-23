import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Don't redirect if the path already includes a locale
  localePrefix: 'as-needed',
})

export const config = {
  // Match only internationalized pathnames, exclude studio and api routes
  matcher: ['/', '/(ca|es|en)/:path*', '/((?!_next|_vercel|studio|api|.*\\..*).*)'],
}
