/*
# Create apps table for Zilla Labs

1. New Tables
- `apps`
  - `id` (uuid, primary key)
  - `name` (text, not null) — display name of the app
  - `tagline` (text) — short one-line description
  - `description` (text) — longer description shown on detail view
  - `icon_url` (text) — URL to the app icon image
  - `platform` (text, not null) — "apk", "exe", or "both"
  - `category` (text) — e.g. "Productivity", "Games", "Utilities"
  - `version` (text) — current version string
  - `file_size` (text) — human-readable file size, e.g. "24.5 MB"
  - `download_url` (text, not null) — direct URL to the downloadable file
  - `download_count` (integer, default 0) — tracks number of downloads
  - `release_date` (date) — date of this release
  - `created_at` (timestamp, default now())

2. Security
- Enable RLS on `apps`.
- Single-tenant public app (no auth): allow anon + authenticated full CRUD.
  Data is intentionally public/shared — visitors can browse and download
  without signing in. Download count increments are public writes.

3. Notes
- The frontend reads all apps to display the download catalog.
- Each download click increments `download_count`.
- No user accounts or sign-in required.
*/

CREATE TABLE IF NOT EXISTS apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tagline text,
  description text,
  icon_url text,
  platform text NOT NULL DEFAULT 'exe',
  category text DEFAULT 'Utilities',
  version text DEFAULT '1.0.0',
  file_size text,
  download_url text NOT NULL,
  download_count integer NOT NULL DEFAULT 0,
  release_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE apps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_apps" ON apps;
CREATE POLICY "anon_select_apps" ON apps FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_apps" ON apps;
CREATE POLICY "anon_insert_apps" ON apps FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_apps" ON apps;
CREATE POLICY "anon_update_apps" ON apps FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_apps" ON apps;
CREATE POLICY "anon_delete_apps" ON apps FOR DELETE
  TO anon, authenticated USING (true);
