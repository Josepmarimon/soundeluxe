import { defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  type: 'document',
  title: 'Home Page',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      initialValue: 'Home Page Configuration',
      hidden: true,
    },
    // Hero Section
    {
      name: 'heroTitle',
      type: 'object',
      title: 'Hero Title',
      fields: [
        {
          name: 'ca',
          type: 'string',
          title: 'Català',
          initialValue: 'Viu la música com mai abans',
        },
        {
          name: 'es',
          type: 'string',
          title: 'Español',
          initialValue: 'Vive la música como nunca antes',
        },
        {
          name: 'en',
          type: 'string',
          title: 'English',
          initialValue: 'Experience music like never before',
        },
      ],
    },
    {
      name: 'heroSubtitle',
      type: 'object',
      title: 'Hero Subtitle',
      fields: [
        {
          name: 'ca',
          type: 'text',
          title: 'Català',
          rows: 2,
          initialValue: 'Sessions exclusives d\'escoltes de vinils amb àudio d\'alta fidelitat en un espai acústicament perfecte',
        },
        {
          name: 'es',
          type: 'text',
          title: 'Español',
          rows: 2,
          initialValue: 'Sesiones exclusivas de escucha de vinilos con audio de alta fidelidad en un espacio acústicamente perfecto',
        },
        {
          name: 'en',
          type: 'text',
          title: 'English',
          rows: 2,
          initialValue: 'Exclusive vinyl listening sessions with high-fidelity audio in an acoustically perfect space',
        },
      ],
    },
    {
      name: 'heroCta',
      type: 'object',
      title: 'Hero Call to Action Button',
      fields: [
        {
          name: 'ca',
          type: 'string',
          title: 'Català',
          initialValue: 'Descobreix les sessions',
        },
        {
          name: 'es',
          type: 'string',
          title: 'Español',
          initialValue: 'Descubre las sesiones',
        },
        {
          name: 'en',
          type: 'string',
          title: 'English',
          initialValue: 'Discover sessions',
        },
      ],
    },
    {
      name: 'experienceTitle',
      type: 'object',
      title: 'Experience Section Title',
      fields: [
        {
          name: 'ca',
          type: 'string',
          title: 'Català',
          initialValue: 'Una experiència sonora inigualable',
        },
        {
          name: 'es',
          type: 'string',
          title: 'Español',
          initialValue: 'Una experiencia sonora inigualable',
        },
        {
          name: 'en',
          type: 'string',
          title: 'English',
          initialValue: 'An unmatched sonic experience',
        },
      ],
    },
    {
      name: 'experienceSubtitle',
      type: 'object',
      title: 'Experience Section Subtitle',
      fields: [
        {
          name: 'ca',
          type: 'string',
          title: 'Català',
          initialValue: 'Descobreix per què Sound Deluxe ofereix una autèntica experiència audiòfila',
        },
        {
          name: 'es',
          type: 'string',
          title: 'Español',
          initialValue: 'Descubre por qué Sound Deluxe ofrece una auténtica experiencia audiófila',
        },
        {
          name: 'en',
          type: 'string',
          title: 'English',
          initialValue: 'Discover why Sound Deluxe offers an authentic audiophile experience',
        },
      ],
    },
    {
      name: 'experienceFeatures',
      type: 'array',
      title: 'Experience Features',
      of: [{ type: 'experienceFeature' }],
      validation: (rule) => rule.required().max(4),
    },
  ],
})
