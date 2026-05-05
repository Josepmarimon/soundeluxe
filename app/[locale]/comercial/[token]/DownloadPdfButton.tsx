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

    let wrapper: HTMLDivElement | null = null
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas-pro'),
        import('jspdf'),
      ])

      const contentEl = document.getElementById('proposal-content')
      if (!contentEl) return

      const clone = contentEl.cloneNode(true) as HTMLElement

      wrapper = document.createElement('div')
      wrapper.style.cssText = `
        background: white;
        color: #1a1a1a;
        font-family: system-ui, -apple-system, sans-serif;
        padding: 0;
        width: 794px;
        position: fixed;
        left: -10000px;
        top: 0;
      `

      wrapper.appendChild(clone)
      document.body.appendChild(wrapper)
      // applyPrintStyles needs the clone in the DOM so getComputedStyle works
      applyPrintStyles(clone)

      // Wait for images inside the clone to be ready, so html2canvas captures them
      await waitForImages(clone)

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 10
      const availableWidth = pageWidth - margin * 2
      const availableHeight = pageHeight - margin * 2
      const blockGap = 4 // mm of vertical breathing room between blocks

      // Render each top-level block separately so page breaks land between them
      const blocks = Array.from(clone.children).filter(
        (c): c is HTMLElement => c instanceof HTMLElement && c.offsetHeight > 0,
      )

      let cursorY = margin
      let isFirstOnPage = true

      for (const block of blocks) {
        const canvas = await html2canvas(block, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        })

        const blockHeightMm = (canvas.height * availableWidth) / canvas.width

        if (blockHeightMm <= availableHeight) {
          // Block fits on a single page — start a new page if it doesn't fit in remaining space
          const gap = isFirstOnPage ? 0 : blockGap
          if (cursorY + gap + blockHeightMm > pageHeight - margin) {
            pdf.addPage()
            cursorY = margin
            isFirstOnPage = true
          }
          if (!isFirstOnPage) cursorY += blockGap
          pdf.addImage(
            canvas.toDataURL('image/jpeg', 0.95),
            'JPEG',
            margin,
            cursorY,
            availableWidth,
            blockHeightMm,
          )
          cursorY += blockHeightMm
          isFirstOnPage = false
        } else {
          // Block taller than a page — slice across pages
          if (!isFirstOnPage) {
            pdf.addPage()
            cursorY = margin
          }
          const pxPerMm = canvas.width / availableWidth
          const sliceHeightPx = Math.floor(availableHeight * pxPerMm)
          let offsetPx = 0
          while (offsetPx < canvas.height) {
            const remainingPx = canvas.height - offsetPx
            const thisSlicePx = Math.min(sliceHeightPx, remainingPx)
            const thisSliceMm = thisSlicePx / pxPerMm

            const sliceCanvas = document.createElement('canvas')
            sliceCanvas.width = canvas.width
            sliceCanvas.height = thisSlicePx
            const sliceCtx = sliceCanvas.getContext('2d')
            if (!sliceCtx) break
            sliceCtx.fillStyle = '#ffffff'
            sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
            sliceCtx.drawImage(
              canvas,
              0,
              offsetPx,
              canvas.width,
              thisSlicePx,
              0,
              0,
              canvas.width,
              thisSlicePx,
            )
            pdf.addImage(
              sliceCanvas.toDataURL('image/jpeg', 0.95),
              'JPEG',
              margin,
              margin,
              availableWidth,
              thisSliceMm,
            )
            offsetPx += thisSlicePx
            if (offsetPx < canvas.height) {
              pdf.addPage()
            } else {
              cursorY = margin + thisSliceMm
              isFirstOnPage = false
            }
          }
        }
      }

      const filename = `SoundDeluxe_${recipientCompany || recipientName}_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(filename)
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      if (wrapper && wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper)
      }
      setGenerating(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-medium text-fg hover:bg-white/20 transition disabled:opacity-50"
    >
      <Download className="w-3.5 h-3.5" />
      {generating ? l.generating : l.download}
    </button>
  )
}

// Shared canvas used to resolve modern color formats (oklch, oklab, color()...) to rgb.
const colorResolverCanvas =
  typeof document !== 'undefined' ? document.createElement('canvas') : null
const colorResolverCtx = colorResolverCanvas?.getContext('2d') ?? null

type Rgba = { r: number; g: number; b: number; a: number }

function parseColor(value: string): Rgba | null {
  if (!value || value === 'transparent' || value === 'none') return null
  if (!colorResolverCtx) return null
  let resolved: string
  try {
    colorResolverCtx.fillStyle = '#000000'
    colorResolverCtx.fillStyle = value
    resolved = colorResolverCtx.fillStyle as string
  } catch {
    return null
  }
  if (resolved.startsWith('#')) {
    const hex = resolved.slice(1)
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1,
      }
    }
  }
  const m = resolved.match(
    /rgba?\(\s*(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)(?:[\s,/]+(\d+(?:\.\d+)?%?))?\s*\)/i,
  )
  if (m) {
    let a = 1
    if (m[4]) {
      a = m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4])
    }
    return { r: parseFloat(m[1]), g: parseFloat(m[2]), b: parseFloat(m[3]), a }
  }
  return null
}

function relativeLuminance({ r, g, b }: Rgba): number {
  const norm = (c: number) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * norm(r) + 0.7152 * norm(g) + 0.0722 * norm(b)
}

function isGoldish({ r, g, b }: Rgba): boolean {
  // primary gold ~rgb(212, 175, 55) and similar warm yellows
  return r > 150 && g > 120 && b < 110 && r >= g && g > b
}

function applyPrintStyles(el: HTMLElement) {
  el.style.opacity = '1'
  el.style.transform = 'none'
  el.style.transition = 'none'
  el.style.animation = 'none'

  const computed = getComputedStyle(el)

  // Background: dark / nearly-black → white. Translucent dark overlays → white.
  const bg = parseColor(computed.backgroundColor)
  if (bg && bg.a > 0.05) {
    const lum = relativeLuminance(bg)
    if (lum < 0.45) {
      el.style.backgroundColor = '#ffffff'
    }
  }

  // Strip dark gradients but keep image backgrounds (hero photos)
  const bgImage = computed.backgroundImage || ''
  if (bgImage.includes('gradient') && !bgImage.includes('url(')) {
    el.style.backgroundImage = 'none'
    if (!el.style.backgroundColor) el.style.backgroundColor = '#ffffff'
  }

  // Text color: light text on (now) white → dark; preserve gold accent
  const color = parseColor(computed.color)
  if (color && color.a > 0.05) {
    if (isGoldish(color)) {
      el.style.color = '#b8960a'
    } else {
      const lum = relativeLuminance(color)
      if (lum > 0.75) {
        el.style.color = '#1a1a1a'
      } else if (lum > 0.45) {
        el.style.color = '#4a4a4a'
      }
    }
  }

  // Border: very dark borders on white look ugly — soften them
  for (const side of ['borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor'] as const) {
    const bc = parseColor(computed[side])
    if (bc && bc.a > 0.05) {
      const lum = relativeLuminance(bc)
      if (lum < 0.3) {
        ;(el.style as unknown as Record<string, string>)[side] = '#e0e0e0'
      }
    }
  }

  // Text shadows often baked for dark theme — strip them
  if (computed.textShadow && computed.textShadow !== 'none') {
    el.style.textShadow = 'none'
  }

  // Hero "min-h-screen" sections: shrink to printable height
  const classes = el.className || ''
  if (typeof classes === 'string' && classes.includes('min-h-screen')) {
    el.style.minHeight = 'auto'
    el.style.paddingTop = '60px'
    el.style.paddingBottom = '60px'
  }

  if (el.getAttribute('data-section')) {
    el.style.pageBreakInside = 'avoid'
    el.style.breakInside = 'avoid'
  }

  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      applyPrintStyles(child)
    }
  })
}

function waitForImages(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'))
  const pending = imgs
    .filter((img) => !img.complete || img.naturalHeight === 0)
    .map(
      (img) =>
        new Promise<void>((resolve) => {
          const done = () => resolve()
          img.addEventListener('load', done, { once: true })
          img.addEventListener('error', done, { once: true })
        }),
    )
  return Promise.all(pending).then(() => undefined)
}
