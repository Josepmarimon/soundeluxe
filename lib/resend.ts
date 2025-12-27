import { Resend } from 'resend'

// Use a placeholder during build time if RESEND_API_KEY is not set
const apiKey = process.env.RESEND_API_KEY || 're_placeholder_key'

if (!process.env.RESEND_API_KEY && process.env.NODE_ENV !== 'production') {
  console.warn('Missing RESEND_API_KEY environment variable - email sending will fail')
}

export const resend = new Resend(apiKey)

export const FROM_EMAIL = process.env.FROM_EMAIL || 'Sound Deluxe <noreply@soundeluxe.com>'

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://soundeluxe.vercel.app'

// Check if Resend is properly configured
export const isResendConfigured = !!process.env.RESEND_API_KEY
