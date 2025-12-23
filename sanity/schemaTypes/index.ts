import { type SchemaTypeDefinition } from 'sanity'

// Custom types
import blockContent from './blockContent'

// Document types
import album from './album'
import sala from './sala'
import sessionType from './sessionType'
import session from './session'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Custom types
    blockContent,

    // Main documents
    album,
    sala,
    sessionType,
    session,
  ],
}
