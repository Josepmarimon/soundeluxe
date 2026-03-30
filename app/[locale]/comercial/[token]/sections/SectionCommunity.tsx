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
  return Icon ? <Icon className="w-5 h-5" /> : null
}

interface Props {
  content: SectionContent
  image?: string
}

export default function SectionCommunity({ content, image }: Props) {
  const items = content.items || []

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#111]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-8">
            {content.title}
          </motion.h2>

          {/* Image + text side by side on desktop */}
          <div className={`${image ? 'md:flex md:gap-10 md:items-start' : ''} mb-12`}>
            {image && (
              <motion.div variants={fadeInUp} className="md:w-1/3 mb-8 md:mb-0 flex-shrink-0">
                <div className="overflow-hidden rounded-2xl relative group">
                  <img
                    src={image}
                    alt=""
                    className="w-full h-72 md:h-80 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
                </div>
              </motion.div>
            )}

            <motion.div
              variants={fadeInUp}
              className={`text-gray-400 text-lg leading-relaxed prose prose-invert prose-lg prose-p:text-gray-400 prose-strong:text-white ${image ? 'md:w-2/3' : 'text-center max-w-3xl mx-auto'}`}
              dangerouslySetInnerHTML={{ __html: content.body }}
            />
          </div>

          {items.length > 0 && (
            <motion.div variants={staggerContainer} className="grid md:grid-cols-2 gap-4">
              {items.map((item) => (
                <motion.div
                  key={item.title}
                  variants={fadeInUp}
                  className="flex gap-4 p-5 rounded-xl border border-gray-800 bg-gray-900/30 hover:border-[#D4AF37]/20 transition-colors"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center">
                    {getIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
