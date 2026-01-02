import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'legalPage',
  title: 'Pàgina Legal',
  type: 'document',
  icon: () => '📜',
  fields: [
    defineField({
      name: 'slug',
      title: 'Identificador (slug)',
      type: 'string',
      description: 'Identificador únic: privacy, terms, cookies',
      validation: (Rule) => Rule.required(),
      options: {
        list: [
          { title: 'Política de Privacitat', value: 'privacy' },
          { title: 'Termes i Condicions', value: 'terms' },
          { title: 'Política de Cookies', value: 'cookies' },
        ],
      },
    }),
    defineField({
      name: 'title',
      title: 'Títol',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        { name: 'ca', type: 'string', title: 'Català' },
        { name: 'es', type: 'string', title: 'Español' },
        { name: 'en', type: 'string', title: 'English' },
      ],
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Data d\'última actualització',
      type: 'date',
      options: {
        dateFormat: 'DD/MM/YYYY',
      },
    }),
    defineField({
      name: 'intro',
      title: 'Introducció',
      type: 'object',
      description: 'Text introductori opcional',
      fields: [
        { name: 'ca', type: 'text', title: 'Català', rows: 3 },
        { name: 'es', type: 'text', title: 'Español', rows: 3 },
        { name: 'en', type: 'text', title: 'English', rows: 3 },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Seccions',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          title: 'Secció',
          fields: [
            {
              name: 'title',
              title: 'Títol de la secció',
              type: 'object',
              fields: [
                { name: 'ca', type: 'string', title: 'Català' },
                { name: 'es', type: 'string', title: 'Español' },
                { name: 'en', type: 'string', title: 'English' },
              ],
            },
            {
              name: 'content',
              title: 'Contingut',
              type: 'object',
              fields: [
                { name: 'ca', type: 'blockContent', title: 'Català' },
                { name: 'es', type: 'blockContent', title: 'Español' },
                { name: 'en', type: 'blockContent', title: 'English' },
              ],
            },
          ],
          preview: {
            select: {
              title: 'title.ca',
            },
            prepare({ title }) {
              return {
                title: title || 'Secció sense títol',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contacte',
      type: 'string',
      description: 'Email per a consultes legals (ex: info@sounddeluxe.com)',
    }),
  ],
  preview: {
    select: {
      slug: 'slug',
      title: 'title.ca',
    },
    prepare({ slug, title }) {
      const titles: Record<string, string> = {
        privacy: 'Política de Privacitat',
        terms: 'Termes i Condicions',
        cookies: 'Política de Cookies',
      }
      return {
        title: title || titles[slug] || slug,
        subtitle: slug,
      }
    },
  },
})
