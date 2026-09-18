-- Unsubscribe tokens (ADR-0015).
--
-- Every row gets a 128-bit token at signup. The reveal email carries
-- https://www.hunteralphahub.com/unsubscribe?t=<token>, which is the only way to
-- reach a row without the operator's Cloudflare credentials: the API never reads
-- the list, POST /unsubscribe only ever deletes the one row whose token matches.
--
-- Why a column on `subscribers` and not a separate token table: one row per
-- subscriber is the whole model, and a join would add a second way for the two
-- halves to disagree. The unique index makes the token a key, so a collision is a
-- constraint error rather than two people sharing an unsubscribe link.
ALTER TABLE subscribers ADD COLUMN token TEXT;

-- Rows that predate the column (there were none in production on 2026-09-18,
-- but a local database may have test rows) get a token here rather than staying
-- unsubscribable.
UPDATE subscribers SET token = lower(hex(randomblob(16))) WHERE token IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS subscribers_token_unique ON subscribers (token);
