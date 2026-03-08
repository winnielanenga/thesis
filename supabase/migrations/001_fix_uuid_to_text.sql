-- Migration: Fix UUID to TEXT for Google OAuth compatibility
-- Date: 2026-01-25
-- Issue: Google OAuth 'sub' IDs are numeric strings (e.g., "106290319175627162245"),
--        not UUIDs. The profiles.id column was defined as UUID type, causing
--        "invalid input syntax for type uuid" errors.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

BEGIN;

-- 1. Drop foreign key constraints that reference profiles.id
ALTER TABLE user_milestones DROP CONSTRAINT IF EXISTS user_milestones_user_id_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_user_id_fkey;

-- 2. Change the column type from UUID to TEXT in all affected tables
ALTER TABLE profiles ALTER COLUMN id TYPE TEXT;
ALTER TABLE user_milestones ALTER COLUMN user_id TYPE TEXT;
ALTER TABLE tasks ALTER COLUMN user_id TYPE TEXT;

-- 3. Recreate foreign key constraints with CASCADE delete
ALTER TABLE user_milestones 
ADD CONSTRAINT user_milestones_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE tasks 
ADD CONSTRAINT tasks_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

COMMIT;

-- Verification: After running, test by updating a profile in settings
