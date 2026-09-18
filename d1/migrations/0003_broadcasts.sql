-- One row per notification we send out (ADR-0017).
--
-- Why a table instead of "just remember": a broadcast sends one email per
-- subscriber, and the failure mode everyone hits once is running it twice — 300
-- people get the same message twice and there is no way to take it back. The
-- unique index on `broadcast_key` makes the second run a constraint error rather
-- than a second send: the operator has to pass `force` to mean it.
--
-- It is also the only record of what went out and to how many, which the Worker
-- logs cannot answer after 24 hours.
CREATE TABLE IF NOT EXISTS broadcasts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  -- The codename slug, e.g. "owl-alpha" or "reveal-unbiased-pareto".
  broadcast_key TEXT NOT NULL,
  subject     TEXT    NOT NULL,
  recipients  INTEGER NOT NULL DEFAULT 0,
  failures    INTEGER NOT NULL DEFAULT 0,
  sent_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS broadcasts_key_unique ON broadcasts (broadcast_key);
