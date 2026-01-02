import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Configuració del lloc',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'newsletter', title: 'Newsletter' },
  ],
  fields: [
    // Newsletter settings
    defineField({
      name: 'newsletterPaused',
      title: 'Newsletter pausat',
      type: 'boolean',
      description: 'Quan està activat, només els usuaris de test reben emails. Desactiva quan la web estigui llesta.',
      initialValue: true,
      group: 'newsletter',
    }),
    defineField({
      name: 'testEmails',
      title: 'Emails de test',
      type: 'array',
      description: 'Aquests emails rebran newsletters encara que estiguin pausats. Útil per testejar.',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'email',
              title: 'Email',
              type: 'string',
              validation: (Rule) => Rule.required().email(),
            },
            {
              name: 'name',
              title: 'Nom (opcional)',
              type: 'string',
            },
          ],
          preview: {
            select: {
              title: 'email',
              subtitle: 'name',
            },
          },
        },
      ],
      group: 'newsletter',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuració del lloc',
      }
    },
  },
})
