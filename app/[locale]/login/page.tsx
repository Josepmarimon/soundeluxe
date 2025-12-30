'use client'

import { useState, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Locale } from '@/lib/sanity/types'

export default function LoginPage() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Handle URL parameters for verification status
  useEffect(() => {
    const verified = searchParams.get('verified')
    const errorParam = searchParams.get('error')

    if (verified === 'true') {
      setSuccess(
        locale === 'ca'
          ? 'Email verificat correctament! Ja pots iniciar sessió.'
          : locale === 'es'
            ? '¡Email verificado correctamente! Ya puedes iniciar sesión.'
            : 'Email verified successfully! You can now sign in.'
      )
    } else if (verified === 'already') {
      setSuccess(
        locale === 'ca'
          ? 'El teu email ja estava verificat. Pots iniciar sessió.'
          : locale === 'es'
            ? 'Tu email ya estaba verificado. Puedes iniciar sesión.'
            : 'Your email was already verified. You can sign in.'
      )
    }

    if (errorParam === 'token_expired') {
      setError(
        locale === 'ca'
          ? 'L\'enllaç de verificació ha caducat. Registra\'t de nou.'
          : locale === 'es'
            ? 'El enlace de verificación ha caducado. Regístrate de nuevo.'
            : 'The verification link has expired. Please register again.'
      )
    } else if (errorParam === 'invalid_token') {
      setError(
        locale === 'ca'
          ? 'Enllaç de verificació invàlid.'
          : locale === 'es'
            ? 'Enlace de verificación inválido.'
            : 'Invalid verification link.'
      )
    }
  }, [searchParams, locale])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        // Check if it's an email not verified error
        if (result.error.includes('EMAIL_NOT_VERIFIED')) {
          setError(
            locale === 'ca'
              ? 'Has de verificar el teu email abans d\'iniciar sessió. Comprova la teva safata d\'entrada.'
              : locale === 'es'
                ? 'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
                : 'You must verify your email before signing in. Check your inbox.'
          )
        } else {
          setError(
            locale === 'ca'
              ? 'Credencials incorrectes'
              : locale === 'es'
                ? 'Credenciales incorrectas'
                : 'Invalid credentials'
          )
        }
      } else {
        router.push(`/${locale}/profile`)
        router.refresh()
      }
    } catch (error) {
      setError(
        locale === 'ca'
          ? 'Error al iniciar sessió'
          : locale === 'es'
            ? 'Error al iniciar sesión'
            : 'Error signing in'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent pt-16 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('navigation.login')}
          </h1>
          <p className="text-zinc-400">
            {locale === 'ca'
              ? 'Accedeix al teu compte'
              : locale === 'es'
                ? 'Accede a tu cuenta'
                : 'Access your account'}
          </p>
        </div>

        <div className="bg-velvet-card rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {success && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                  ? 'Iniciant sessió...'
                  : locale === 'es'
                    ? 'Iniciando sesión...'
                    : 'Signing in...'
                : t('navigation.login')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-zinc-400 text-sm">
              {locale === 'ca'
                ? 'No tens compte?'
                : locale === 'es'
                  ? '¿No tienes cuenta?'
                  : "Don't have an account?"}{' '}
              <Link
                href={`/${locale}/register`}
                className="text-white hover:underline"
              >
                {t('navigation.register')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
