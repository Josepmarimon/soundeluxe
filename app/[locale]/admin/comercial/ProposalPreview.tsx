'use client'

import { useEffect, useState } from 'react'
import type { ResolvedSection, CommercialRecipientType, Lang, LinkSection } from '@/lib/comercial/types'
import type { CommercialMetrics } from '@/lib/types/commercial'
import { resolveSectionsForLink } from '@/lib/comercial/helpers'
import SectionRenderer from '@/app/[locale]/comercial/[token]/sections/SectionRenderer'

interface Props {
  recipientType: CommercialRecipientType
  recipientName: string
  recipientCompany?: string
  lang: Lang
  sections: LinkSection[]
}

export default function ProposalPreview({ recipientType, recipientName, recipientCompany, lang, sections }: Props) {
  const [metrics, setMetrics] = useState<CommercialMetrics | null>(null)

  const resolvedSections = resolveSectionsForLink(
    recipientType,
    lang,
    sections,
    recipientName || 'Nom del destinatari',
    recipientCompany
  )

  const needsMetrics = resolvedSections.some((s) => s.supportsMetrics)

  useEffect(() => {
    if (!needsMetrics) return
    fetch('/api/comercial/metrics')
      .then((r) => r.ok ? r.json() : null)
      .then(setMetrics)
      .catch(() => {})
  }, [needsMetrics])

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-[#0a0a0a]">
      <div className="px-3 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">Previsualització</span>
        <span className="text-xs text-gray-500">{resolvedSections.length} seccions</span>
      </div>
      <div
        className="overflow-y-auto"
        style={{ maxHeight: '60vh', transformOrigin: 'top left' }}
      >
        <div className="transform scale-[0.45] origin-top-left" style={{ width: '222%' }}>
          <div className="min-h-screen bg-[#0a0a0a] text-white">
            {resolvedSections.map((section) => (
              <div key={section.key}>
                <SectionRenderer
                  section={section}
                  recipientName={recipientName || 'Nom del destinatari'}
                  recipientCompany={recipientCompany}
                  lang={lang}
                  metrics={metrics}
                />
              </div>
            ))}
            <footer className="py-8 px-6 border-t border-gray-800/50 text-center">
              <p className="text-gray-600 text-sm">Aquesta proposta és confidencial i personalitzada.</p>
              <p className="text-gray-700 text-xs mt-2">Sound Deluxe &copy; {new Date().getFullYear()}</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
