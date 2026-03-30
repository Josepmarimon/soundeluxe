'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
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
  recipientName: string
  recipientCompany?: string | null
  lang: string
  image?: string
}

export default function SectionHero({ content, recipientName, recipientCompany, lang, image }: Props) {
  const greeting = lang === 'ca' ? 'Benvolgut/da,' : lang === 'es' ? 'Estimado/a,' : 'Dear,'
  const from = lang === 'ca' ? 'de' : lang === 'es' ? 'de' : 'from'
  const proposalLabel = lang === 'ca' ? 'Proposta Comercial' : lang === 'es' ? 'Propuesta Comercial' : 'Commercial Proposal'

  return (
    <section data-section="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlays */}
      {image && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="absolute inset-0 bg-black/70" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(212,175,55,0.1),transparent_60%)]" />

      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp} className="mb-6">
          <span className="inline-block px-4 py-1.5 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] text-sm tracking-widest uppercase backdrop-blur-sm">
            {proposalLabel}
          </span>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold mb-4 tracking-tight drop-shadow-lg">
          {content.title}
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-gray-200 mb-2 drop-shadow">
          {greeting}{' '}
          <span className="text-[#D4AF37] font-semibold">{recipientName}</span>
          {recipientCompany && (
            <span className="text-gray-300"> {from} {recipientCompany}</span>
          )}
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="text-gray-300 text-lg max-w-xl mx-auto mt-4 drop-shadow"
          dangerouslySetInnerHTML={{ __html: content.body }}
        />

        <motion.div variants={fadeInUp} className="mt-12">
          <ChevronDown className="w-6 h-6 text-[#D4AF37] mx-auto animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  )
}
