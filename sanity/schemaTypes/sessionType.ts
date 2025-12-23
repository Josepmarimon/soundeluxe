import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

/**
 * Session Type Schema
 * Defines different types of listening sessions
 */
export default defineType({
  name: 'sessionType',
  title: 'Tipus de Sessió',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'key',
      title: 'Clau',
      type: 'string',
      description: 'Identificador únic del tipus (ex: standard, debate, conference, masterclass)',
      options: {
        list: [
          { title: 'Estàndard', value: 'standard' },
          { title: 'Amb Debat', value: 'debate' },
          { title: 'Amb Conferència', value: 'conference' },
          { title: 'Masterclass', value: 'masterclass' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'object',
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'es',
          title: 'Español',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descripció',
      type: 'object',
      description: 'Descripció breu del tipus de sessió',
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'text',
        },
        {
          name: 'es',
          title: 'Español',
          type: 'text',
        },
        {
          name: 'en',
          title: 'English',
          type: 'text',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name.ca',
      subtitle: 'key',
    },
    prepare(selection) {
      const { title, subtitle } = selection
      return {
        title: title || 'Sense nom',
        subtitle: subtitle,
      }
    },
  },
})
