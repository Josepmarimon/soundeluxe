'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { ResolvedSection } from '@/lib/comercial/types'
import type { CommercialMetrics } from '@/lib/types/commercial'
import SectionRenderer from './sections/SectionRenderer'
import DownloadPdfButton from './DownloadPdfButton'

type Lang = 'ca' | 'es' | 'en'

interface Props {
  token: string
  recipientName: string
  recipientCompany?: string | null
  lang: Lang
  resolvedSections: ResolvedSection[]
}

export default function ComercialPageClient({ token, recipientName, recipientCompany, lang, resolvedSections }: Props) {
  const [visitId, setVisitId] = useState<string | null>(null)
  const [maxScrollDepth, setMaxScrollDepth] = useState(0)
  const [sectionsViewed, setSectionsViewed] = useState<Set<string>>(new Set())
  const [metrics, setMetrics] = useState<CommercialMetrics | null>(null)
  const startTimeRef = useRef<number>(Date.now())
  const hasTrackedRef = useRef(false)

  // Section keys for tracking
  const sectionKeys = resolvedSections.map((s) => s.key)

  // Fetch metrics if any section needs them
  const needsMetrics = resolvedSections.some((s) => s.supportsMetrics)
  useEffect(() => {
    if (!needsMetrics) return
    fetch('/api/comercial/metrics')
      .then((r) => r.ok ? r.json() : null)
      .then(setMetrics)
      .catch(() => {})
  }, [needsMetrics])

  // Track visit
  useEffect(() => {
    if (hasTrackedRef.current) return
    hasTrackedRef.current = true

    fetch('/api/comercial/track-visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data && setVisitId(data.visitId))
      .catch(() => {})
  }, [token])

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) return
      const pct = Math.min(100, Math.round((window.scrollY / docHeight) * 100))
      if (pct > maxScrollDepth) setMaxScrollDepth(pct)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [maxScrollDepth])

  // Track sections with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section')
            if (id) setSectionsViewed((prev) => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.3 }
    )

    sectionKeys.forEach((key) => {
      const el = document.querySelector(`[data-section="${key}"]`)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Send engagement on unload
  const sendEngagement = useCallback(() => {
    if (!visitId) return
    navigator.sendBeacon(
      '/api/comercial/update-engagement',
      JSON.stringify({
        visitId,
        timeOnPageSeconds: Math.round((Date.now() - startTimeRef.current) / 1000),
        scrollDepthPercent: maxScrollDepth,
        sectionsViewed: Array.from(sectionsViewed),
      })
    )
  }, [visitId, maxScrollDepth, sectionsViewed])

  useEffect(() => {
    window.addEventListener('beforeunload', sendEngagement)
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') sendEngagement()
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('beforeunload', sendEngagement)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [sendEngagement])

  // Language switch
  const switchLang = (newLang: Lang) => {
    const url = new URL(window.location.href)
    if (newLang === 'ca') url.searchParams.delete('lang')
    else url.searchParams.set('lang', newLang)
    window.location.href = url.toString()
  }

  // Confidential footer text
  const footerText = lang === 'ca'
    ? 'Aquesta proposta és confidencial i personalitzada.'
    : lang === 'es'
      ? 'Esta propuesta es confidencial y personalizada.'
      : 'This proposal is confidential and personalized.'

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Top controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <DownloadPdfButton
          recipientName={recipientName}
          recipientCompany={recipientCompany}
          lang={lang}
        />
        <div className="flex gap-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
          {(['ca', 'es', 'en'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition ${
                lang === l ? 'bg-[#D4AF37] text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Proposal content (used for PDF generation) */}
      <div id="proposal-content">
        {/* Dynamic sections */}
        {resolvedSections.map((section) => (
          <div key={section.key} data-section={section.key}>
            <SectionRenderer
              section={section}
              recipientName={recipientName}
              recipientCompany={recipientCompany}
              lang={lang}
              metrics={metrics}
            />
          </div>
        ))}

        {/* Footer */}
        <footer className="py-8 px-6 border-t border-gray-800/50 text-center">
          <p className="text-gray-600 text-sm">{footerText}</p>
          <p className="text-gray-700 text-xs mt-2">Sound Deluxe &copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  )
}
