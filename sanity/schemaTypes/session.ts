import { defineField, defineType } from 'sanity'
import { CalendarIcon } from '@sanity/icons'

/**
 * Session Schema
 * Represents a specific listening session with date, album, venue, and pricing
 */
export default defineType({
  name: 'session',
  title: 'Sessions',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'album',
      title: 'Àlbum',
      type: 'reference',
      to: [{ type: 'album' }],
      validation: (Rule) => Rule.required(),
      description: 'Àlbum que es reproduirà en aquesta sessió',
    }),
    defineField({
      name: 'sala',
      title: 'Sala',
      type: 'reference',
      to: [{ type: 'sala' }],
      validation: (Rule) => Rule.required(),
      description: 'Sala on es farà la sessió',
    }),
    defineField({
      name: 'sessionType',
      title: 'Tipus de Sessió',
      type: 'reference',
      to: [{ type: 'sessionType' }],
      validation: (Rule) => Rule.required(),
      description: 'Tipus de sessió (estàndard, debat, conferència, masterclass)',
    }),
    defineField({
      name: 'date',
      title: 'Data i hora',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
      description: 'Data i hora de la sessió',
      options: {
        dateFormat: 'DD-MM-YYYY',
        timeFormat: 'HH:mm',
        timeStep: 15,
      },
    }),
    defineField({
      name: 'price',
      title: 'Preu (€)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0).max(1000),
      description: 'Preu per plaça en euros',
      initialValue: 15,
    }),
    defineField({
      name: 'totalPlaces',
      title: 'Places totals',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(100),
      description: 'Nombre total de places disponibles',
    }),
    defineField({
      name: 'vinylInfo',
      title: 'Informació del vinil',
      type: 'object',
      description: 'Detalls sobre el vinil que es reproduirà',
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'string',
          placeholder: 'Ex: Vinilo Original Motown',
        },
        {
          name: 'es',
          title: 'Español',
          type: 'string',
          placeholder: 'Ej: Vinilo Original Motown',
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
          placeholder: 'Ex: Original Motown Vinyl',
        },
      ],
    }),
    defineField({
      name: 'specialNotes',
      title: 'Notes especials',
      type: 'object',
      description: 'Informació addicional sobre la sessió',
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
    defineField({
      name: 'isActive',
      title: 'Sessió activa',
      type: 'boolean',
      description: 'Marcar com inactiva per ocultar-la del frontend',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      albumTitle: 'album.title',
      albumArtist: 'album.artist',
      albumCover: 'album.coverImage',
      date: 'date',
      sala: 'sala.name.ca',
      price: 'price',
    },
    prepare(selection) {
      const { albumTitle, albumArtist, albumCover, date, sala, price } = selection
      const dateObj = new Date(date)
      const formattedDate = dateObj.toLocaleDateString('ca-ES', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
      return {
        title: `${albumTitle} - ${albumArtist}`,
        subtitle: `${formattedDate} · ${sala} · ${price}€`,
        media: albumCover,
      }
    },
  },
  orderings: [
    {
      title: 'Data (més recent primer)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
    {
      title: 'Data (més antic primer)',
      name: 'dateAsc',
      by: [{ field: 'date', direction: 'asc' }],
    },
  ],
})
