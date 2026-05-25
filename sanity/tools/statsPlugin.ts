import { definePlugin } from 'sanity'
import { TrendUpwardIcon } from '@sanity/icons'
import StatsTool from './StatsTool'

export const statsPlugin = definePlugin({
  name: 'stats-plugin',
  tools: [
    {
      name: 'stats',
      title: 'Estadístiques',
      icon: TrendUpwardIcon,
      component: StatsTool,
    },
  ],
})
