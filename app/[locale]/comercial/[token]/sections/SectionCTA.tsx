'use client'

import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
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
  lang: string
}

export default function SectionCTA({ content, lang }: Props) {
  const buttonLabel = lang === 'ca' ? 'Contactar' : lang === 'es' ? 'Contactar' : 'Contact Us'
  const emailLabel = lang === 'ca' ? 'O escriu-nos a' : lang === 'es' ? 'O escríbenos a' : 'Or write to us at'

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold mb-6">
            {content.title}
          </motion.h2>
          <motion.div
            variants={fadeInUp}
            className="text-gray-400 text-lg mb-10 prose prose-invert prose-lg prose-p:text-gray-400 prose-strong:text-white mx-auto"
            dangerouslySetInnerHTML={{ __html: content.body }}
          />
          <motion.div variants={fadeInUp}>
            <a
              href="mailto:info@soundeluxe.es"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-black font-bold rounded-full text-lg hover:bg-[#c4a030] transition-colors"
            >
              <Mail className="w-5 h-5" />
              {buttonLabel}
            </a>
            <p className="text-gray-500 text-sm mt-4">
              {emailLabel}{' '}
              <a href="mailto:info@soundeluxe.es" className="text-[#D4AF37]">info@soundeluxe.es</a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
