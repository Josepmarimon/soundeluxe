import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'

/**
 * Testimonial Schema
 * Customer reviews and testimonials for Sound Deluxe sessions
 */
export default defineType({
  name: 'testimonial',
  title: 'Testimonis',
  type: 'document',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      description: 'Nom complet del client',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'profession',
      title: 'Professió',
      type: 'string',
      description: 'Professió o ocupació',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      description: 'Foto del client (opcional)',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'rating',
      title: 'Puntuació',
      type: 'number',
      description: 'Estrelles (1-5)',
      validation: (Rule) => Rule.required().min(1).max(5),
      initialValue: 5,
      options: {
        list: [
          { title: '⭐', value: 1 },
          { title: '⭐⭐', value: 2 },
          { title: '⭐⭐⭐', value: 3 },
          { title: '⭐⭐⭐⭐', value: 4 },
          { title: '⭐⭐⭐⭐⭐', value: 5 },
        ],
      },
    }),
    defineField({
      name: 'quote',
      title: 'Testimoni',
      type: 'object',
      description: 'El testimoni en diferents idiomes (màx 50 paraules)',
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(300),
        },
        {
          name: 'es',
          title: 'Español',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(300),
        },
        {
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(300),
        },
      ],
    }),
    defineField({
      name: 'session',
      title: 'Sessió assistida',
      type: 'reference',
      to: [{ type: 'album' }],
      description: 'Àlbum de la sessió a la qual va assistir',
    }),
    defineField({
      name: 'sessionText',
      title: 'Text de sessió (alternatiu)',
      type: 'string',
      description: 'Si no hi ha referència a àlbum, escriu manualment (ex: "Kind of Blue — Miles Davis")',
    }),
    defineField({
      name: 'featured',
      title: 'Destacat',
      type: 'boolean',
      description: 'Mostrar a la pàgina principal',
      initialValue: true,
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
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'profession',
      rating: 'rating',
      media: 'photo',
      albumTitle: 'session.title',
      albumArtist: 'session.artist',
    },
    prepare(selection) {
      const { title, subtitle, rating, media, albumTitle, albumArtist } = selection
      const stars = '⭐'.repeat(rating || 5)
      return {
        title: `${title} ${stars}`,
        subtitle: albumTitle ? `${subtitle} · ${albumTitle} — ${albumArtist}` : subtitle,
        media: media,
      }
    },
  },
})
