// =============================================================
// Intern Verification & Portfolio System — Shared Types
// =============================================================

import { Database } from './database.types'

// ---- Row aliases ----
export type InternRow = Database['public']['Tables']['interns']['Row']
export type CertificateRow = Database['public']['Tables']['certificates']['Row']
export type ProjectContributorRow = Database['public']['Tables']['project_contributors']['Row']
export type VerificationLogRow = Database['public']['Tables']['verification_logs']['Row']
export type AuditLogRow = Database['public']['Tables']['audit_logs']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ProjectRow = Database['public']['Tables']['projects']['Row']

// ---- Joined / Display types ----

/** Intern record with linked profile data */
export interface InternWithProfile extends InternRow {
  profiles: {
    email: string
    full_name: string | null
    avatar_url: string | null
    rating: number | null
  } | null
}

/** Certificate with intern + profile details (for admin tables & public pages) */
export interface CertificateWithIntern extends CertificateRow {
  interns: {
    intern_id: string
    department: string
    start_date: string
    end_date: string | null
    status: string
    bio: string | null
    skills: string[] | null
    github_url: string | null
    linkedin_url: string | null
    portfolio_url: string | null
    profiles: {
      full_name: string | null
      email: string
      avatar_url: string | null
    } | null
  } | null
}

/** Project contributor with linked project and intern details */
export interface ProjectContributorWithDetails extends ProjectContributorRow {
  projects: {
    id: string
    title: string
    description: string | null
    status: string | null
    showcase_image_url: string | null
    showcase_tags: string[] | null
  } | null
  interns: {
    intern_id: string
    department: string
    profiles: {
      full_name: string | null
      avatar_url: string | null
    } | null
  } | null
}

/** Audit log entry with actor profile info */
export interface AuditLogWithActor extends AuditLogRow {
  profiles: {
    full_name: string | null
    email: string
  } | null
}

/** Public verification API response */
export interface VerificationResult {
  valid: boolean
  status: 'active' | 'revoked' | 'expired' | 'not_found'
  certificate: {
    certificate_id: string
    title: string
    description: string | null
    issued_at: string
    valid_until: string | null
    qr_code_url: string | null
    revoked_at: string | null
    revoked_reason: string | null
  } | null
  intern: {
    intern_id: string
    name: string | null
    department: string
    bio: string | null
    skills: string[] | null
    avatar_url: string | null
    start_date: string
    end_date: string | null
    github_url: string | null
    linkedin_url: string | null
    portfolio_url: string | null
  } | null
  contributions: {
    project_title: string
    role: string
    contribution_summary: string | null
  }[]
}

/** Showcase project for public display */
export interface ShowcaseProject extends ProjectRow {
  contributors: {
    role: string
    interns: {
      intern_id: string
      profiles: {
        full_name: string | null
        avatar_url: string | null
      } | null
    } | null
  }[]
}
