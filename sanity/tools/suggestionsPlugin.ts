import { definePlugin } from 'sanity'
import { CommentIcon } from '@sanity/icons'
import SuggestionsTool from './SuggestionsTool'

export const suggestionsPlugin = definePlugin({
  name: 'suggestions-plugin',
  tools: [
    {
      name: 'suggestions',
      title: 'Suggerències',
      icon: CommentIcon,
      component: SuggestionsTool,
    },
  ],
})
