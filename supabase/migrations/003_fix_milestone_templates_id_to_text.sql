-- Migration: Fix milestone_templates.id from UUID to TEXT
-- Date: 2026-03-29
-- Issue: Milestone template IDs are human-readable strings (e.g., "9-fall-meet-with-school-counselor"),
--        not UUIDs. The milestone_templates.id column was defined as UUID type, causing
--        "invalid input syntax for type uuid" errors when upserting templates.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

BEGIN;

-- 1. Drop foreign key constraint on user_milestones.template_id that references milestone_templates.id
ALTER TABLE user_milestones DROP CONSTRAINT IF EXISTS user_milestones_template_id_fkey;

-- 2. Change the column types from UUID to TEXT
ALTER TABLE milestone_templates ALTER COLUMN id TYPE TEXT;
ALTER TABLE user_milestones ALTER COLUMN template_id TYPE TEXT;

-- 3. Recreate the foreign key constraint
ALTER TABLE user_milestones
ADD CONSTRAINT user_milestones_template_id_fkey
FOREIGN KEY (template_id) REFERENCES milestone_templates(id) ON DELETE CASCADE;

-- 4. Ensure a unique constraint exists on (user_id, template_id) for upserts
ALTER TABLE user_milestones
DROP CONSTRAINT IF EXISTS user_milestones_user_id_template_id_key;

ALTER TABLE user_milestones
ADD CONSTRAINT user_milestones_user_id_template_id_key
UNIQUE (user_id, template_id);

COMMIT;
