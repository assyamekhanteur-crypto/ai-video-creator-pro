/*
# Migration: timeline persistence for the video editor
Adds a jsonb column on projects to store the track/clip graph edited in
src/pages/Editor.tsx, so work isn't lost between sessions.
*/

ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS timeline_data jsonb NOT NULL DEFAULT '{"tracks":[]}'::jsonb;
