import { defineField, defineType, defineArrayMember } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

/**
 * FAQ Page Schema
 * Manages FAQ questions and legal policies (cancellation, returns, etc.)
 */
export default defineType({
  name: 'faqPage',
  title: 'FAQ i Polítiques',
  type: 'document',
  icon: HelpCircleIcon,
  groups: [
    { name: 'general', title: 'General', default: true },
    { name: 'faqs', title: 'Preguntes Freqüents' },
    { name: 'policies', title: 'Polítiques Legals' },
  ],
  fields: [
    // Page Title
    defineField({
      name: 'title',
      title: 'Títol de la pàgina',
      type: 'object',
      group: 'general',
      validation: (Rule) => Rule.required(),
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'string',
          initialValue: 'Preguntes Freqüents',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'es',
          title: 'Español',
          type: 'string',
          initialValue: 'Preguntas Frecuentes',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
          initialValue: 'Frequently Asked Questions',
          validation: (Rule) => Rule.required(),
        },
      ],
    }),
    // Page Subtitle
    defineField({
      name: 'subtitle',
      title: 'Subtítol',
      type: 'object',
      group: 'general',
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'text',
          rows: 2,
          initialValue: 'Tot el que necessites saber sobre les nostres sessions i serveis',
        },
        {
          name: 'es',
          title: 'Español',
          type: 'text',
          rows: 2,
          initialValue: 'Todo lo que necesitas saber sobre nuestras sesiones y servicios',
        },
        {
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 2,
          initialValue: 'Everything you need to know about our sessions and services',
        },
      ],
    }),
    // FAQ Items
    defineField({
      name: 'faqs',
      title: 'Preguntes Freqüents',
      type: 'array',
      group: 'faqs',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'faqItem',
          title: 'Pregunta',
          fields: [
            {
              name: 'question',
              title: 'Pregunta',
              type: 'object',
              validation: (Rule) => Rule.required(),
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
            },
            {
              name: 'answer',
              title: 'Resposta',
              type: 'object',
              validation: (Rule) => Rule.required(),
              fields: [
                {
                  name: 'ca',
                  title: 'Català',
                  type: 'text',
                  rows: 4,
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'es',
                  title: 'Español',
                  type: 'text',
                  rows: 4,
                  validation: (Rule) => Rule.required(),
                },
                {
                  name: 'en',
                  title: 'English',
                  type: 'text',
                  rows: 4,
                  validation: (Rule) => Rule.required(),
                },
              ],
            },
            {
              name: 'category',
              title: 'Categoria',
              type: 'string',
              options: {
                list: [
                  { title: 'Sessions', value: 'sessions' },
                  { title: 'Reserves', value: 'booking' },
                  { title: 'Pagaments', value: 'payments' },
                  { title: 'Espai', value: 'venue' },
                  { title: 'Altres', value: 'other' },
                ],
              },
              initialValue: 'sessions',
            },
          ],
          preview: {
            select: {
              title: 'question.ca',
              category: 'category',
            },
            prepare({ title, category }) {
              const categoryLabels: Record<string, string> = {
                sessions: '🎵 Sessions',
                booking: '📅 Reserves',
                payments: '💳 Pagaments',
                venue: '🏠 Espai',
                other: '📝 Altres',
              }
              return {
                title: title || 'Nova pregunta',
                subtitle: categoryLabels[category] || category,
              }
            },
          },
        }),
      ],
    }),
    // Cancellation Policy Title
    defineField({
      name: 'cancellationTitle',
      title: "Títol de la secció de cancel·lació",
      type: 'object',
      group: 'policies',
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'string',
          initialValue: "Política de cancel·lació i devolucions",
        },
        {
          name: 'es',
          title: 'Español',
          type: 'string',
          initialValue: 'Política de cancelación y devoluciones',
        },
        {
          name: 'en',
          title: 'English',
          type: 'string',
          initialValue: 'Cancellation and Refund Policy',
        },
      ],
    }),
    // Cancellation Policy Content
    defineField({
      name: 'cancellationPolicy',
      title: "Contingut de la política de cancel·lació",
      type: 'object',
      group: 'policies',
      description: 'Text complet de la política de cancel·lació i devolucions',
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
    // Additional Legal Sections (array for flexibility)
    defineField({
      name: 'additionalPolicies',
      title: 'Seccions legals addicionals',
      type: 'array',
      group: 'policies',
      description: 'Afegeix més seccions legals si cal (termes d\'ús, normes, etc.)',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'policySection',
          title: 'Secció legal',
          fields: [
            {
              name: 'sectionTitle',
              title: 'Títol de la secció',
              type: 'object',
              validation: (Rule) => Rule.required(),
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
            },
            {
              name: 'content',
              title: 'Contingut',
              type: 'object',
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
            },
          ],
          preview: {
            select: {
              title: 'sectionTitle.ca',
            },
            prepare({ title }) {
              return {
                title: title || 'Nova secció',
              }
            },
          },
        }),
      ],
    }),
    // Contact for questions
    defineField({
      name: 'contactInfo',
      title: 'Informació de contacte',
      type: 'object',
      group: 'policies',
      description: 'Text que apareix al final amb informació de contacte',
      fields: [
        {
          name: 'ca',
          title: 'Català',
          type: 'text',
          rows: 2,
          initialValue: 'Si tens alguna pregunta addicional, no dubtis en contactar-nos a info@soundeluxe.com',
        },
        {
          name: 'es',
          title: 'Español',
          type: 'text',
          rows: 2,
          initialValue: 'Si tienes alguna pregunta adicional, no dudes en contactarnos en info@soundeluxe.com',
        },
        {
          name: 'en',
          title: 'English',
          type: 'text',
          rows: 2,
          initialValue: "If you have any additional questions, don't hesitate to contact us at info@soundeluxe.com",
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'FAQ i Polítiques',
        subtitle: 'Configuració de preguntes freqüents i polítiques legals',
      }
    },
  },
})
