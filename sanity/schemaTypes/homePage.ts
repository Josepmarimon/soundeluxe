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
