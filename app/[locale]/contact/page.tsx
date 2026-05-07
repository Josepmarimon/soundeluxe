import type { ContactPage, FooterContent, Locale } from '@/lib/sanity/types'
import { client } from '@/lib/sanity/client'
import { contactPageQuery, footerContentQuery } from '@/lib/sanity/queries'

interface ContactPageProps {
  params: Promise<{
    locale: Locale
  }>
}

export default async function ContactPageRoute({ params }: ContactPageProps) {
  const { locale } = await params

  const [contactData, footerData] = await Promise.all([
    client.fetch<ContactPage | null>(contactPageQuery),
    client.fetch<FooterContent | null>(footerContentQuery),
  ])

  const contactEmail = footerData?.contactInfo?.email ?? null
  const contactPhone = footerData?.contactInfo?.phone ?? null
  const contactAddress = footerData?.contactInfo?.address?.[locale] ?? null

  const title = contactData?.title?.[locale] ?? 'Contacte'
  const subtitle = contactData?.subtitle?.[locale] ?? null
  const emailLabel = contactData?.emailLabel?.[locale] ?? 'Correu electrònic'
  const phoneLabel = contactData?.phoneLabel?.[locale] ?? 'Telèfon'
  const addressLabel = contactData?.addressLabel?.[locale] ?? 'Adreça'
  const socialLabel = contactData?.socialLabel?.[locale] ?? 'Xarxes socials'
  const hoursTitle = contactData?.hoursTitle?.[locale] ?? 'Horari'
  const hoursLines = contactData?.hoursLines?.[locale] ?? []

  const formTitle = contactData?.formTitle?.[locale] ?? 'Envia\'ns un missatge'
  const formNameLabel = contactData?.formNameLabel?.[locale] ?? 'Nom'
  const formNamePlaceholder = contactData?.formNamePlaceholder?.[locale] ?? ''
  const formEmailLabel = contactData?.formEmailLabel?.[locale] ?? 'Correu electrònic'
  const formEmailPlaceholder = contactData?.formEmailPlaceholder?.[locale] ?? ''
  const formSubjectLabel = contactData?.formSubjectLabel?.[locale] ?? 'Assumpte'
  const formSubjectPlaceholder = contactData?.formSubjectPlaceholder?.[locale] ?? ''
  const formMessageLabel = contactData?.formMessageLabel?.[locale] ?? 'Missatge'
  const formMessagePlaceholder = contactData?.formMessagePlaceholder?.[locale] ?? ''
  const formSubmitLabel = contactData?.formSubmitLabel?.[locale] ?? 'Enviar'

  const socialLinks = [
    { name: 'Instagram', url: footerData?.socialLinks?.instagram },
    { name: 'Facebook', url: footerData?.socialLinks?.facebook },
    { name: 'Twitter / X', url: footerData?.socialLinks?.twitter },
    { name: 'YouTube', url: footerData?.socialLinks?.youtube },
    { name: 'Spotify', url: footerData?.socialLinks?.spotify },
  ].filter((link): link is { name: string; url: string } => Boolean(link.url))

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-fg mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-fg">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {contactEmail && (
              <div className="bg-surface-alt p-6 rounded-lg shadow-md">
                <h3 className="text-black font-semibold mb-2">{emailLabel}</h3>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-zinc-700 hover:text-primary transition-colors"
                >
                  {contactEmail}
                </a>
              </div>
            )}

            {contactPhone && (
              <div className="bg-surface-alt p-6 rounded-lg shadow-md">
                <h3 className="text-black font-semibold mb-2">{phoneLabel}</h3>
                <a
                  href={`tel:${contactPhone.replace(/\s/g, '')}`}
                  className="text-zinc-700 hover:text-primary transition-colors"
                >
                  {contactPhone}
                </a>
              </div>
            )}

            {contactAddress && (
              <div className="bg-surface-alt p-6 rounded-lg shadow-md">
                <h3 className="text-black font-semibold mb-2">{addressLabel}</h3>
                <address className="text-zinc-700 not-italic whitespace-pre-line">
                  {contactAddress}
                </address>
              </div>
            )}

            {hoursLines.length > 0 && (
              <div className="bg-surface-alt p-6 rounded-lg shadow-md">
                <h3 className="text-black font-semibold mb-3">{hoursTitle}</h3>
                <div className="space-y-1 text-zinc-700">
                  {hoursLines.map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="bg-surface-alt p-6 rounded-lg shadow-md">
                <h3 className="text-black font-semibold mb-3">{socialLabel}</h3>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-700 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="bg-surface-alt p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6">{formTitle}</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-black mb-2">
                  {formNameLabel}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={formNamePlaceholder}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-black mb-2">
                  {formEmailLabel}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={formEmailPlaceholder}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-black mb-2">
                  {formSubjectLabel}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder={formSubjectPlaceholder}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-black mb-2">
                  {formMessageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder={formMessagePlaceholder}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-3 rounded-full font-semibold hover:bg-primary-dark transition-all shadow-lg"
              >
                {formSubmitLabel}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
