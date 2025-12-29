'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, Stack, Text, TextInput, TextArea, Button, Select, Flex, Badge, Box, Spinner } from '@sanity/ui'
import { SearchIcon, CheckmarkIcon, CloseIcon, EditIcon } from '@sanity/icons'

interface User {
  id: string
  name: string
  email: string
}

interface Suggestion {
  id: string
  artistName: string
  albumTitle: string
  coverUrl: string | null
  year: number | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ADDED'
  adminResponse: string | null
  adminNotes: string | null
  respondedAt: string | null
  respondedBy: string | null
  createdAt: string
  user: User
}

export default function SuggestionsTool() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [editingSuggestion, setEditingSuggestion] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<{
    status: string
    adminResponse: string
    adminNotes: string
  }>({
    status: '',
    adminResponse: '',
    adminNotes: '',
  })
  const [saving, setSaving] = useState(false)

  const fetchSuggestions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = filterStatus
        ? `/api/admin/suggestions?status=${filterStatus}`
        : '/api/admin/suggestions'
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('No tens permisos per accedir a aquesta secció')
        }
        throw new Error('Error carregant suggerències')
      }

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut')
    } finally {
      setLoading(false)
    }
  }, [filterStatus])

  useEffect(() => {
    fetchSuggestions()
  }, [fetchSuggestions])

  const handleEdit = (suggestion: Suggestion) => {
    setEditingSuggestion(suggestion.id)
    setEditForm({
      status: suggestion.status,
      adminResponse: suggestion.adminResponse || '',
      adminNotes: suggestion.adminNotes || '',
    })
  }

  const handleSave = async (id: string) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/suggestions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: editForm.status,
          adminResponse: editForm.adminResponse,
          adminNotes: editForm.adminNotes,
        }),
      })

      if (!response.ok) {
        throw new Error('Error guardant')
      }

      const data = await response.json()
      setSuggestions(prev =>
        prev.map(s => s.id === id ? data.suggestion : s)
      )
      setEditingSuggestion(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error guardant')
    } finally {
      setSaving(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors: Record<string, 'caution' | 'positive' | 'critical' | 'primary'> = {
      PENDING: 'caution',
      APPROVED: 'positive',
      REJECTED: 'critical',
      ADDED: 'primary',
    }
    const labels: Record<string, string> = {
      PENDING: 'Pendent',
      APPROVED: 'Aprovat',
      REJECTED: 'Rebutjat',
      ADDED: 'Afegit',
    }
    return <Badge tone={colors[status]}>{labels[status]}</Badge>
  }

  if (loading && suggestions.length === 0) {
    return (
      <Card padding={5}>
        <Flex justify="center" align="center" style={{ minHeight: '200px' }}>
          <Spinner />
        </Flex>
      </Card>
    )
  }

  if (error) {
    return (
      <Card padding={5} tone="critical">
        <Text>{error}</Text>
      </Card>
    )
  }

  return (
    <Card padding={4}>
      <Stack space={4}>
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Text size={4} weight="bold">
            Suggerències d&apos;Àlbums ({suggestions.length})
          </Text>
          <Flex gap={2} align="center">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.currentTarget.value)}
            >
              <option value="">Tots els estats</option>
              <option value="PENDING">Pendents</option>
              <option value="APPROVED">Aprovats</option>
              <option value="REJECTED">Rebutjats</option>
              <option value="ADDED">Afegits</option>
            </Select>
            <Button
              icon={SearchIcon}
              text="Actualitzar"
              onClick={fetchSuggestions}
              disabled={loading}
            />
          </Flex>
        </Flex>

        {/* Suggestions List */}
        {suggestions.length === 0 ? (
          <Card padding={5} tone="transparent">
            <Text align="center" muted>
              No hi ha suggerències{filterStatus ? ` amb estat "${filterStatus}"` : ''}
            </Text>
          </Card>
        ) : (
          <Stack space={3}>
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} padding={4} radius={2} shadow={1}>
                <Stack space={3}>
                  {/* Header row */}
                  <Flex justify="space-between" align="flex-start" wrap="wrap" gap={3}>
                    <Flex gap={3} align="flex-start">
                      {/* Cover */}
                      {suggestion.coverUrl && (
                        <Box
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 4,
                            overflow: 'hidden',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={suggestion.coverUrl}
                            alt={suggestion.albumTitle}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      )}
                      {/* Info */}
                      <Stack space={2}>
                        <Text size={2} weight="bold">
                          {suggestion.albumTitle}
                        </Text>
                        <Text size={1} muted>
                          {suggestion.artistName} {suggestion.year && `· ${suggestion.year}`}
                        </Text>
                        <Text size={0} muted>
                          Suggerit per: {suggestion.user.name} ({suggestion.user.email})
                        </Text>
                        <Text size={0} muted>
                          Data: {new Date(suggestion.createdAt).toLocaleDateString('ca-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </Text>
                      </Stack>
                    </Flex>
                    <Flex gap={2} align="center">
                      {getStatusBadge(suggestion.status)}
                      {editingSuggestion !== suggestion.id && (
                        <Button
                          icon={EditIcon}
                          mode="ghost"
                          onClick={() => handleEdit(suggestion)}
                        />
                      )}
                    </Flex>
                  </Flex>

                  {/* Edit Form */}
                  {editingSuggestion === suggestion.id && (
                    <Card padding={3} radius={2} tone="transparent" style={{ backgroundColor: 'var(--card-bg-color)' }}>
                      <Stack space={3}>
                        <Stack space={2}>
                          <Text size={1} weight="medium">Estat</Text>
                          <Select
                            value={editForm.status}
                            onChange={(e) => setEditForm(prev => ({ ...prev, status: e.currentTarget.value }))}
                          >
                            <option value="PENDING">Pendent</option>
                            <option value="APPROVED">Aprovat</option>
                            <option value="REJECTED">Rebutjat</option>
                            <option value="ADDED">Afegit al catàleg</option>
                          </Select>
                        </Stack>

                        <Stack space={2}>
                          <Text size={1} weight="medium">Resposta per a l&apos;usuari</Text>
                          <TextArea
                            value={editForm.adminResponse}
                            onChange={(e) => setEditForm(prev => ({ ...prev, adminResponse: e.currentTarget.value }))}
                            placeholder="Escriu un missatge que l'usuari podrà veure al seu perfil..."
                            rows={3}
                          />
                        </Stack>

                        <Stack space={2}>
                          <Text size={1} weight="medium">Notes internes (no visibles per l&apos;usuari)</Text>
                          <TextArea
                            value={editForm.adminNotes}
                            onChange={(e) => setEditForm(prev => ({ ...prev, adminNotes: e.currentTarget.value }))}
                            placeholder="Notes internes per a l'equip..."
                            rows={2}
                          />
                        </Stack>

                        <Flex gap={2} justify="flex-end">
                          <Button
                            icon={CloseIcon}
                            text="Cancel·lar"
                            mode="ghost"
                            onClick={() => setEditingSuggestion(null)}
                            disabled={saving}
                          />
                          <Button
                            icon={CheckmarkIcon}
                            text={saving ? 'Guardant...' : 'Guardar'}
                            tone="primary"
                            onClick={() => handleSave(suggestion.id)}
                            disabled={saving}
                          />
                        </Flex>
                      </Stack>
                    </Card>
                  )}

                  {/* Show existing response if not editing */}
                  {editingSuggestion !== suggestion.id && suggestion.adminResponse && (
                    <Card padding={3} radius={2} tone="positive">
                      <Stack space={2}>
                        <Text size={1} weight="medium">Resposta enviada:</Text>
                        <Text size={1} style={{ whiteSpace: 'pre-wrap' }}>
                          {suggestion.adminResponse}
                        </Text>
                        {suggestion.respondedAt && (
                          <Text size={0} muted>
                            Per {suggestion.respondedBy} el {new Date(suggestion.respondedAt).toLocaleDateString('ca-ES')}
                          </Text>
                        )}
                      </Stack>
                    </Card>
                  )}

                  {/* Show internal notes if not editing */}
                  {editingSuggestion !== suggestion.id && suggestion.adminNotes && (
                    <Card padding={3} radius={2} tone="caution">
                      <Stack space={2}>
                        <Text size={1} weight="medium">Notes internes:</Text>
                        <Text size={1} style={{ whiteSpace: 'pre-wrap' }}>
                          {suggestion.adminNotes}
                        </Text>
                      </Stack>
                    </Card>
                  )}
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  )
}
