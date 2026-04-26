'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

interface GuestCheckoutModalProps {
  open: boolean
  onClose: () => void
  sessionId: string
  numPlaces: number
  total: number
  locale: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function GuestCheckoutModal({
  open,
  onClose,
  sessionId,
  numPlaces,
  total,
  locale,
}: GuestCheckoutModalProps) {
  const t = useTranslations('booking')
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountExists, setAccountExists] = useState(false)

  useEffect(() => {
    if (!open) {
      setName('')
      setEmail('')
      setError(null)
      setAccountExists(false)
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null

  const goToLoginWithEmail = () => {
    const callback = `/${locale}/sessions/${sessionId}`
    const params = new URLSearchParams({ callbackUrl: callback })
    if (email.trim()) params.set('email', email.trim().toLowerCase())
    router.push(`/${locale}/login?${params.toString()}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setAccountExists(false)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim().toLowerCase()

    if (!trimmedName || !trimmedEmail) {
      setError(t('guest.errors.missingFields'))
      return
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError(t('guest.errors.invalidEmail'))
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          numPlaces,
          locale,
          guestEmail: trimmedEmail,
          guestName: trimmedName,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 409 && data?.code === 'ACCOUNT_EXISTS') {
          setAccountExists(true)
          setError(t('errors.accountExists'))
          return
        }
        if (res.status === 409) {
          setError(t('errors.soldOut'))
          return
        }
        setError(t('errors.generic'))
        return
      }

      window.location.href = data.url
    } catch {
      setError(t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-outline-subtle overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-fg">{t('guest.title')}</h2>
              <p className="text-sm text-fg-muted mt-1">{t('guest.subtitle')}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t('cancel')}
              className="text-fg-muted hover:text-fg flex-shrink-0 ml-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                {t('guest.nameLabel')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('guest.namePlaceholder')}
                required
                maxLength={120}
                autoComplete="name"
                className="w-full px-3 py-2.5 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                {t('guest.emailLabel')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('guest.emailPlaceholder')}
                required
                maxLength={200}
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <p className="text-[11px] text-fg-subtle">
              {t('guest.loginHint')}{' '}
              <button
                type="button"
                onClick={goToLoginWithEmail}
                className="text-fg underline hover:text-primary"
              >
                {t('guest.loginInstead')}
              </button>
            </p>

            <div className="flex items-baseline justify-between pt-2 border-t border-outline">
              <span className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold">{t('total')}</span>
              <span className="text-2xl font-black text-fg">
                {total.toFixed(2)}<span className="text-base font-bold text-fg-subtle">€</span>
              </span>
            </div>

            {error && (
              <div className="space-y-1">
                <p className="text-red-400 text-xs">{error}</p>
                {accountExists && (
                  <button
                    type="button"
                    onClick={goToLoginWithEmail}
                    className="text-fg underline text-xs hover:text-primary"
                  >
                    {t('guest.loginInstead')}
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-full border border-outline text-fg font-semibold text-sm hover:bg-card-hover/50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-dark transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('processing') : t('proceedToPayment')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
