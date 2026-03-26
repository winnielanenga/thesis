-- Migration: Add dream_colleges column to profiles
-- Date: 2026-03-17
-- Issue: Onboarding flow now collects optional dream colleges list.
--        The column was defined in TypeScript types but missing from the actual table.
--
-- INSTRUCTIONS:
-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard)
-- Navigate to: Project -> SQL Editor -> New Query -> Paste & Run

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS dream_colleges TEXT[] DEFAULT NULL;
