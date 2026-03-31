import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import BookingConfirmationPoller from '@/components/BookingConfirmationPoller'
import type { Locale } from '@/lib/sanity/types'

interface ConfirmationPageProps {
  params: Promise<{ locale: Locale }>
  searchParams: Promise<{ session_id?: string }>
}

export default async function BookingConfirmationPage({
  params,
  searchParams,
}: ConfirmationPageProps) {
  const { locale } = await params
  const { session_id } = await searchParams
  const t = await getTranslations()

  const authSession = await auth()

  if (!authSession?.user) {
    redirect(`/${locale}/login`)
  }

  if (!session_id) {
    redirect(`/${locale}/sessions`)
  }

  return (
    <div className="min-h-screen bg-[#0a1929] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <BookingConfirmationPoller
          stripeSessionId={session_id}
          locale={locale}
          userEmail={authSession.user.email!}
        />
      </div>
    </div>
  )
}
