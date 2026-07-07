-- ============================================================
-- Migration: 20260707223600_fix_job_postings_select_policy
-- Fix job_postings select policy for anonymous users and restore execute permissions.
-- ============================================================

-- 1. Drop old select policy
DROP POLICY IF EXISTS "job_postings_select" ON public.job_postings;

-- 2. Create updated select policy using auth.jwt() instead of is_admin() to support anonymous visitors
CREATE POLICY "job_postings_select" ON public.job_postings
    FOR SELECT USING (
        status = 'open' OR 
        (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin')
    );

-- 3. Grant execute privileges on RLS helper functions to public, anon, and authenticated roles
-- This prevents database permission errors when helper functions are referenced in RLS policies
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.is_client() TO anon, authenticated, public;
