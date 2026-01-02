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
  const { id, type } = props
  const client = useClient({ apiVersion: '2024-01-01' })

  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'artist' | 'album' | 'confirm'>('artist')
  const [artistQuery, setArtistQuery] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [releases, setReleases] = useState<Release[]>([])
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null)
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

  const selectRelease = useCallback((release: Release) => {
    setSelectedRelease(release)
    setStep('confirm')
  }, [])

  const importAlbum = useCallback(async () => {
    if (!selectedArtist || !selectedRelease) return

    setImporting(true)
    try {
      // Upload cover image
      let coverImageAssetId: string | null = null
      if (selectedRelease.coverUrl) {
        try {
          const response = await fetch(selectedRelease.coverUrl)
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

      // Get document IDs
      const publishedId = id.startsWith('drafts.') ? id.replace('drafts.', '') : id
      const draftId = `drafts.${publishedId}`

      // Check if draft exists, if not create it
      const existingDraft = await client.getDocument(draftId)
      const existingPublished = await client.getDocument(publishedId)

      if (existingDraft || existingPublished) {
        // Build patch data with dot notation for nested fields
        const patchData: Record<string, unknown> = {
          title: selectedRelease.title,
          artist: selectedArtist.name,
          'links.musicbrainz': `https://musicbrainz.org/release-group/${selectedRelease.id}`,
        }

        if (selectedRelease.year) {
          patchData.year = selectedRelease.year
        }

        if (coverImageAssetId) {
          patchData.coverImage = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: coverImageAssetId,
            },
          }
        }

        // Patch existing document
        const targetId = existingDraft ? draftId : publishedId
        await client.patch(targetId).set(patchData).commit()
      } else {
        // Build create data with proper object structure
        const createData = {
          _id: draftId,
          _type: 'album' as const,
          title: selectedRelease.title,
          artist: selectedArtist.name,
          links: {
            musicbrainz: `https://musicbrainz.org/release-group/${selectedRelease.id}`,
          },
          year: selectedRelease.year || undefined,
          coverImage: coverImageAssetId ? {
            _type: 'image' as const,
            asset: {
              _type: 'reference' as const,
              _ref: coverImageAssetId,
            },
          } : undefined,
        }

        // Create new draft document
        await client.createOrReplace(createData)
      }

      // Close and refresh
      setIsOpen(false)
      window.location.reload()

    } catch (error) {
      console.error('Error importing album:', error)
    } finally {
      setImporting(false)
    }
  }, [client, id, selectedArtist, selectedRelease])

  const reset = useCallback(() => {
    setStep('artist')
    setArtistQuery('')
    setArtists([])
    setSelectedArtist(null)
    setReleases([])
    setSelectedRelease(null)
  }, [])

  const backToAlbums = useCallback(() => {
    setStep('album')
    setSelectedRelease(null)
  }, [])

  const getHeader = () => {
    switch (step) {
      case 'artist':
        return "1. Cerca l'artista"
      case 'album':
        return `2. Selecciona l'àlbum de ${selectedArtist?.name}`
      case 'confirm':
        return "3. Confirma la importació"
      default:
        return ''
    }
  }

  return {
    label: 'Importar de MusicBrainz',
    icon: DownloadIcon,
    onHandle: () => {
      setIsOpen(true)
    },
    dialog: isOpen ? {
      type: 'dialog',
      header: getHeader(),
      onClose: () => {
        setIsOpen(false)
        reset()
      },
      content: (
        <div style={{ padding: '1rem' }}>
          {/* Step 1: Search Artist */}
          {step === 'artist' && (
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
          )}

          {/* Step 2: Select Album */}
          {step === 'album' && (
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
                ← Tornar a cercar artista
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
                  gap: '0.75rem',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '0.5rem',
                }}>
                  {releases.map((release) => (
                    <button
                      key={release.id}
                      type="button"
                      onClick={() => selectRelease(release)}
                      style={{
                        cursor: 'pointer',
                        textAlign: 'center',
                        background: 'none',
                        border: '2px solid transparent',
                        borderRadius: '8px',
                        padding: '4px',
                        transition: 'border-color 0.2s',
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.borderColor = '#2276fc'
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.borderColor = 'transparent'
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
                          display: 'block',
                        }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-album.png'
                        }}
                      />
                      <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                        {release.title}
                        {release.year && ` (${release.year})`}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirm Import */}
          {step === 'confirm' && selectedRelease && selectedArtist && (
            <div>
              <button
                onClick={backToAlbums}
                disabled={importing}
                style={{
                  marginBottom: '1rem',
                  padding: '0.25rem 0.5rem',
                  background: 'none',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                ← Tornar a seleccionar àlbum
              </button>

              {/* Album Preview */}
              <div style={{
                display: 'flex',
                gap: '1.5rem',
                padding: '1rem',
                background: '#f5f5f5',
                borderRadius: '8px',
                marginBottom: '1.5rem',
              }}>
                <img
                  src={selectedRelease.coverUrl}
                  alt={selectedRelease.title}
                  style={{
                    width: '150px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-album.png'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>
                    {selectedRelease.title}
                  </h3>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                    <strong>Artista:</strong> {selectedArtist.name}
                  </p>
                  {selectedRelease.year && (
                    <p style={{ margin: '0 0 0.25rem 0', color: '#666' }}>
                      <strong>Any:</strong> {selectedRelease.year}
                    </p>
                  )}
                  <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: '#888' }}>
                    S&apos;importarà: títol, artista, any, portada i enllaç MusicBrainz
                  </p>
                </div>
              </div>

              {/* Import Button */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setIsOpen(false)
                    reset()
                  }}
                  disabled={importing}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: 'none',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel·lar
                </button>
                <button
                  onClick={importAlbum}
                  disabled={importing}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: importing ? '#ccc' : '#2276fc',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: importing ? 'wait' : 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {importing ? 'Importat...' : 'Importar dades'}
                </button>
              </div>
            </div>
          )}
        </div>
      ),
    } : null,
  }
}
