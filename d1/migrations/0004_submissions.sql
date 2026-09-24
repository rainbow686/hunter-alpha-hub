-- Submissions: what arrives through /submit.
--
-- Why this table exists, given /submit used to say "send it through the contact
-- page": that page has no form, it has a mailto link, and the entry point a person
-- actually uses is the one on the page that asks for the submission. The old note
-- argued against a form because "a form that silently posts into a queue nobody
-- reads would be worse than asking for an email" — an argument about the queue,
-- not about forms. This table is the queue, and the notification is a digest.
--
-- One row per link, not one row per submission: the operator's own use is pasting
-- a few hundred X posts found in one sitting, and a row that holds "300 links in a
-- text blob" cannot be listed, counted, deduplicated or marked read.
--
-- What is stored: what the sender typed. No IP address, no user agent, no
-- referrer — the same rule as `subscribers`, for the same reason: the privacy page
-- promises that a column which does not exist cannot leak, so abuse control is a
-- daily cap on sending rather than per-visitor tracking.
CREATE TABLE IF NOT EXISTS submissions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  -- Which part of the site this belongs to, from the form's routing table
  -- (jev-project / jev-thread / catalogue / stealth / site). The prefix is the
  -- column; a new model topic is a new prefix and no schema change.
  topic        TEXT    NOT NULL,
  -- Where a reply goes. The sender's own address, in their own words.
  email        TEXT    NOT NULL,
  name         TEXT,
  url          TEXT    NOT NULL,
  -- Read off the URL's host by lib/submission-sources.ts, never asked for: the
  -- table maps a host to the column it belongs in (github -> builds, hn -> threads)
  -- and to the ingest script that can enrich it. Stored per row rather than per
  -- request because one paste is usually one platform, but a mixed paste is legal.
  source       TEXT    NOT NULL DEFAULT 'web',
  -- Optional on purpose: the operator submits hundreds of links with no prose,
  -- and a stranger's one sentence is not what decides whether we read the link.
  summary      TEXT,
  numbers      TEXT,
  note         TEXT,
  -- Set when the row has been copied into the repo's candidate queue
  -- (scripts/submissions.mjs pull), which is where the writing happens. The queue
  -- is a JSON file under version control because that is where every other
  -- candidate lives; this table is the door, not the desk.
  pulled_at    TEXT,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  -- When this row was last covered by a digest email. NULL means nobody has been
  -- told about it yet, which is the only state that needs a human.
  notified_at  TEXT
);

-- The two queries that matter: "what has nobody been told about" and "what has not
-- been pulled yet". Both are partial, so both are cheap at any size.
CREATE INDEX IF NOT EXISTS submissions_unnotified ON submissions (created_at) WHERE notified_at IS NULL;
CREATE INDEX IF NOT EXISTS submissions_unpulled   ON submissions (created_at) WHERE pulled_at IS NULL;

-- Same link twice is not two things to read. The operator pasting a batch will
-- re-paste yesterday's by accident; the UNIQUE index makes that a no-op instead of
-- a duplicate row, via INSERT OR IGNORE in the endpoint.
CREATE UNIQUE INDEX IF NOT EXISTS submissions_url_unique ON submissions (url);
