import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'footerContent',
  title: 'Contingut del Footer',
  type: 'document',
  icon: () => '📋',
  groups: [
    { name: 'brand', title: 'Marca' },
    { name: 'contact', title: 'Contacte' },
    { name: 'social', title: 'Xarxes Socials' },
    { name: 'content', title: 'Contingut' },
    { name: 'contactPage', title: 'Pàgina de Contacte' },
  ],
  fields: [
    // BRAND GROUP
    defineField({
      name: 'description',
      title: 'Descripció del footer',
      type: 'object',
      group: 'brand',
      fields: [
        { name: 'ca', type: 'text', title: 'Català', rows: 2 },
        { name: 'es', type: 'text', title: 'Español', rows: 2 },
        { name: 'en', type: 'text', title: 'English', rows: 2 },
      ],
    }),

    // CONTACT GROUP
    defineField({
      name: 'contactInfo',
      title: 'Informació de contacte',
      type: 'object',
      group: 'contact',
      fields: [
        {
          name: 'phone',
          type: 'string',
          title: 'Telèfon',
          description: 'Format: +34 XXX XXX XXX',
        },
        {
          name: 'email',
          type: 'string',
          title: 'Email',
          validation: (Rule) => Rule.email(),
        },
        {
          name: 'address',
          type: 'object',
          title: 'Adreça',
          fields: [
            { name: 'ca', type: 'text', title: 'Català', rows: 2 },
            { name: 'es', type: 'text', title: 'Español', rows: 2 },
            { name: 'en', type: 'text', title: 'English', rows: 2 },
          ],
        },
      ],
    }),

    // SOCIAL GROUP
    defineField({
      name: 'socialLinks',
      title: 'Xarxes socials',
      type: 'object',
      group: 'social',
      description: 'Deixa en blanc les xarxes que no vulguis mostrar',
      fields: [
        {
          name: 'instagram',
          type: 'url',
          title: 'Instagram',
          description: 'URL completa (ex: https://instagram.com/sounddeluxe)',
        },
        {
          name: 'facebook',
          type: 'url',
          title: 'Facebook',
          description: 'URL completa (ex: https://facebook.com/sounddeluxe)',
        },
        {
          name: 'twitter',
          type: 'url',
          title: 'Twitter / X',
          description: 'URL completa (ex: https://twitter.com/sounddeluxe)',
        },
        {
          name: 'youtube',
          type: 'url',
          title: 'YouTube',
          description: 'URL completa (ex: https://youtube.com/@sounddeluxe)',
        },
        {
          name: 'spotify',
          type: 'url',
          title: 'Spotify',
          description: 'URL completa (ex: https://open.spotify.com/user/sounddeluxe)',
        },
      ],
    }),

    // CONTENT GROUP
    defineField({
      name: 'sectionTitles',
      title: 'Títols de seccions',
      type: 'object',
      group: 'content',
      fields: [
        {
          name: 'links',
          type: 'object',
          title: 'Títol secció Enllaços',
          fields: [
            { name: 'ca', type: 'string', title: 'Català', initialValue: 'Enllaços' },
            { name: 'es', type: 'string', title: 'Español', initialValue: 'Enlaces' },
            { name: 'en', type: 'string', title: 'English', initialValue: 'Links' },
          ],
        },
        {
          name: 'legal',
          type: 'object',
          title: 'Títol secció Legal',
          fields: [
            { name: 'ca', type: 'string', title: 'Català', initialValue: 'Legal' },
            { name: 'es', type: 'string', title: 'Español', initialValue: 'Legal' },
            { name: 'en', type: 'string', title: 'English', initialValue: 'Legal' },
          ],
        },
        {
          name: 'contact',
          type: 'object',
          title: 'Títol secció Contacte',
          fields: [
            { name: 'ca', type: 'string', title: 'Català', initialValue: 'Contacte' },
            { name: 'es', type: 'string', title: 'Español', initialValue: 'Contacto' },
            { name: 'en', type: 'string', title: 'English', initialValue: 'Contact' },
          ],
        },
      ],
    }),
    defineField({
      name: 'copyrightText',
      title: 'Text de copyright',
      type: 'object',
      group: 'content',
      description: 'Usa {year} per inserir l\'any actual automàticament',
      fields: [
        {
          name: 'ca',
          type: 'string',
          title: 'Català',
          initialValue: '© {year} Sound Deluxe. Tots els drets reservats.',
        },
        {
          name: 'es',
          type: 'string',
          title: 'Español',
          initialValue: '© {year} Sound Deluxe. Todos los derechos reservados.',
        },
        {
          name: 'en',
          type: 'string',
          title: 'English',
          initialValue: '© {year} Sound Deluxe. All rights reserved.',
        },
      ],
    }),
    // CONTACT PAGE GROUP
    defineField({
      name: 'contactPage',
      title: 'Continguts de la pàgina de Contacte',
      type: 'object',
      group: 'contactPage',
      description: 'Textos editables de la pàgina /contact (les dades de telèfon, email i adreça es prenen de la secció Contacte)',
      fields: [
        {
          name: 'title',
          type: 'object',
          title: 'Títol',
          fields: [
            { name: 'ca', type: 'string', title: 'Català', initialValue: 'Contacte' },
            { name: 'es', type: 'string', title: 'Español', initialValue: 'Contacto' },
            { name: 'en', type: 'string', title: 'English', initialValue: 'Contact' },
          ],
        },
        {
          name: 'subtitle',
          type: 'object',
          title: 'Subtítol',
          fields: [
            { name: 'ca', type: 'text', title: 'Català', rows: 2 },
            { name: 'es', type: 'text', title: 'Español', rows: 2 },
            { name: 'en', type: 'text', title: 'English', rows: 2 },
          ],
        },
        {
          name: 'hoursTitle',
          type: 'object',
          title: 'Títol secció Horari',
          fields: [
            { name: 'ca', type: 'string', title: 'Català', initialValue: 'Horari d\'atenció' },
            { name: 'es', type: 'string', title: 'Español', initialValue: 'Horario de atención' },
            { name: 'en', type: 'string', title: 'English', initialValue: 'Opening hours' },
          ],
        },
        {
          name: 'hoursLines',
          type: 'object',
          title: 'Línies d\'horari',
          description: 'Una línia per dia o franja horària',
          fields: [
            {
              name: 'ca',
              type: 'array',
              title: 'Català',
              of: [{ type: 'string' }],
            },
            {
              name: 'es',
              type: 'array',
              title: 'Español',
              of: [{ type: 'string' }],
            },
            {
              name: 'en',
              type: 'array',
              title: 'English',
              of: [{ type: 'string' }],
            },
          ],
        },
        {
          name: 'emailLabel',
          type: 'object',
          title: 'Etiqueta Email',
          fields: [
            { name: 'ca', type: 'string', title: 'Català', initialValue: 'Correu electrònic' },
            { name: 'es', type: 'string', title: 'Español', initialValue: 'Correo electrónico' },
            { name: 'en', type: 'string', title: 'English', initialValue: 'Email' },
          ],
        },
        {
          name: 'phoneLabel',
          type: 'object',
          title: 'Etiqueta Telèfon',
          fields: [
            { name: 'ca', type: 'string', title: 'Català', initialValue: 'Telèfon' },
            { name: 'es', type: 'string', title: 'Español', initialValue: 'Teléfono' },
            { name: 'en', type: 'string', title: 'English', initialValue: 'Phone' },
          ],
        },
        {
          name: 'addressLabel',
          type: 'object',
          title: 'Etiqueta Adreça',
          fields: [
            { name: 'ca', type: 'string', title: 'Català', initialValue: 'Adreça' },
            { name: 'es', type: 'string', title: 'Español', initialValue: 'Dirección' },
            { name: 'en', type: 'string', title: 'English', initialValue: 'Address' },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contingut del Footer',
      }
    },
  },
})
