import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Geist, Geist_Mono, DM_Serif_Display, Barlow } from 'next/font/google'
import '../globals.css'
import { locales } from '@/i18n'
import Navbar from '@/components/Navbar'
import FooterWrapper from '@/components/FooterWrapper'
import SessionProvider from '@/components/SessionProvider'
import RegisterModalProvider from '@/components/RegisterModalProvider'
import PageViewTracker from '@/components/PageViewTracker'
import { client } from '@/lib/sanity/client'
import { homePageFlagsQuery } from '@/lib/sanity/queries'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const dmSerifDisplay = DM_Serif_Display({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
})

const barlow = Barlow({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: '900',
  style: ['normal', 'italic'],
  display: 'swap',
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
  const [messages, homePageFlags] = await Promise.all([
    getMessages(),
    client.fetch<{ showShop?: boolean; showGallery?: boolean }>(homePageFlagsQuery),
  ])

  const showShop = homePageFlags?.showShop ?? true
  const showGallery = homePageFlags?.showGallery ?? false

  return (
    <html lang={locale}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='day'){document.documentElement.setAttribute('data-theme','day');}}catch(e){}`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSerifDisplay.variable} ${barlow.variable} antialiased`}
      >
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <RegisterModalProvider>
              <PageViewTracker locale={locale} />
              <Navbar showShop={showShop} showGallery={showGallery} />
              <main className="pt-16">{children}</main>
              <FooterWrapper />
            </RegisterModalProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
