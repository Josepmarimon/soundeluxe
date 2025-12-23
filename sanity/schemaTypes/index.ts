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
  ],
}
