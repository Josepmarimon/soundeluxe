import type { Image, PortableTextBlock } from 'sanity'

// Locale type
export type Locale = 'ca' | 'es' | 'en'

// Multilingual text fields
export interface MultilingualText {
  ca: string
  es: string
  en: string
}

export interface MultilingualRichText {
  ca: PortableTextBlock[]
  es: PortableTextBlock[]
  en: PortableTextBlock[]
}

// Album
export interface Album {
  _id: string
  title: string
  artist: string
  year: number
  genre: string
  coverImage: Image
  additionalImages?: Image[]
  description?: MultilingualRichText
  duration?: number
  recordLabel?: string
  awards?: MultilingualText
  links?: {
    spotify?: string
    appleMusic?: string
    youtube?: string
    musicbrainz?: string
    discogs?: string
  }
}

// Sala (Venue)
export interface Sala {
  _id: string
  name: MultilingualText
  address: {
    street: string
    city: string
    postalCode: string
    country: string
    googleMapsUrl?: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  capacity: number
  photos?: Image[]
  accessibility?: MultilingualText
  schedule?: MultilingualText
}

// Session Type
export interface SessionType {
  _id: string
  key: 'standard' | 'debate' | 'conference' | 'masterclass'
  name: MultilingualText
  description?: MultilingualText
}

// Session
export interface Session {
  _id: string
  date: string
  price: number
  totalPlaces: number
  vinylInfo?: MultilingualText
  specialNotes?: MultilingualText
  album: Album
  sala: Sala
  sessionType: SessionType
}

// Simplified session for list views
export interface SessionListItem {
  _id: string
  date: string
  price: number
  totalPlaces: number
  album: {
    _id: string
    title: string
    artist: string
    year: number
    genre: string
    coverImage: Image
    additionalImages?: Image[]
  }
  sala: {
    _id: string
    name: MultilingualText
  }
  sessionType: {
    _id: string
    key: string
    name: MultilingualText
  }
}

// Experience Feature
export interface ExperienceFeature {
  title: MultilingualText
  description: MultilingualText
  image: Image
  icon: string
}

// Home Page Configuration
export interface HomePage {
  _id: string
  heroTitle?: MultilingualText
  heroSubtitle?: MultilingualText
  heroCta?: MultilingualText
  heroBackgroundType?: 'image' | 'video' | 'none'
  heroBackgroundImage?: Image
  heroBackgroundVideo?: {
    asset: {
      url: string
      _id: string
    }
  }
  experienceTitle?: MultilingualText
  experienceSubtitle?: MultilingualText
  experienceFeatures?: ExperienceFeature[]
}
