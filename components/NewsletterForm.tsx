'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'

export default function NewsletterForm() {
  const t = useTranslations('newsletter')
  const locale = useLocale()

  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    // Validate email
    if (!validateEmail(email)) {
      setErrorMessage(t('invalidEmail'))
      return
    }

    // Validate consent
    if (!consent) {
      setErrorMessage(t('privacyConsent'))
      return
    }

    setStatus('loading')

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          language: locale.toUpperCase(),
        }),
      })

      if (!response.ok) {
        throw new Error('Subscription failed')
      }

      setStatus('success')
      setEmail('')
      setConsent(false)
    } catch {
      setStatus('error')
      setErrorMessage(t('error'))
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-900/30 border border-green-700 rounded-xl p-6 text-center">
        <p className="text-green-400 font-medium">{t('success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 px-6 py-4 bg-white/10 border border-zinc-700 rounded-full text-white placeholder-zinc-400 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
          disabled={status === 'loading'}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black rounded-full font-semibold hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? t('subscribing') : t('subscribe')}
        </button>
      </div>

      {/* GDPR Consent Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="newsletter-consent"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-4 h-4 rounded border-zinc-600 bg-white/10 text-[#D4AF37] focus:ring-[#D4AF37] focus:ring-offset-0"
          disabled={status === 'loading'}
        />
        <label htmlFor="newsletter-consent" className="text-sm text-zinc-400">
          {t('privacyConsent')}{' '}
          <Link
            href={`/${locale}/privacy`}
            className="text-[#D4AF37] hover:text-[#F4E5AD] underline"
          >
            {t('privacyLink')}
          </Link>
        </label>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <p className="text-red-400 text-sm text-center">{errorMessage}</p>
      )}

      {status === 'error' && !errorMessage && (
        <p className="text-red-400 text-sm text-center">{t('error')}</p>
      )}
    </form>
  )
}
