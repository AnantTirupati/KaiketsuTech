-- ============================================================
-- Migration: 20260706223100_add_management_task_category
-- Add Management task category and management department
-- ============================================================

-- 1. Tasks Table: Drop old check constraint and add updated one
ALTER TABLE public.tasks DROP CONSTRAINT IF EXISTS tasks_category_check;

ALTER TABLE public.tasks ADD CONSTRAINT tasks_category_check 
CHECK (category IN ('Frontend', 'Backend', 'Design Sys', 'Management', 'Operations', 'Other'));

-- 2. Interns Table: Drop old check constraint and add updated one
ALTER TABLE public.interns DROP CONSTRAINT IF EXISTS interns_department_check;

ALTER TABLE public.interns ADD CONSTRAINT interns_department_check 
CHECK (department IN ('engineering', 'design', 'marketing', 'operations', 'management'));
