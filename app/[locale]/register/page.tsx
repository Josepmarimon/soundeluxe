'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Locale } from '@/lib/sanity/types'

export default function RegisterPage() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
        headers: {
          'Content-Type': 'application/json',
        },
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

      // Show success message
      setSuccess(true)
    } catch (error) {
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

  // Success state - show email verification message
  if (success) {
    return (
      <div className="min-h-screen bg-transparent pt-16 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <div className="bg-velvet-card rounded-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              {locale === 'ca'
                ? 'Comprova el teu email'
                : locale === 'es'
                  ? 'Revisa tu email'
                  : 'Check your email'}
            </h1>
            <p className="text-zinc-400 mb-6">
              {locale === 'ca'
                ? `Hem enviat un email de verificació a ${email}. Clica l'enllaç per activar el teu compte.`
                : locale === 'es'
                  ? `Hemos enviado un email de verificación a ${email}. Haz clic en el enlace para activar tu cuenta.`
                  : `We've sent a verification email to ${email}. Click the link to activate your account.`}
            </p>
            <p className="text-zinc-500 text-sm">
              {locale === 'ca'
                ? 'No el trobes? Comprova la carpeta de spam.'
                : locale === 'es'
                  ? '¿No lo encuentras? Revisa la carpeta de spam.'
                  : "Can't find it? Check your spam folder."}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent pt-16 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('navigation.register')}
          </h1>
          <p className="text-zinc-400">
            {locale === 'ca'
              ? 'Crea el teu compte'
              : locale === 'es'
                ? 'Crea tu cuenta'
                : 'Create your account'}
          </p>
        </div>

        <div className="bg-velvet-card rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-white mb-2">
                {locale === 'ca' ? 'Nom' : locale === 'es' ? 'Nombre' : 'Name'}
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a3a5c] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-white mb-2">
                {t('footer.email')}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a3a5c] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white mb-2">
                {locale === 'ca'
                  ? 'Contrasenya'
                  : locale === 'es'
                    ? 'Contraseña'
                    : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-[#1a3a5c] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                  tabIndex={-1}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? locale === 'ca'
                  ? 'Creant compte...'
                  : locale === 'es'
                    ? 'Creando cuenta...'
                    : 'Creating account...'
                : t('navigation.register')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              {locale === 'ca'
                ? 'Ja tens compte?'
                : locale === 'es'
                  ? '¿Ya tienes cuenta?'
                  : 'Already have an account?'}{' '}
              <Link
                href={`/${locale}/login`}
                className="text-white hover:underline"
              >
                {t('navigation.login')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
