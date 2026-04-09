// Datos fiscales del emisor para factura simplificada
// Actualizar con los datos reales de la empresa

export const COMPANY = {
  name: 'Sound Deluxe S.L.',
  nif: 'B12345678', // TODO: Actualizar con el NIF real
  address: {
    street: 'Carrer de la Música, 1',
    postalCode: '08001',
    city: 'Barcelona',
    province: 'Barcelona',
    country: 'España',
  },
  email: 'info@soundeluxe.es',
  web: 'soundeluxe.es',
  vatRate: 21, // IVA 21%
  invoiceSeries: 'SD', // Serie de facturación
} as const

/**
 * Formatea el número de factura simplificada
 * Formato: SD-2026-0001
 */
export function formatInvoiceNumber(invoiceNumber: number, date: Date): string {
  const year = date.getFullYear()
  const num = String(invoiceNumber).padStart(4, '0')
  return `${COMPANY.invoiceSeries}-${year}-${num}`
}

/**
 * Calcula el desglose fiscal
 */
export function calculateTaxBreakdown(totalWithVat: number) {
  const vatRate = COMPANY.vatRate / 100
  const baseAmount = totalWithVat / (1 + vatRate)
  const vatAmount = totalWithVat - baseAmount

  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
    vatRate: COMPANY.vatRate,
    vatAmount: Math.round(vatAmount * 100) / 100,
    total: totalWithVat,
  }
}
