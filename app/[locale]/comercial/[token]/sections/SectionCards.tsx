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
  visible: { transition: { staggerChildren: 0.15 } },
}

function getIcon(name?: string) {
  if (!name) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name]
  return Icon ? <Icon className="w-6 h-6" /> : null
}

interface Props {
  content: SectionContent
  image?: string
}

export default function SectionCards({ content, image }: Props) {
  const items = content.items || []
  const cols = items.length <= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          {content.title}
        </motion.h2>

        {content.body && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-gray-400 text-lg text-center max-w-2xl mx-auto mb-10 prose prose-invert"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        )}

        {image && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="mb-12 relative group"
          >
            <div className="overflow-hidden rounded-2xl">
              <img
                src={image}
                alt=""
                className="w-full h-56 md:h-72 object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#111]/70 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
          </motion.div>
        )}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className={`grid ${cols} gap-6`}
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className={`${items.length <= 3 ? 'text-center p-8' : 'flex gap-5 p-6'} rounded-2xl border border-gray-800 bg-gray-900/30 hover:border-[#D4AF37]/30 transition-colors`}
            >
              {items.length <= 3 ? (
                <>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] mb-6">
                    {getIcon(item.icon)}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
