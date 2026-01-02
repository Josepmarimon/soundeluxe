import { createClient } from '@sanity/client'

import { apiVersion, dataset, projectId } from '@/sanity/env'

// Client with write permissions for mutations
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})
