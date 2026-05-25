'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface PageViewTrackerProps {
  locale: string
}

export default function PageViewTracker({ locale }: PageViewTrackerProps) {
  const pathname = usePathname()
  const lastTracked = useRef<string | null>(null)

  useEffect(() => {
    if (!pathname) return
    if (lastTracked.current === pathname) return
    lastTracked.current = pathname

    if (
      pathname.startsWith('/studio') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next')
    ) {
      return
    }

    const referrer = document.referrer || null
    const payload = JSON.stringify({ path: pathname, locale, referrer })

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' })
      navigator.sendBeacon('/api/track/pageview', blob)
    } else {
      fetch('/api/track/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {})
    }
  }, [pathname, locale])

  return null
}
