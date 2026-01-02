'use client'

import { useState, useCallback } from 'react'
import { useClient } from 'sanity'
import { DownloadIcon } from '@sanity/icons'
import type { DocumentActionComponent } from 'sanity'

interface Artist {
  id: string
  name: string
  disambiguation?: string
  country?: string
}

interface Release {
  id: string
  title: string
  year: number | null
  coverUrl: string
}

export const importFromMusicBrainz: DocumentActionComponent = (props) => {
  const { id, type, published, draft } = props
  const client = useClient({ apiVersion: '2024-01-01' })

  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'artist' | 'album'>('artist')
  const [artistQuery, setArtistQuery] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)

  // Only show for album documents
  if (type !== 'album') {
    return null
  }

  const searchArtists = useCallback(async () => {
    if (artistQuery.length < 2) return

    setLoading(true)
    try {
      const response = await fetch(`/api/musicbrainz/artists?q=${encodeURIComponent(artistQuery)}`)
      const data = await response.json()
      setArtists(data.artists || [])
    } catch (error) {
      console.error('Error searching artists:', error)
    } finally {
      setLoading(false)
    }
  }, [artistQuery])

  const selectArtist = useCallback(async (artist: Artist) => {
    setSelectedArtist(artist)
    setStep('album')
    setLoading(true)

    try {
      const response = await fetch(`/api/musicbrainz/releases?artistId=${artist.id}`)
      const data = await response.json()
      setReleases(data.releases || [])
    } catch (error) {
      console.error('Error fetching releases:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const importAlbum = useCallback(async (release: Release) => {
    if (!selectedArtist) return

    setImporting(true)
    try {
      // Upload cover image
      let coverImageAssetId: string | null = null
      if (release.coverUrl) {
        try {
          const response = await fetch(release.coverUrl)
          if (response.ok) {
            const blob = await response.blob()
            const asset = await client.assets.upload('image', blob, {
              filename: 'album-cover.jpg',
            })
            coverImageAssetId = asset._id
          }
        } catch (e) {
          console.error('Error uploading cover:', e)
        }
      }

      // Build data
      const setData: Record<string, unknown> = {
        title: release.title,
        artist: selectedArtist.name,
        'links.musicbrainz': `https://musicbrainz.org/release-group/${release.id}`,
      }

      if (release.year) {
        setData.year = release.year
      }

      if (coverImageAssetId) {
        setData.coverImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: coverImageAssetId,
          },
        }
      }

      // Patch document
      const docId = id.startsWith('drafts.') ? id : `drafts.${id}`
      await client.patch(docId).set(setData).commit()

      // Close and refresh
      setIsOpen(false)
      window.location.reload()

    } catch (error) {
      console.error('Error importing album:', error)
    } finally {
      setImporting(false)
    }
  }, [client, id, selectedArtist])

  const reset = useCallback(() => {
    setStep('artist')
    setArtistQuery('')
    setArtists([])
    setSelectedArtist(null)
    setReleases([])
  }, [])

  return {
    label: 'Importar de MusicBrainz',
    icon: DownloadIcon,
    onHandle: () => {
      setIsOpen(true)
    },
    dialog: isOpen ? {
      type: 'dialog',
      header: step === 'artist' ? 'Cerca l\'artista' : `Àlbums de ${selectedArtist?.name}`,
      onClose: () => {
        setIsOpen(false)
        reset()
      },
      content: (
        <div style={{ padding: '1rem' }}>
          {step === 'artist' ? (
            <div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={artistQuery}
                  onChange={(e) => setArtistQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchArtists()}
                  placeholder="Nom de l'artista..."
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                <button
                  onClick={searchArtists}
                  disabled={loading || artistQuery.length < 2}
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#2276fc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  {loading ? 'Cercant...' : 'Cercar'}
                </button>
              </div>

              {artists.length > 0 && (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {artists.map((artist) => (
                    <div
                      key={artist.id}
                      onClick={() => selectArtist(artist)}
                      style={{
                        padding: '0.75rem',
                        borderBottom: '1px solid #eee',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 'bold' }}>{artist.name}</div>
                      {(artist.disambiguation || artist.country) && (
                        <div style={{ fontSize: '0.85rem', color: '#666' }}>
                          {[artist.disambiguation, artist.country].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <button
                onClick={reset}
                style={{
                  marginBottom: '1rem',
                  padding: '0.25rem 0.5rem',
                  background: 'none',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                ← Tornar a cercar
              </button>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Carregant àlbums...</div>
              ) : releases.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No s&apos;han trobat àlbums
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '0.5rem',
                  maxHeight: '400px',
                  overflowY: 'auto',
                }}>
                  {releases.map((release) => (
                    <div
                      key={release.id}
                      onClick={() => !importing && importAlbum(release)}
                      style={{
                        cursor: importing ? 'wait' : 'pointer',
                        opacity: importing ? 0.5 : 1,
                        textAlign: 'center',
                      }}
                    >
                      <img
                        src={release.coverUrl}
                        alt={release.title}
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          objectFit: 'cover',
                          borderRadius: '4px',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-album.png'
                        }}
                      />
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        {release.title}
                        {release.year && ` (${release.year})`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ),
    } : null,
  }
}
