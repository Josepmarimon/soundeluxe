// Helper functions for resolving sections with defaults + overrides

import type {
  CommercialRecipientType,
  Lang,
  LinkSection,
  ResolvedSection,
  SectionContent,
} from './types'
import { SECTION_REGISTRY, getSectionContentForType } from './sections'
import { getTemplate } from './templates'

/**
 * Resolve the final list of sections for a commercial link.
 * Merges template defaults with per-link overrides.
 */
export function resolveSectionsForLink(
  recipientType: CommercialRecipientType,
  lang: Lang,
  linkSections: LinkSection[] | null,
  recipientName: string,
  recipientCompany?: string | null
): ResolvedSection[] {
  const template = getTemplate(recipientType)

  // Use link sections if available, otherwise template defaults
  const sectionConfigs = linkSections ?? template.defaultSections.map((s) => ({
    key: s.key,
    visible: s.visible,
    order: s.order,
  }))

  return sectionConfigs
    .filter((s) => s.visible)
    .sort((a, b) => a.order - b.order)
    .map((config) => {
      const definition = SECTION_REGISTRY[config.key]
      if (!definition) return null

      // Get base content for this type + lang
      const baseContent = getSectionContentForType(config.key, recipientType, lang)

      // Merge with custom overrides
      const linkSection = config as LinkSection
      const customLang = linkSection.customContent?.[lang]
      const content: SectionContent = {
        title: customLang?.title ?? baseContent.title,
        body: customLang?.body ?? baseContent.body,
        items: customLang?.items ?? baseContent.items,
      }

      // Interpolate recipient variables
      if (definition.supportsRecipientInterpolation) {
        content.title = interpolateContent(content.title, recipientName, recipientCompany)
        content.body = interpolateContent(content.body, recipientName, recipientCompany)
      }

      return {
        key: config.key,
        component: definition.component,
        content,
        image: linkSection.customImage ?? definition.defaultImage,
        supportsMetrics: definition.supportsMetrics,
      } satisfies ResolvedSection
    })
    .filter((s): s is NonNullable<typeof s> => s !== null) as ResolvedSection[]
}

/**
 * Replace {{recipientName}} and {{recipientCompany}} placeholders
 */
function interpolateContent(
  text: string,
  recipientName: string,
  recipientCompany?: string | null
): string {
  let result = text.replace(/\{\{recipientName\}\}/g, recipientName)
  result = result.replace(/\{\{recipientCompany\}\}/g, recipientCompany || '')
  return result
}

/**
 * Get the default LinkSection[] array for a recipient type
 * (used when creating a new link in the admin)
 */
export function getDefaultSectionsForType(type: CommercialRecipientType): LinkSection[] {
  const template = getTemplate(type)
  return template.defaultSections.map((s) => ({
    key: s.key,
    visible: s.visible,
    order: s.order,
  }))
}

/**
 * Get all available section keys
 */
export function getAllSectionKeys(): string[] {
  return Object.keys(SECTION_REGISTRY)
}
