'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

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
  qrDataUrl?: string
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
      const html2pdf = (await import('html2pdf.js')).default
      const contentEl = document.getElementById('ticket-content')
      if (!contentEl) return

      const clone = contentEl.cloneNode(true) as HTMLElement
      const wrapper = document.createElement('div')
      wrapper.style.cssText = `
        background: white;
        font-family: system-ui, -apple-system, sans-serif;
        padding: 0;
        width: 210mm;
      `
      applyPrintStyles(clone)
      wrapper.appendChild(clone)
      wrapper.style.position = 'fixed'
      wrapper.style.left = '-9999px'
      wrapper.style.top = '0'
      document.body.appendChild(wrapper)

      const filename = `SoundDeluxe_${ticket.invoiceNumber.replace(/\//g, '-')}.pdf`

      await html2pdf()
        .set({
          margin: [15, 15, 15, 15],
          filename,
          image: { type: 'jpeg', quality: 0.98 },
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
        })
        .from(wrapper)
        .save()

      document.body.removeChild(wrapper)
    } catch (err) {
      console.error('Error generating PDF:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1929] pt-20 pb-16">
      {/* Action bar */}
      <div className="max-w-2xl mx-auto px-4 mb-6 flex items-center justify-between">
        <Link
          href={`/${locale}/profile`}
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('backToProfile')}
        </Link>
        <button
          onClick={handleDownload}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black rounded-full font-semibold text-sm hover:shadow-lg transition-shadow disabled:opacity-50"
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
          <div className="bg-gradient-to-r from-[#0a1929] via-[#122a45] to-[#0a1929] px-5 sm:px-8 py-5 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-[#D4AF37] text-xl sm:text-2xl font-bold tracking-wider">SOUND DELUXE</h1>
                <p className="text-zinc-400 text-xs mt-0.5 tracking-wide">{t('subtitle')}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-[#D4AF37] font-bold text-sm">{t('simplifiedInvoice')}</p>
                <p className="text-white font-mono text-sm mt-0.5">{ticket.invoiceNumber}</p>
              </div>
            </div>
          </div>

          <div className="px-5 sm:px-8 py-6">
            {/* Company & Invoice details */}
            <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-3 sm:gap-0 mb-6 pb-6 border-b border-zinc-200">
              <div className="text-xs text-zinc-500 space-y-0.5">
                <p className="font-semibold text-zinc-700">{ticket.company.name}</p>
                <p>NIF: {ticket.company.nif}</p>
                <p>{ticket.company.address.street}</p>
                <p>{ticket.company.address.postalCode} {ticket.company.address.city}</p>
              </div>
              <div className="text-right text-xs text-zinc-500 space-y-0.5">
                <p><span className="text-zinc-400">{t('issueDate')}:</span> <span className="text-zinc-700">{ticket.issueDate}</span></p>
                <p><span className="text-zinc-400">{t('reference')}:</span> <span className="font-mono text-zinc-700">{ticket.bookingId.slice(0, 12)}</span></p>
              </div>
            </div>

            {/* Event details - the star of the show */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 mb-1">{ticket.albumTitle}</h2>
              <p className="text-zinc-500 text-lg">{ticket.albumArtist}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6" data-section="details">
              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">{t('dateTime')}</p>
                <p className="text-zinc-800 font-medium text-sm">{ticket.sessionDate}</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">{t('venue')}</p>
                <p className="text-zinc-800 font-medium text-sm">{ticket.venueName}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{ticket.venueAddress}</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">{t('attendee')}</p>
                <p className="text-zinc-800 font-medium text-sm">{ticket.userName}</p>
                <p className="text-zinc-500 text-xs mt-0.5">{ticket.userEmail}</p>
              </div>
              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-zinc-400 text-xs uppercase tracking-wide mb-1">{t('places')}</p>
                <p className="text-zinc-800 font-bold text-2xl">{ticket.numPlaces}</p>
              </div>
            </div>

            {/* Tax breakdown - factura simplificada requirements */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden mb-6" data-section="tax">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-zinc-50">
                    <th className="text-left px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">{t('concept')}</th>
                    <th className="text-right px-4 py-3 text-zinc-500 font-medium text-xs uppercase tracking-wide">{t('amount')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-100">
                    <td className="px-4 py-3 text-zinc-700">
                      {t('sessionEntry', { places: ticket.numPlaces })}
                      <br />
                      <span className="text-zinc-400 text-xs">{ticket.albumTitle} — {ticket.albumArtist}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-700">{ticket.baseAmount}€</td>
                  </tr>
                  <tr className="border-t border-zinc-100">
                    <td className="px-4 py-3 text-zinc-500">{t('vatLine', { rate: ticket.vatRate })}</td>
                    <td className="px-4 py-3 text-right text-zinc-500">{ticket.vatAmount}€</td>
                  </tr>
                  <tr className="border-t-2 border-zinc-200 bg-zinc-50">
                    <td className="px-4 py-3 font-bold text-zinc-900">{t('total')}</td>
                    <td className="px-4 py-3 text-right font-bold text-zinc-900 text-lg">{ticket.totalAmount}€</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* QR Code and entry info */}
            <div className="flex items-center gap-6 bg-zinc-50 rounded-xl p-5" data-section="qr">
              {ticket.qrDataUrl && (
                <div className="flex-shrink-0">
                  <img src={ticket.qrDataUrl} alt="QR Code" className="w-28 h-28 rounded-lg" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-zinc-800 mb-1">{t('entryQr')}</p>
                <p className="text-zinc-500 text-sm">{t('entryQrNote')}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t border-zinc-200 text-center">
              <p className="text-zinc-400 text-xs">
                {ticket.company.name} · NIF {ticket.company.nif} · {ticket.company.address.street}, {ticket.company.address.postalCode} {ticket.company.address.city}
              </p>
              <p className="text-zinc-300 text-xs mt-1">{ticket.company.web}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Apply print-friendly styles for PDF generation.
 * The ticket is already white-background, so only minor adjustments are needed.
 */
function applyPrintStyles(el: HTMLElement) {
  el.style.opacity = '1'
  el.style.transform = 'none'
  el.style.transition = 'none'
  el.style.animation = 'none'

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
    if (child instanceof HTMLElement) {
      applyPrintStyles(child)
    }
  })
}
