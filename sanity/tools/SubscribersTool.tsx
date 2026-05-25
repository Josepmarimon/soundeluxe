'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Card,
  Stack,
  Text,
  TextInput,
  Button,
  Select,
  Flex,
  Badge,
  Spinner,
  Grid,
} from '@sanity/ui'
import { SearchIcon, DownloadIcon, RefreshIcon } from '@sanity/icons'

type SubscriberStatus = 'CONFIRMED' | 'PENDING' | 'UNSUBSCRIBED'
type SubscriberSource = 'ANONYMOUS' | 'USER'

interface Subscriber {
  id: string
  source: SubscriberSource
  email: string
  name: string | null
  language: string
  status: SubscriberStatus
  confirmedAt: string | null
  unsubscribedAt: string | null
  createdAt: string
  isTestUser?: boolean
}

interface Stats {
  total: number
  confirmed: number
  pending: number
  unsubscribed: number
  anonymous: number
  users: number
}

const STATUS_LABELS: Record<SubscriberStatus, string> = {
  CONFIRMED: 'Confirmat',
  PENDING: 'Pendent',
  UNSUBSCRIBED: 'Baixa',
}

const STATUS_TONES: Record<SubscriberStatus, 'positive' | 'caution' | 'critical'> = {
  CONFIRMED: 'positive',
  PENDING: 'caution',
  UNSUBSCRIBED: 'critical',
}

const SOURCE_LABELS: Record<SubscriberSource, string> = {
  ANONYMOUS: 'Anònim',
  USER: 'Registrat',
}

