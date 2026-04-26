'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { signIn } from 'next-auth/react'
import type { Locale } from '@/lib/sanity/types'

const TEXTS = {
  ca: {
    title: 'Crea la teva contrasenya',
    subtitle: 'Afegeix una contrasenya per accedir a totes les teves entrades.',
    passwordLabel: 'Nova contrasenya',
    passwordPlaceholder: 'Mínim 8 caràcters',
    confirmLabel: 'Confirma contrasenya',
    submit: 'Crear contrasenya',
    processing: 'Creant...',
    successRedirect: 'Contrasenya creada! Iniciant sessió...',
    missingToken: 'Enllaç invàlid o caducat. Torna a la pàgina de login per demanar un nou enllaç.',
    errors: {
      mismatch: 'Les contrasenyes no coincideixen.',
      tooShort: 'La contrasenya ha de tenir almenys 8 caràcters.',
      expired: 'Aquest enllaç ha caducat. Torna a la pàgina de login per demanar-ne un nou.',
      invalid: 'Enllaç invàlid.',
      generic: 'Hi ha hagut un error. Torna-ho a intentar.',
    },
  },
  es: {
    title: 'Crea tu contraseña',
    subtitle: 'Añade una contraseña para acceder a todas tus entradas.',
    passwordLabel: 'Nueva contraseña',
    passwordPlaceholder: 'Mínimo 8 caracteres',
    confirmLabel: 'Confirma contraseña',
    submit: 'Crear contraseña',
    processing: 'Creando...',
    successRedirect: '¡Contraseña creada! Iniciando sesión...',
    missingToken: 'Enlace inválido o caducado. Vuelve a la página de login para solicitar uno nuevo.',
    errors: {
      mismatch: 'Las contraseñas no coinciden.',
      tooShort: 'La contraseña debe tener al menos 8 caracteres.',
      expired: 'Este enlace ha caducado. Vuelve a login para solicitar uno nuevo.',
      invalid: 'Enlace inválido.',
      generic: 'Ha habido un error. Inténtalo de nuevo.',
    },
  },
  en: {
    title: 'Create your password',
    subtitle: 'Add a password to access all your tickets.',
    passwordLabel: 'New password',
    passwordPlaceholder: 'At least 8 characters',
    confirmLabel: 'Confirm password',
    submit: 'Create password',
    processing: 'Creating...',
    successRedirect: 'Password created! Signing in...',
    missingToken: 'Invalid or expired link. Go back to the login page to request a new one.',
    errors: {
      mismatch: 'Passwords do not match.',
      tooShort: 'Password must be at least 8 characters.',
      expired: 'This link has expired. Go back to the login page to request a new one.',
      invalid: 'Invalid link.',
      generic: 'Something went wrong. Please try again.',
    },
  },
}

function SetPasswordInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const locale = useLocale() as Locale
  const t = TEXTS[locale]

  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  if (!token) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-velvet-card rounded-lg p-8 text-center">
            <p className="text-fg">{t.missingToken}</p>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError(t.errors.tooShort)
      return
    }
    if (password !== confirm) {
      setError(t.errors.mismatch)
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data?.code === 'TOKEN_EXPIRED') setError(t.errors.expired)
        else if (data?.code === 'INVALID_TOKEN') setError(t.errors.invalid)
        else setError(t.errors.generic)
        setLoading(false)
        return
      }

      setSuccess(t.successRedirect)

      // Auto sign-in
      const result = await signIn('credentials', {
        email: data.email,
        password,
        redirect: false,
      })
      if (result?.ok) {
        router.push(`/${locale}/profile`)
        router.refresh()
      } else {
        // Fallback: anar a login
        router.push(`/${locale}/login?email=${encodeURIComponent(data.email)}`)
      }
    } catch {
      setError(t.errors.generic)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-fg mb-2">{t.title}</h1>
          <p className="text-fg-muted">{t.subtitle}</p>
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
              <label htmlFor="password" className="block text-fg mb-2">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 bg-surface-raised text-fg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder={t.passwordPlaceholder}
                  required
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg"
                  tabIndex={-1}
                >
                  {showPassword ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-fg mb-2">
                {t.confirmLabel}
              </label>
              <input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 bg-surface-raised text-fg rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t.processing : t.submit}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordInner />
    </Suspense>
  )
}
