/*
# Make download_url nullable

The app no longer uses file downloads — apps are launched in-browser.
The download_url column is kept for backward compatibility but is now nullable
so we can insert apps that don't have a download URL (like Zilla Hub and Zilla Desk).
*/

ALTER TABLE apps ALTER COLUMN download_url DROP NOT NULL;
