'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface GiftModalProps {
  open: boolean
  onClose: () => void
  sessionId: string
  numPlaces: number
  total: number
  locale: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function GiftModal({ open, onClose, sessionId, numPlaces, total, locale }: GiftModalProps) {
  const t = useTranslations('booking')
  const { status } = useSession()
  const router = useRouter()

  const isLoggedIn = status === 'authenticated'

  const [recipientName, setRecipientName] = useState('')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [giftMessage, setGiftMessage] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountExists, setAccountExists] = useState(false)

  useEffect(() => {
    if (!open) {
      setRecipientName('')
      setRecipientEmail('')
      setGiftMessage('')
      setBuyerName('')
      setBuyerEmail('')
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
    if (buyerEmail.trim()) params.set('email', buyerEmail.trim().toLowerCase())
    router.push(`/${locale}/login?${params.toString()}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setAccountExists(false)

    const name = recipientName.trim()
    const email = recipientEmail.trim().toLowerCase()
    const buyerNameTrimmed = buyerName.trim()
    const buyerEmailTrimmed = buyerEmail.trim().toLowerCase()

    if (!name || !email) {
      setError(t('gift.errors.missingFields'))
      return
    }
    if (!EMAIL_RE.test(email)) {
      setError(t('gift.errors.invalidEmail'))
      return
    }

    if (!isLoggedIn) {
      if (!buyerNameTrimmed || !buyerEmailTrimmed) {
        setError(t('gift.errors.missingBuyerFields'))
        return
      }
      if (!EMAIL_RE.test(buyerEmailTrimmed)) {
        setError(t('gift.errors.invalidBuyerEmail'))
        return
      }
      if (buyerEmailTrimmed === email) {
        setError(t('errors.selfGift'))
        return
      }
    }

    setLoading(true)
    try {
      const payload: Record<string, unknown> = {
        sessionId,
        numPlaces,
        locale,
        isGift: true,
        recipientName: name,
        recipientEmail: email,
        giftMessage: giftMessage.trim() || undefined,
      }
      if (!isLoggedIn) {
        payload.guestEmail = buyerEmailTrimmed
        payload.guestName = buyerNameTrimmed
      }

      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
        if (res.status === 400 && data?.code === 'GIFT_SELF') {
          setError(t('errors.selfGift'))
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
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-outline-subtle overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-fg">{t('gift.title')}</h2>
              <p className="text-sm text-fg-muted mt-1">{t('gift.subtitle')}</p>
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
            {/* Buyer fields - only when not logged in */}
            {!isLoggedIn && (
              <div className="space-y-2 pb-3 border-b border-outline">
                <p className="text-xs font-bold text-fg-subtle uppercase tracking-wider">
                  {t('gift.buyerSection')}
                </p>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                    {t('gift.buyerName')}
                  </label>
                  <input
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder={t('gift.buyerNamePlaceholder')}
                    required
                    maxLength={120}
                    autoComplete="name"
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                    {t('gift.buyerEmail')}
                  </label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder={t('gift.buyerEmailPlaceholder')}
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
              </div>
            )}

            {!isLoggedIn && (
              <p className="text-xs font-bold text-fg-subtle uppercase tracking-wider pt-1">
                {t('gift.recipientSection')}
              </p>
            )}

            <div>
              <label className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                {t('gift.recipientName')}
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder={t('gift.recipientNamePlaceholder')}
                required
                maxLength={120}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                {t('gift.recipientEmail')}
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder={t('gift.recipientEmailPlaceholder')}
                required
                maxLength={200}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                {t('gift.message')}
              </label>
              <textarea
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value)}
                placeholder={t('gift.messagePlaceholder')}
                rows={3}
                maxLength={300}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

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
                {loading ? t('processing') : t('gift.submit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
