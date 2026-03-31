import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { client } from '@/lib/sanity/client'
import { upcomingSessionsQuery } from '@/lib/sanity/queries'
import type { Locale } from '@/lib/sanity/types'
import AttendanceDashboard from './AttendanceDashboard'

interface AttendancePageProps {
  params: Promise<{ locale: Locale }>
}

export default async function AttendancePage({ params }: AttendancePageProps) {
  const { locale } = await params
  const t = await getTranslations()

  const authSession = await auth()

  if (!authSession?.user) {
    redirect(`/${locale}/login`)
  }

  const userRole = (authSession.user as any).role
  if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
    redirect(`/${locale}`)
  }

  // Fetch sessions (upcoming + recent past for check-in purposes)
  const sessions = await client.fetch(upcomingSessionsQuery)

  return (
    <div className="min-h-screen bg-[#0a1929] pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">{t('attendance.title')}</h1>
        <AttendanceDashboard sessions={sessions} locale={locale} />
      </div>
    </div>
  )
}
