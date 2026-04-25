'use client'

import { useState } from 'react'
import AlbumCatalog from '@/components/AlbumCatalog'
import AlbumSuggestionForm from '@/components/AlbumSuggestionForm'
import type { Album } from '@/lib/sanity/types'

interface Props {
  albums: Album[]
  genres: string[]
  artists: string[]
}

export default function VotesCatalogWithSuggestion({ albums, genres, artists }: Props) {
  const [isFormActive, setIsFormActive] = useState(false)

  return (
    <div
      className={`grid grid-cols-1 gap-8 mb-16 transition-[grid-template-columns] duration-500 ease-in-out ${
        isFormActive ? 'lg:grid-cols-[1fr_1fr]' : 'lg:grid-cols-[3fr_1fr]'
      }`}
    >
      <div className="min-w-0">
        <AlbumCatalog
          albums={albums}
          genres={genres}
          artists={artists}
          showVoteButton={true}
          hideArtistSearch={true}
        />
      </div>
      <aside className="min-w-0">
        <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
          <AlbumSuggestionForm onActiveChange={setIsFormActive} />
        </div>
      </aside>
    </div>
  )
}
