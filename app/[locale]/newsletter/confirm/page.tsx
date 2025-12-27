import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface Props {
  searchParams: Promise<{ token?: string }>
}

async function confirmSubscription(token: string, baseUrl: string): Promise<{
  success: boolean
  error: string
  alreadyConfirmed: boolean
}> {
  try {
    const response = await fetch(`${baseUrl}/api/newsletter/confirm?token=${token}`, {
      method: 'GET',
      cache: 'no-store',
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: response.status === 410 ? 'expired' : 'invalid',
        alreadyConfirmed: false,
      }
    }

    return {
      success: true,
      error: '',
      alreadyConfirmed: data.alreadyConfirmed || false,
    }
  } catch {
    return { success: false, error: 'server', alreadyConfirmed: false }
  }
}

export default async function NewsletterConfirmPage({ searchParams }: Props) {
  const t = await getTranslations('newsletter')
  const { token } = await searchParams

  // Get base URL for API call
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let result = { success: false, error: 'invalid', alreadyConfirmed: false }

  if (token) {
    result = await confirmSubscription(token, baseUrl)
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-16 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4 text-center">
        {result.success ? (
          <>
            <div className="mb-6 flex justify-center">
              <CheckCircle className="w-20 h-20 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {t('confirmTitle')}
            </h1>
            <p className="text-zinc-300 mb-8">
              {result.alreadyConfirmed ? t('alreadyConfirmed') : t('confirmMessage')}
            </p>
          </>
        ) : result.error === 'expired' ? (
          <>
            <div className="mb-6 flex justify-center">
              <AlertCircle className="w-20 h-20 text-yellow-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {t('confirmExpired')}
            </h1>
            <p className="text-zinc-300 mb-8">
              {t('confirmExpired')}
            </p>
          </>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <XCircle className="w-20 h-20 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              {t('confirmError')}
            </h1>
            <p className="text-zinc-300 mb-8">
              {t('confirmError')}
            </p>
          </>
        )}

        <Link
          href="/"
          className="inline-block bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black px-8 py-3 rounded-full font-semibold hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028] transition-all"
        >
          {t('backHome')}
        </Link>
      </div>
    </div>
  )
}
