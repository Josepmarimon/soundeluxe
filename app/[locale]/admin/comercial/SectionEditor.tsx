'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'
import type { LinkSection, CommercialRecipientType, Lang } from '@/lib/comercial/types'
import { SECTION_REGISTRY, getSectionContentForType } from '@/lib/comercial/sections'
import TiptapEditor from './TiptapEditor'

interface Props {
  sections: LinkSection[]
  onChange: (sections: LinkSection[]) => void
  recipientType: CommercialRecipientType
  lang: Lang
}

export default function SectionEditor({ sections, onChange, recipientType, lang }: Props) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  const toggleVisibility = (key: string) => {
    onChange(sections.map((s) => s.key === key ? { ...s, visible: !s.visible } : s))
  }

  const moveSection = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= sections.length) return
    const updated = [...sections]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    // Recalculate order
    onChange(updated.map((s, i) => ({ ...s, order: i })))
  }

  const updateSectionContent = (key: string, field: 'title' | 'body', value: string) => {
    onChange(sections.map((s) => {
      if (s.key !== key) return s
      return {
        ...s,
        customContent: {
          ...s.customContent,
          [lang]: {
            ...s.customContent?.[lang],
            [field]: value,
          },
        },
      }
    }))
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-300">Seccions de la proposta</h3>
        <span className="text-xs text-gray-500">{sections.filter((s) => s.visible).length} actives</span>
      </div>

      {sections.map((section, index) => {
        const def = SECTION_REGISTRY[section.key]
        if (!def) return null

        const isExpanded = expandedKey === section.key
        const defaultContent = getSectionContentForType(section.key, recipientType, lang)
        const currentTitle = section.customContent?.[lang]?.title ?? defaultContent.title
        const currentBody = section.customContent?.[lang]?.body ?? defaultContent.body

        return (
          <div
            key={section.key}
            className={`border rounded-lg overflow-hidden transition-colors ${
              section.visible ? 'border-gray-700 bg-gray-900/50' : 'border-gray-800 bg-gray-900/20 opacity-60'
            }`}
          >
            {/* Section header */}
            <div className="flex items-center gap-2 px-3 py-2">
              {/* Reorder buttons */}
              <div className="flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={() => moveSection(index, -1)}
                  disabled={index === 0}
                  className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20"
                >
                  <ArrowUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => moveSection(index, 1)}
                  disabled={index === sections.length - 1}
                  className="p-0.5 text-gray-500 hover:text-white disabled:opacity-20"
                >
                  <ArrowDown className="w-3 h-3" />
                </button>
              </div>

              {/* Visibility toggle */}
              <button
                type="button"
                onClick={() => toggleVisibility(section.key)}
                className={`p-1 rounded ${section.visible ? 'text-[#D4AF37]' : 'text-gray-600'}`}
              >
                {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              {/* Section name */}
              <button
                type="button"
                onClick={() => setExpandedKey(isExpanded ? null : section.key)}
                className="flex-1 flex items-center justify-between text-left"
              >
                <div>
                  <span className="text-sm font-medium">{def.name[lang]}</span>
                  <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                    def.category === 'common' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'
                  }`}>
                    {def.category === 'common' ? 'comú' : 'específic'}
                  </span>
                  {section.customContent?.[lang] && (
                    <span className="ml-1 text-xs px-1.5 py-0.5 rounded bg-amber-900/30 text-amber-400">
                      personalitzat
                    </span>
                  )}
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
            </div>

            {/* Expanded editor */}
            {isExpanded && section.visible && (
              <div className="px-3 pb-3 border-t border-gray-800 pt-3 space-y-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Títol</label>
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => updateSectionContent(section.key, 'title', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Contingut</label>
                  <TiptapEditor
                    content={currentBody}
                    onChange={(html) => updateSectionContent(section.key, 'body', html)}
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
