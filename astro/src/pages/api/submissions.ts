import type { APIRoute } from "astro";
import { inferSource } from "@repo/lib/submission-sources";

/**
 * POST /api/submissions — the door for /submit.
 *
 * Writes one row per link, then decides whether to send **one digest**, not one
 * email per row. That distinction is the whole design, and the first version got
 * it wrong: it mailed the operator once per submission, which is right for a
 * stranger sending one repository and useless for the operator pasting three
 * hundred X posts found in one sitting. The notification is not the workflow; it
 * is a doorbell. Repo-side, `scripts/submissions.mjs` is the workflow.
 *
 * Three rules shape the rest:
 *
 *   1. The row is written before anything is sent. A stored row that nobody was
 *      told about is recoverable (`notified_at IS NULL` is exactly that state);
 *      an email about a row that failed to insert is nothing at all.
 *   2. `summary` is optional. The operator submits hundreds of bare links, and
 *      requiring prose from them would be requiring a form of work the pipeline
 *      is going to do anyway — nothing publishes without `ourNote`, which is
 *      written later, by a person, after reading the link.
 *   3. No IP, user agent or referrer is stored, so abuse control is a global
 *      daily cap on *sending* plus a honeypot, rather than tracking visitors.
 *
 * Silent mode: a request carrying `Authorization: Bearer $NOTIFY_TOKEN` omits the
 * email entirely and marks the rows notified, for when the operator (or the agent
 * acting for them) already knows what it just inserted. Same token the reveal
 * broadcast uses, so there is one operator credential rather than two.
 */
export const prerender = false;

interface Env {
  DB?: D1Database;
  NOTIFY_TOKEN?: string;
  EMAIL?: {
    send(message: {
      to: string;
      from: { email: string; name?: string };
      replyTo?: string;
      subject: string;
      html?: string;
      text?: string;
    }): Promise<{ messageId?: string }>;
  };
}

const OWNER = "rainbow686@gmail.com";
const FROM = { email: "notify@hunteralphahub.com", name: "Hunter Alpha Hub" };

/** Past the cap rows still land; only the mail stops. A flood costs rows, not mail. */
const DAILY_SEND_CAP = 40;
/**
 * One digest per window. A burst of pastes inside the window is one doorbell, and
 * every digest lists *everything* still unnotified, so a suppressed send delays a
 * notification rather than losing it.
 */
const DIGEST_WINDOW_MINUTES = 15;
/** Above this many links in one request the digest lists a sample and points at the queue. */
const DIGEST_SAMPLE = 20;
const MAX_LINKS_PER_REQUEST = 500;

/**
 * Every topic the form can send, grouped the way the site is. The list is the
 * endpoint's allowlist, so a topic that the form can render but this does not
 * know is a 400 the sender did not earn — the two live in one file's worth of
 * distance for that reason. Laya's four landed with its topic on 2026-09-24.
 */
const TOPICS = [
  "jev-project", "jev-demo", "jev-thread", "jev-video",
  "laya-project", "laya-measurement", "laya-thread", "laya-video",
  "catalogue", "stealth", "site",
];
const MAX = { email: 254, name: 120, url: 500, summary: 2000, numbers: 500, note: 1000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Anything that looks like a URL on its own line. Bare hosts get https:// in front. */
const URLISH = /^(?:https?:\/\/\S+|\S+\.\S{2,}\/\S*|\S+\.(?:com|org|net|io|dev|ai|co|gg)\/?)$/i;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

const clean = (value: unknown, max: number): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
};

