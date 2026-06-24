// =============================================================
// Certificate & Intern ID Utilities
// =============================================================

import QRCode from 'qrcode'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kaiketsutech.online'

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
export function buildVerificationUrl(certificateId: string): string {
  return `${SITE_URL}/verify/${certificateId}`
}

/**
 * Generate a QR code as a base64 PNG data URI
 * Encodes the verification URL for the given certificate ID
 */
export async function generateQRCodeDataUri(certificateId: string): Promise<string> {
  const url = buildVerificationUrl(certificateId)
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
