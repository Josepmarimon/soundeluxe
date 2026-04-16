import { client } from '@/lib/sanity/client'
import { groq } from 'next-sanity'

export interface CompanyData {
  name: string
  nif: string
  address: {
    street: string
    postalCode: string
    city: string
    province: string
    country: string
  }
  email: string
  web: string
  vatRate: number
  invoiceSeries: string
}

// Fallback per si no s'ha configurat a Sanity
const COMPANY_FALLBACK: CompanyData = {
  name: 'Sound Deluxe S.L.',
  nif: 'B12345678',
  address: {
    street: 'Carrer de la Música, 1',
    postalCode: '08001',
    city: 'Barcelona',
    province: 'Barcelona',
    country: 'España',
  },
  email: 'info@soundeluxe.es',
  web: 'soundeluxe.es',
  vatRate: 21,
  invoiceSeries: 'SD',
}

const billingConfigQuery = groq`
  *[_type == "billingConfig"][0] {
    companyName,
    nif,
    address,
    email,
    web,
    vatRate,
    invoiceSeries
  }
`

/**
 * Obté les dades de facturació des de Sanity.
 * Retorna el fallback si no s'ha configurat.
 */
export async function getCompanyData(): Promise<CompanyData> {
  try {
    const data = await client.fetch(billingConfigQuery)
    if (!data?.companyName || !data?.nif) {
      return COMPANY_FALLBACK
    }
    return {
      name: data.companyName,
      nif: data.nif,
      address: data.address || COMPANY_FALLBACK.address,
      email: data.email || COMPANY_FALLBACK.email,
      web: data.web || COMPANY_FALLBACK.web,
      vatRate: data.vatRate ?? COMPANY_FALLBACK.vatRate,
      invoiceSeries: data.invoiceSeries || COMPANY_FALLBACK.invoiceSeries,
    }
  } catch {
    return COMPANY_FALLBACK
  }
}

/**
 * Formatea el número de factura simplificada
 * Formato: SD-2026-0001
 */
export async function formatInvoiceNumber(invoiceNumber: number, date: Date): Promise<string> {
  const company = await getCompanyData()
  const year = date.getFullYear()
  const num = String(invoiceNumber).padStart(4, '0')
  return `${company.invoiceSeries}-${year}-${num}`
}

/**
 * Calcula el desglose fiscal
 */
export async function calculateTaxBreakdown(totalWithVat: number) {
  const company = await getCompanyData()
  const vatRate = company.vatRate / 100
  const baseAmount = totalWithVat / (1 + vatRate)
  const vatAmount = totalWithVat - baseAmount

  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    vatRate: company.vatRate,
    vatAmount: Math.round(vatAmount * 100) / 100,
    total: totalWithVat,
  }
}
