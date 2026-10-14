// =============================================================
// Certificate & Intern ID Utilities
// =============================================================

import QRCode from 'qrcode'

/**
 * Resolve the public production site URL for certificates and QR codes.
 * Ensures localhost / 127.0.0.1 is NEVER encoded in certificate QR codes,
 * because physical device scans cannot reach localhost.
 */
export function getProductionSiteUrl(siteUrlOverride?: string): string {
  // If explicitly overridden and not localhost, use it
  if (siteUrlOverride && !siteUrlOverride.includes('localhost') && !siteUrlOverride.includes('127.0.0.1')) {
    return siteUrlOverride.replace(/\/$/, '')
  }

  // If env var is set and not localhost, use it
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '')
  }

  // Fallback to official production domain
  return 'https://www.kaiketsutech.online'
}

/**
 * Generate a unique certificate ID in the format KT-XXXX-YYMM
 * e.g. KT-A7F2-2606
 */
export function generateCertificateId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let slug = ''
  for (let i = 0; i < 4; i++) {
    slug += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  const now = new Date()
  const year = String(now.getFullYear()).slice(-2)
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `KT-${slug}-${year}${month}`
}

/**
 * Generate a unique intern ID in the format KT-INT-NNNN
 * @param sequenceNum - Sequential number (padded to 4 digits)
 */
export function generateInternId(sequenceNum: number): string {
  return `KT-INT-${String(sequenceNum).padStart(4, '0')}`
}

/**
 * Build the public verification URL for a certificate
 */
export function buildVerificationUrl(certificateId: string, siteUrl?: string): string {
  const base = getProductionSiteUrl(siteUrl)
  return `${base}/verify/${certificateId}`
}

/**
 * Generate a QR code as a base64 PNG data URI
 * Encodes the verification URL for the given certificate ID
 */
export async function generateQRCodeDataUri(certificateId: string, siteUrl?: string): Promise<string> {
  const url = buildVerificationUrl(certificateId, siteUrl)
  const dataUri = await QRCode.toDataURL(url, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#1c110b',
      light: '#f6ded3',
    },
  })
  return dataUri
}
