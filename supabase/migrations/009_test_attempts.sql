-- Migration: Standardized test attempts tracker
-- Date: 2026-04-25
-- Adds a `test_attempts` table for tracking SAT/ACT/PSAT/AP/Subject test
-- sittings. Each row is one attempt: a future test_date with no score is
-- an upcoming test; a past test_date with a total_score is a historical
-- attempt. Subscore breakdowns are stored as freetext (e.g. "Math 720,
-- EBRW 760" or "AP score 5") to keep the schema flexible across test
-- formats without joining sub-tables.
-- RLS enabled with no anon policies, matching the rest of the schema.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

BEGIN;

CREATE TABLE IF NOT EXISTS test_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    test_type TEXT NOT NULL CHECK (test_type IN ('SAT', 'ACT', 'PSAT', 'AP', 'Subject Test', 'Other')),
    test_name TEXT,
    test_date DATE NOT NULL,
    registered BOOLEAN NOT NULL DEFAULT FALSE,
    total_score INTEGER CHECK (total_score IS NULL OR (total_score >= 0 AND total_score <= 2400)),
    breakdown TEXT,
    goal_score INTEGER CHECK (goal_score IS NULL OR (goal_score >= 0 AND goal_score <= 2400)),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS test_attempts_user_date_idx ON test_attempts (user_id, test_date);
CREATE INDEX IF NOT EXISTS test_attempts_user_type_idx ON test_attempts (user_id, test_type);

ALTER TABLE test_attempts ENABLE ROW LEVEL SECURITY;

COMMIT;
