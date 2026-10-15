/*
# Add app_url column and remove download-related columns

1. Changes
- Add `app_url` (text) — URL of the web app to embed/launch inside Zilla Labs
- Add `is_embeddable` (boolean, default true) — whether the app can be shown in an iframe
- The existing `download_url` column is kept for backward compatibility but is no longer used by the UI

2. Notes
- The app now opens web apps directly inside the site via iframe embedding
- No data loss — existing columns are preserved, only new columns added
*/

ALTER TABLE apps ADD COLUMN IF NOT EXISTS app_url text;
ALTER TABLE apps ADD COLUMN IF NOT EXISTS is_embeddable boolean NOT NULL DEFAULT true;
