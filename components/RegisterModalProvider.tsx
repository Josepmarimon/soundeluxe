'use client'

import { createContext, useCallback, useContext, useState } from 'react'
import RegisterModal from './RegisterModal'

interface RegisterModalContextValue {
  open: () => void
  close: () => void
  isOpen: boolean
}

const RegisterModalContext = createContext<RegisterModalContextValue | null>(null)

export function useRegisterModal() {
  const ctx = useContext(RegisterModalContext)
  if (!ctx) {
    throw new Error('useRegisterModal must be used within RegisterModalProvider')
  }
  return ctx
}

export default function RegisterModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  return (
    <RegisterModalContext.Provider value={{ open, close, isOpen }}>
      {children}
      <RegisterModal open={isOpen} onClose={close} />
    </RegisterModalContext.Provider>
  )
}
