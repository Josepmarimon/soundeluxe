import { defineType } from 'sanity'

export default defineType({
  name: 'experienceFeature',
  type: 'object',
  title: 'Experience Feature',
  fields: [
    {
      name: 'title',
      type: 'object',
      title: 'Title',
      fields: [
        {
          name: 'ca',
          type: 'string',
          title: 'Català',
          validation: (rule) => rule.required(),
        },
        {
          name: 'es',
          type: 'string',
          title: 'Español',
          validation: (rule) => rule.required(),
        },
        {
          name: 'en',
          type: 'string',
          title: 'English',
          validation: (rule) => rule.required(),
        },
      ],
    },
    {
      name: 'description',
      type: 'object',
      title: 'Description',
      fields: [
        {
          name: 'ca',
          type: 'text',
          title: 'Català',
          validation: (rule) => rule.required(),
        },
        {
          name: 'es',
          type: 'text',
          title: 'Español',
          validation: (rule) => rule.required(),
        },
        {
          name: 'en',
          type: 'text',
          title: 'English',
          validation: (rule) => rule.required(),
        },
      ],
    },
    {
      name: 'image',
      type: 'image',
      title: 'Image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    },
    {
      name: 'icon',
      type: 'string',
      title: 'Icon',
      description: 'SVG path data for the icon',
      validation: (rule) => rule.required(),
    },
  ],
  preview: {
    select: {
      title: 'title.ca',
      media: 'image',
    },
  },
})
