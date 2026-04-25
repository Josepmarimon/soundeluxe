'use client'

import { useEffect, useState } from 'react'

type Theme = 'night' | 'day'

const STORAGE_KEY = 'theme'

function readTheme(): Theme {
  if (typeof document === 'undefined') return 'night'
  return document.documentElement.getAttribute('data-theme') === 'day' ? 'day' : 'night'
}

function applyTheme(theme: Theme) {
  if (theme === 'day') {
    document.documentElement.setAttribute('data-theme', 'day')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {}
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('night')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme(readTheme())
    setMounted(true)
  }, [])

  const toggle = () => {
    const next: Theme = theme === 'day' ? 'night' : 'day'
    applyTheme(next)
    setTheme(next)
  }

  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />
  }

  const isDay = theme === 'day'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDay ? 'Switch to night mode' : 'Switch to day mode'}
      className="w-9 h-9 flex items-center justify-center rounded-full border border-border/50 text-fg-muted hover:text-primary hover:border-primary/60 transition-colors"
    >
      {isDay ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 14v2m9-9h-2M5 12H3m15.364-6.364l-1.414 1.414M6.05 17.95l-1.414 1.414M18.364 18.364l-1.414-1.414M6.05 6.05L4.636 4.636M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )}
    </button>
  )
}