/** Split a paste into links: one per line, tolerate commas and whitespace. */
function parseLinks(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const piece of raw.split(/[\s,]+/)) {
    const token = piece.trim();
    if (!token || !URLISH.test(token)) continue;
    const url = /^https?:\/\//i.test(token) ? token : `https://${token}`;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push(url.slice(0, MAX.url));
    if (out.length >= MAX_LINKS_PER_REQUEST) break;
  }
  return out;
}

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const POST: APIRoute = async ({ request, locals }) => {
  const env = (locals as { runtime?: { env?: Env } })?.runtime?.env ?? (process.env as Env);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ error: "Body must be JSON" }, 400);
  }

  /*
   * The honeypot. A field no human sees, so a value in it came from a script. It
   * answers 201 having stored nothing: telling a bot it was caught only teaches
   * whoever wrote it to leave the field alone.
   */
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return json({ ok: true, stored: 0 }, 201);
  }

  const silent = (() => {
    const expected = env.NOTIFY_TOKEN;
    if (!expected) return false;
    const offered = (request.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
    return offered.length > 0 && offered === expected;
  })();

  const email = clean(body.email, MAX.email);
  const topic = clean(body.topic, 30) ?? "site";
  const rawUrl = clean(body.url, 40000) ?? "";

  /*
   * The operator's own batches arrive with no address to reply to and no prose;
   * requiring either would be requiring the form to know who is typing. So the
   * email is required only when there is something to answer — a silent request
   * needs none — and the summary is never required.
   */
  if (!silent) {
    if (!email || !EMAIL_RE.test(email)) {
      return json({ error: "A valid email address is needed, so a reply has somewhere to go." }, 400);
    }
  }
  if (!TOPICS.includes(topic)) {
    return json({ error: `topic must be one of: ${TOPICS.join(", ")}` }, 400);
  }

  const links = parseLinks(rawUrl);
  if (!links.length) {
    return json({ error: "No link found. One URL per line, starting with http:// or https://" }, 400);
  }

  const db = env.DB;
  if (!db) {
    return json(
      {
        error: "Not stored",
        detail:
          "This deployment has no database bound, so nothing was saved and nothing was sent. Try again later rather than resending.",
      },
      503,
    );
  }

  const row = {
    topic,
    email: (email ?? "operator@hunteralphahub.com").toLowerCase(),
    name: clean(body.name, MAX.name),
    summary: clean(body.summary, MAX.summary),
    numbers: clean(body.numbers, MAX.numbers),
    note: clean(body.note, MAX.note),
  };

  let stored = 0;
  try {
    for (const url of links) {
      // OR IGNORE against the unique index on url: a re-pasted batch is a no-op
      // rather than a duplicate of everything already in the queue.
      const result = await db
        .prepare(
          "INSERT OR IGNORE INTO submissions (topic, email, name, url, source, summary, numbers, note) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(row.topic, row.email, row.name, url, inferSource(url).source, row.summary, row.numbers, row.note)
        .run();
      stored += Number(result?.meta?.changes ?? 0);
    }
  } catch (error) {
    return json(
      { error: "Not stored", detail: `The database refused the row: ${String(error).slice(0, 160)}` },
      503,
    );
  }

  const duplicate = stored < links.length;

  /*
   * Silent mode: the caller already knows. Mark them notified so they never show
   * up in a later digest — otherwise the operator's own 300 rows would be mailed
   * back to them on the next stranger's submission.
   */
  if (silent) {
    await db
      .prepare("UPDATE submissions SET notified_at = datetime('now') WHERE notified_at IS NULL")
      .run();
    return json({ ok: true, stored, duplicate, mailed: false, silent: true }, 201);
  }

  if (!env.EMAIL) {
    return json({ ok: true, stored, duplicate, mailed: false, note: "Stored. This deployment cannot send mail yet." }, 201);
  }

  // Window + cap: both are about the doorbell, not the queue.
  const recent = await db
    .prepare(
      "SELECT COUNT(*) AS sent, MAX(notified_at) AS last FROM submissions " +
        "WHERE notified_at >= datetime('now', ?)",
    )
    .bind(`-${DIGEST_WINDOW_MINUTES} minutes`)
    .first<{ sent: number; last: string | null }>();
  const sentToday = await db
    .prepare("SELECT COUNT(*) AS n FROM submissions WHERE notified_at >= datetime('now', '-1 day')")
    .first<{ n: number }>();

  if (Number(sentToday?.n ?? 0) >= DAILY_SEND_CAP) {
    return json({ ok: true, stored, duplicate, mailed: false, note: "Stored. The daily notification cap is reached." }, 201);
  }
  if (recent?.last) {
    // Inside the window: the rows stay unnotified and the next digest carries them.
    return json({ ok: true, stored, duplicate, mailed: false, note: "Stored. A digest went out minutes ago; these ride the next one." }, 201);
  }

  const pending = await db
    .prepare(
      "SELECT id, topic, source, email, name, url, summary FROM submissions " +
        "WHERE notified_at IS NULL ORDER BY id LIMIT 400",
    )
    .all<{ id: number; topic: string; source: string; email: string; name: string | null; url: string; summary: string | null }>();
  const rows = pending.results ?? [];
  if (!rows.length) {
    return json({ ok: true, stored, duplicate, mailed: false, note: "Stored. Nothing pending to report." }, 201);
  }

  const byTopic = new Map<string, typeof rows>();
  for (const item of rows) {
    const list = byTopic.get(item.topic) ?? [];
    list.push(item);
    byTopic.set(item.topic, list);
  }
  const sender = row.name ? `${row.name} <${row.email}>` : row.email;
  const shown = rows.slice(0, DIGEST_SAMPLE);

  const text = [
    `${rows.length} submission${rows.length === 1 ? "" : "s"} waiting.`,
    "",
    ...[...byTopic.entries()].map(([topic, list]) => `${topic} — ${list.length}`),
    "",
    ...shown.map((item) => `${item.id}. [${item.source}] ${item.url}${item.summary ? `\n     ${item.summary}` : ""}`),
    rows.length > shown.length ? `\n… and ${rows.length - shown.length} more.` : "",
    "",
    `Read the queue: cd astro && node scripts/submissions.mjs list`,
    `Move it into the columns: node scripts/submissions.mjs pull`,
    "",
    `Reply to this message to answer ${sender}.`,
  ].filter(Boolean).join("\n");

  const html =
    `<div style="font:14px/1.6 -apple-system,Segoe UI,Roboto,sans-serif;color:#1c1a16">` +
    `<p style="margin:0 0 12px"><strong>${rows.length}</strong> submission${rows.length === 1 ? "" : "s"} waiting · ` +
    `${[...byTopic.entries()].map(([t, l]) => `${escape(t)} ${l.length}`).join(" · ")}</p>` +
    `<ol style="margin:0 0 12px;padding-left:20px">` +
    shown
      .map(
        (item) =>
          `<li style="margin-bottom:6px"><a href="${escape(item.url)}">${escape(item.url)}</a>` +
          `<br><span style="color:#5f5849;font-size:12px">${escape(item.source)} · ${escape(item.topic)}</span>` +
          (item.summary ? `<br>${escape(item.summary)}` : "") +
          `</li>`,
      )
      .join("") +
    `</ol>` +
    (rows.length > shown.length
      ? `<p style="margin:0 0 12px;color:#5f5849">… and ${rows.length - shown.length} more.</p>`
      : "") +
    `<p style="margin:0 0 12px;font-family:ui-monospace,Menlo,monospace;font-size:12px">` +
    `node scripts/submissions.mjs list · node scripts/submissions.mjs pull</p>` +
    `<p style="margin:0;color:#5f5849;font-size:12px">Reply to this message to answer ${escape(sender)}.</p>` +
    `</div>`;

  try {
    await env.EMAIL.send({
      to: OWNER,
      from: FROM,
      // Only set replyTo when a person is actually on the other end. In silent
      // mode there is nobody to answer, and the placeholder address would bounce.
      ...(silent ? {} : { replyTo: row.email }),
      subject: `Submission: ${rows.length} waiting — ${[...new Set(rows.map((r) => r.source))].join(", ")}`,
      text,
      html,
    });
    await db
      .prepare("UPDATE submissions SET notified_at = datetime('now') WHERE notified_at IS NULL")
      .run();
    return json({ ok: true, stored, duplicate, mailed: true, pending: rows.length }, 201);
  } catch (error) {
    return json(
      {
        ok: true,
        stored,
        duplicate,
        mailed: false,
        note: `Stored. The digest did not leave (${String(error).slice(0, 120)}) — the rows are in the queue.`,
      },
      201,
    );
  }
};
