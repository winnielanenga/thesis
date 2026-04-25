-- Migration: Essays / application tracker
-- Date: 2026-04-25
-- Adds an `essays` table for tracking college application essays:
--   - Common App main, supplements, scholarships
--   - per-essay status (Not Started / Drafting / Reviewing / Submitted)
--   - optional school, prompt, word limit, deadline, notes
-- RLS enabled with no anon policies, matching the rest of the schema.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

BEGIN;

CREATE TABLE IF NOT EXISTS essays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    school TEXT,
    type TEXT NOT NULL CHECK (type IN ('Common App', 'Supplemental', 'Scholarship', 'Other')),
    prompt TEXT,
    word_limit INTEGER CHECK (word_limit IS NULL OR (word_limit > 0 AND word_limit <= 100000)),
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'Drafting', 'Reviewing', 'Submitted')),
    deadline DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS essays_user_status_idx ON essays (user_id, status);
CREATE INDEX IF NOT EXISTS essays_user_deadline_idx ON essays (user_id, deadline);

ALTER TABLE essays ENABLE ROW LEVEL SECURITY;

COMMIT;
