#!/usr/bin/env node
/**
 * One-off: publish batch 2 of the X column (2026-09-24).
 *
 * Twenty rows, each one read first: the note, the tags, the slug and the headline below
 * were written against the post text, not against the reference site's caption. Kept as a
 * script rather than a pile of hand edits so the batch is one reviewable diff and the
 * wording can be corrected without redoing the mechanical parts.
 *
 * Run once: `node tools/lead-crawl/batch2-notes.mjs`
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "../..");
const QUEUE = resolve(ROOT, "lib/data/jev-x-posts.json");
const PAGES = resolve(ROOT, "lib/data/jev-x-pages.json");
const READ_ON = "2026-09-24";

const batch = [
  {
    id: "x:2102025642862600634",
    slug: "jev-webmcp-side-panel-extension",
    headline: "A Chrome side panel that drives a page's own WebMCP tools",
    tags: ["browser-agents"],
    note: "A Chrome side panel that reads the page's own WebMCP tools and, on every keystroke, picks the one that fits, fills in its arguments and says how sure it is. The confidence number reaching the interface is the interesting half. We have not installed the extension.",
  },
  {
    id: "x:2101157548346794059",
    slug: "ai-slop-detector",
    headline: "One URL in, a slop score out: 35 tells in 243 ms",
    tags: ["media-and-content"],
    note: "One URL in, a slop score out: thirty-five tells checked in 243 milliseconds for about $0.00015 of tokens. The tells are the author's own list of design clichés, so the score measures his taste as much as the page — and it had two likes when we read it.",
  },
  {
    id: "x:2100937437325205568",
    slug: "jev-webmcp-benchmark-112x",
    headline: "Jev and a small LLM won a WebMCP benchmark at 112× lower model cost",
    tags: ["browser-agents", "research-and-data"],
    note: "A WebMCP benchmark where Jev paired with a fast small language model solved every task at roughly 112× lower model cost than a frontier model driving a browser with code execution. The benchmark belongs to the company selling the tooling, so the multiple is their number, not a neutral one.",
  },
  {
    id: "x:2102332567588577720",
    slug: "second-jev-repository-list",
    headline: "A second list of Jev repositories, posted while the topic climbed",
    tags: ["research-and-data"],
    note: "Another list of the repositories people were building with, posted while the topic was still climbing and carrying almost no engagement. Nothing in it is new to our resources column; what the row shows is that a second-hand list market appeared within a week.",
  },
  {
    id: "x:2100891604735099103",
    slug: "jev-lead-outreach-scoring",
    headline: "Seven hundred outreach messages scored in forty seconds",
    tags: ["triage-and-routing"],
    note: "Seven hundred leads and the outreach message written for each one, scored in forty seconds for nine cents, with mismatches between message and lead flagged. Judging a written sentence against an intent is the errand; the accuracy claim is the author's and there is no holdout in the post.",
  },
  {
    id: "x:2100426999546184123",
    slug: "jev-classifying-1018-papers",
    headline: "1,018 research papers labelled for eight cents",
    tags: ["research-and-data"],
    note: "1,018 research papers sorted into twenty-four topics for eight cents, 256 milliseconds median per paper, with a fast language model writing the summary that Jev then labels. The two-model pipeline is the reusable shape, and the per-item cost is the number worth keeping.",
  },
  {
    id: "x:2100470174130250127",
    slug: "x-algorithm-simulator-jev",
    headline: "X's published weights, a global feed, and Jev calling how a post travels",
    tags: ["media-and-content"],
    note: "The X feed rebuilt on the weights X published, with Jev deciding how far a post will travel. “Insanely accurate” is a claim and not a measurement — the part we can check is that the simulation needs a global feed of everybody's posts to be interesting at all.",
  },
  {
    id: "x:2100793777103466615",
    slug: "youtube-sponsor-skipper",
    headline: "An extension that spots the sponsor read and skips it, live",
    tags: ["media-and-content"],
    note: "An open-source extension that listens to a YouTube video, spots the sponsor segment and skips it, for roughly half a cent of model spend per video. Deciding against live audio rather than a transcript is the hard part, and the author published the code and its bring-your-own-key setup.",
  },
  {
    id: "x:2100888635943883244",
    slug: "reply-guy-filter",
    headline: "Filtering the reply spam X's own moderation misses",
    tags: ["media-and-content"],
    note: "A tip rather than a project: a filter for the reply-guy comments X's own moderation misses, assembled inside a coding agent in about five minutes. The five minutes is setup time, not a measurement of anything else, and the filter itself is a few lines of prompt work.",
  },
  {
    id: "x:2100425868053008758",
    slug: "live-viral-post-analyzer",
    headline: "A draft scored for viral potential half a second after you stop typing",
    tags: ["media-and-content"],
    note: "A writing surface that scores a draft's viral potential half a second after the typing stops, and labels what kind of post it is at the same time. The author says making it good would need a lot of scraped X data — the honest half of the post, and the reason it is still a demo.",
  },
  {
    id: "x:2099925687465570372",
    slug: "jev-plays-doom-cost-per-hour",
    headline: "Doom at ten decisions a second, about seven dollars an hour",
    tags: ["browser-agents"],
    note: "Doom played at roughly ten decisions a second, which the vendor works out to about seven dollars an hour of model calls. The cost of a continuous loop is the number this column keeps needing, and here the company that sells it put the arithmetic in public.",
  },
  {
    id: "x:2100622054945095934",
    slug: "jev-stagehand-browser-use",
    headline: "Browser use at a tenth of a cent a task, with Stagehand",
    tags: ["browser-agents"],
    note: "Browser use priced at a tenth of a cent a task in a remote browser: the accessibility tree goes in as state, candidate actions go in as questions, and the chosen action comes back. It is the same loop every computer-use demo here uses, minus the screenshots.",
  },
  {
    id: "x:2100356151468585346",
    slug: "jev-trading-bot-monad-kuru",
    headline: "A bot that decides every 300 ms block and trades on an on-chain book",
    tags: ["trading-and-markets"],
    note: "A bot that asks Jev whether to buy or sell from a price feed and places the order on an on-chain order book every three-hundred-millisecond block. Real money on a real venue is the claim, and it is one we have not checked against the chain.",
  },
  {
    id: "x:2100042788851101842",
    slug: "inbox-triage-1500-emails",
    headline: "1,500 of one person's own emails, classified",
    tags: ["triage-and-routing"],
    note: "One person running fifteen hundred of his own emails through the model and reporting that it works well. A personal inbox is a fair place to start and also the reason the post carries no accuracy figure: the only labels in it are his own.",
  },
  {
    id: "x:2099947471518474522",
    slug: "every-editorial-judgments",
    headline: "A week of testing at Every: probabilities instead of words",
    tags: ["media-and-content"],
    note: "An editor at a media company on a week of testing the model, making the point the whole column keeps returning to — that the output is a probability rather than a word, which is what lets a decision sit inside a loop. One operator's judgement, no benchmark.",
  },
  {
    id: "x:2100694549362553153",
    slug: "instant-compaction-with-jev",
    headline: "Instant compaction: score the tool calls, drop what does not matter",
    tags: ["coding-and-context"],
    note: "Compaction turned into a scoring problem: grade every tool call, drop the ones the model judges irrelevant, and skip the summarisation pass entirely. The most-liked post we have catalogued, and the idea that two later posts in this same column argue with.",
  },
  {
    id: "x:2100614659690713543",
    slug: "fraud-detection-jev-kimi-k3",
    headline: "Fraud triage in two stages: Jev sorts, a large model reads the rest",
    tags: ["triage-and-routing"],
    note: "Fraud triage in two stages: Jev labels a hundred emails in 1.42 seconds, then the uncertain ones go to a large model — ninety-six of a hundred right for about seven cents. The accuracy is self-reported; the routing pattern is the part worth copying, and it is what the whole site argues for.",
  },
  {
    id: "x:2100679300756435135",
    slug: "postgres-jev-extension",
    headline: "A Postgres function that judges rows in plain English",
    tags: ["triage-and-routing"],
    note: "A Postgres extension that judges rows in natural language with no index and no embeddings: one function inside a WHERE clause, a hundred and twenty-nine rows in about a second. The demo is small and the shape is not — a filter that can read what a column means.",
  },
  {
    id: "x:2100631847155994852",
    slug: "computer-use-without-screenshots",
    headline: "Computer use where no pixel leaves the machine",
    tags: ["browser-agents"],
    note: "Computer use with no screenshots and no DOM: a local model segments every button on screen, on-device OCR reads the labels, and only that text reaches Jev. Keeping the pixels on the machine is a design decision rather than a trick, and it changes what the model has to be good at.",
  },
  {
    id: "x:2100570517954838897",
    slug: "slay-the-spire-2-jev",
    headline: "Slay the Spire 2 at seven tenths of a second a turn",
    tags: ["browser-agents"],
    note: "Slay the Spire 2 played at seven tenths of a second a turn, visibly faster than the frontier model the author had used for the same game. A Chinese-language post and a feel claim rather than a win rate; the clip is the evidence anyone can check.",
  },
];

const queue = JSON.parse(readFileSync(QUEUE, "utf8"));
const pages = JSON.parse(readFileSync(PAGES, "utf8"));
const index = new Map(queue.entries.map((e) => [e.id, e]));
const seen = new Set();

for (const row of batch) {
  const entry = index.get(row.id);
  if (!entry) throw new Error(`${row.id} is not in the queue`);
  if (seen.has(row.slug)) throw new Error(`duplicate slug ${row.slug}`);
  if (Object.values(pages.pages).some((p) => p.slug === row.slug)) throw new Error(`${row.slug} is already used`);
  seen.add(row.slug);
  if (row.note.trim().split(/\s+/).length < 20) throw new Error(`${row.id}: note is too short`);

  entry.ourNote = row.note;
  entry.tags = row.tags;
  entry.status = "published";
  entry.checked = [
    `post read through the public syndication endpoint on ${READ_ON}`,
    `text, author, date and like count read from that response on ${READ_ON}`,
    "poster image stays on X's CDN; nothing downloaded or rehosted",
  ];
  pages.pages[row.id] = { slug: row.slug, headline: row.headline };
}

pages.meta.note = " Twenty records added 2026-09-24 in content batch 1 (leads from the madewithjev directory crawl), forty in batch 2 the same day. Both batches were read one row at a time against the post text.";
writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`);
writeFileSync(PAGES, `${JSON.stringify(pages, null, 2)}\n`);
console.log(`published ${batch.length} rows; pages now ${Object.keys(pages.pages).length}`);
