-- ============================================================
-- FIX: Profiles RLS infinite recursion causing HTTP 500
-- Migration: 20260625300000
-- 
-- Root Cause: The "Allow admin full access to profiles" policy
-- used is_admin(), which queried public.profiles with RLS enabled,
-- triggering infinite recursion. PostgREST returned 500 for every
-- profiles query, causing the middleware/dashboard fallback:
--   const role = profile?.role || 'client'
-- This made the admin always redirect to /dashboard/client.
-- ============================================================

-- Step 1: Drop broken profiles policies
DROP POLICY IF EXISTS "Allow admin full access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated read access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access to profiles" ON public.profiles;

-- Step 2: Create clean, non-recursive profiles policies

-- SELECT: Allow authenticated users to read any profile
CREATE POLICY "profiles_select_authenticated" ON public.profiles
    FOR SELECT TO authenticated
    USING (true);

-- SELECT: Allow anon to read profiles (public pages: verify, intern profiles)
CREATE POLICY "profiles_select_anon" ON public.profiles
    FOR SELECT TO anon
    USING (true);

-- UPDATE: Users can update their own profile
CREATE POLICY "profiles_update_own" ON public.profiles
    FOR UPDATE TO authenticated
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id);

-- UPDATE: Admin can update any profile (uses auth.users to avoid recursion)
CREATE POLICY "profiles_admin_update" ON public.profiles
    FOR UPDATE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = (SELECT auth.uid())
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = (SELECT auth.uid())
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- DELETE: Admin can delete profiles
CREATE POLICY "profiles_admin_delete" ON public.profiles
    FOR DELETE TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = (SELECT auth.uid())
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Step 3: Fix is_admin() and is_client() to query auth.users instead of profiles
-- This eliminates any possibility of RLS recursion when these functions are
-- used in policies on OTHER tables (e.g., intern_applications, tasks, projects).
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = (SELECT auth.uid())
    AND raw_user_meta_data->>'role' = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.is_client()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = (SELECT auth.uid())
    AND raw_user_meta_data->>'role' = 'client'
  );
$$;

-- Step 4: Restrict execute permissions on helper functions
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.is_client() FROM anon, public;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_client() TO authenticated;
