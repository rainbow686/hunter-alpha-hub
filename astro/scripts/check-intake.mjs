/**
 * check-intake.mjs — the gate that keeps the intake columns honest.
 *
 * roadmap/jev-intake.md §4. Automation collects; a person decides. These are the
 * mechanical consequences of that sentence, and they run in `npm run checks` so
 * the rule cannot be quietly dropped when someone is in a hurry:
 *
 *   1. every rendered entry carries a written note (>= 20 words) — no note, no page;
 *   2. every entry has a URL, an author and a date;
 *   3. no URL appears twice;
 *   4. thumbnails declare their size (CLS) — enforced where thumbnails exist;
 *   5. the candidate queue has a ceiling: past it we are hoarding, not writing.
 *   6. every author-reported figure carries its evidence (value, what it is about, the
 *      sentence, the page, the date) and belongs to a published row.
 */
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const QUEUES = [
  resolve(ROOT, "lib/data/jev-threads.json"),
  resolve(ROOT, "lib/data/jev-videos.json"),
  resolve(ROOT, "lib/data/jev-x-posts.json"),
  resolve(ROOT, "lib/data/jev-builds.json"),
];
const MAX_CANDIDATES = 200;
// The facet vocabulary is a single file so the guard and the pages cannot disagree.
const VOCAB = new Set(JSON.parse(readFileSync(resolve(ROOT, "lib/data/jev-tags.json"), "utf8")).tags.map((t) => t.slug));
const MIN_NOTE_WORDS = 20;
const HOST_WHITELIST = ["news.ycombinator.com", "www.reddit.com", "reddit.com", "www.youtube.com", "youtube.com", "github.com", "x.com", "twitter.com"];

const fail = [];
const dossieSlugs = new Map();
/* Published ids, so a number can never be attached to a row that is not on the site. */
const publishedIds = new Set();
let queued = 0, publishedTotal = 0, queryTotal = 0, waiting = 0, rejectedTotal = 0;
for (const QUEUE of QUEUES) {
  if (!existsSync(QUEUE)) { fail.push(`${QUEUE} missing — run its ingest script`); continue; }
  const q = JSON.parse(readFileSync(QUEUE, "utf8"));
  queryTotal += q.meta?.queries?.length ?? 0;
  const entries = q.entries ?? [];
  if (entries.length > MAX_CANDIDATES) fail.push(`candidate queue holds ${entries.length} entries (ceiling ${MAX_CANDIDATES}) — write notes or tighten the queries`);

  const seen = new Map();
  let published = 0;
  for (const e of entries) {
    const where = e.id ?? "(no id)";
    if (seen.has(e.url)) fail.push(`${where}: duplicate URL, already used by ${seen.get(e.url)}`);
    seen.set(e.url, where);

    if (!["candidate", "published", "rejected", "removed"].includes(e.status)) fail.push(`${where}: unknown status "${e.status}"`);
    if (!e.url || !e.author || !e.publishedAt) fail.push(`${where}: url/author/publishedAt are required`);
    /*
     * A rejection is a decision, and a decision without a written reason is the
     * beginning of a queue that quietly becomes a graveyard. Six "awesome-*" lists
     * were rejected on 2026-09-22 because the resources column already carries them;
     * the reason is what stops the next person re-adding them.
     */
    if (["rejected", "removed"].includes(e.status)) {
      const reason = (e.reason ?? "").trim().split(/\s+/).filter(Boolean).length;
      if (reason < 5) fail.push(`${where}: ${e.status} with a ${reason}-word reason (minimum 5)`);
      rejectedTotal += 1;
    }
    if (e.status === "candidate") waiting += 1;

    if (e.status === "published") {
      published += 1;
      publishedIds.add(e.id);
      const words = (e.ourNote ?? "").trim().split(/\s+/).filter(Boolean).length;
      if (words < MIN_NOTE_WORDS) fail.push(`${where}: published with a ${words}-word note (minimum ${MIN_NOTE_WORDS}) — the note is the only thing that makes this not a link dump`);
      if (!Array.isArray(e.checked) || e.checked.length === 0) fail.push(`${where}: published with nothing recorded in "checked"`);
      const host = new URL(e.url).hostname;
      if (!HOST_WHITELIST.includes(host)) fail.push(`${where}: host ${host} is not in the whitelist`);
      if (e.media?.thumb && (!e.media.thumbW || !e.media.thumbH)) fail.push(`${where}: thumbnail without width/height`);

      /*
       * The dossier is the first-hand layer, and for a build it is the only thing that
       * makes a page (rather than a list row) defensible: what it does, how it works, what
       * we read in the repository, and what we did NOT check. A dossier with the first half
       * and not the last is an advertisement, so both halves are required, in words.
       */
      if (e.source === "github") {
        const d = e.dossier;
        if (!d) {
          fail.push(`${where}: published without a dossier — a build with no first-hand layer is a link with a sentence`);
        } else {
          const words = (s) => (s ?? "").trim().split(/\s+/).filter(Boolean).length;
          if (!/^[a-z0-9][a-z0-9-]*$/.test(d.slug ?? "")) fail.push(`${where}: dossier slug "${d.slug}" is not url-safe`);
          if (dossieSlugs.has(d.slug)) fail.push(`${where}: dossier slug "${d.slug}" is already used by ${dossieSlugs.get(d.slug)}`);
          dossieSlugs.set(d.slug, where);
          if (words(d.whatItDoes) < 25) fail.push(`${where}: dossier whatItDoes is ${words(d.whatItDoes)} words (minimum 25)`);
          if (words(d.howItWorks) < 20) fail.push(`${where}: dossier howItWorks is ${words(d.howItWorks)} words (minimum 20)`);
          if (!Array.isArray(d.whatWeChecked) || d.whatWeChecked.length < 3) {
            fail.push(`${where}: dossier lists ${d.whatWeChecked?.length ?? 0} checked items (minimum 3)`);
          }
          if (words(d.whatWeDidNotCheck) < 10) {
            fail.push(`${where}: dossier whatWeDidNotCheck is ${words(d.whatWeDidNotCheck)} words (minimum 10) — the limit is half the value`);
          }
          for (const field of ["license", "stack", "readOn", "bestFor"]) {
            if (!d[field]) fail.push(`${where}: dossier has no ${field}`);
          }
        }
      }

      // Facets: tags are optional (an untagged row appears in no facet — no junk-drawer
      // bucket), but a tag that is not in the vocabulary fails the build. Without that, a
      // typo produces a silently empty facet page — which is how x-posts once rendered zero
      // cards (docs/lessons/).
      const tags = e.tags ?? [];
      for (const tag of tags) if (!VOCAB.has(tag)) fail.push(`${where}: tag "${tag}" is not in lib/data/jev-tags.json`);

      // The excerpt tier (docs/handbook/writing-style.md): a clip is allowed only up to
      // five seconds, silent, and only when the row states where it came from and how
      // long it runs. Anything else is a copy wearing a quotation's clothes.
      if (e.media?.clip) {
        const clip = e.media.clip;
        if (!(clip.seconds > 0 && clip.seconds <= 5)) fail.push(`${where}: clip is ${clip.seconds}s — the excerpt tier allows a maximum of 5`);
        if (clip.audio !== false) fail.push(`${where}: clip keeps its audio — excerpts must be silent (music rights, and the loudest fingerprint)`);
        if (!clip.source || !clip.asOf) fail.push(`${where}: clip without source/date — the row must say where it came from and when`);
        if (!e.url) fail.push(`${where}: clip without a link back to the original post`);
      }
    }
  }
  queued += entries.length; publishedTotal += published;
}

