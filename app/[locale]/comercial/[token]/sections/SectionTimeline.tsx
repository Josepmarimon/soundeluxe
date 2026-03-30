'use client'

import { motion } from 'framer-motion'
import * as LucideIcons from 'lucide-react'
import type { SectionContent } from '@/lib/comercial/types'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
}

function getIcon(name?: string) {
  if (!name) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name]
  return Icon ? <Icon className="w-5 h-5" /> : null
}

interface Props {
  content: SectionContent
}

export default function SectionTimeline({ content }: Props) {
  const items = content.items || []

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          {content.title}
        </motion.h2>

        {content.body && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-gray-400 text-lg text-center max-w-2xl mx-auto mb-12 prose prose-invert"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative"
        >
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />

          {items.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="relative pl-16 pb-12 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 top-1 w-5 h-5 rounded-full border-2 border-[#D4AF37] bg-[#0a0a0a] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              </div>

              <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#D4AF37]">{getIcon(item.icon)}</span>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
