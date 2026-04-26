/**
 * Session date/time helpers.
 *
 * Sessions are physical events in Barcelona/Madrid. We always render their date
 * and time in Europe/Madrid, regardless of where the server (UTC on Vercel) or
 * the user's browser sits. Without this, server-rendered pages and emails show
 * UTC while client-rendered components show the browser's local TZ — producing
 * different times for the same booking in the same browsing session.
 */

export const SESSION_TIMEZONE = 'Europe/Madrid'

export const SESSION_LOCALE_MAP = {
  ca: 'ca-ES',
  es: 'es-ES',
  en: 'en-GB',
} as const

export type SessionLocale = keyof typeof SESSION_LOCALE_MAP

export function resolveSessionLocale(input: string | null | undefined): SessionLocale {
  if (input === 'es' || input === 'en') return input
  return 'ca'
}

/**
 * Format a session datetime in Europe/Madrid TZ with the user's locale.
 *
 * Pass any subset of Intl.DateTimeFormatOptions for date and/or time parts.
 * The timeZone is always Europe/Madrid and cannot be overridden.
 */
export function formatSessionDateTime(
  iso: string | Date,
  locale: SessionLocale,
  options: Intl.DateTimeFormatOptions
): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  return date.toLocaleString(SESSION_LOCALE_MAP[locale], {
    ...options,
    timeZone: SESSION_TIMEZONE,
  })
}

/**
 * YYYY-MM-DD key for the Madrid calendar day a session falls on.
 * Use to group sessions by day, regardless of viewer TZ.
 */
export function getSessionDayKey(iso: string | Date): string {
  const date = typeof iso === 'string' ? new Date(iso) : iso
  // 'en-CA' yields ISO-like YYYY-MM-DD output.
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: SESSION_TIMEZONE,
  }).format(date)
}
