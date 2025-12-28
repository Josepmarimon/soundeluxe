'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import type { FAQItem } from '@/lib/sanity/types'
import type { Locale } from '@/lib/sanity/types'

interface FAQAccordionProps {
  faqs: FAQItem[]
  locale: Locale
}

const categoryLabels: Record<string, Record<Locale, string>> = {
  sessions: { ca: 'Sessions', es: 'Sesiones', en: 'Sessions' },
  booking: { ca: 'Reserves', es: 'Reservas', en: 'Booking' },
  payments: { ca: 'Pagaments', es: 'Pagos', en: 'Payments' },
  venue: { ca: 'Espai', es: 'Espacio', en: 'Venue' },
  other: { ca: 'Altres', es: 'Otros', en: 'Other' },
}

export default function FAQAccordion({ faqs, locale }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set())

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(key)) {
        newSet.delete(key)
      } else {
        newSet.add(key)
      }
      return newSet
    })
  }

  // Group FAQs by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const category = faq.category || 'other'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(faq)
    return acc
  }, {} as Record<string, FAQItem[]>)

  const categoryOrder = ['sessions', 'booking', 'payments', 'venue', 'other']
  const sortedCategories = Object.keys(groupedFaqs).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  )

  return (
    <div className="space-y-8">
      {sortedCategories.map((category) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">
            {categoryLabels[category]?.[locale] || category}
          </h3>
          <div className="space-y-3">
            {groupedFaqs[category].map((faq) => {
              const isOpen = openItems.has(faq._key)
              return (
                <div
                  key={faq._key}
                  className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/30"
                >
                  <button
                    onClick={() => toggleItem(faq._key)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-zinc-800/50 transition-colors"
                  >
                    <span className="font-medium text-white">
                      {faq.question?.[locale]}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isOpen ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="px-6 pb-4 text-zinc-300 leading-relaxed">
                      {faq.answer?.[locale]}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
