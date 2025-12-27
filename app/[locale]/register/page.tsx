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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError(
        locale === 'ca'
          ? 'Les contrasenyes no coincideixen'
          : locale === 'es'
            ? 'Las contraseñas no coinciden'
            : 'Passwords do not match'
      )
      return
    }

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

      // Redirect to login after successful registration
      router.push(`/${locale}/login?registered=true`)
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
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a3a5c] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
                disabled={isLoading}
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white mb-2">
                {locale === 'ca'
                  ? 'Confirmar contrasenya'
                  : locale === 'es'
                    ? 'Confirmar contraseña'
                    : 'Confirm password'}
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#1a3a5c] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                required
                disabled={isLoading}
                minLength={8}
              />
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
