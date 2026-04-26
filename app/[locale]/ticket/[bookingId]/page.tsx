import { redirect, notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { client } from '@/lib/sanity/client'
import { sessionByIdQuery } from '@/lib/sanity/queries'
import { generatePlaceQRDataURL } from '@/lib/qr'
import { getCompanyData, formatInvoiceNumber, calculateTaxBreakdown } from '@/lib/company'
import type { Session, Locale } from '@/lib/sanity/types'
import TicketView from './TicketView'
import { formatSessionDateTime, SESSION_LOCALE_MAP } from '@/lib/datetime'

interface TicketPageProps {
  params: Promise<{ locale: Locale; bookingId: string }>
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { locale, bookingId } = await params

  const authSession = await auth()
  const userId = authSession?.user ? (authSession.user as any).id : null
  const userRole = authSession?.user ? (authSession.user as any).role : null

  const reserva = await prisma.reserva.findUnique({
    where: { id: bookingId },
    include: {
      user: { select: { name: true, email: true } },
      places: { orderBy: { placeNumber: 'asc' } },
    },
  })

  if (!reserva) notFound()

  // Si està autenticat però no és el propietari (i no és admin/editor) → bloquejar.
  // Si NO està autenticat → permetre (cas guest checkout: el booking ID és secret).
  if (
    authSession?.user &&
    reserva.userId !== userId &&
    userRole !== 'ADMIN' &&
    userRole !== 'EDITOR'
  ) {
    redirect(`/${locale}`)
  }

  if (reserva.status !== 'CONFIRMED') {
    if (authSession?.user) redirect(`/${locale}/profile`)
    redirect(`/${locale}/sessions`)
  }

  // Fetch session data from Sanity
  const sessionData: Session | null = await client.fetch(sessionByIdQuery, { id: reserva.sessionId })

  if (!sessionData) notFound()

  // Generate one QR per place
  const qrPlaces = await Promise.all(
    reserva.places.map(async (place) => {
      let qrDataUrl: string | undefined
      try {
        qrDataUrl = await generatePlaceQRDataURL(place.id, locale)
      } catch (qrError) {
        console.error('Failed to generate ticket QR code:', qrError)
      }
      return {
        placeId: place.id,
        placeNumber: place.placeNumber,
        qrDataUrl,
      }
    })
  )

  const tbdDateLabel = { ca: 'Data pendent de confirmar', es: 'Fecha pendiente de confirmar', en: 'Date to be confirmed' } as const
  const tbdVenueLabel = { ca: 'Lloc pendent de confirmar', es: 'Lugar pendiente de confirmar', en: 'Venue to be confirmed' } as const
  const sessionDate = sessionData.date
    ? formatSessionDateTime(sessionData.date, locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    : tbdDateLabel[locale]
  const venueName = sessionData.sala
    ? (sessionData.sala.name[locale] || sessionData.sala.name.ca)
    : tbdVenueLabel[locale]
  const venueAddress = sessionData.sala?.address
    ? `${sessionData.sala.address.street}, ${sessionData.sala.address.city}`
    : ''

  const totalAmount = Number(reserva.totalAmount)
  const company = await getCompanyData()
  const taxBreakdown = await calculateTaxBreakdown(totalAmount)
  const invoiceNumber = reserva.invoiceNumber
    ? await formatInvoiceNumber(reserva.invoiceNumber, reserva.createdAt)
    : reserva.id.slice(0, 12).toUpperCase()

  const issueDate = reserva.createdAt.toLocaleDateString(SESSION_LOCALE_MAP[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <TicketView
      locale={locale}
      ticket={{
        invoiceNumber,
        issueDate,
        bookingId: reserva.id,
        userName: reserva.user.name || reserva.user.email,
        userEmail: reserva.user.email,
        albumTitle: sessionData.album.title,
        albumArtist: sessionData.album.artist,
        sessionDate,
        venueName,
        venueAddress,
        numPlaces: reserva.numPlaces,
        totalAmount: totalAmount.toFixed(2),
        baseAmount: taxBreakdown.baseAmount.toFixed(2),
        vatRate: taxBreakdown.vatRate,
        vatAmount: taxBreakdown.vatAmount.toFixed(2),
        qrPlaces,
        company,
      }}
    />
  )
}
