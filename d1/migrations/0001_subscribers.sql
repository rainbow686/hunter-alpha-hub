-- Subscribers to the "tell me when the next codename appears" list.
--
-- Replaces the Supabase table of the same name (ADR-0014). Cloudflare D1 rather
-- than Supabase because the site is already Workers-only: one account, one
-- deployment pipeline, no third-party credentials to rotate, and no NXDOMAIN to
-- wake up to — the Supabase project behind this form had been deleted for months
-- while the form quietly answered 503.
--
-- What is stored: an email address and when it arrived. Nothing else. No IP, no
-- user agent, no referrer — the privacy policy promises only the address, and a
-- column that does not exist cannot leak.
CREATE TABLE IF NOT EXISTS subscribers (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  email       TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  -- Case-insensitive uniqueness: the API normalises to lower case before writing,
  -- and this index makes a double submit a constraint error rather than a
  -- duplicate row. The 409 the form shows is this index doing its job.
  source      TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_unique
  ON subscribers (LOWER(email));