function formatDate(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('ca-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function toCSV(rows: Subscriber[]): string {
  const header = [
    'email',
    'nom',
    'idioma',
    'estat',
    'origen',
    'confirmat',
    'baixa',
    'creat',
  ]
  const lines = rows.map((s) =>
    [
      s.email,
      s.name ?? '',
      s.language,
      STATUS_LABELS[s.status],
      SOURCE_LABELS[s.source],
      s.confirmedAt ?? '',
      s.unsubscribedAt ?? '',
      s.createdAt,
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )
  return [header.join(','), ...lines].join('\n')
}

export default function SubscribersTool() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterSource, setFilterSource] = useState<string>('')
  const [search, setSearch] = useState('')

  const fetchSubscribers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const url = filterStatus
        ? `/api/admin/newsletter-subscribers?status=${filterStatus}`
        : '/api/admin/newsletter-subscribers'
      const response = await fetch(url)

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Has d\'iniciar sessió com a admin a la web per veure els subscriptors')
        }
        if (response.status === 403) {
          throw new Error('No tens permisos per accedir a aquesta secció')
        }
        throw new Error('Error carregant subscriptors')
      }

      const data = await response.json()
      setSubscribers(data.subscribers || [])
      setStats(data.stats || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut')
    } finally {
      setLoading(false)
    }
  }, [filterStatus])

  useEffect(() => {
    fetchSubscribers()
  }, [fetchSubscribers])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return subscribers.filter((s) => {
      if (filterSource && s.source !== filterSource) return false
      if (!q) return true
      return (
        s.email.toLowerCase().includes(q) ||
        (s.name ?? '').toLowerCase().includes(q)
      )
    })
  }, [subscribers, search, filterSource])

  const handleExport = () => {
    const csv = toCSV(filtered)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `subscriptors-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading && subscribers.length === 0) {
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
        <Stack space={3}>
          <Text>{error}</Text>
          <Button text="Tornar a provar" onClick={fetchSubscribers} />
        </Stack>
      </Card>
    )
  }

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          <Text size={4} weight="bold">
            Subscriptors del Newsletter ({filtered.length})
          </Text>
          <Flex gap={2} align="center">
            <Button
              icon={DownloadIcon}
              text="Exportar CSV"
              mode="ghost"
              onClick={handleExport}
              disabled={filtered.length === 0}
            />
            <Button
              icon={RefreshIcon}
              text="Actualitzar"
              onClick={fetchSubscribers}
              disabled={loading}
            />
          </Flex>
        </Flex>

        {stats && (
          <Grid columns={[2, 3, 6]} gap={2}>
            <StatCard label="Total" value={stats.total} />
            <StatCard label="Confirmats" value={stats.confirmed} tone="positive" />
            <StatCard label="Pendents" value={stats.pending} tone="caution" />
            <StatCard label="Baixes" value={stats.unsubscribed} tone="critical" />
            <StatCard label="Anònims" value={stats.anonymous} />
            <StatCard label="Registrats" value={stats.users} />
          </Grid>
        )}

        <Flex gap={2} align="center" wrap="wrap">
          <Flex flex={1} style={{ minWidth: 200 }}>
            <TextInput
              icon={SearchIcon}
              placeholder="Cerca per email o nom..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              style={{ width: '100%' }}
            />
          </Flex>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.currentTarget.value)}
          >
            <option value="">Tots els estats</option>
            <option value="CONFIRMED">Confirmats</option>
            <option value="PENDING">Pendents</option>
            <option value="UNSUBSCRIBED">Baixes</option>
          </Select>
          <Select
            value={filterSource}
            onChange={(e) => setFilterSource(e.currentTarget.value)}
          >
            <option value="">Tots els orígens</option>
            <option value="ANONYMOUS">Anònims</option>
            <option value="USER">Registrats</option>
          </Select>
        </Flex>

        {filtered.length === 0 ? (
          <Card padding={5} tone="transparent">
            <Text align="center" muted>
              No hi ha subscriptors que coincideixin amb els filtres
            </Text>
          </Card>
        ) : (
          <Card radius={2} shadow={1} overflow="auto">
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ borderBottom: '1px solid var(--card-border-color)' }}>
                  <Th>Email</Th>
                  <Th>Nom</Th>
                  <Th>Idioma</Th>
                  <Th>Estat</Th>
                  <Th>Origen</Th>
                  <Th>Confirmat</Th>
                  <Th>Alta</Th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr
                    key={`${s.source}-${s.id}`}
                    style={{ borderBottom: '1px solid var(--card-border-color)' }}
                  >
                    <Td>
                      <Flex gap={2} align="center">
                        <Text size={1}>{s.email}</Text>
                        {s.isTestUser && (
                          <Badge tone="primary" fontSize={0}>
                            test
                          </Badge>
                        )}
                      </Flex>
                    </Td>
                    <Td>
                      <Text size={1} muted={!s.name}>
                        {s.name ?? '—'}
                      </Text>
                    </Td>
                    <Td>
                      <Text size={1}>{s.language}</Text>
                    </Td>
                    <Td>
                      <Badge tone={STATUS_TONES[s.status]} fontSize={0}>
                        {STATUS_LABELS[s.status]}
                      </Badge>
                    </Td>
                    <Td>
                      <Text size={1} muted>
                        {SOURCE_LABELS[s.source]}
                      </Text>
                    </Td>
                    <Td>
                      <Text size={1} muted>
                        {formatDate(s.confirmedAt)}
                      </Text>
                    </Td>
                    <Td>
                      <Text size={1} muted>
                        {formatDate(s.createdAt)}
                      </Text>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </Stack>
    </Card>
  )
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone?: 'positive' | 'caution' | 'critical'
}) {
  return (
    <Card padding={3} radius={2} tone={tone ?? 'transparent'} shadow={1}>
      <Stack space={2}>
        <Text size={0} muted>
          {label}
        </Text>
        <Text size={3} weight="bold">
          {value}
        </Text>
      </Stack>
    </Card>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: 'left',
        padding: '10px 12px',
        fontWeight: 600,
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        color: 'var(--card-muted-fg-color)',
      }}
    >
      {children}
    </th>
  )
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{ padding: '10px 12px', verticalAlign: 'middle' }}>{children}</td>
  )
}
