import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

/**
 * Gallery Image Schema
 * Images for the Sound Deluxe gallery
 */
export default defineType({
  name: 'galleryImage',
  title: 'Imatges de Galeria',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Imatge',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Peu de foto',
      type: 'object',
      description: 'Text descriptiu de la imatge',
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
      name: 'category',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'galleryCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'session',
      title: 'Sessió relacionada',
      type: 'reference',
      to: [{ type: 'session' }],
      description: 'Si la foto és d\'una sessió específica',
    }),
    defineField({
      name: 'sala',
      title: 'Sala',
      type: 'reference',
      to: [{ type: 'sala' }],
      description: 'Si la foto és d\'una sala específica',
    }),
    defineField({
      name: 'date',
      title: 'Data',
      type: 'date',
      description: 'Data en què es va fer la foto',
    }),
    defineField({
      name: 'featured',
      title: 'Destacada',
      type: 'boolean',
      description: 'Mostrar en posició destacada',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: 'Ordre',
      type: 'number',
      description: 'Ordre de visualització (menor = primer)',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Ordre personalitzat',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Més recents',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      caption: 'caption.ca',
      category: 'category.name.ca',
      media: 'image',
      date: 'date',
    },
    prepare(selection) {
      const { caption, category, media, date } = selection
      return {
        title: caption || 'Sense peu de foto',
        subtitle: `${category || 'Sense categoria'}${date ? ` · ${date}` : ''}`,
        media: media,
      }
    },
  },
})
