-- Migration: Recommendation letter tracker
-- Date: 2026-04-25
-- Adds a `recommendations` table for tracking teacher / counselor / outside
-- recommendation letters: who you asked, when, deadline, status, notes.
-- Status lifecycle: Not Asked -> Asked -> Confirmed -> Submitted, with
-- Declined as a terminal alternative state.
-- RLS enabled with no anon policies, matching the rest of the schema.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

BEGIN;

CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recommender_name TEXT NOT NULL,
    recommender_role TEXT,
    email TEXT,
    type TEXT NOT NULL CHECK (type IN ('Teacher', 'Counselor', 'Coach', 'Employer', 'Other')),
    status TEXT NOT NULL DEFAULT 'Not Asked' CHECK (status IN ('Not Asked', 'Asked', 'Confirmed', 'Submitted', 'Declined')),
    requested_date DATE,
    deadline DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS recommendations_user_status_idx ON recommendations (user_id, status);
CREATE INDEX IF NOT EXISTS recommendations_user_deadline_idx ON recommendations (user_id, deadline);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

COMMIT;
