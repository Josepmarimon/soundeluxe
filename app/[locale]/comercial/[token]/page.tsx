import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ComercialPageClient from './ComercialPageClient'
import { resolveSectionsForLink } from '@/lib/comercial/helpers'
import type { LinkSection } from '@/lib/comercial/types'
import type { CommercialRecipientType } from '@/lib/comercial/types'
import { t, type Lang } from './translations'

export const metadata: Metadata = {
  title: 'Sound Deluxe — Proposta Comercial',
  description: 'Proposta de col·laboració personalitzada',
  robots: 'noindex, nofollow',
}

interface Props {
  params: Promise<{ token: string; locale: string }>
  searchParams: Promise<{ lang?: string }>
}

export default async function ComercialPage({ params, searchParams }: Props) {
  const { token } = await params
  const { lang: langParam } = await searchParams

  // Validate token format (cuid or uuid)
  if (!token || token.length < 20) {
    notFound()
  }

  const link = await prisma.commercialLink.findUnique({
    where: { token },
    select: {
      id: true,
      token: true,
      recipientName: true,
      recipientCompany: true,
      expiresAt: true,
      deletedAt: true,
      lang: true,
      recipientType: true,
      sections: true,
    },
  })

  if (!link || link.deletedAt) {
    notFound()
  }

  // Language: URL param overrides DB default
  const dbLang = link.lang.toLowerCase() as Lang
  const lang: Lang = langParam === 'en' ? 'en' : langParam === 'es' ? 'es' : langParam === 'ca' ? 'ca' : dbLang

  // Check expiration
  if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 to-black">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold text-white mb-4">{t('expiredTitle', lang)}</h1>
          <p className="text-gray-400">
            {t('expiredText', lang)}{' '}
            <a href="mailto:info@soundeluxe.es" className="text-[#D4AF37] hover:text-[#c4a030]">
              info@soundeluxe.es
            </a>
            {' '}{t('expiredRequestNew', lang)}
          </p>
        </div>
      </div>
    )
  }

  // Resolve sections: merge template defaults with per-link overrides
  const recipientType = (link.recipientType || 'VENUE') as CommercialRecipientType
  const linkSections = (link.sections as LinkSection[] | null) ?? null

  const resolvedSections = resolveSectionsForLink(
    recipientType,
    lang,
    linkSections,
    link.recipientName,
    link.recipientCompany
  )

  return (
    <ComercialPageClient
      token={token}
      recipientName={link.recipientName}
      recipientCompany={link.recipientCompany}
      lang={lang}
      resolvedSections={resolvedSections}
    />
  )
}
