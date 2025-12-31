import { defineField, defineType } from 'sanity'
import { PlayIcon, ImageIcon, TagIcon, LinkIcon, SearchIcon } from '@sanity/icons'
import { MusicBrainzSearch } from '../components/MusicBrainzSearch'

/**
 * Album Schema
 * Represents a music album that can be played in listening sessions
 */
export default defineType({
  name: 'album',
  title: 'Àlbums',
  type: 'document',
  icon: PlayIcon,
  groups: [
    { name: 'search', title: '🔍 Cercar', icon: SearchIcon },
    { name: 'info', title: '🎵 Informació bàsica', default: true },
    { name: 'media', title: '🖼️ Imatges', icon: ImageIcon },
    { name: 'details', title: '📝 Detalls', icon: TagIcon },
    { name: 'shop', title: '🛒 Botiga' },
    { name: 'links', title: '🔗 Enllaços', icon: LinkIcon },
  ],
  fields: [
    // === CERCA MUSICBRAINZ ===
    defineField({
      name: 'musicbrainzSearch',
      title: 'Cerca a MusicBrainz',
      type: 'object',
      group: 'search',
      description: 'Cerca i importa dades d\'àlbum des de MusicBrainz automàticament',
      fields: [
        {
          name: 'placeholder',
          type: 'string',
          hidden: true,
        },
      ],
      components: {
        input: MusicBrainzSearch,
      },
    }),

    // === INFORMACIÓ BÀSICA ===
    defineField({
      name: 'title',
      title: 'Títol',
      type: 'string',
      description: 'Sempre en idioma original (ex: "The Dark Side of the Moon")',
      validation: (Rule) => Rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'artist',
      title: 'Artista',
      type: 'string',
      description: 'Nom de l\'artista o banda',
      validation: (Rule) => Rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'year',
      title: 'Any de llançament',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear() + 1),
      group: 'info',
    }),
    defineField({
      name: 'genre',
      title: 'Gènere',
      type: 'string',
      options: {
        list: [
          { title: 'Rock', value: 'rock' },
          { title: 'Jazz', value: 'jazz' },
          { title: 'Soul', value: 'soul' },
          { title: 'Clàssica', value: 'clasica' },
          { title: 'Electrònica', value: 'electronica' },
          { title: 'Pop', value: 'pop' },
          { title: 'Hip-Hop', value: 'hiphop' },
        ],
      },
      validation: (Rule) => Rule.required(),
      group: 'info',
    }),
    defineField({
      name: 'duration',
      title: 'Durada total (minuts)',
      type: 'number',
      description: 'Durada aproximada de l\'àlbum en minuts',
      group: 'info',
    }),

    // === IMATGES ===
    defineField({
      name: 'coverImage',
      title: 'Portada',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
      group: 'media',
    }),
    defineField({
      name: 'additionalImages',
      title: 'Imatges addicionals',
      type: 'array',
      description: 'Back cover, gatefold, interior, etc.',
      of: [{ type: 'image', options: { hotspot: true } }],
      group: 'media',
    }),

    // === DETALLS ===
    defineField({
      name: 'description',
      title: 'Descripció',
      type: 'object',
      description: 'Text editorial sobre l\'àlbum (història, context, etc.)',
      group: 'details',
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'blockContent',
        },
        {
          name: 'es',
          title: 'Español',
          type: 'blockContent',
        },
        {
          name: 'en',
          title: 'English',
          type: 'blockContent',
        },
      ],
    }),
    defineField({
      name: 'awards',
      title: 'Premis i reconeixements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Grammy, Hall of Fame, etc.',
      group: 'details',
    }),

    // === BOTIGA ===
    defineField({
      name: 'salePrice',
      title: 'Preu de venda (€)',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(500),
      description: 'Preu del disc per a la venda',
      group: 'shop',
    }),
    defineField({
      name: 'inStock',
      title: 'En stock',
      type: 'boolean',
      description: 'Indica si el disc està disponible per a la venda',
      initialValue: true,
      group: 'shop',
    }),

    // === ENLLAÇOS ===
    defineField({
      name: 'links',
      title: 'Enllaços externs',
      type: 'object',
      description: 'Enllaços a plataformes de música',
      group: 'links',
      fields: [
        {
          name: 'spotify',
          title: 'Spotify',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
        {
          name: 'appleMusic',
          title: 'Apple Music',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
        {
          name: 'youtube',
          title: 'YouTube',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
        {
          name: 'musicbrainz',
          title: 'MusicBrainz',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
        {
          name: 'discogs',
          title: 'Discogs',
          type: 'url',
          validation: (Rule) =>
            Rule.uri({
              scheme: ['http', 'https'],
            }),
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'artist',
      media: 'coverImage',
      year: 'year',
    },
    prepare(selection) {
      const { title, subtitle, media, year } = selection
      return {
        title: title,
        subtitle: `${subtitle} · ${year}`,
        media: media,
      }
    },
  },
})
