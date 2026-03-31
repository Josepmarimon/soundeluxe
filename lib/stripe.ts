import Stripe from 'stripe'

const secretKey = process.env.STRIPE_SECRET_KEY || 'sk_placeholder_key'

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV !== 'production') {
  console.warn('Missing STRIPE_SECRET_KEY environment variable - payment processing will fail')
}

export const stripe = new Stripe(secretKey, {
  typescript: true,
})
