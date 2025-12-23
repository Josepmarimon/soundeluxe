import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/lib/sanity/types'

interface ContactPageProps {
  params: Promise<{
    locale: Locale
  }>
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params
  const t = await getTranslations()

  const content = {
    ca: {
      title: 'Contacte',
      subtitle: 'Tens alguna pregunta? Estem aquí per ajudar-te',
      email: 'Correu electrònic',
      phone: 'Telèfon',
      address: 'Adreça',
      addressLine1: 'Carrer Example, 123',
      addressLine2: '08001 Barcelona',
      addressLine3: 'Catalunya, Espanya',
      form: {
        title: 'Envia\'ns un missatge',
        name: 'Nom',
        namePlaceholder: 'El teu nom',
        email: 'Correu electrònic',
        emailPlaceholder: 'el.teu@email.com',
        subject: 'Assumpte',
        subjectPlaceholder: 'De què vols parlar?',
        message: 'Missatge',
        messagePlaceholder: 'Escriu el teu missatge aquí...',
        submit: 'Enviar missatge',
      },
      hours: {
        title: 'Horari d\'atenció',
        weekdays: 'Dilluns a Divendres: 10:00 - 20:00',
        weekend: 'Dissabte: 12:00 - 18:00',
        sunday: 'Diumenge: Tancat',
      },
    },
    es: {
      title: 'Contacto',
      subtitle: '¿Tienes alguna pregunta? Estamos aquí para ayudarte',
      email: 'Correo electrónico',
      phone: 'Teléfono',
      address: 'Dirección',
      addressLine1: 'Calle Example, 123',
      addressLine2: '08001 Barcelona',
      addressLine3: 'Catalunya, España',
      form: {
        title: 'Envíanos un mensaje',
        name: 'Nombre',
        namePlaceholder: 'Tu nombre',
        email: 'Correo electrónico',
        emailPlaceholder: 'tu@email.com',
        subject: 'Asunto',
        subjectPlaceholder: '¿De qué quieres hablar?',
        message: 'Mensaje',
        messagePlaceholder: 'Escribe tu mensaje aquí...',
        submit: 'Enviar mensaje',
      },
      hours: {
        title: 'Horario de atención',
        weekdays: 'Lunes a Viernes: 10:00 - 20:00',
        weekend: 'Sábado: 12:00 - 18:00',
        sunday: 'Domingo: Cerrado',
      },
    },
    en: {
      title: 'Contact',
      subtitle: 'Have any questions? We\'re here to help',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      addressLine1: 'Example Street, 123',
      addressLine2: '08001 Barcelona',
      addressLine3: 'Catalonia, Spain',
      form: {
        title: 'Send us a message',
        name: 'Name',
        namePlaceholder: 'Your name',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        subject: 'Subject',
        subjectPlaceholder: 'What do you want to talk about?',
        message: 'Message',
        messagePlaceholder: 'Write your message here...',
        submit: 'Send message',
      },
      hours: {
        title: 'Opening hours',
        weekdays: 'Monday to Friday: 10:00 - 20:00',
        weekend: 'Saturday: 12:00 - 18:00',
        sunday: 'Sunday: Closed',
      },
    },
  }

  const pageContent = content[locale]

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {pageContent.title}
          </h1>
          <p className="text-xl text-zinc-300">
            {pageContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Email */}
            <div className="bg-[#F5F1E8] p-6 rounded-lg shadow-md">
              <h3 className="text-black font-semibold mb-2">
                {pageContent.email}
              </h3>
              <a
                href="mailto:info@sounddeluxe.com"
                className="text-zinc-700 hover:text-[#D4AF37] transition-colors"
              >
                info@sounddeluxe.com
              </a>
            </div>

            {/* Phone */}
            <div className="bg-[#F5F1E8] p-6 rounded-lg shadow-md">
              <h3 className="text-black font-semibold mb-2">
                {pageContent.phone}
              </h3>
              <a
                href="tel:+34123456789"
                className="text-zinc-700 hover:text-[#D4AF37] transition-colors"
              >
                +34 123 456 789
              </a>
            </div>

            {/* Address */}
            <div className="bg-[#F5F1E8] p-6 rounded-lg shadow-md">
              <h3 className="text-black font-semibold mb-2">
                {pageContent.address}
              </h3>
              <address className="text-zinc-700 not-italic">
                {pageContent.addressLine1}
                <br />
                {pageContent.addressLine2}
                <br />
                {pageContent.addressLine3}
              </address>
            </div>

            {/* Hours */}
            <div className="bg-[#F5F1E8] p-6 rounded-lg shadow-md">
              <h3 className="text-black font-semibold mb-3">
                {pageContent.hours.title}
              </h3>
              <div className="space-y-1 text-zinc-700">
                <p>{pageContent.hours.weekdays}</p>
                <p>{pageContent.hours.weekend}</p>
                <p>{pageContent.hours.sunday}</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-[#F5F1E8] p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-black mb-6">
              {pageContent.form.title}
            </h2>
            <form className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-black mb-2">
                  {pageContent.form.name}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={pageContent.form.namePlaceholder}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-black mb-2">
                  {pageContent.form.email}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={pageContent.form.emailPlaceholder}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-black mb-2">
                  {pageContent.form.subject}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder={pageContent.form.subjectPlaceholder}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-black mb-2">
                  {pageContent.form.message}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder={pageContent.form.messagePlaceholder}
                  className="w-full px-4 py-3 bg-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-black py-3 rounded-full font-semibold hover:bg-[#C5A028] transition-colors"
              >
                {pageContent.form.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
