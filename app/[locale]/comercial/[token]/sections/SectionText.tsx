'use client'

import { motion } from 'framer-motion'
import type { SectionContent } from '@/lib/comercial/types'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

interface Props {
  content: SectionContent
  image?: string
}

export default function SectionText({ content, image }: Props) {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-bold text-center mb-8">
            {content.title}
          </motion.h2>

          {image && (
            <motion.div variants={fadeInUp} className="mb-10 relative group">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src={image}
                  alt=""
                  className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#0a0a0a]/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/5 pointer-events-none" />
            </motion.div>
          )}

          <motion.div
            variants={fadeInUp}
            className="text-gray-400 text-lg text-center max-w-2xl mx-auto leading-relaxed prose prose-invert prose-lg prose-p:text-gray-400 prose-strong:text-white prose-em:text-gray-300"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
        </motion.div>
      </div>
    </section>
  )
}
