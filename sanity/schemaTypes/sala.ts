import { defineField, defineType } from 'sanity'
import { HomeIcon, PinIcon, ImageIcon, UsersIcon, ClockIcon } from '@sanity/icons'

/**
 * Sala Schema
 * Represents a Hi-Fi listening room/venue
 */
export default defineType({
  name: 'sala',
  title: 'Sales Hi-Fi',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'info', title: '🏠 Informació bàsica', default: true },
    { name: 'location', title: '📍 Ubicació', icon: PinIcon },
    { name: 'media', title: '🖼️ Fotos', icon: ImageIcon },
    { name: 'access', title: '♿ Accessibilitat', icon: UsersIcon },
    { name: 'schedule', title: '🕐 Horaris', icon: ClockIcon },
  ],
  fields: [
    // === INFORMACIÓ BÀSICA ===
    defineField({
      name: 'name',
      title: 'Nom de la sala',
      type: 'object',
      validation: (Rule) => Rule.required(),
      group: 'info',
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
      name: 'capacity',
      title: 'Capacitat màxima',
      type: 'number',
      description: 'Nombre màxim de persones',
      validation: (Rule) => Rule.required().min(1).max(1000),
      group: 'info',
    }),

    // === UBICACIÓ ===
    defineField({
      name: 'address',
      title: 'Adreça',
      type: 'object',
      validation: (Rule) => Rule.required(),
      group: 'location',
      fields: [
        {
          name: 'street',
          title: 'Carrer i número',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'city',
          title: 'Ciutat',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'postalCode',
          title: 'Codi postal',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'country',
          title: 'País',
          type: 'string',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'googleMapsUrl',
          title: 'Google Maps URL',
          type: 'url',
          description: 'Enllaç directe a Google Maps',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
        {
          name: 'coordinates',
          title: 'Coordenades',
          type: 'geopoint',
          description: 'Ubicació exacta per mapes',
        },
      ],
    }),

    // === FOTOS ===
    defineField({
      name: 'photos',
      title: 'Fotos de la sala',
      type: 'array',
      group: 'media',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              title: 'Descripció',
              type: 'string',
              description: 'Descripció breu de la foto',
            },
          ],
        },
      ],
    }),

    // === ACCESSIBILITAT ===
    defineField({
      name: 'accessibility',
      title: 'Informació d\'accessibilitat',
      type: 'object',
      description: 'Cadira de rodes, ascensor, etc.',
      group: 'access',
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

    // === HORARIS ===
    defineField({
      name: 'schedule',
      title: 'Horaris',
      type: 'object',
      description: 'Horaris d\'obertura de la sala',
      group: 'schedule',
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
      subtitle: 'address.city',
      media: 'photos.0',
      capacity: 'capacity',
    },
    prepare(selection) {
      const { title, subtitle, media, capacity } = selection
      return {
        title: title || 'Sense nom',
        subtitle: `${subtitle} · ${capacity} places`,
        media: media,
      }
    },
  },
})
