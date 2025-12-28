import { defineField, defineType } from 'sanity'
import { TagIcon } from '@sanity/icons'

/**
 * Gallery Category Schema
 * Categories to filter gallery images
 */
export default defineType({
  name: 'galleryCategory',
  title: 'Categories de Galeria',
  type: 'document',
  icon: TagIcon,
  fields: [
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Identificador únic per filtrar',
      options: {
        source: 'name.ca',
        maxLength: 50,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Ordre',
      type: 'number',
      description: 'Ordre de visualització',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Ordre personalitzat',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name.ca',
      slug: 'slug.current',
    },
    prepare(selection) {
      const { title, slug } = selection
      return {
        title: title,
        subtitle: `/${slug}`,
      }
    },
  },
})
