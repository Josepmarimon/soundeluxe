'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, Stack, Text, TextInput, Button, Flex, Box, Spinner, Grid } from '@sanity/ui'
import { SearchIcon, CloseIcon, CheckmarkIcon } from '@sanity/icons'
import { useFormValue, useClient } from 'sanity'
import type { ObjectInputProps } from 'sanity'

interface Artist {
  id: string
  name: string
  sortName: string
  disambiguation?: string
  country?: string
}

interface Release {
  id: string
  title: string
  year: number | null
  releaseDate: string | null
  coverUrl: string
}

export function MusicBrainzSearch(props: ObjectInputProps) {
  const client = useClient({ apiVersion: '2024-01-01' })

  // Get document ID - extract from props
  const documentId = useFormValue(['_id']) as string | undefined

  // Get current form values
  const currentTitle = useFormValue(['title']) as string | undefined
  const currentArtist = useFormValue(['artist']) as string | undefined

  // Artist search state
  const [artistQuery, setArtistQuery] = useState('')
  const [artists, setArtists] = useState<Artist[]>([])
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null)
  const [showArtistDropdown, setShowArtistDropdown] = useState(false)
  const [loadingArtists, setLoadingArtists] = useState(false)

  // Releases state
  const [releases, setReleases] = useState<Release[]>([])
  const [loadingReleases, setLoadingReleases] = useState(false)
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null)

  // UI state
  const [isExpanded, setIsExpanded] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [applySuccess, setApplySuccess] = useState(false)
  const [applyError, setApplyError] = useState<string | null>(null)

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced artist search
  const searchArtists = useCallback(async (query: string) => {
    if (query.length < 2) {
      setArtists([])
      return
    }

    setLoadingArtists(true)
    try {
      const response = await fetch(`/api/musicbrainz/artists?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setArtists(data.artists || [])
    } catch (error) {
      console.error('Error searching artists:', error)
      setArtists([])
    } finally {
      setLoadingArtists(false)
    }
  }, [])

  // Handle artist query change with debounce
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (artistQuery.length >= 2 && !selectedArtist) {
      debounceRef.current = setTimeout(() => {
        searchArtists(artistQuery)
      }, 300)
    } else {
      setArtists([])
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [artistQuery, selectedArtist, searchArtists])

  // Fetch releases when artist is selected
  useEffect(() => {
    if (!selectedArtist) {
      setReleases([])
      return
    }

    const fetchReleases = async () => {
      setLoadingReleases(true)
      try {
        const response = await fetch(`/api/musicbrainz/releases?artistId=${selectedArtist.id}`)
        const data = await response.json()
        setReleases(data.releases || [])
      } catch (error) {
        console.error('Error fetching releases:', error)
        setReleases([])
      } finally {
        setLoadingReleases(false)
      }
    }

    fetchReleases()
  }, [selectedArtist])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowArtistDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle artist selection
  const handleSelectArtist = (artist: Artist) => {
    setSelectedArtist(artist)
    setArtistQuery(artist.name)
    setShowArtistDropdown(false)
    setSelectedRelease(null)
  }

  // Clear selection
  const handleClearArtist = () => {
    setSelectedArtist(null)
    setArtistQuery('')
    setReleases([])
    setSelectedRelease(null)
  }

  // Upload image from URL to Sanity
  const uploadImageFromUrl = async (imageUrl: string): Promise<string | null> => {
    try {
      // Fetch the image through our API to avoid CORS issues
      const response = await fetch(imageUrl)
      if (!response.ok) return null

      const blob = await response.blob()

      // Upload to Sanity
      const asset = await client.assets.upload('image', blob, {
        filename: 'album-cover.jpg',
      })

      return asset._id
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  // Apply selected album to form
  const handleApplyAlbum = async () => {
    if (!selectedArtist || !selectedRelease || !documentId) return

    setIsApplying(true)
    setApplySuccess(false)
    setApplyError(null)

    try {
      // Upload cover image if available
      let coverImageAssetId: string | null = null
      if (selectedRelease.coverUrl) {
        coverImageAssetId = await uploadImageFromUrl(selectedRelease.coverUrl)
      }

      // Build the set object
      const setData: Record<string, unknown> = {
        title: selectedRelease.title,
        artist: selectedArtist.name,
        'links.musicbrainz': `https://musicbrainz.org/release-group/${selectedRelease.id}`,
      }

      if (selectedRelease.year) {
        setData.year = selectedRelease.year
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

      // Get the correct document ID (with drafts. prefix if needed)
      const patchId = documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`

      // Apply the patch using Sanity client
      await client.patch(patchId).set(setData).commit()

      setApplySuccess(true)

      // Reset after success
      setTimeout(() => {
        setIsExpanded(false)
        setApplySuccess(false)
        handleClearArtist()
        // Refresh the page to show updated data
        window.location.reload()
      }, 1500)

    } catch (error) {
      console.error('Error applying album:', error)
      setApplyError(error instanceof Error ? error.message : 'Error aplicant les dades')
    } finally {
      setIsApplying(false)
    }
  }

  // Collapsed state - show button
  if (!isExpanded) {
    return (
      <Card padding={3} radius={2} tone="primary" border>
        <Flex justify="space-between" align="center">
          <Stack space={2}>
            <Text size={1} weight="semibold">Cerca a MusicBrainz</Text>
            <Text size={1} muted>
              {currentTitle && currentArtist
                ? `Actual: ${currentTitle} - ${currentArtist}`
                : 'Cerca i importa dades d\'àlbum automàticament'}
            </Text>
          </Stack>
          <Button
            icon={SearchIcon}
            text="Cercar àlbum"
            tone="primary"
            onClick={() => setIsExpanded(true)}
          />
        </Flex>
      </Card>
    )
  }

  // Expanded state - show search interface
  return (
    <Card padding={4} radius={2} tone="primary" border>
      <Stack space={4}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text size={2} weight="bold">Cerca a MusicBrainz</Text>
          <Button
            icon={CloseIcon}
            mode="ghost"
            onClick={() => {
              setIsExpanded(false)
              handleClearArtist()
            }}
          />
        </Flex>

        {/* Success message */}
        {applySuccess && (
          <Card padding={3} radius={2} tone="positive">
            <Flex gap={2} align="center">
              <CheckmarkIcon />
              <Text size={1}>Dades aplicades correctament!</Text>
            </Flex>
          </Card>
        )}

        {/* Error message */}
        {applyError && (
          <Card padding={3} radius={2} tone="critical">
            <Text size={1}>{applyError}</Text>
          </Card>
        )}

        {/* Artist search */}
        <Stack space={2}>
          <Text size={1} weight="medium">1. Cerca l&apos;artista</Text>
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <TextInput
              value={artistQuery}
              onChange={(e) => {
                setArtistQuery(e.currentTarget.value)
                if (selectedArtist) {
                  setSelectedArtist(null)
                  setReleases([])
                  setSelectedRelease(null)
                }
                setShowArtistDropdown(true)
              }}
              onFocus={() => {
                if (artistQuery.length >= 2 && !selectedArtist) {
                  setShowArtistDropdown(true)
                }
              }}
              placeholder="Escriu el nom de l'artista..."
              disabled={loadingArtists}
            />

            {/* Clear button */}
            {selectedArtist && (
              <Button
                icon={CloseIcon}
                mode="ghost"
                onClick={handleClearArtist}
                style={{
                  position: 'absolute',
                  right: 4,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
            )}

            {/* Loading indicator */}
            {loadingArtists && (
              <Box style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
                <Spinner />
              </Box>
            )}

            {/* Artist dropdown */}
            {showArtistDropdown && artists.length > 0 && !selectedArtist && (
              <Card
                shadow={2}
                radius={2}
                style={{
                  position: 'absolute',
                  zIndex: 100,
                  width: '100%',
                  marginTop: 4,
                  maxHeight: 250,
                  overflowY: 'auto',
                }}
              >
                <Stack>
                  {artists.map((artist) => (
                    <Card
                      key={artist.id}
                      padding={3}
                      as="button"
                      style={{ cursor: 'pointer', border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                      onClick={() => handleSelectArtist(artist)}
                    >
                      <Stack space={1}>
                        <Text size={1} weight="medium">{artist.name}</Text>
                        {(artist.disambiguation || artist.country) && (
                          <Text size={0} muted>
                            {[artist.disambiguation, artist.country].filter(Boolean).join(' · ')}
                          </Text>
                        )}
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              </Card>
            )}
          </div>
        </Stack>

        {/* Album selection */}
        {selectedArtist && (
          <Stack space={2}>
            <Text size={1} weight="medium">2. Selecciona l&apos;àlbum</Text>

            {loadingReleases ? (
              <Flex justify="center" padding={4}>
                <Spinner />
              </Flex>
            ) : releases.length === 0 ? (
              <Card padding={4} tone="transparent">
                <Text size={1} align="center" muted>
                  No s&apos;han trobat àlbums
                </Text>
              </Card>
            ) : (
              <Grid columns={[3, 4, 5, 6]} gap={2}>
                {releases.map((release) => (
                  <Card
                    key={release.id}
                    padding={0}
                    radius={2}
                    as="button"
                    tone={selectedRelease?.id === release.id ? 'primary' : 'default'}
                    style={{
                      cursor: 'pointer',
                      border: selectedRelease?.id === release.id ? '2px solid var(--card-focus-ring-color)' : '1px solid var(--card-border-color)',
                      background: 'none',
                      overflow: 'hidden',
                      aspectRatio: '1',
                      position: 'relative',
                    }}
                    onClick={() => setSelectedRelease(release)}
                  >
                    <img
                      src={release.coverUrl}
                      alt={release.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-album.png'
                      }}
                    />
                    {/* Selected indicator */}
                    {selectedRelease?.id === release.id && (
                      <Box
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          background: 'var(--card-focus-ring-color)',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CheckmarkIcon style={{ color: 'white', fontSize: 12 }} />
                      </Box>
                    )}
                  </Card>
                ))}
              </Grid>
            )}
          </Stack>
        )}

        {/* Selected album preview */}
        {selectedRelease && (
          <Card padding={3} radius={2} tone="positive">
            <Flex gap={3} align="center">
              <Box style={{ width: 50, height: 50, borderRadius: 4, overflow: 'hidden', flexShrink: 0 }}>
                <img
                  src={selectedRelease.coverUrl}
                  alt={selectedRelease.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
              <Stack space={1}>
                <Text size={1} weight="bold">{selectedRelease.title}</Text>
                <Text size={1} muted>
                  {selectedArtist?.name} {selectedRelease.year && `· ${selectedRelease.year}`}
                </Text>
              </Stack>
            </Flex>
          </Card>
        )}

        {/* Apply button */}
        <Flex justify="flex-end" gap={2}>
          <Button
            text="Cancel·lar"
            mode="ghost"
            onClick={() => {
              setIsExpanded(false)
              handleClearArtist()
            }}
          />
          <Button
            icon={isApplying ? undefined : CheckmarkIcon}
            text={isApplying ? 'Aplicant...' : 'Aplicar dades'}
            tone="primary"
            disabled={!selectedArtist || !selectedRelease || isApplying || !documentId}
            onClick={handleApplyAlbum}
          />
        </Flex>
      </Stack>
    </Card>
  )
}
