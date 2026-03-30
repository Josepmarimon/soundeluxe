'use client'

import { useState } from 'react'
import { Download } from 'lucide-react'

interface Props {
  recipientName: string
  recipientCompany?: string | null
  lang: string
}

const labels = {
  ca: { download: 'Descarregar PDF', generating: 'Generant PDF...' },
  es: { download: 'Descargar PDF', generating: 'Generando PDF...' },
  en: { download: 'Download PDF', generating: 'Generating PDF...' },
}

export default function DownloadPdfButton({ recipientName, recipientCompany, lang }: Props) {
  const [generating, setGenerating] = useState(false)
  const l = labels[lang as keyof typeof labels] || labels.ca

  const handleDownload = async () => {
    setGenerating(true)

    try {
      // Dynamic import to avoid SSR issues
      const html2pdf = (await import('html2pdf.js')).default

      // Get the content container (skip the fixed controls)
      const contentEl = document.getElementById('proposal-content')
      if (!contentEl) return

      // Clone the content to apply print styles without affecting the page
      const clone = contentEl.cloneNode(true) as HTMLElement

      // Create a wrapper with white background and print-friendly styles
      const wrapper = document.createElement('div')
      wrapper.style.cssText = `
        background: white;
        color: #1a1a1a;
        font-family: system-ui, -apple-system, sans-serif;
        padding: 0;
        width: 210mm;
      `

      // Apply print styles to the clone
      applyPrintStyles(clone)
      wrapper.appendChild(clone)

      // Temporarily add to DOM (hidden) for html2pdf to process
      wrapper.style.position = 'fixed'
      wrapper.style.left = '-9999px'
      wrapper.style.top = '0'
      document.body.appendChild(wrapper)

      const filename = `SoundDeluxe_${recipientCompany || recipientName}_${new Date().toISOString().split('T')[0]}.pdf`

      await html2pdf()
        .set({
          margin: [10, 12, 10, 12], // mm: top, right, bottom, left
          filename,
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            backgroundColor: '#ffffff',
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        })
        .from(wrapper)
        .save()

      // Clean up
      document.body.removeChild(wrapper)
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-medium text-white hover:bg-white/20 transition disabled:opacity-50"
    >
      <Download className="w-3.5 h-3.5" />
      {generating ? l.generating : l.download}
    </button>
  )
}

/**
 * Recursively apply print-friendly styles to all elements
 * Converting dark theme to white background for A4 printing
 */
function applyPrintStyles(el: HTMLElement) {
  // Remove animations
  el.style.opacity = '1'
  el.style.transform = 'none'
  el.style.transition = 'none'
  el.style.animation = 'none'

  // Convert dark backgrounds to white
  const bg = getComputedStyle(el).backgroundColor
  if (bg && (bg.includes('0, 0, 0') || bg.includes('10, 10, 10') || bg.includes('17, 17, 17') || bg.includes('0a0a0a') || bg.includes('rgb(0,'))) {
    el.style.backgroundColor = 'white'
  }

  // Handle gradient backgrounds
  const bgImage = el.style.backgroundImage || ''
  if (bgImage.includes('gradient') && !bgImage.includes('url(')) {
    el.style.backgroundImage = 'none'
    el.style.backgroundColor = 'white'
  }

  // Convert text colors for readability on white
  const color = getComputedStyle(el).color
  if (color === 'rgb(255, 255, 255)' || color === 'rgba(255, 255, 255, 1)') {
    el.style.color = '#1a1a1a'
  }
  // Gray text stays gray but darker for print
  if (color.includes('156, 163, 175') || color.includes('107, 114, 128') || color.includes('75, 85, 99') || color.includes('209, 213, 219')) {
    el.style.color = '#4a4a4a'
  }

  // Keep gold accent
  if (color.includes('212, 175, 55')) {
    el.style.color = '#b8960a'
  }

  // Fix border colors
  const borderColor = getComputedStyle(el).borderColor
  if (borderColor.includes('55, 65, 81') || borderColor.includes('31, 41, 55') || borderColor.includes('gray')) {
    el.style.borderColor = '#e0e0e0'
  }

  // Fix card backgrounds
  const classes = el.className || ''
  if (typeof classes === 'string') {
    if (classes.includes('bg-gray-900') || classes.includes('bg-gray-800')) {
      el.style.backgroundColor = '#f7f7f7'
    }
    if (classes.includes('bg-[#D4AF37]/10') || classes.includes('bg-[#D4AF37]/20')) {
      el.style.backgroundColor = '#fef9e7'
    }
    // Hero section: keep image but lighten overlay
    if (classes.includes('min-h-screen')) {
      el.style.minHeight = 'auto'
      el.style.paddingTop = '60px'
      el.style.paddingBottom = '60px'
    }
  }

  // Add page break hints for sections
  if (el.getAttribute('data-section')) {
    el.style.pageBreakInside = 'avoid'
    el.style.breakInside = 'avoid'
  }

  // Process children
  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      applyPrintStyles(child)
    }
  })
}
