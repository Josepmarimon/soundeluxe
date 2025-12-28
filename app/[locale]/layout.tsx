import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import { locales } from '@/i18n'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SessionProvider from '@/components/SessionProvider'
import { client } from '@/lib/sanity/client'
import { siteSettingsQuery } from '@/lib/sanity/queries'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
  description: 'Sessions exclusives d\'escolta en alta fidelitat per a autèntics audiòfils a Barcelona',
  openGraph: {
    title: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
    description: 'Sessions exclusives d\'escolta en alta fidelitat per a autèntics audiòfils a Barcelona',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sound Deluxe',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sound Deluxe - Experiències audiòfiles d\'alta fidelitat',
    description: 'Sessions exclusives d\'escolta en alta fidelitat per a autèntics audiòfils a Barcelona',
    images: ['/og-image.png'],
  },
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Ensure that the incoming locale is valid
  if (!locales.includes(locale as any)) {
    notFound()
  }

  // Fetch site settings and messages in parallel
  const [messages, siteSettings] = await Promise.all([
    getMessages(),
    client.fetch<{ showShop?: boolean }>(siteSettingsQuery),
  ])

  const showShop = siteSettings?.showShop ?? true

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar showShop={showShop} />
            <main>{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
