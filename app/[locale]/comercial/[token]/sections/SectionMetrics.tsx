'use client'

import { motion } from 'framer-motion'
import { Users, Calendar, Layers, Disc3, Star, Sparkles } from 'lucide-react'
import type { SectionContent } from '@/lib/comercial/types'
import type { CommercialMetrics } from '@/lib/types/commercial'

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

function formatNumber(num: number): string {
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
  return num.toString()
}

interface Props {
  content: SectionContent
  metrics: CommercialMetrics | null
  lang: string
}

export default function SectionMetrics({ content, metrics, lang }: Props) {
  const m = metrics?.platform

  const labels = {
    ca: { users: 'Usuaris registrats', sessions: 'Sessions realitzades', reservas: 'Reserves confirmades', albums: 'Àlbums al catàleg', ressenyes: 'Ressenyes', rating: 'Valoració mitjana' },
    es: { users: 'Usuarios registrados', sessions: 'Sesiones realizadas', reservas: 'Reservas confirmadas', albums: 'Álbumes en catálogo', ressenyes: 'Reseñas', rating: 'Valoración media' },
    en: { users: 'Registered users', sessions: 'Sessions held', reservas: 'Confirmed bookings', albums: 'Albums in catalog', ressenyes: 'Reviews', rating: 'Average rating' },
  }

  const l = labels[lang as keyof typeof labels] || labels.ca

  const stats = [
    { value: m ? formatNumber(m.totalUsers) : '—', label: l.users, icon: <Users className="w-5 h-5" /> },
    { value: m ? formatNumber(m.totalSessions) : '—', label: l.sessions, icon: <Calendar className="w-5 h-5" /> },
    { value: m ? formatNumber(m.totalReservas) : '—', label: l.reservas, icon: <Layers className="w-5 h-5" /> },
    { value: m ? formatNumber(m.totalAlbums) : '—', label: l.albums, icon: <Disc3 className="w-5 h-5" /> },
    { value: m ? formatNumber(m.totalRessenyes) : '—', label: l.ressenyes, icon: <Star className="w-5 h-5" /> },
    { value: m ? `${m.avgRating.toFixed(1)}/5` : '—', label: l.rating, icon: <Sparkles className="w-5 h-5" /> },
  ]

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-3xl md:text-4xl font-bold text-center mb-16"
        >
          {content.title}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 md:grid-cols-3 gap-6"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="text-center p-6 rounded-2xl border border-gray-800 bg-gray-900/30"
            >
              <div className="text-[#D4AF37] mb-3 flex justify-center">{stat.icon}</div>
              <div className="text-3xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
