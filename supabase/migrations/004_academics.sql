-- Migration: Academics persistence (courses + exams)
-- Date: 2026-04-25
-- Adds two new tables so the Academics page state survives a page refresh:
--   - courses: term-scoped course records with grade, credits, type
--   - exams:   per-course exam tracker
-- Both reference profiles(id) via user_id for ownership and CASCADE on delete.
-- Also tightens target_gpa to a 0-5 range via a CHECK constraint.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

BEGIN;

-- 1. courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Regular', 'Honors', 'AP/IB')),
    grade TEXT CHECK (grade IS NULL OR grade IN ('A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F')),
    credits NUMERIC(3,1) NOT NULL DEFAULT 1 CHECK (credits > 0 AND credits <= 10),
    term_season TEXT NOT NULL CHECK (term_season IN ('Fall', 'Winter', 'Spring')),
    term_year INTEGER NOT NULL CHECK (term_year >= 2020 AND term_year <= 2050),
    grade_level INTEGER CHECK (grade_level IS NULL OR grade_level BETWEEN 9 AND 12),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS courses_user_term_idx ON courses (user_id, term_year, term_season);

-- 2. exams table
CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    exam_name TEXT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS exams_user_date_idx ON exams (user_id, date);
CREATE INDEX IF NOT EXISTS exams_course_idx ON exams (course_id);

-- 3. Tighten target_gpa to a sensible range (column already exists, no data loss)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_target_gpa_range;
ALTER TABLE profiles
ADD CONSTRAINT profiles_target_gpa_range
CHECK (target_gpa IS NULL OR (target_gpa >= 0 AND target_gpa <= 5));

COMMIT;
