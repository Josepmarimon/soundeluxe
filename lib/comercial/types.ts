// Types for the Commercial Proposal Template System

export type Lang = 'ca' | 'es' | 'en'

export type CommercialRecipientType = 'VENUE' | 'DISC_PROVIDER' | 'FAN_CLUB' | 'COMPANY' | 'RECORD_LABEL'

export type SectionCategory = 'common' | 'type_specific'

export type SectionComponentType =
  | 'SectionHero'
  | 'SectionText'
  | 'SectionCards'
  | 'SectionMetrics'
  | 'SectionCommunity'
  | 'SectionTimeline'
  | 'SectionCTA'

export interface LocalizedString {
  ca: string
  es: string
  en: string
}

export interface SectionContentItem {
  title: string
  description: string
  icon?: string // Lucide icon name
}

export interface SectionContent {
  title: string
  body: string // HTML (from Tiptap WYSIWYG)
  items?: SectionContentItem[]
}

// Definition of an available section (stored in code)
export interface SectionDefinition {
  key: string
  name: LocalizedString
  category: SectionCategory
  component: SectionComponentType
  defaultContent: Record<Lang, SectionContent>
  defaultImage?: string
  supportsMetrics?: boolean
  supportsRecipientInterpolation?: boolean // for {{recipientName}}, {{recipientCompany}}
}

// Per-link section override (stored in DB as JSON)
export interface LinkSection {
  key: string
  visible: boolean
  order: number
  customContent?: Partial<Record<Lang, Partial<SectionContent>>>
  customImage?: string
}

// Final resolved section ready for rendering
export interface ResolvedSection {
  key: string
  component: SectionComponentType
  content: SectionContent // resolved for the current lang
  image?: string
  supportsMetrics?: boolean
}

// Template definition per recipient type
export interface TemplateDefinition {
  recipientType: CommercialRecipientType
  name: LocalizedString
  description: LocalizedString
  icon: string // Lucide icon name
  defaultSections: Array<{ key: string; visible: boolean; order: number }>
}
