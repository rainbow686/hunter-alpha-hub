#!/usr/bin/env node
/**
 * ingest-devto.mjs — dev.to posts about Jev → candidates for the discussion column.
 *
 *   node scripts/ingest-devto.mjs [--dry]
 *
 * ## Why dev.to and not Reddit
 *
 * The column was mapped onto the reference site's `/community`, which carries Reddit and Hacker
 * News. Reddit is closed to us: its public JSON answers **403 without OAuth** and creating the app
 * is still blocked (`lessons/reddit-app-creation-is-a-dead-end.md`). Re-checked 2026-09-23:
 * Bluesky's public API 403s, Lobsters rejects the query shape — and dev.to answers **200**, with
 * thirty Jev posts already in it.
 *
 * ## What it takes, and what it refuses to decide
 *
 * dev.to's public API has no full-text search; `?tag=jev` is the query, and tagging is the author's
 * own act — which makes it a decent relevance filter rather than a guess. The row keeps the fields
 * the column prints: title, author, date, reactions, comments, cover image, reading time, and the
 * author's own description.
 *
 * Candidates only, like every other queue here: nothing reaches a page until somebody reads it and
 * writes the note (`scripts/check-intake.mjs` enforces both halves). A dev.to article is one
 * person's write-up, and the column's only value is that a person here read it first.
 *
 * One field worth knowing about: dev.to publishes its own **AI disclosure** on each article
 * (`ai_disclosure_label`). We store it, because a column that quotes thirty write-ups about an AI
 * model should say which of them were written by one.
 */
import { mergeQueue } from "./lib/merge-queue.mjs";
import { matches, requireSource, resolveTopic } from "./lib/topics.mjs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
/** Default topic `jev`; `--topic laya` uses Laya's tags and appends to the same threads file. */
const TOPIC = resolveTopic();
const CFG = requireSource(TOPIC, "devto");
const QUEUE = resolve(ROOT, CFG.out);
const UA = "hunter-alpha-hub-intake/0.1 (+https://www.hunteralphahub.com/contact)";
const TAGS = CFG.tags;
/** The 30 most recent under `tag=jev` at the time of writing; dev.to pages at 30 by default. */
const PER_PAGE = CFG.perPage ?? 30;
const asOf = new Date().toISOString().slice(0, 10);
/** Relevance is the author's tag plus the words actually in the row. */
const RELEVANT = CFG.relevance;

const seen = new Set();
const fresh = [];

for (const tag of TAGS) {
  let page = 1;
  for (; page <= 2; page++) {
    const url = new URL("https://dev.to/api/articles");
    url.searchParams.set("tag", tag);
    url.searchParams.set("per_page", String(PER_PAGE));
    url.searchParams.set("page", String(page));
    const res = await fetch(url, { headers: { "user-agent": UA, accept: "application/json" } });
    if (!res.ok) {
      console.error(`tag=${tag} page=${page}: HTTP ${res.status} — stopping this tag`);
      break;
    }
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) break;
    let kept = 0;
    for (const a of items) {
      const id = `devto:${a.id}`;
      if (seen.has(id)) continue;
      /*
       * `tags` comes back as a comma-separated string on the list endpoint and `tag_list` as an
       * array — the first run crashed on `.join` because of it. Read whichever is there.
       */
      const tagText = Array.isArray(a.tag_list)
        ? a.tag_list.join(" ")
        : typeof a.tags === "string"
          ? a.tags
          : "";
      /*
       * Relevance is judged on the row's **own words**, never on the tag we searched by.
       *
       * The first run folded `tagText` into this string and the Jev queue filled with 2023–2025
       * TypeScript posts about "type-safe" APIs: dev.to's `typesafe` tag is a general tag about type
       * safety, and a row that carried it matched `\btypesafe\b` through the tag itself. A tag is how
       * we *found* the row; it cannot also be the evidence that the row is about this model.
       *
       * The date floor is the second half of the same fix: the model is from September 2026, so a
       * 2024 article cannot be about it whatever its tags say.
       */
      const text = `${a.title} ${a.description ?? ""}`;
      if (!RELEVANT.test(text)) continue;
      if (CFG.minDate && (a.published_at ?? "").slice(0, 10) < CFG.minDate) continue;
      seen.add(id);
      fresh.push({
        id,
        source: "devto",
        url: a.url,
        title: a.title,
        author: a.user?.name ?? a.user?.username ?? "",
        publishedAt: (a.published_at ?? "").slice(0, 10),
        media: { kind: "article", thumb: a.cover_image ?? "", thumbW: 1000, thumbH: 420 },
        metrics: {
          reactions: a.positive_reactions_count ?? 0,
          comments: a.comments_count ?? 0,
          readingMinutes: a.reading_time_minutes ?? null,
          asOf,
        },
        /** The author's own one-line summary, quoted rather than paraphrased. */
        what: a.description ?? "",
        /** dev.to's own disclosure. Null means the author declared nothing. */
        aiDisclosure: a.ai_disclosure_level ?? null,
        candidateReason: `tagged ${tag} on dev.to`,
        status: "candidate",
        ourNote: "",
        checked: [],
      });
      kept += 1;
    }
    console.log(`tag=${tag} page=${page}: ${items.length} returned, ${kept} kept`);
    if (items.length < PER_PAGE) break;
    await new Promise((r) => setTimeout(r, 400));
  }
}

const dry = process.argv.includes("--dry");
const { added, kept, total, published } = mergeQueue(QUEUE, fresh, {
  note: "candidate-only queue — publish requires a written ourNote, enforced by scripts/check-intake.mjs",
}, { dry });
console.log(`\ndev.to: ${fresh.length} found · ${added} new · ${kept} already here · ${published} published · ${total} total${dry ? " (dry run)" : ""}`);
for (const e of fresh.slice(0, 10)) {
  console.log(`  ${String(e.metrics.reactions).padStart(4)} ♥  ${String(e.metrics.comments).padStart(3)} c  ${e.publishedAt}  ${e.title.slice(0, 62)}`);
}
