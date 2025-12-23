import { groq } from 'next-sanity'

// Get all active sessions with album, sala, and sessionType details
export const sessionsQuery = groq`
  *[_type == "session" && isActive == true] | order(date asc) {
    _id,
    date,
    price,
    totalPlaces,
    vinylInfo,
    specialNotes,
    album->{
      _id,
      title,
      artist,
      year,
      genre,
      coverImage,
      additionalImages,
      description,
      duration,
      recordLabel,
      awards,
      links
    },
    sala->{
      _id,
      name,
      address,
      capacity,
      photos,
      accessibility,
      schedule
    },
    sessionType->{
      _id,
      key,
      name,
      description
    }
  }
`

// Get upcoming sessions (future dates only)
export const upcomingSessionsQuery = groq`
  *[_type == "session" && isActive == true && date > now()] | order(date asc) {
    _id,
    date,
    price,
    totalPlaces,
    vinylInfo,
    specialNotes,
    album->{
      _id,
      title,
      artist,
      year,
      genre,
      coverImage,
      additionalImages,
      description
    },
    sala->{
      _id,
      name,
      address
    },
    sessionType->{
      _id,
      key,
      name
    }
  }
`

// Get single session by ID
export const sessionByIdQuery = groq`
  *[_type == "session" && _id == $id][0] {
    _id,
    date,
    price,
    totalPlaces,
    vinylInfo,
    specialNotes,
    album->{
      _id,
      title,
      artist,
      year,
      genre,
      coverImage,
      additionalImages,
      description,
      duration,
      recordLabel,
      awards,
      links
    },
    sala->{
      _id,
      name,
      address,
      capacity,
      photos,
      accessibility,
      schedule
    },
    sessionType->{
      _id,
      key,
      name,
      description
    }
  }
`

// Get all albums
export const albumsQuery = groq`
  *[_type == "album"] | order(year desc) {
    _id,
    title,
    artist,
    year,
    genre,
    coverImage,
    additionalImages,
    description
  }
`

// Get single album by ID
export const albumByIdQuery = groq`
  *[_type == "album" && _id == $id][0] {
    _id,
    title,
    artist,
    year,
    genre,
    coverImage,
    additionalImages,
    description,
    duration,
    recordLabel,
    awards,
    links
  }
`

// Get all salas (venues)
export const salasQuery = groq`
  *[_type == "sala"] {
    _id,
    name,
    address,
    capacity,
    photos,
    accessibility,
    schedule
  }
`

// Get all session types
export const sessionTypesQuery = groq`
  *[_type == "sessionType"] {
    _id,
    key,
    name,
    description
  }
`

// Get unique genres from albums
export const genresQuery = groq`
  *[_type == "album"] | order(genre asc) {
    "value": genre
  } | {
    "genres": array::unique([].value)
  }[0]
`

// Get unique artists from albums
export const artistsQuery = groq`
  *[_type == "album"] | order(artist asc) {
    "value": artist
  } | {
    "artists": array::unique([].value)
  }[0]
`
