'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface QrPlace {
  placeId: string
  placeNumber: number
  qrDataUrl?: string
}

interface TicketData {
  invoiceNumber: string
  issueDate: string
  bookingId: string
  userName: string
  userEmail: string
  albumTitle: string
  albumArtist: string
  sessionDate: string
  venueName: string
  venueAddress: string
  numPlaces: number
  totalAmount: string
  baseAmount: string
  vatRate: number
  vatAmount: string
  qrPlaces: QrPlace[]
  company: {
    name: string
    nif: string
    address: {
      street: string
      postalCode: string
      city: string
      province: string
      country: string
    }
    email: string
    web: string
  }
}

interface TicketViewProps {
  locale: string
  ticket: TicketData
}

export default function TicketView({ locale, ticket }: TicketViewProps) {
  const t = useTranslations('ticket')
  const [generating, setGenerating] = useState(false)

  const handleDownload = async () => {
    setGenerating(true)
    try {
      const html2canvas = (await import('html2canvas-pro')).default
      const { default: JsPdf } = await import('jspdf')

      const contentEl = document.getElementById('ticket-content')
      if (!contentEl) return

      const clone = contentEl.cloneNode(true) as HTMLElement
      const wrapper = document.createElement('div')
      wrapper.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        background: white;
        font-family: system-ui, -apple-system, sans-serif;
        padding: 0;
        width: 794px;
      `
      applyPrintStyles(clone)
      wrapper.appendChild(clone)
      document.body.appendChild(wrapper)

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      document.body.removeChild(wrapper)

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new JsPdf({ unit: 'mm', format: 'a4', orientation: 'portrait' })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 15
      const contentWidth = pageWidth - margin * 2
      const contentHeight = (canvas.height * contentWidth) / canvas.width

      if (contentHeight <= pageHeight - margin * 2) {
        pdf.addImage(imgData, 'JPEG', margin, margin, contentWidth, contentHeight)
      } else {
        // Múltiples pàgines: dividir la imatge en seccions
        const pageContentHeight = pageHeight - margin * 2
        const pixelsPerMm = canvas.width / contentWidth
        const sliceHeightPx = pageContentHeight * pixelsPerMm
        let yOffset = 0
        let firstPage = true
        while (yOffset < canvas.height) {
          const sliceCanvas = document.createElement('canvas')
          sliceCanvas.width = canvas.width
          sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - yOffset)
          const ctx = sliceCanvas.getContext('2d')!
          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height)
          ctx.drawImage(canvas, 0, -yOffset)
          const sliceData = sliceCanvas.toDataURL('image/jpeg', 0.95)
          const sliceHeightMm = (sliceCanvas.height * contentWidth) / canvas.width

          if (!firstPage) pdf.addPage()
          pdf.addImage(sliceData, 'JPEG', margin, margin, contentWidth, sliceHeightMm)
          firstPage = false
          yOffset += sliceHeightPx
        }
      }

      const filename = `SoundDeluxe_${ticket.invoiceNumber.replace(/\//g, '-')}.pdf`
      pdf.save(filename)
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg pt-20 pb-16">
      {/* Action bar */}
      <div className="max-w-2xl mx-auto px-4 mb-6 flex items-center justify-between">
        <Link
          href={`/${locale}/profile`}
          className="text-fg-muted hover:text-fg transition-colors flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToProfile')}
        </Link>
        <button
          onClick={handleDownload}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-full font-semibold text-sm hover:shadow-lg transition-shadow disabled:opacity-50"
        >
          {generating ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t('generating')}
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('downloadPdf')}
            </>
          )}
        </button>
      </div>

      {/* Ticket content - this is what gets converted to PDF */}
      <div id="ticket-content" className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">

          {/* Header - branded dark stripe */}
          <div className="px-5 sm:px-8 py-5 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-primary text-xl sm:text-2xl font-bold tracking-wider">SOUND DELUXE</h1>
                <p className="text-fg-muted text-xs mt-0.5 tracking-wide">{t('subtitle')}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-primary font-bold text-sm">{t('simplifiedInvoice')}</p>
                <p className="text-fg font-mono text-sm mt-0.5">{ticket.invoiceNumber}</p>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-8 py-6">
            {/* Company & Invoice details */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-3 sm:gap-0 mb-6 pb-6 border-b border-zinc-200">
              <div className="text-xs text-fg-subtle space-y-0.5">
                <p className="font-semibold text-zinc-700">{ticket.company.name}</p>
                <p>NIF: {ticket.company.nif}</p>
                <p>{ticket.company.address.street}</p>
                <p>{ticket.company.address.postalCode} {ticket.company.address.city}</p>
              </div>
              <div className="text-right text-xs text-fg-subtle space-y-0.5">
                <p><span className="text-fg-muted">{t('issueDate')}:</span> <span className="text-zinc-700">{ticket.issueDate}</span></p>
                <p><span className="text-fg-muted">{t('reference')}:</span> <span className="font-mono text-zinc-700">{ticket.bookingId.slice(0, 12)}</span></p>
              </div>
            </div>

            {/* Event details - the star of the show */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 mb-1">{ticket.albumTitle}</h2>
              <p className="text-fg-subtle text-lg">{ticket.albumArtist}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6" data-section="details">
              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-fg-muted text-xs uppercase tracking-wide mb-1">{t('dateTime')}</p>
                <p className="text-zinc-800 font-medium text-sm">{ticket.sessionDate}</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-fg-muted text-xs uppercase tracking-wide mb-1">{t('venue')}</p>
                <p className="text-zinc-800 font-medium text-sm">{ticket.venueName}</p>
                <p className="text-fg-subtle text-xs mt-0.5">{ticket.venueAddress}</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-fg-muted text-xs uppercase tracking-wide mb-1">{t('attendee')}</p>
                <p className="text-zinc-800 font-medium text-sm">{ticket.userName}</p>
                <p className="text-fg-subtle text-xs mt-0.5">{ticket.userEmail}</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-fg-muted text-xs uppercase tracking-wide mb-1">{t('places')}</p>
                <p className="text-zinc-800 font-bold text-2xl">{ticket.numPlaces}</p>
              </div>
            </div>

            {/* Tax breakdown - factura simplificada requirements */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden mb-6" data-section="tax">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50">
                    <th className="text-left px-4 py-3 text-fg-subtle font-medium text-xs uppercase tracking-wide">{t('concept')}</th>
                    <th className="text-right px-4 py-3 text-fg-subtle font-medium text-xs uppercase tracking-wide">{t('amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-100">
                    <td className="px-4 py-3 text-zinc-700">
                      {t('sessionEntry', { places: ticket.numPlaces })}
                      <br />
                      <span className="text-fg-muted text-xs">{ticket.albumTitle} — {ticket.albumArtist}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-700">{ticket.baseAmount}€</td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="px-4 py-3 text-fg-subtle">{t('vatLine', { rate: ticket.vatRate })}</td>
                    <td className="px-4 py-3 text-right text-fg-subtle">{ticket.vatAmount}€</td>
                  </tr>
                  <tr className="border-t-2 border-zinc-200 bg-zinc-50">
                    <td className="px-4 py-3 font-bold text-zinc-900">{t('total')}</td>
                    <td className="px-4 py-3 text-right font-bold text-zinc-900 text-lg">{ticket.totalAmount}€</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Entry stubs: un QR per cada plaça */}
            <div className="space-y-4" data-section="qr">
              <p className="text-[10px] uppercase tracking-widest text-fg-muted font-bold">
                {t('entryQr')}
              </p>
              {ticket.qrPlaces.map((place) => (
                <div
                  key={place.placeId}
                  className="border-2 border-dashed border-zinc-300 rounded-xl p-5 bg-zinc-50"
                  data-section="qr-place"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {place.qrDataUrl && (
                      <div className="flex-shrink-0 flex flex-col items-center gap-2">
                        <img
                          src={place.qrDataUrl}
                          alt={`QR ${place.placeNumber}/${ticket.qrPlaces.length}`}
                          className="w-32 h-32 rounded-lg bg-white p-1"
                        />
                        <p className="font-mono text-[10px] text-zinc-500">
                          {t('placeOf', { current: place.placeNumber, total: ticket.qrPlaces.length })}
                        </p>
                      </div>
                    )}
                    <div className="min-w-0 flex-1 space-y-2.5">
                      <div>
                        <p className="font-bold text-zinc-900 text-base leading-tight">{ticket.albumTitle}</p>
                        <p className="text-zinc-600 text-sm">{ticket.albumArtist}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5 text-sm">
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-zinc-800">{ticket.sessionDate}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-zinc-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="min-w-0">
                            <p className="text-zinc-800 font-medium">{ticket.venueName}</p>
                            <p className="text-zinc-500 text-xs">{ticket.venueAddress}</p>
                          </div>
                        </div>
                      </div>

                      <p className="text-fg-subtle text-xs italic pt-1">{t('entryQrNote')}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
              <p className="text-fg-muted text-xs">
                {ticket.company.name} · NIF {ticket.company.nif} · {ticket.company.address.street}, {ticket.company.address.postalCode} {ticket.company.address.city}
              </p>
              <p className="text-fg text-xs mt-1">{ticket.company.web}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Convert any CSS color (including lab, oklch, oklab) to hex using canvas.
 * Canvas fillStyle always returns colors in #rrggbb or rgba format.
 */
let _colorCtx: CanvasRenderingContext2D | null = null
function colorToHex(color: string): string {
  if (!_colorCtx) {
    _colorCtx = document.createElement('canvas').getContext('2d')!
  }
  _colorCtx.fillStyle = '#000000' // reset
  _colorCtx.fillStyle = color
  return _colorCtx.fillStyle
}

const UNSUPPORTED_COLOR_FN = /\b(oklch|oklab|lab|lch|color)\s*\(/i

/**
 * Replace any unsupported color function inside a string value (gradients,
 * box-shadow, etc.) by parsing each color token through canvas.
 */
function sanitizeColorString(value: string): string {
  if (!UNSUPPORTED_COLOR_FN.test(value)) return value
  // Match outermost color function calls like `oklch(...)` with balanced parens.
  return value.replace(/(oklch|oklab|lab|lch|color)\s*\(([^()]*(?:\([^()]*\)[^()]*)*)\)/gi, (match) => {
    try {
      return colorToHex(match)
    } catch {
      return match
    }
  })
}

/**
 * Apply print-friendly styles for PDF generation.
 */
function applyPrintStyles(el: HTMLElement) {
  el.style.opacity = '1'
  el.style.transform = 'none'
  el.style.transition = 'none'
  el.style.animation = 'none'

  const computed = window.getComputedStyle(el)

  // Direct color properties — convert via canvas to hex.
  const colorProps = [
    'color',
    'backgroundColor',
    'borderTopColor',
    'borderRightColor',
    'borderBottomColor',
    'borderLeftColor',
    'outlineColor',
    'textDecorationColor',
    'caretColor',
    'columnRuleColor',
    'fill',
    'stroke',
  ] as const
  for (const prop of colorProps) {
    const val = computed[prop as any] as string
    if (val && val !== 'none' && val !== 'transparent' && val !== 'rgba(0, 0, 0, 0)') {
      el.style[prop as any] = colorToHex(val)
    }
  }

  // Composite properties that can embed colors (gradients, shadows). Sanitize tokens.
  const compositeProps = ['backgroundImage', 'boxShadow', 'textShadow'] as const
  for (const prop of compositeProps) {
    const val = computed[prop as any] as string
    if (val && val !== 'none') {
      const sanitized = sanitizeColorString(val)
      if (sanitized !== val) el.style[prop as any] = sanitized
    }
  }

  // Remove rounded corners on main container for cleaner A4
  if (el.classList.contains('rounded-2xl') && el.parentElement?.id === 'ticket-content') {
    el.style.borderRadius = '0'
    el.style.boxShadow = 'none'
  }

  // Force 2-column grid for PDF (even on narrow wrapper)
  if (el.getAttribute('data-section') === 'details') {
    el.style.display = 'grid'
    el.style.gridTemplateColumns = '1fr 1fr'
    el.style.gap = '12px'
  }

  // Prevent page breaks inside key sections
  if (el.getAttribute('data-section')) {
    el.style.pageBreakInside = 'avoid'
    el.style.breakInside = 'avoid'
  }

  // Process children
  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement || child instanceof SVGElement) {
      applyPrintStyles(child as HTMLElement)
    }
  })
}
