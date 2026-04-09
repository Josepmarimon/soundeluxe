import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import type { Locale } from '@/lib/sanity/types'
import ScannerClient from './ScannerClient'

interface ScannerPageProps {
  params: Promise<{ locale: Locale }>
}

export default async function ScannerPage({ params }: ScannerPageProps) {
  const { locale } = await params

  const authSession = await auth()

  if (!authSession?.user) {
    redirect(`/${locale}/login`)
  }

  const userRole = (authSession.user as any).role
  if (userRole !== 'ADMIN' && userRole !== 'EDITOR') {
    redirect(`/${locale}`)
  }

  return <ScannerClient locale={locale} />
}
