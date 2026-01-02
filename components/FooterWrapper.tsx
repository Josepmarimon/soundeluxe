import { client } from '@/lib/sanity/client'
import { footerContentQuery } from '@/lib/sanity/queries'
import type { FooterContent } from '@/lib/sanity/types'
import Footer from './Footer'

export default async function FooterWrapper() {
  const footerData: FooterContent | null = await client.fetch(footerContentQuery)
  return <Footer footerData={footerData} />
}
