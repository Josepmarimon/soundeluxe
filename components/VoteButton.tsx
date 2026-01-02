'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { emitVoteEvent } from '@/hooks/useVoteEvents'

interface VoteButtonProps {
  albumId: string
  initialVoteCount?: number
  showCount?: boolean
}

export default function VoteButton({
  albumId,
  initialVoteCount = 0,
  showCount = true
}: VoteButtonProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const t = useTranslations('album')

  const [hasVoted, setHasVoted] = useState(false)
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [isLoading, setIsLoading] = useState(false)
  const [checkingVote, setCheckingVote] = useState(true)

  // Check if user has voted on mount
  useEffect(() => {
    const checkUserVote = async () => {
      if (!session?.user) {
        setCheckingVote(false)
        return
      }

      try {
        const response = await fetch(`/api/votes/user/${albumId}`)
        const data = await response.json()
        setHasVoted(data.hasVoted)
      } catch (error) {
        console.error('Error checking vote:', error)
      } finally {
        setCheckingVote(false)
      }
    }

    checkUserVote()
  }, [albumId, session])

  // Fetch vote count on mount
  useEffect(() => {
    const fetchVoteCount = async () => {
      try {
        const response = await fetch(`/api/votes/${albumId}`)
        const data = await response.json()
        setVoteCount(data.count)
      } catch (error) {
        console.error('Error fetching vote count:', error)
      }
    }

    if (showCount) {
      fetchVoteCount()
    }
  }, [albumId, showCount])

  const handleVote = async () => {
    // Redirect to login if not authenticated
    if (!session?.user) {
      router.push('/ca/login')
      return
    }

    setIsLoading(true)

    try {
      if (hasVoted) {
        // Remove vote
        const response = await fetch(`/api/votes?albumId=${albumId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setHasVoted(false)
          setVoteCount((prev) => Math.max(0, prev - 1))
          emitVoteEvent(albumId, 'unvote')
        }
      } else {
        // Add vote
        const response = await fetch('/api/votes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ albumId }),
        })

        if (response.ok) {
          setHasVoted(true)
          setVoteCount((prev) => prev + 1)
          emitVoteEvent(albumId, 'vote')
        }
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingVote) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-pulse bg-[#1a3a5c] h-10 w-32 rounded-full" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleVote}
        disabled={isLoading}
        className={`
          px-6 py-2.5 rounded-full font-semibold transition-all shadow-md
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-2
          ${
            hasVoted
              ? 'bg-gradient-to-r from-[#D4AF37] via-[#F4E5AD] to-[#D4AF37] text-black hover:from-[#C5A028] hover:via-[#E5D59D] hover:to-[#C5A028]'
              : 'bg-[#0a1929] text-white hover:bg-[#1a3a5c] border border-[#D4AF37]/30'
          }
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={hasVoted ? 'currentColor' : 'none'}
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
        {hasVoted ? t('voted') : t('vote')}
      </button>

      {showCount && (
        <span className="text-zinc-300 text-sm font-medium">
          {t('votes', { count: voteCount })}
        </span>
      )}
    </div>
  )
}
