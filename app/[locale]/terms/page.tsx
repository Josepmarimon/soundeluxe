import { client } from '@/lib/sanity/client'
import { legalPageQuery } from '@/lib/sanity/queries'
import type { LegalPage, Locale } from '@/lib/sanity/types'
import LegalPageContent from '@/components/LegalPageContent'

interface TermsPageProps {
  params: Promise<{ locale: string }>
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params

  const page: LegalPage | null = await client.fetch(legalPageQuery, {
    slug: 'terms',
  })

  return (
    <LegalPageContent
      page={page}
      locale={locale as Locale}
      fallbackTitle="Termes i Condicions"
    />
  )
}
