'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import type { Locale } from '@/lib/sanity/types'

export default function LoginPage() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(
          locale === 'ca'
            ? 'Credencials incorrectes'
            : locale === 'es'
              ? 'Credenciales incorrectas'
              : 'Invalid credentials'
        )
      } else {
        router.push(`/${locale}`)
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
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a3a5c] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
                disabled={isLoading}
              />
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
