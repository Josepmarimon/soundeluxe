import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

/**
 * Gallery Page Configuration Schema
 * Settings and content for the gallery page
 */
export default defineType({
  name: 'galleryPage',
  title: 'Pàgina de Galeria',
  type: 'document',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Títol (H1)',
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
      name: 'subtitle',
      title: 'Subtítol',
      type: 'object',
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'string',
        },
        {
          name: 'es',
          title: 'Español',
          type: 'string',
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'intro',
      title: 'Text introductori',
      type: 'object',
      description: '2-3 frases sobre la galeria',
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'text',
          rows: 3,
        },
        {
          name: 'es',
          title: 'Español',
          type: 'text',
          rows: 3,
        },
        {
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 3,
        },
      ],
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA per compartir',
      type: 'object',
      description: 'Text animant a compartir amb hashtag',
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'text',
          rows: 2,
        },
        {
          name: 'es',
          title: 'Español',
          type: 'text',
          rows: 2,
        },
        {
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 2,
        },
      ],
    }),
    defineField({
      name: 'hashtag',
      title: 'Hashtag',
      type: 'string',
      description: 'Hashtag per compartir (sense #)',
      initialValue: 'SoundDeluxeBCN',
    }),
  ],
  preview: {
    select: {
      title: 'title.ca',
    },
    prepare(selection) {
      return {
        title: 'Configuració de Galeria',
        subtitle: selection.title,
      }
    },
  },
})
