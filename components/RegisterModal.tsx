'use client'

import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Locale } from '@/lib/sanity/types'

interface RegisterModalProps {
  open: boolean
  onClose: () => void
}

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  const t = useTranslations()
  const locale = useLocale() as Locale

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      setName('')
      setEmail('')
      setPassword('')
      setShowPassword(false)
      setError('')
      setSuccess(false)
      setIsLoading(false)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError(
        locale === 'ca'
          ? 'La contrasenya ha de tenir almenys 8 caràcters'
          : locale === 'es'
            ? 'La contraseña debe tener al menos 8 caracteres'
            : 'Password must be at least 8 characters'
      )
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          language: locale.toUpperCase(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.error ||
            (locale === 'ca'
              ? 'Error al crear el compte'
              : locale === 'es'
                ? 'Error al crear la cuenta'
                : 'Error creating account')
        )
        return
      }

      setSuccess(true)
    } catch {
      setError(
        locale === 'ca'
          ? 'Error al crear el compte'
          : locale === 'es'
            ? 'Error al crear la cuenta'
            : 'Error creating account'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-card rounded-2xl shadow-2xl border border-outline-subtle overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 md:p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-fg mb-3">
                {locale === 'ca'
                  ? 'Comprova el teu email'
                  : locale === 'es'
                    ? 'Revisa tu email'
                    : 'Check your email'}
              </h2>
              <p className="text-sm text-fg-muted mb-3">
                {locale === 'ca'
                  ? `Hem enviat un email de verificació a ${email}. Clica l'enllaç per activar el teu compte.`
                  : locale === 'es'
                    ? `Hemos enviado un email de verificación a ${email}. Haz clic en el enlace para activar tu cuenta.`
                    : `We've sent a verification email to ${email}. Click the link to activate your account.`}
              </p>
              <p className="text-xs text-fg-subtle mb-5">
                {locale === 'ca'
                  ? 'No el trobes? Comprova la carpeta de spam.'
                  : locale === 'es'
                    ? '¿No lo encuentras? Revisa la carpeta de spam.'
                    : "Can't find it? Check your spam folder."}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-dark transition-all shadow-lg"
              >
                {locale === 'ca' ? 'Tancar' : locale === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-fg">
                    {locale === 'ca'
                      ? "Registra't gratis"
                      : locale === 'es'
                        ? 'Regístrate gratis'
                        : 'Sign up for free'}
                  </h2>
                  <p className="text-sm text-fg-muted mt-1">
                    {locale === 'ca'
                      ? 'Crea el teu compte'
                      : locale === 'es'
                        ? 'Crea tu cuenta'
                        : 'Create your account'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={locale === 'ca' ? 'Tancar' : locale === 'es' ? 'Cerrar' : 'Close'}
                  className="text-fg-muted hover:text-fg flex-shrink-0 ml-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label htmlFor="register-name" className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                    {locale === 'ca' ? 'Nom' : locale === 'es' ? 'Nombre' : 'Name'}
                  </label>
                  <input
                    id="register-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={120}
                    autoComplete="name"
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="register-email" className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                    {t('footer.email')}
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    maxLength={200}
                    autoComplete="email"
                    disabled={isLoading}
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="register-password" className="text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block">
                    {locale === 'ca' ? 'Contrasenya' : locale === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                  <div className="relative">
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      disabled={isLoading}
                      className="w-full px-3 py-2.5 pr-10 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-dim hover:text-black transition-colors p-1"
                      tabIndex={-1}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-xs">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-on-primary px-6 py-3 rounded-full font-bold text-sm hover:bg-primary-dark transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? locale === 'ca'
                      ? 'Creant compte...'
                      : locale === 'es'
                        ? 'Creando cuenta...'
                        : 'Creating account...'
                    : locale === 'ca'
                      ? "Registra't gratis"
                      : locale === 'es'
                        ? 'Regístrate gratis'
                        : 'Sign up for free'}
                </button>

                <p className="text-center text-[11px] text-fg-subtle pt-1">
                  {locale === 'ca'
                    ? 'Ja tens compte?'
                    : locale === 'es'
                      ? '¿Ya tienes cuenta?'
                      : 'Already have an account?'}{' '}
                  <Link
                    href={`/${locale}/login`}
                    onClick={onClose}
                    className="text-fg underline hover:text-primary"
                  >
                    {t('navigation.login')}
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
