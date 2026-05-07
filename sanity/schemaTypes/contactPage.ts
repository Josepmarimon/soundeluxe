import { defineType, defineField } from 'sanity'

const multilingualText = (rows = 2) => ({
  type: 'object' as const,
  fields: [
    { name: 'ca', type: 'text' as const, title: 'Català', rows },
    { name: 'es', type: 'text' as const, title: 'Español', rows },
    { name: 'en', type: 'text' as const, title: 'English', rows },
  ],
})

const multilingualString = (initialValues?: { ca?: string; es?: string; en?: string }) => ({
  type: 'object' as const,
  fields: [
    { name: 'ca', type: 'string' as const, title: 'Català', initialValue: initialValues?.ca },
    { name: 'es', type: 'string' as const, title: 'Español', initialValue: initialValues?.es },
    { name: 'en', type: 'string' as const, title: 'English', initialValue: initialValues?.en },
  ],
})

export default defineType({
  name: 'contactPage',
  title: 'Pàgina de Contacte',
  type: 'document',
  icon: () => '✉️',
  description: 'Textos editables de la pàgina /contact. Les dades de telèfon, email, adreça i xarxes socials es prenen de la configuració del Footer.',
  groups: [
    { name: 'header', title: 'Capçalera' },
    { name: 'labels', title: 'Etiquetes' },
    { name: 'hours', title: 'Horari' },
    { name: 'form', title: 'Formulari' },
  ],
  fields: [
    // HEADER
    defineField({
      name: 'title',
      title: 'Títol',
      group: 'header',
      ...multilingualString({ ca: 'Contacte', es: 'Contacto', en: 'Contact' }),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítol',
      group: 'header',
      ...multilingualText(2),
    }),

    // LABELS
    defineField({
      name: 'emailLabel',
      title: 'Etiqueta Email',
      group: 'labels',
      ...multilingualString({ ca: 'Correu electrònic', es: 'Correo electrónico', en: 'Email' }),
    }),
    defineField({
      name: 'phoneLabel',
      title: 'Etiqueta Telèfon',
      group: 'labels',
      ...multilingualString({ ca: 'Telèfon', es: 'Teléfono', en: 'Phone' }),
    }),
    defineField({
      name: 'addressLabel',
      title: 'Etiqueta Adreça',
      group: 'labels',
      ...multilingualString({ ca: 'Adreça', es: 'Dirección', en: 'Address' }),
    }),
    defineField({
      name: 'socialLabel',
      title: 'Etiqueta Xarxes Socials',
      group: 'labels',
      ...multilingualString({ ca: 'Xarxes socials', es: 'Redes sociales', en: 'Social media' }),
    }),

    // HOURS
    defineField({
      name: 'hoursTitle',
      title: 'Títol secció Horari',
      group: 'hours',
      ...multilingualString({ ca: 'Horari d\'atenció', es: 'Horario de atención', en: 'Opening hours' }),
    }),
    defineField({
      name: 'hoursLines',
      title: 'Línies d\'horari',
      group: 'hours',
      description: 'Una línia per dia o franja horària',
      type: 'object',
      fields: [
        { name: 'ca', type: 'array', title: 'Català', of: [{ type: 'string' }] },
        { name: 'es', type: 'array', title: 'Español', of: [{ type: 'string' }] },
        { name: 'en', type: 'array', title: 'English', of: [{ type: 'string' }] },
      ],
    }),

    // FORM
    defineField({
      name: 'formTitle',
      title: 'Títol del formulari',
      group: 'form',
      ...multilingualString({ ca: 'Envia\'ns un missatge', es: 'Envíanos un mensaje', en: 'Send us a message' }),
    }),
    defineField({
      name: 'formNameLabel',
      title: 'Etiqueta Nom',
      group: 'form',
      ...multilingualString({ ca: 'Nom', es: 'Nombre', en: 'Name' }),
    }),
    defineField({
      name: 'formNamePlaceholder',
      title: 'Placeholder Nom',
      group: 'form',
      ...multilingualString({ ca: 'El teu nom', es: 'Tu nombre', en: 'Your name' }),
    }),
    defineField({
      name: 'formEmailLabel',
      title: 'Etiqueta Email (formulari)',
      group: 'form',
      ...multilingualString({ ca: 'Correu electrònic', es: 'Correo electrónico', en: 'Email' }),
    }),
    defineField({
      name: 'formEmailPlaceholder',
      title: 'Placeholder Email',
      group: 'form',
      ...multilingualString({ ca: 'el.teu@email.com', es: 'tu@email.com', en: 'your@email.com' }),
    }),
    defineField({
      name: 'formSubjectLabel',
      title: 'Etiqueta Assumpte',
      group: 'form',
      ...multilingualString({ ca: 'Assumpte', es: 'Asunto', en: 'Subject' }),
    }),
    defineField({
      name: 'formSubjectPlaceholder',
      title: 'Placeholder Assumpte',
      group: 'form',
      ...multilingualString({ ca: 'De què vols parlar?', es: '¿De qué quieres hablar?', en: 'What do you want to talk about?' }),
    }),
    defineField({
      name: 'formMessageLabel',
      title: 'Etiqueta Missatge',
      group: 'form',
      ...multilingualString({ ca: 'Missatge', es: 'Mensaje', en: 'Message' }),
    }),
    defineField({
      name: 'formMessagePlaceholder',
      title: 'Placeholder Missatge',
      group: 'form',
      ...multilingualString({ ca: 'Escriu el teu missatge aquí...', es: 'Escribe tu mensaje aquí...', en: 'Write your message here...' }),
    }),
    defineField({
      name: 'formSubmitLabel',
      title: 'Botó d\'enviament',
      group: 'form',
      ...multilingualString({ ca: 'Enviar missatge', es: 'Enviar mensaje', en: 'Send message' }),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Pàgina de Contacte' }
    },
  },
})
