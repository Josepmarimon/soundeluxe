import { defineType, defineField } from 'sanity'

const multilingualText = (rows = 4) => ({
  type: 'object' as const,
  fields: [
    { name: 'ca', type: 'text' as const, title: 'Català', rows },
    { name: 'es', type: 'text' as const, title: 'Español', rows },
    { name: 'en', type: 'text' as const, title: 'English', rows },
  ],
})

const multilingualString = () => ({
  type: 'object' as const,
  fields: [
    { name: 'ca', type: 'string' as const, title: 'Català' },
    { name: 'es', type: 'string' as const, title: 'Español' },
    { name: 'en', type: 'string' as const, title: 'English' },
  ],
})

export default defineType({
  name: 'aboutPage',
  title: 'Pàgina Sobre nosaltres',
  type: 'document',
  icon: () => 'ℹ️',
  groups: [
    { name: 'header', title: 'Capçalera' },
    { name: 'sections', title: 'Seccions' },
    { name: 'cta', title: 'Crida a l\'acció' },
  ],
  fields: [
    // HEADER
    defineField({
      name: 'title',
      title: 'Títol de la pàgina',
      group: 'header',
      ...multilingualString(),
    }),
    defineField({
      name: 'intro',
      title: 'Introducció',
      group: 'header',
      ...multilingualText(3),
    }),

    // SECTIONS
    defineField({
      name: 'missionTitle',
      title: 'Títol secció Missió',
      group: 'sections',
      ...multilingualString(),
    }),
    defineField({
      name: 'missionText',
      title: 'Text secció Missió',
      group: 'sections',
      ...multilingualText(5),
    }),
    defineField({
      name: 'experienceTitle',
      title: 'Títol secció Experiència',
      group: 'sections',
      ...multilingualString(),
    }),
    defineField({
      name: 'experienceText',
      title: 'Text secció Experiència',
      group: 'sections',
      ...multilingualText(5),
    }),
    defineField({
      name: 'valuesTitle',
      title: 'Títol secció Valors',
      group: 'sections',
      ...multilingualString(),
    }),
    defineField({
      name: 'valuesList',
      title: 'Llista de valors',
      group: 'sections',
      type: 'object',
      fields: [
        {
          name: 'ca',
          type: 'array',
          title: 'Català',
          of: [{ type: 'string' }],
        },
        {
          name: 'es',
          type: 'array',
          title: 'Español',
          of: [{ type: 'string' }],
        },
        {
          name: 'en',
          type: 'array',
          title: 'English',
          of: [{ type: 'string' }],
        },
      ],
    }),

    // CTA
    defineField({
      name: 'ctaTitle',
      title: 'Títol del CTA',
      group: 'cta',
      ...multilingualString(),
    }),
    defineField({
      name: 'ctaText',
      title: 'Text del CTA',
      group: 'cta',
      ...multilingualText(2),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Pàgina Sobre nosaltres',
      }
    },
  },
})
