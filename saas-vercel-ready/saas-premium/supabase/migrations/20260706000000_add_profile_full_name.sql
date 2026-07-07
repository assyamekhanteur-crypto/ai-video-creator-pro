/*
# Migration: add full_name to profiles

Needed for the new Settings page (Profile tab).
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text;
