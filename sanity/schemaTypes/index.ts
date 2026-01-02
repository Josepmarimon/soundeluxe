import { type SchemaTypeDefinition } from 'sanity'

// Custom types
import blockContent from './blockContent'
import experienceFeature from './experienceFeature'

// Document types
import album from './album'
import sala from './sala'
import sessionType from './sessionType'
import session from './session'
import homePage from './homePage'
import testimonial from './testimonial'
import galleryCategory from './galleryCategory'
import galleryImage from './galleryImage'
import galleryPage from './galleryPage'
import faqPage from './faqPage'
import siteSettings from './siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Custom types
    blockContent,
    experienceFeature,

    // Main documents
    album,
    sala,
    sessionType,
    session,
    homePage,
    testimonial,
    galleryCategory,
    galleryImage,
    galleryPage,
    faqPage,
    siteSettings,
  ],
}
