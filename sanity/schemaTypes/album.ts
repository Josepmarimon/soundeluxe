import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

/**
 * Album Schema
 * Represents a music album that can be played in listening sessions
 */
export default defineType({
  name: 'album',
  title: 'Àlbums',
  type: 'document',
  icon: PlayIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Títol',
      type: 'string',
      description: 'Sempre en idioma original (ex: "The Dark Side of the Moon")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'artist',
      title: 'Artista',
      type: 'string',
      description: 'Nom de l\'artista o banda',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Any de llançament',
      type: 'number',
      validation: (Rule) => Rule.required().min(1900).max(new Date().getFullYear() + 1),
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
    }),
    defineField({
      name: 'coverImage',
      title: 'Portada',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'additionalImages',
      title: 'Imatges addicionals',
      type: 'array',
      description: 'Back cover, gatefold, interior, etc.',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'duration',
      title: 'Durada total (minuts)',
      type: 'number',
      description: 'Durada aproximada de l\'àlbum en minuts',
    }),
    defineField({
      name: 'description',
      title: 'Descripció',
      type: 'object',
      description: 'Text editorial sobre l\'àlbum (història, context, etc.)',
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
      name: 'links',
      title: 'Enllaços',
      type: 'object',
      description: 'Enllaços a plataformes de música',
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
    defineField({
      name: 'awards',
      title: 'Premis i reconeixements',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Grammy, Hall of Fame, etc.',
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
