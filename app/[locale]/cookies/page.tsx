import { client } from '@/lib/sanity/client'
import { legalPageQuery } from '@/lib/sanity/queries'
import type { LegalPage, Locale } from '@/lib/sanity/types'
import LegalPageContent from '@/components/LegalPageContent'

interface CookiesPageProps {
  params: Promise<{ locale: string }>
}

export default async function CookiesPage({ params }: CookiesPageProps) {
  const { locale } = await params

  const page: LegalPage | null = await client.fetch(legalPageQuery, {
    slug: 'cookies',
  })

  return (
    <LegalPageContent
      page={page}
      locale={locale as Locale}
      fallbackTitle="Política de Cookies"
    />
  )
}
