-- ============================================================
-- Migration: 20260706225500_create_job_postings
-- Create job_postings table, enable RLS, configure policies, and seed data.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.job_postings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    track TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- 1. SELECT: Allow public read access to open job postings (or admins to see all)
CREATE POLICY "job_postings_select" ON public.job_postings
    FOR SELECT USING (status = 'open' OR is_admin());

-- 2. ALL: Allow admin full access (uses auth.users raw metadata role check to prevent recursion)
CREATE POLICY "job_postings_admin_all" ON public.job_postings
    FOR ALL TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

-- 3. Set updated_at trigger
CREATE TRIGGER set_job_postings_updated_at
    BEFORE UPDATE ON public.job_postings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
INSERT INTO public.job_postings (id, title, track, description, requirements, status)
VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'Full Stack Developer Intern',
    'Full Stack',
    'Develop production-grade React components, API route handlers, and data sync workers in TypeScript and Next.js.',
    ARRAY['TypeScript / React', 'Next.js App Router', 'Node.js / Express', 'PostgreSQL / Supabase'],
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Frontend Developer Intern',
    'Frontend',
    'Architect typography scales, color palettes, and glassmorphic dashboards. Wire up Framer Motion micro-animations.',
    ARRAY['React / TypeScript', 'CSS Grid & Flexbox', 'Tailwind CSS v4', 'Framer Motion'],
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'Backend Developer Intern',
    'Backend',
    'Map database schemas, write system flow triggers, and configure Supabase RLS security policies.',
    ARRAY['PostgreSQL / SQL', 'Database Migrations', 'Node.js / Express', 'API Architecture'],
    'open'
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'Management Intern',
    'Management',
    'Coordinate squad timelines, optimize client workflows, manage task assignments, and ensure delivery milestones are met.',
    ARRAY['Project Management', 'Client Communication', 'Operational Workflows', 'Task Assignment'],
    'open'
  )
ON CONFLICT (id) DO NOTHING;
