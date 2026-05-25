'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  Stack,
  Text,
  Button,
  Select,
  Flex,
  Spinner,
  Grid,
} from '@sanity/ui'
import { RefreshIcon } from '@sanity/icons'

interface Bucket {
  date: string
  count: number
}

interface TopPage {
  path: string
  count: number
}

interface StatsResponse {
  range: string
  granularity: 'day' | 'week' | 'month'
  totals: {
    registrations: number
    subscribers: number
    pageViews: number
  }
  registrations: Bucket[]
  subscribers: Bucket[]
  topPages: TopPage[]
}

const RANGE_OPTIONS = [
  { value: '7d', label: 'Últims 7 dies' },
  { value: '30d', label: 'Últims 30 dies' },
  { value: '90d', label: 'Últims 90 dies' },
  { value: '365d', label: 'Últim any' },
]

function formatBucket(date: string, granularity: 'day' | 'week' | 'month'): string {
  const d = new Date(date)
  if (granularity === 'month') {
    return d.toLocaleDateString('ca-ES', { month: 'short', year: '2-digit' })
  }
  return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'short' })
}

export default function StatsTool() {
  const [data, setData] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [range, setRange] = useState('30d')

  const fetchStats = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/admin/stats?range=${range}`)
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Has d\'iniciar sessió com a admin a la web per veure les estadístiques')
        }
        if (response.status === 403) {
          throw new Error('No tens permisos per accedir a aquesta secció')
        }
        throw new Error('Error carregant estadístiques')
      }
      const json = await response.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconegut')
    } finally {
      setLoading(false)
    }
  }, [range])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  if (loading && !data) {
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
          <Button text="Tornar a provar" onClick={fetchStats} />
        </Stack>
      </Card>
    )
  }

  if (!data) return null

  return (
    <Card padding={4}>
      <Stack space={4}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          <Text size={4} weight="bold">
            Estadístiques
          </Text>
          <Flex gap={2} align="center">
            <Select value={range} onChange={(e) => setRange(e.currentTarget.value)}>
              {RANGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <Button
              icon={RefreshIcon}
              text="Actualitzar"
              onClick={fetchStats}
              disabled={loading}
            />
          </Flex>
        </Flex>

        <Grid columns={[1, 3]} gap={2}>
          <BigStatCard
            label="Visites"
            value={data.totals.pageViews}
            color="var(--card-fg-color)"
          />
          <BigStatCard
            label="Nous registres"
            value={data.totals.registrations}
            color="#3b82f6"
          />
          <BigStatCard
            label="Nous subscriptors"
            value={data.totals.subscribers}
            color="#10b981"
          />
        </Grid>

        <ChartCard
          title="Nous registres"
          data={data.registrations}
          granularity={data.granularity}
          color="#3b82f6"
        />
        <ChartCard
          title="Nous subscriptors newsletter"
          data={data.subscribers}
          granularity={data.granularity}
          color="#10b981"
        />

        <Card padding={3} radius={2} shadow={1}>
          <Stack space={3}>
            <Text size={2} weight="bold">
              Top pàgines visitades
            </Text>
            {data.topPages.length === 0 ? (
              <Text muted size={1}>
                Encara no hi ha visites en aquest rang
              </Text>
            ) : (
              <TopPagesTable pages={data.topPages} />
            )}
          </Stack>
        </Card>
      </Stack>
    </Card>
  )
}

function BigStatCard({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <Card padding={4} radius={2} shadow={1}>
      <Stack space={3}>
        <Text size={1} muted>
          {label}
        </Text>
        <Text size={5} weight="bold" style={{ color }}>
          {value.toLocaleString('ca-ES')}
        </Text>
      </Stack>
    </Card>
  )
}

function ChartCard({
  title,
  data,
  granularity,
  color,
}: {
  title: string
  data: Bucket[]
  granularity: 'day' | 'week' | 'month'
  color: string
}) {
  return (
    <Card padding={3} radius={2} shadow={1}>
      <Stack space={3}>
        <Text size={2} weight="bold">
          {title}
        </Text>
        {data.length === 0 ? (
          <Text muted size={1}>
            Sense dades
          </Text>
        ) : (
          <BarChart data={data} granularity={granularity} color={color} />
        )}
      </Stack>
    </Card>
  )
}

function BarChart({
  data,
  granularity,
  color,
}: {
  data: Bucket[]
  granularity: 'day' | 'week' | 'month'
  color: string
}) {
  const width = 800
  const height = 180
  const paddingX = 32
  const paddingTop = 12
  const paddingBottom = 28

  const max = Math.max(1, ...data.map((b) => b.count))
  const innerW = width - paddingX * 2
  const innerH = height - paddingTop - paddingBottom
  const barW = innerW / data.length

  const labelEvery = Math.max(1, Math.ceil(data.length / 10))

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        style={{ width: '100%', height: 200, display: 'block' }}
      >
        {[0.25, 0.5, 0.75, 1].map((p) => (
          <line
            key={p}
            x1={paddingX}
            x2={width - paddingX}
            y1={paddingTop + innerH * p}
            y2={paddingTop + innerH * p}
            stroke="var(--card-border-color)"
            strokeDasharray="2,3"
            opacity={0.6}
          />
        ))}

        {data.map((b, i) => {
          const h = (b.count / max) * innerH
          const x = paddingX + i * barW + 1
          const y = paddingTop + innerH - h
          return (
            <g key={`${b.date}-${i}`}>
              <rect
                x={x}
                y={y}
                width={Math.max(1, barW - 2)}
                height={h}
                fill={color}
                rx={2}
              >
                <title>{`${formatBucket(b.date, granularity)}: ${b.count}`}</title>
              </rect>
            </g>
          )
        })}

        <text
          x={paddingX - 4}
          y={paddingTop + 4}
          textAnchor="end"
          fontSize={10}
          fill="currentColor"
          opacity={0.6}
        >
          {max}
        </text>
        <text
          x={paddingX - 4}
          y={paddingTop + innerH}
          textAnchor="end"
          fontSize={10}
          fill="currentColor"
          opacity={0.6}
        >
          0
        </text>

        {data.map((b, i) =>
          i % labelEvery === 0 ? (
            <text
              key={`label-${i}`}
              x={paddingX + i * barW + barW / 2}
              y={height - 8}
              textAnchor="middle"
              fontSize={10}
              fill="currentColor"
              opacity={0.7}
            >
              {formatBucket(b.date, granularity)}
            </text>
          ) : null,
        )}
      </svg>
    </div>
  )
}

function TopPagesTable({ pages }: { pages: TopPage[] }) {
  const max = Math.max(1, ...pages.map((p) => p.count))
  return (
    <Stack space={2}>
      {pages.map((p) => {
        const pct = (p.count / max) * 100
        return (
          <div key={p.path} style={{ position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: `${pct}%`,
                background: 'var(--card-bg2-color, rgba(59,130,246,0.12))',
                borderRadius: 4,
              }}
            />
            <Flex
              justify="space-between"
              align="center"
              style={{ position: 'relative', padding: '6px 10px' }}
            >
              <Text size={1} style={{ wordBreak: 'break-all' }}>
                {p.path}
              </Text>
              <Text size={1} weight="medium">
                {p.count.toLocaleString('ca-ES')}
              </Text>
            </Flex>
          </div>
        )
      })}
    </Stack>
  )
}
