import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'billingConfig',
  title: 'Facturació',
  type: 'document',
  fields: [
    defineField({
      name: 'companyName',
      title: 'Nom de l\'empresa',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nif',
      title: 'NIF / CIF',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'address',
      title: 'Adreça fiscal',
      type: 'object',
      fields: [
        defineField({
          name: 'street',
          title: 'Carrer i número',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'postalCode',
          title: 'Codi postal',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'city',
          title: 'Ciutat',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'province',
          title: 'Província',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'country',
          title: 'País',
          type: 'string',
          initialValue: 'España',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'email',
      title: 'Email de contacte',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'web',
      title: 'Web',
      type: 'string',
    }),
    defineField({
      name: 'vatRate',
      title: 'Tipus d\'IVA (%)',
      type: 'number',
      initialValue: 21,
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'invoiceSeries',
      title: 'Sèrie de facturació',
      type: 'string',
      description: 'Prefix per als números de factura (ex: SD)',
      initialValue: 'SD',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'companyName',
      subtitle: 'nif',
    },
  },
})