/*
 * The author-reported figures on the cards (`lib/jev-claims.json`).
 *
 * A number on a card is the easiest thing on this site to fake and the most damaging to get
 * wrong: a bare `300 ms` reads as our measurement of Jev unless the label says otherwise, and
 * two rows in this file are about models that are not Jev at all. So the gate asks for the
 * whole chain — what it is about, the sentence, the page, the day — and refuses a figure with
 * no quote, because an unsourced number is exactly what the reference site prints.
 */
const CLAIMS_FILE = resolve(ROOT, "lib/data/jev-claims.json");
if (!existsSync(CLAIMS_FILE)) {
  fail.push("lib/data/jev-claims.json missing — the cards reference it");
} else {
  const file = JSON.parse(readFileSync(CLAIMS_FILE, "utf8"));
  const claims = file.claims ?? {};
  let claimTotal = 0;
  for (const [id, list] of Object.entries(claims)) {
    if (!publishedIds.has(id)) fail.push(`claims/${id}: no published row with that id`);
    if (!Array.isArray(list) || list.length === 0) fail.push(`claims/${id}: empty list — delete the key instead`);
    for (const [i, c] of (list ?? []).entries()) {
      const at = `claims/${id}[${i}]`;
      const missing = ["value", "label", "quote", "from", "source"].filter((k) => typeof c[k] !== "string" || !c[k].trim());
      if (missing.length) { fail.push(`${at}: missing ${missing.join(", ")}`); continue; }
      if (!/\d/.test(c.value)) fail.push(`${at}: value "${c.value}" carries no digit`);
      // The label has to say what the number is about. "Latency" is not an answer: latency of
      // what, measured by whom, and if it is a substitute model's number, say so.
      if (c.label.trim().split(/\s+/).length < 3) fail.push(`${at}: label "${c.label}" is too short to say what the number is about`);
      if (c.quote.trim().split(/\s+/).length < 6) fail.push(`${at}: quote is too short to be the sentence the number came from`);
      if (!/^https?:\/\//.test(c.from)) fail.push(`${at}: from is not a URL`);
      else if (!HOST_WHITELIST.includes(new URL(c.from).hostname)) fail.push(`${at}: from points at ${new URL(c.from).hostname}, outside the source whitelist`);
      claimTotal += 1;
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(file.meta?.readOn ?? "")) fail.push("claims meta.readOn is not an ISO date");
  console.log(`  claims: ${claimTotal} figures across ${Object.keys(claims).length} rows, read on ${file.meta.readOn}`);
}
console.log(
  `Intake OK — ${queued} queued: ${publishedTotal} published, ${waiting} waiting for a note, ${rejectedTotal} rejected with a reason (${queryTotal} queries).`,
);

if (fail.length) {
  console.error(`Intake check failed (${fail.length}):`);
  for (const f of fail) console.error(`  - ${f}`);
  process.exit(1);
}
