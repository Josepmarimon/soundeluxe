'use client'

import * as LucideIcons from 'lucide-react'
import type { CommercialRecipientType } from '@/lib/comercial/types'
import { TEMPLATES, RECIPIENT_TYPES } from '@/lib/comercial/templates'

function getIcon(name: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name]
  return Icon ? <Icon className="w-6 h-6" /> : null
}

interface Props {
  value: CommercialRecipientType
  onChange: (type: CommercialRecipientType) => void
  lang: 'ca' | 'es' | 'en'
}

export default function RecipientTypeSelector({ value, onChange, lang }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {RECIPIENT_TYPES.map((type) => {
        const template = TEMPLATES[type]
        const selected = value === type
        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              selected
                ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                : 'border-gray-700 hover:border-gray-600 text-gray-400 hover:text-gray-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              selected ? 'bg-[#D4AF37]/20' : 'bg-gray-800'
            }`}>
              {getIcon(template.icon)}
            </div>
            <span className="text-sm font-medium text-center">{template.name[lang]}</span>
            <span className="text-xs text-center opacity-60">{template.description[lang]}</span>
          </button>
        )
      })}
    </div>
  )
}
