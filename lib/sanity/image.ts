import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { dataset, projectId } from '@/sanity/env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlForImage = (source: Image | undefined) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined
  }

  return imageBuilder?.image(source).auto('format').fit('max')
}

export function resolveOpenGraphImage(image: Image | undefined, width = 1200, height = 627) {
  if (!image) return undefined
  const url = urlForImage(image)?.width(width).height(height).fit('crop').url()
  if (!url) return undefined
  return { url, alt: '', width, height }
}
