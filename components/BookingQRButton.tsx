'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

interface BookingQRButtonProps {
  bookingId: string
  locale: string
}

export default function BookingQRButton({ bookingId, locale }: BookingQRButtonProps) {
  const t = useTranslations('qr')
  const [qrUrl, setQrUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showQR, setShowQR] = useState(false)

  const handleShowQR = async () => {
    if (qrUrl) {
      setShowQR(!showQR)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/booking/${bookingId}/qr`, {
        headers: { 'x-locale': locale },
      })
      if (res.ok) {
        const data = await res.json()
        setQrUrl(data.qrDataUrl)
        setShowQR(true)
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleShowQR}
        disabled={loading}
        className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#F4E5AD] text-sm font-medium transition-colors"
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        )}
        {showQR ? t('hideCode') : t('showCode')}
      </button>

      {showQR && qrUrl && (
        <div className="mt-3 bg-white rounded-xl p-4 inline-block">
          <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
          <p className="text-zinc-600 text-xs text-center mt-2">{t('scanAtDoor')}</p>
        </div>
      )}
    </div>
  )
}
