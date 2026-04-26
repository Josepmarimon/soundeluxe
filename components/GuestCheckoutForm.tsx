'use client'

import { useTranslations } from 'next-intl'

interface GuestCheckoutFormProps {
  email: string
  name: string
  onEmailChange: (email: string) => void
  onNameChange: (name: string) => void
  disabled?: boolean
  /** compact = estil reduït per al back de SessionCard sobre fons primari */
  variant?: 'default' | 'compact' | 'oncolor'
}

export default function GuestCheckoutForm({
  email,
  name,
  onEmailChange,
  onNameChange,
  disabled = false,
  variant = 'default',
}: GuestCheckoutFormProps) {
  const t = useTranslations('booking.guest')

  const compact = variant === 'compact' || variant === 'oncolor'
  const onColor = variant === 'oncolor'

  const labelClass = onColor
    ? 'text-[10px] uppercase tracking-wider text-black font-bold mb-1 block'
    : 'text-[10px] uppercase tracking-wider text-fg-subtle font-bold mb-1 block'

  const inputClass = onColor
    ? 'w-full px-3 py-2 rounded-lg bg-white text-black placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black border border-black/20 text-sm'
    : compact
    ? 'w-full px-3 py-2 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary text-sm'
    : 'w-full px-3 py-2.5 rounded-lg bg-surface-alt text-black placeholder:text-fg-dim focus:outline-none focus:ring-2 focus:ring-primary'

  const spaceClass = compact ? 'space-y-2' : 'space-y-3'

  return (
    <div className={spaceClass}>
      <div>
        <label className={labelClass}>{t('nameLabel')}</label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t('namePlaceholder')}
          required
          maxLength={120}
          disabled={disabled}
          className={inputClass}
          autoComplete="name"
        />
      </div>

      <div>
        <label className={labelClass}>{t('emailLabel')}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder={t('emailPlaceholder')}
          required
          maxLength={200}
          disabled={disabled}
          className={inputClass}
          autoComplete="email"
        />
      </div>
    </div>
  )
}
