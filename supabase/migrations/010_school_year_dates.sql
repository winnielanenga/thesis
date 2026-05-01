-- Migration: School year start/end dates on profile
-- Date: 2026-04-30
-- Adds 4 integer columns to profiles to record when the user's school year
-- starts and ends. Stored as month (0-11, JavaScript Date convention) + day
-- (1-31) so the year doesn't get baked in. Used by the planner to draw the
-- timeline; doesn't affect grade-level/season logic which stays tied to a
-- generic Aug cutoff.
--
-- Defaults preserve existing behavior (Sept 1 - June 15) for any user who
-- onboarded before this migration.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

BEGIN;

ALTER TABLE profiles
    ADD COLUMN IF NOT EXISTS school_year_start_month INTEGER DEFAULT 8 CHECK (school_year_start_month BETWEEN 0 AND 11),
    ADD COLUMN IF NOT EXISTS school_year_start_day   INTEGER DEFAULT 1 CHECK (school_year_start_day BETWEEN 1 AND 31),
    ADD COLUMN IF NOT EXISTS school_year_end_month   INTEGER DEFAULT 5 CHECK (school_year_end_month BETWEEN 0 AND 11),
    ADD COLUMN IF NOT EXISTS school_year_end_day     INTEGER DEFAULT 15 CHECK (school_year_end_day BETWEEN 1 AND 31);

-- Backfill any rows that pre-date the migration (e.g. from before defaults applied)
UPDATE profiles SET school_year_start_month = 8 WHERE school_year_start_month IS NULL;
UPDATE profiles SET school_year_start_day   = 1 WHERE school_year_start_day   IS NULL;
UPDATE profiles SET school_year_end_month   = 5 WHERE school_year_end_month   IS NULL;
UPDATE profiles SET school_year_end_day     = 15 WHERE school_year_end_day    IS NULL;

COMMIT;
