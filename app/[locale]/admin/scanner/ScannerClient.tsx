'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

interface BookingResult {
  success: boolean
  alreadyCheckedIn?: boolean
  attendedAt?: string
  numPlaces?: number
  error?: string
}

interface BookingDetails {
  bookingId: string
  userName: string
  userEmail: string
  numPlaces: number
  album?: string
  artist?: string
  sessionDate?: string
  venue?: string
  attended: boolean
  attendedAt: string | null
  status: string
}

type ScanState = 'scanning' | 'loading' | 'found' | 'confirmed' | 'already' | 'error'

export default function ScannerClient({ locale }: { locale: string }) {
  const t = useTranslations('scanner')
  const [scanState, setScanState] = useState<ScanState>('scanning')
  const [booking, setBooking] = useState<BookingDetails | null>(null)
  const [error, setError] = useState<string>('')
  const [cameraReady, setCameraReady] = useState(false)
  const scannerRef = useRef<any>(null)
  const lastScannedRef = useRef<string>('')
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null)
  const processingRef = useRef(false)

  const extractBookingId = useCallback((text: string): string | null => {
    // Match URLs like /admin/checkin/{bookingId} or /checkin/{bookingId}
    const urlMatch = text.match(/\/checkin\/([a-zA-Z0-9_-]+)/)
    if (urlMatch) return urlMatch[1]
    // Also accept raw booking IDs (cuid format)
    if (/^c[a-z0-9]{20,30}$/.test(text)) return text
    return null
  }, [])

  const fetchBookingDetails = useCallback(async (bookingId: string): Promise<BookingDetails | null> => {
    try {
      const res = await fetch(`/api/admin/scanner/booking?bookingId=${bookingId}`, {
        headers: { 'x-locale': locale },
      })
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }, [locale])

  const pauseScanning = useCallback(() => {
    if (scannerRef.current?.isScanning) {
      scannerRef.current.pause(true) // pause video
    }
  }, [])

  const resumeScanning = useCallback(() => {
    if (scannerRef.current?.getState?.() === 3) { // PAUSED state
      scannerRef.current.resume()
    }
  }, [])

  const handleCheckin = useCallback(async () => {
    if (!booking) return

    try {
      const res = await fetch('/api/admin/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.bookingId }),
      })

      const data: BookingResult = await res.json()

      if (data.alreadyCheckedIn) {
        setScanState('already')
        setBooking(prev => prev ? { ...prev, attended: true, attendedAt: data.attendedAt || null } : null)
      } else if (data.success) {
        setScanState('confirmed')
        // Vibrate on success (double tap pattern)
        if (navigator.vibrate) navigator.vibrate([100, 50, 100])
      } else {
        setScanState('error')
        setError(data.error || t('errorGeneric'))
      }
    } catch {
      setScanState('error')
      setError(t('errorGeneric'))
    }
  }, [booking, t])

  const resetScanner = useCallback(() => {
    setScanState('scanning')
    setBooking(null)
    setError('')
    lastScannedRef.current = ''
    processingRef.current = false
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current)
      resetTimerRef.current = null
    }
    resumeScanning()
  }, [resumeScanning])

  const scheduleAutoReset = useCallback((delay: number = 4000) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(resetScanner, delay)
  }, [resetScanner])

  const onScanSuccess = useCallback(async (decodedText: string) => {
    // Guard: don't process if already handling a scan
    if (processingRef.current) return

    const bookingId = extractBookingId(decodedText)
    if (!bookingId || bookingId === lastScannedRef.current) return

    // Lock processing
    processingRef.current = true
    lastScannedRef.current = bookingId
    setScanState('loading')
    pauseScanning()

    // Vibrate feedback on detection
    if (navigator.vibrate) navigator.vibrate(50)

    const details = await fetchBookingDetails(bookingId)

    if (!details) {
      setScanState('error')
      setError(t('bookingNotFound'))
      scheduleAutoReset(3000)
      return
    }

    if (details.status !== 'CONFIRMED') {
      setScanState('error')
      setError(t('invalidBooking'))
      scheduleAutoReset(3000)
      return
    }

    setBooking(details)

    if (details.attended) {
      setScanState('already')
      scheduleAutoReset(4000)
    } else {
      setScanState('found')
      // Don't auto-reset on found — wait for staff action
    }
  }, [extractBookingId, fetchBookingDetails, t, scheduleAutoReset, pauseScanning])

  // Initialize scanner
  useEffect(() => {
    let html5QrCode: any = null

    const initScanner = async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode')
        html5QrCode = new Html5Qrcode('qr-reader')
        scannerRef.current = html5QrCode

        await html5QrCode.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 260, height: 260 },
            aspectRatio: 1,
            disableFlip: false,
          },
          (decodedText: string) => {
            onScanSuccess(decodedText)
          },
          () => {} // ignore scan failures
        )

        setCameraReady(true)
      } catch (err) {
        console.error('Failed to start scanner:', err)
        setError(t('cameraError'))
        setScanState('error')
      }
    }

    initScanner()

    return () => {
      if (html5QrCode?.isScanning) {
        html5QrCode.stop().catch(() => {})
      }
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen bg-[#0a1929] flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Compact header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0a1929]/95 backdrop-blur-sm border-b border-[#254a6e]/30" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        <div className="px-4 py-3 flex items-center justify-between">
          <Link
            href={`/${locale}/admin/attendance`}
            className="text-zinc-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-white font-bold text-lg">{t('title')}</h1>
          <div className="w-8" /> {/* spacer for centering */}
        </div>
      </div>

      {/* Scanner viewport */}
      <div className="flex-1 flex flex-col items-center pt-16 pb-4 px-4" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 64px)' }}>
        {/* Camera view */}
        <div className="relative w-full max-w-sm mt-4">
          <div
            id="qr-reader"
            className="w-full rounded-2xl overflow-hidden bg-black"
            style={{ minHeight: '320px' }}
          />

          {/* Scanning overlay with animated gold corners */}
          {scanState === 'scanning' && cameraReady && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-[260px] h-[260px] relative">
                <div className="absolute -top-0.5 -left-0.5 w-12 h-12 border-t-[3px] border-l-[3px] border-[#D4AF37] rounded-tl-xl" />
                <div className="absolute -top-0.5 -right-0.5 w-12 h-12 border-t-[3px] border-r-[3px] border-[#D4AF37] rounded-tr-xl" />
                <div className="absolute -bottom-0.5 -left-0.5 w-12 h-12 border-b-[3px] border-l-[3px] border-[#D4AF37] rounded-bl-xl" />
                <div className="absolute -bottom-0.5 -right-0.5 w-12 h-12 border-b-[3px] border-r-[3px] border-[#D4AF37] rounded-br-xl" />
                {/* Animated scan line */}
                <div className="absolute left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent animate-scan" />
              </div>
            </div>
          )}

          {/* Loading overlay */}
          {scanState === 'loading' && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-2xl backdrop-blur-sm">
              <div className="flex flex-col items-center gap-3">
                <svg className="animate-spin w-10 h-10 text-[#D4AF37]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Scanning hint */}
        {scanState === 'scanning' && (
          <p className="text-zinc-500 text-sm mt-4 text-center">{t('hint')}</p>
        )}

        {/* === RESULT CARDS === */}

        {/* Booking found — awaiting confirmation */}
        {booking && scanState === 'found' && (
          <div className="w-full max-w-sm mt-6 animate-in">
            <div className="bg-zinc-800/90 backdrop-blur-sm rounded-2xl p-5 border border-zinc-700 shadow-xl">
              {/* Guest row */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-[#D4AF37]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold truncate">{booking.userName}</p>
                  <p className="text-zinc-400 text-xs truncate">{booking.userEmail}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[#D4AF37] font-bold text-2xl">{booking.numPlaces}</span>
                  <p className="text-zinc-500 text-xs">{t('places')}</p>
                </div>
              </div>

              {/* Session details */}
              {booking.album && (
                <div className="space-y-1.5 text-sm mb-5 bg-zinc-900/50 rounded-xl p-3">
                  <div className="flex justify-between gap-4">
                    <span className="text-zinc-500 flex-shrink-0">{t('album')}</span>
                    <span className="text-white font-medium text-right truncate">{booking.album}</span>
                  </div>
                  {booking.artist && (
                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500 flex-shrink-0">{t('artist')}</span>
                      <span className="text-zinc-300 text-right truncate">{booking.artist}</span>
                    </div>
                  )}
                  {booking.venue && (
                    <div className="flex justify-between gap-4">
                      <span className="text-zinc-500 flex-shrink-0">{t('venue')}</span>
                      <span className="text-zinc-300 text-right truncate">{booking.venue}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Big confirm button */}
              <button
                onClick={handleCheckin}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {t('confirmEntry')} — {booking.numPlaces} {t('places')}
              </button>

              <button
                onClick={resetScanner}
                className="w-full text-zinc-500 hover:text-zinc-300 text-sm mt-3 py-2 transition-colors"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        )}

        {/* Entry confirmed */}
        {scanState === 'confirmed' && booking && (
          <div className="w-full max-w-sm mt-6 animate-in">
            <div className="bg-emerald-900/30 border border-emerald-700 rounded-2xl p-6 text-center shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 mb-3 animate-bounce-once">
                <svg className="w-9 h-9 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-emerald-300 font-bold text-xl">{t('entryConfirmed')}</p>
              <p className="text-zinc-400 text-sm mt-1">
                {booking.userName} · {booking.numPlaces} {t('places')}
              </p>
              <button
                onClick={resetScanner}
                className="mt-5 px-8 py-2.5 bg-zinc-800 border border-zinc-600 text-white rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                {t('scanNext')}
              </button>
            </div>
          </div>
        )}

        {/* Already checked in */}
        {scanState === 'already' && booking && (
          <div className="w-full max-w-sm mt-6 animate-in">
            <div className="bg-amber-900/20 border border-amber-700/50 rounded-2xl p-6 text-center shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-3">
                <svg className="w-9 h-9 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <p className="text-amber-300 font-bold text-lg">{t('alreadyCheckedIn')}</p>
              <p className="text-zinc-400 text-sm mt-1">
                {booking.userName} · {booking.numPlaces} {t('places')}
              </p>
              {booking.attendedAt && (
                <p className="text-zinc-500 text-xs mt-1">
                  {new Date(booking.attendedAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
              <button
                onClick={resetScanner}
                className="mt-5 px-8 py-2.5 bg-zinc-800 border border-zinc-600 text-white rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                {t('scanNext')}
              </button>
            </div>
          </div>
        )}

        {/* Error */}
        {scanState === 'error' && (
          <div className="w-full max-w-sm mt-6 animate-in">
            <div className="bg-red-900/20 border border-red-700/50 rounded-2xl p-6 text-center shadow-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-3">
                <svg className="w-9 h-9 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-red-300 font-bold text-lg">{error}</p>
              <button
                onClick={resetScanner}
                className="mt-5 px-8 py-2.5 bg-zinc-800 border border-zinc-600 text-white rounded-full text-sm font-medium hover:bg-zinc-700 transition-colors"
              >
                {t('tryAgain')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Styles for scanner UI */}
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 8%; }
          50% { top: 88%; }
        }
        .animate-scan {
          animation: scan 2.5s ease-in-out infinite;
          position: absolute;
        }
        .animate-in {
          animation: slideUp 0.25s ease-out;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-once {
          animation: bounceOnce 0.4s ease-out;
        }
        @keyframes bounceOnce {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        /* html5-qrcode overrides: hide all built-in UI */
        #qr-reader {
          border: none !important;
          background: transparent !important;
        }
        #qr-reader video {
          border-radius: 16px !important;
          object-fit: cover !important;
        }
        #qr-reader__scan_region {
          min-height: 320px;
        }
        #qr-reader__dashboard,
        #qr-reader__dashboard_section,
        #qr-reader__dashboard_section_csr,
        #qr-reader__dashboard_section_swaplink,
        #qr-reader__header_message,
        #qr-reader img[alt="Info icon"] {
          display: none !important;
        }
        /* Prevent text selection on scan results (mobile UX) */
        .animate-in * {
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  )
}
