import { definePlugin } from 'sanity'
import { EnvelopeIcon } from '@sanity/icons'
import SubscribersTool from './SubscribersTool'

export const subscribersPlugin = definePlugin({
  name: 'subscribers-plugin',
  tools: [
    {
      name: 'subscribers',
      title: 'Subscriptors',
      icon: EnvelopeIcon,
      component: SubscribersTool,
    },
  ],
})
