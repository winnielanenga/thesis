-- Migration: Extracurricular activities tracker
-- Date: 2026-04-25
-- Adds an `activities` table for tracking activities to list on the Common App:
--   - name, organization, role, category, description
--   - hours per week, weeks per year, grade levels participated
--   - "continue in college" flag (mirrors a Common App question)
-- Field shapes mirror the Common App "Activities" section so the data
-- can be transcribed straight into an application later.
-- RLS enabled with no anon policies, matching the rest of the schema.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

BEGIN;

CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    organization TEXT,
    role TEXT,
    category TEXT NOT NULL CHECK (category IN (
        'Academic', 'Athletics', 'Arts', 'Community Service',
        'Leadership / Government', 'Work / Internship',
        'Religious / Cultural', 'Research / Science', 'Other'
    )),
    description TEXT,
    hours_per_week NUMERIC(4,1) CHECK (hours_per_week IS NULL OR (hours_per_week >= 0 AND hours_per_week <= 168)),
    weeks_per_year INTEGER CHECK (weeks_per_year IS NULL OR (weeks_per_year >= 0 AND weeks_per_year <= 52)),
    grade_levels INTEGER[] NOT NULL DEFAULT '{}',
    continue_in_college BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT activities_grade_levels_valid CHECK (
        grade_levels <@ ARRAY[9, 10, 11, 12]
    )
);

CREATE INDEX IF NOT EXISTS activities_user_idx ON activities (user_id);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

COMMIT;
