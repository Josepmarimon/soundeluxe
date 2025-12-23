'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

interface VoteCountProps {
  albumId: string
  compact?: boolean
}

export default function VoteCount({ albumId, compact = false }: VoteCountProps) {
  const t = useTranslations('album')
  const [voteCount, setVoteCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchVoteCount = async () => {
      try {
        const response = await fetch(`/api/votes/${albumId}`)
        const data = await response.json()
        setVoteCount(data.count)
      } catch (error) {
        console.error('Error fetching vote count:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVoteCount()
  }, [albumId])

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 bg-zinc-300 rounded animate-pulse" />
        <div className="w-12 h-3 bg-zinc-300 rounded animate-pulse" />
      </div>
    )
  }

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 text-zinc-600">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
        <span className="text-xs font-medium">{voteCount}</span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-zinc-300">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
      <span className="text-sm font-medium">
        {t('votes', { count: voteCount })}
      </span>
    </div>
  )
}
