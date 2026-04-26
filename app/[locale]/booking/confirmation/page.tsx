import { redirect } from 'next/navigation'
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

  if (!session_id) {
    redirect(`/${locale}/sessions`)
  }

  return (
    <div className="min-h-screen bg-bg pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <BookingConfirmationPoller
          stripeSessionId={session_id}
          locale={locale}
        />
      </div>
    </div>
  )
}
