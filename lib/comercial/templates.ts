// Template definitions per recipient type
// Each template defines which sections to show and in what order

import type { TemplateDefinition, CommercialRecipientType } from './types'

const allSectionKeys = [
  'hero', 'about', 'context', 'team-community', 'equipment',
  'platform-metrics', 'audience', 'why-you', 'format',
  'collaboration', 'roadmap', 'cta',
]

function buildSections(keys: string[]): Array<{ key: string; visible: boolean; order: number }> {
  return keys.map((key, i) => ({ key, visible: true, order: i }))
}

export const TEMPLATES: Record<CommercialRecipientType, TemplateDefinition> = {
  VENUE: {
    recipientType: 'VENUE',
    name: { ca: 'Espais / Venues', es: 'Espacios / Venues', en: 'Venues' },
    description: {
      ca: 'Per a espais on celebrar sessions d\'escolta',
      es: 'Para espacios donde celebrar sesiones de escucha',
      en: 'For venues to host listening sessions',
    },
    icon: 'Building',
    defaultSections: buildSections(allSectionKeys),
  },

  DISC_PROVIDER: {
    recipientType: 'DISC_PROVIDER',
    name: { ca: 'Proveïdors de discs', es: 'Proveedores de discos', en: 'Disc Providers' },
    description: {
      ca: 'Per a botigues i distribuïdors de vinil',
      es: 'Para tiendas y distribuidores de vinilo',
      en: 'For vinyl shops and distributors',
    },
    icon: 'Disc3',
    defaultSections: buildSections([
      'hero', 'about', 'audience', 'format', 'context',
      'team-community', 'platform-metrics', 'why-you',
      'collaboration', 'roadmap', 'cta',
    ]),
  },

  FAN_CLUB: {
    recipientType: 'FAN_CLUB',
    name: { ca: 'Clubs de fans', es: 'Clubs de fans', en: 'Fan Clubs' },
    description: {
      ca: 'Per a clubs de fans que vulguin organitzar activitats',
      es: 'Para clubs de fans que quieran organizar actividades',
      en: 'For fan clubs wanting to organize activities',
    },
    icon: 'Heart',
    defaultSections: buildSections([
      'hero', 'about', 'format', 'audience', 'why-you',
      'team-community', 'platform-metrics', 'collaboration',
      'roadmap', 'cta',
    ]),
  },

  COMPANY: {
    recipientType: 'COMPANY',
    name: { ca: 'Empreses', es: 'Empresas', en: 'Companies' },
    description: {
      ca: 'Per a empreses que vulguin experiències corporatives',
      es: 'Para empresas que quieran experiencias corporativas',
      en: 'For companies wanting corporate experiences',
    },
    icon: 'Briefcase',
    defaultSections: buildSections([
      'hero', 'about', 'why-you', 'format', 'audience',
      'platform-metrics', 'collaboration', 'team-community',
      'roadmap', 'cta',
    ]),
  },

  RECORD_LABEL: {
    recipientType: 'RECORD_LABEL',
    name: { ca: 'Discogràfiques', es: 'Discográficas', en: 'Record Labels' },
    description: {
      ca: 'Per a segells discogràfics que vulguin presentar llançaments',
      es: 'Para sellos discográficos que quieran presentar lanzamientos',
      en: 'For record labels wanting to present releases',
    },
    icon: 'Music2',
    defaultSections: buildSections([
      'hero', 'about', 'audience', 'why-you', 'format',
      'team-community', 'platform-metrics', 'context',
      'collaboration', 'roadmap', 'cta',
    ]),
  },
}

export function getTemplate(type: CommercialRecipientType): TemplateDefinition {
  return TEMPLATES[type]
}

export const RECIPIENT_TYPES: CommercialRecipientType[] = [
  'VENUE', 'DISC_PROVIDER', 'FAN_CLUB', 'COMPANY', 'RECORD_LABEL',
]
