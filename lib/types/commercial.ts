// TypeScript types for the Commercial Links System

import type { LinkSection } from '@/lib/comercial/types'

export type CommercialLinkStatus = 'PENDING' | 'SENT' | 'OPENED' | 'CONVERTED'

export type CommercialRecipientType = 'VENUE' | 'DISC_PROVIDER' | 'FAN_CLUB' | 'COMPANY' | 'RECORD_LABEL'

export type { LinkSection } from '@/lib/comercial/types'

export interface CommercialLink {
  id: string
  token: string
  recipientEmail: string
  recipientName: string
  recipientCompany: string | null
  status: CommercialLinkStatus
  firstOpenedAt: string | null
  lastOpenedAt: string | null
  openCount: number
  expiresAt: string | null
  notes: string | null
  lang: 'CA' | 'ES' | 'EN'
  recipientType: CommercialRecipientType
  sections: LinkSection[] | null
  createdBy: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface CommercialLinkVisit {
  id: string
  linkId: string
  visitedAt: string
  timeOnPageSeconds: number | null
  ipAddress: string | null
  userAgent: string | null
  deviceType: string | null
  browser: string | null
  os: string | null
  country: string | null
  city: string | null
  scrollDepthPercent: number | null
  sectionsViewed: string[]
}

export interface CommercialLinkStats {
  total: number
  pending: number
  sent: number
  opened: number
  converted: number
  openRate: number
  conversionRate: number
}

export interface CreateCommercialLinkInput {
  recipientEmail: string
  recipientName: string
  recipientCompany?: string
  notes?: string
  expiresAt?: string
  lang?: 'CA' | 'ES' | 'EN'
  recipientType?: CommercialRecipientType
  sections?: LinkSection[]
}

export interface UpdateEngagementInput {
  visitId: string
  timeOnPageSeconds?: number
  scrollDepthPercent?: number
  sectionsViewed?: string[]
}

export interface CommercialMetrics {
  platform: {
    totalUsers: number
    totalSessions: number
    totalReservas: number
    totalAlbums: number
    totalRessenyes: number
    avgRating: number
    usersThisMonth: number
  }
  hardcoded: {
    instagram: {
      followers: number
    }
  }
  timestamp: string
}
