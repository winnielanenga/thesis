-- Migration: Enable Row Level Security on all user-data tables
-- Date: 2026-04-25
-- Why: Defense-in-depth. ThesisPrep accesses Supabase exclusively via the service role
--      key (src/lib/supabase.ts), which bypasses RLS. So today RLS adds no security —
--      server actions are the real gate. But Supabase warns about disabled RLS because
--      a leaked anon key, or a future client-side Supabase call, would otherwise have
--      unrestricted access. Enabling RLS with NO anon/authenticated policies means
--      only the service role (server-side) can read or write. Existing server actions
--      continue working unchanged.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

BEGIN;

ALTER TABLE profiles            ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks               ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_milestones     ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestone_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses             ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams               ENABLE ROW LEVEL SECURITY;

-- No policies are created. With RLS enabled and zero policies,
-- the anon and authenticated roles get NO access. The service role
-- bypasses RLS, so server-side code (Next.js server actions) is unaffected.

COMMIT;
