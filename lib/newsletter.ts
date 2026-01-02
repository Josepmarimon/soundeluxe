import { prisma } from './prisma'
import { client } from './sanity/client'

interface SiteSettings {
  newsletterPaused: boolean
  testEmails: { email: string; name?: string }[]
}

// Cache para evitar queries repetidas a Sanity
let settingsCache: SiteSettings | null = null
let settingsCacheTime = 0
const CACHE_TTL = 60 * 1000 // 1 minuto

/**
 * Obtiene la configuración del sitio desde Sanity.
 * Usa cache de 1 minuto para evitar queries repetidas.
 */
async function getSiteSettings(): Promise<SiteSettings> {
  const now = Date.now()

  if (settingsCache && now - settingsCacheTime < CACHE_TTL) {
    return settingsCache
  }

  const settings = await client.fetch<SiteSettings | null>(`
    *[_type == "siteSettings"][0]{
      newsletterPaused,
      testEmails[]{ email, name }
    }
  `)

  settingsCache = settings ?? { newsletterPaused: true, testEmails: [] }
  settingsCacheTime = now

  return settingsCache
}

/**
 * Verifica si los envíos de newsletter están pausados globalmente.
 * Lee la configuración desde Sanity Studio.
 */
export async function isNewsletterPaused(): Promise<boolean> {
  const settings = await getSiteSettings()
  return settings.newsletterPaused ?? true
}

/**
 * Obtiene la lista de emails de test desde Sanity.
 */
export async function getTestEmails(): Promise<string[]> {
  const settings = await getSiteSettings()
  return (settings.testEmails ?? []).map(t => t.email.toLowerCase())
}

/**
 * Verifica si se puede enviar un email a un usuario específico.
 * Retorna true si:
 * - Los envíos NO están pausados, O
 * - El usuario es un usuario de test (isTestUser=true en Prisma), O
 * - El email está en la lista de test de Sanity
 */
export async function canSendEmailToUser(userId: string): Promise<boolean> {
  const paused = await isNewsletterPaused()
  if (!paused) {
    return true
  }

  // Verificar si es usuario de test en Prisma
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isTestUser: true, email: true }
  })

  if (user?.isTestUser) {
    return true
  }

  // Verificar si el email está en la lista de test de Sanity
  if (user?.email) {
    const testEmails = await getTestEmails()
    return testEmails.includes(user.email.toLowerCase())
  }

  return false
}

/**
 * Verifica si se puede enviar un email a un email específico.
 */
export async function canSendEmailToEmail(email: string): Promise<boolean> {
  const paused = await isNewsletterPaused()
  if (!paused) {
    return true
  }

  const normalizedEmail = email.toLowerCase()

  // Verificar si está en la lista de test de Sanity
  const testEmails = await getTestEmails()
  if (testEmails.includes(normalizedEmail)) {
    return true
  }

  // Verificar si es usuario de test en Prisma
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { isTestUser: true }
  })

  return user?.isTestUser ?? false
}

/**
 * Filtra una lista de usuarios para obtener solo los que pueden recibir emails.
 * Útil para envíos masivos de newsletter.
 */
export async function filterUsersForNewsletter(userIds: string[]): Promise<string[]> {
  const paused = await isNewsletterPaused()
  if (!paused) {
    return userIds
  }

  const testEmails = await getTestEmails()

  // Usuarios de test en Prisma O en la lista de Sanity
  const allowedUsers = await prisma.user.findMany({
    where: {
      id: { in: userIds },
      OR: [
        { isTestUser: true },
        { email: { in: testEmails } }
      ]
    },
    select: { id: true }
  })

  return allowedUsers.map(u => u.id)
}

/**
 * Obtiene todos los suscriptores activos que pueden recibir emails.
 * Respeta el flag de pausa global.
 */
export async function getActiveSubscribers() {
  const paused = await isNewsletterPaused()
  const testEmails = await getTestEmails()

  const baseWhere = {
    newsletterSubscribed: true,
    newsletterConfirmedAt: { not: null }
  }

  if (paused) {
    return prisma.user.findMany({
      where: {
        ...baseWhere,
        OR: [
          { isTestUser: true },
          { email: { in: testEmails } }
        ]
      },
      select: {
        id: true,
        email: true,
        name: true,
        language: true
      }
    })
  }

  return prisma.user.findMany({
    where: baseWhere,
    select: {
      id: true,
      email: true,
      name: true,
      language: true
    }
  })
}

/**
 * Invalida el cache de configuración.
 * Útil cuando se actualiza la configuración desde Sanity.
 */
export function invalidateSettingsCache(): void {
  settingsCache = null
  settingsCacheTime = 0
}
