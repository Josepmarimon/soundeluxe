'use client'

import type { ResolvedSection } from '@/lib/comercial/types'
import type { CommercialMetrics } from '@/lib/types/commercial'
import SectionHero from './SectionHero'
import SectionText from './SectionText'
import SectionCards from './SectionCards'
import SectionMetrics from './SectionMetrics'
import SectionCommunity from './SectionCommunity'
import SectionTimeline from './SectionTimeline'
import SectionCTA from './SectionCTA'

interface Props {
  section: ResolvedSection
  recipientName: string
  recipientCompany?: string | null
  lang: string
  metrics: CommercialMetrics | null
}

export default function SectionRenderer({ section, recipientName, recipientCompany, lang, metrics }: Props) {
  switch (section.component) {
    case 'SectionHero':
      return (
        <SectionHero
          content={section.content}
          recipientName={recipientName}
          recipientCompany={recipientCompany}
          lang={lang}
          image={section.image}
        />
      )
    case 'SectionText':
      return <SectionText content={section.content} image={section.image} />
    case 'SectionCards':
      return <SectionCards content={section.content} image={section.image} />
    case 'SectionMetrics':
      return <SectionMetrics content={section.content} metrics={metrics} lang={lang} />
    case 'SectionCommunity':
      return <SectionCommunity content={section.content} image={section.image} />
    case 'SectionTimeline':
      return <SectionTimeline content={section.content} />
    case 'SectionCTA':
      return <SectionCTA content={section.content} lang={lang} />
    default:
      return <SectionText content={section.content} />
  }
}
