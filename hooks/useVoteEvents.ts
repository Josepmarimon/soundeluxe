'use client'

import { useEffect, useCallback } from 'react'

const VOTE_EVENT = 'vote-updated'

interface VoteEventDetail {
  albumId: string
  action: 'vote' | 'unvote'
}

// Emit a vote event when a user votes or unvotes
export function emitVoteEvent(albumId: string, action: 'vote' | 'unvote') {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<VoteEventDetail>(VOTE_EVENT, {
      detail: { albumId, action }
    })
    window.dispatchEvent(event)
  }
}

// Hook to listen for vote events
export function useVoteEvents(callback: (detail: VoteEventDetail) => void) {
  const handleEvent = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<VoteEventDetail>
    callback(customEvent.detail)
  }, [callback])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener(VOTE_EVENT, handleEvent)
      return () => {
        window.removeEventListener(VOTE_EVENT, handleEvent)
      }
    }
  }, [handleEvent])
}
