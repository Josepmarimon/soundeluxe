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
      salePrice,
      inStock,
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
      description,
      salePrice,
      inStock
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
      salePrice,
      inStock,
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
    description,
    salePrice,
    inStock
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
    salePrice,
    inStock,
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

// Get votable albums (albums without future scheduled sessions)
export const votableAlbumsQuery = groq`
  *[_type == "album"] {
    _id,
    title,
    artist,
    year,
    genre,
    coverImage,
    additionalImages,
    description,
    duration,
    salePrice,
    inStock,
    links,
    "hasFutureSessions": count(*[_type == "session" && isActive == true && date > now() && references(^._id)]) > 0
  } [hasFutureSessions == false] | order(year desc)
`

// Get home page configuration
export const homePageQuery = groq`
  *[_type == "homePage"][0] {
    _id,
    heroTitle,
    heroSubtitle,
    heroCta,
    heroBackgroundType,
    heroBackgroundImage,
    heroBackgroundVideo {
      asset->{
        url,
        _id
      }
    },
    experienceTitle,
    experienceSubtitle,
    experienceFeatures[] {
      title,
      description,
      image,
      icon
    }
  }
`
