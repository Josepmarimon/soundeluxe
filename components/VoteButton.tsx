'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
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
  const t = useTranslations('album')
  const tPrompt = useTranslations('loginPrompt')
  const locale = useLocale()

  const [hasVoted, setHasVoted] = useState(false)
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [isLoading, setIsLoading] = useState(false)
  const [checkingVote, setCheckingVote] = useState(true)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)

  // Lock body scroll while prompt is open + close on Escape
  useEffect(() => {
    if (!showLoginPrompt) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowLoginPrompt(false)
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [showLoginPrompt])

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
    // Show login prompt if not authenticated
    if (!session?.user) {
      setShowLoginPrompt(true)
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
        <div className="animate-pulse bg-surface-raised h-10 w-32 rounded-full" />
      </div>
    )
  }

  return (
    <>
    <div className="flex items-center gap-2">
      <button
        onClick={handleVote}
        disabled={isLoading}
        className={`
          px-3 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm
          disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center gap-1.5
          ${
            hasVoted
              ? 'bg-primary text-on-primary hover:bg-primary-dark'
              : 'bg-bg text-fg hover:bg-surface-raised border border-primary/30'
          }
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill={hasVoted ? 'currentColor' : 'none'}
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
        {hasVoted ? t('voted') : t('vote')}
      </button>

      {showCount && (
        <div className="flex items-center gap-1 px-2.5 py-1.5 bg-primary/20 rounded-full border border-primary/30">
          <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>
          </svg>
          <span className="text-primary font-bold text-sm">{voteCount}</span>
        </div>
      )}
    </div>

    {showLoginPrompt && (
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="vote-login-prompt-title"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
        onClick={() => setShowLoginPrompt(false)}
      >
        <div
          className="relative w-full max-w-sm rounded-2xl bg-card border border-outline shadow-xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setShowLoginPrompt(false)}
            aria-label={tPrompt('close')}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-fg-subtle hover:text-fg hover:bg-card-hover transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            </div>
            <h3 id="vote-login-prompt-title" className="text-lg font-bold text-fg mb-1.5">
              {tPrompt('voteTitle')}
            </h3>
            <p className="text-sm text-fg-subtle mb-5">
              {tPrompt('voteMessage')}
            </p>

            <div className="flex flex-col gap-2 w-full">
              <Link
                href={`/${locale}/register`}
                className="bg-primary text-on-primary px-5 py-2.5 rounded-full font-bold text-sm hover:bg-primary-dark transition-all shadow-md text-center"
              >
                {tPrompt('registerFree')}
              </Link>
              <Link
                href={`/${locale}/login`}
                className="text-primary px-5 py-2 rounded-full font-medium text-sm hover:bg-card-hover transition-all text-center"
              >
                {tPrompt('alreadyHaveAccount')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  )
}
