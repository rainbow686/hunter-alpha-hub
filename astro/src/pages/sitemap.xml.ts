import type { APIRoute } from "astro";
import { JEV_FACETS } from "@repo/lib/jev-facets";
import { jevBuildsWithPages } from "@repo/lib/jev-builds";
import { jevXPostsWithPages } from "@repo/lib/jev-x-posts";
import { LAYA_BUILDS_READ_ON, layaBuildsWithPages } from "@repo/lib/laya-builds";
import { LAYA_KINDS } from "@repo/lib/laya-kinds";
import { LAYA_THREADS_READ_ON } from "@repo/lib/laya-threads";
import { LAYA_VIDEOS_READ_ON } from "@repo/lib/laya-videos";
import { LAYA_X_READ_ON } from "@repo/lib/laya-x-posts";
import { LAYA_RESOURCES_READ_ON } from "@repo/lib/laya-resources";
import { LAYA_READ_ON } from "@repo/lib/laya";
import { getCollection } from "astro:content";
import { openrouterModels } from "@repo/lib/openrouter-models";
import { comparisonPairs } from "@repo/lib/openrouter-comparisons";
import { lastmodFor } from "@repo/lib/content-dates";

/**
 * /sitemap.xml
 *
 * The Astro build needs its own, and it is not optional: the link audit refuses
 * to run without one, and after cutover a missing sitemap means Google has no
 * declaration for any page. The static entries below are carried over from the
 * Next app's `app/sitemap.ts` with the same changeFrequency and priority values,
 * so the migration does not quietly re-prioritise the site; the dynamic ones come
 * from the same sources that generate the pages, so a new model, comparison or
 * article appears here by construction.
 *
 * `/privacy` is included because it is live and linked sitewide — it was missing
 * from the live sitemap until 2026-09-18, when the link audit's "200 but not
 * declared" check found it.
 */
export const prerender = true;

const BASE = "https://www.hunteralphahub.com";

interface Entry {
  path: string;
  changeFrequency: string;
  priority: string;
  /**
   * The date this page's content last changed, when we know it. Omitted rather
   * than guessed — see lib/content-dates.ts for why "now" for every URL is worse
   * than nothing.
   */
  lastmod?: string;
}

const STATIC_ENTRIES: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: "1" },
  // The blog index changes when a post is added, so its date comes from the
  // newest post — filled in inside GET(), which has the collection.
  { path: "/blog", changeFrequency: "daily", priority: "0.8" },
  { path: "/faq", changeFrequency: "monthly", priority: "0.7" },
  { path: "/access", changeFrequency: "monthly", priority: "0.7" },
  { path: "/zh/access", changeFrequency: "monthly", priority: "0.7" },
  { path: "/zh/faq", changeFrequency: "monthly", priority: "0.7" },
  { path: "/comparison", changeFrequency: "daily", priority: "1" },
  { path: "/openrouter-models", changeFrequency: "weekly", priority: "0.9" },
  { path: "/best-openrouter-models", changeFrequency: "weekly", priority: "0.9" },
  { path: "/openrouter-pricing-calculator", changeFrequency: "weekly", priority: "0.9" },
  { path: "/openrouter-free-models", changeFrequency: "weekly", priority: "0.8" },
  { path: "/hunter-alpha", changeFrequency: "monthly", priority: "0.3" },
  { path: "/ox-alpha", changeFrequency: "monthly", priority: "0.4" },
  { path: "/union-alpha", changeFrequency: "daily", priority: "0.9" },
  { path: "/union-alpha-free", changeFrequency: "daily", priority: "0.8" },
  { path: "/union-alpha-opencode", changeFrequency: "weekly", priority: "0.8" },
  { path: "/union-alpha-not-working", changeFrequency: "weekly", priority: "0.8" },
  { path: "/terms", changeFrequency: "yearly", priority: "0.3" },
  { path: "/privacy", changeFrequency: "yearly", priority: "0.3" },
  { path: "/about", changeFrequency: "yearly", priority: "0.5" },
  { path: "/contact", changeFrequency: "yearly", priority: "0.5" },
  { path: "/alpha-models", changeFrequency: "weekly", priority: "0.8" },
  { path: "/stealth-models", changeFrequency: "weekly", priority: "0.8" },
  /*
   * The report, not the register: /stealth-models answers "which codenames were
   * there", this one answers "how long did they last and what happened to the
   * price". Priority matches the other two pages in the cluster; the JSON twin is
   * linked from it rather than listed here, the way a data file is.
   */
  { path: "/alpha-line-report", changeFrequency: "weekly", priority: "0.8" },
  /*
   * Second-level column of the Jev topic. Not in the site nav by design
   * (ADR-0018): the topic cover links it, which is also the link that gets it
   * crawled. Weekly, because the star counts and the collections behind it move.
   */
  { path: "/typesafe-jev/resources", changeFrequency: "weekly", priority: "0.7" },
  /*
   * Discussion column. Ordered by points, so it moves when the conversation moves;
   * the numbers behind it are re-read by the HN ingest, not by hand.
   */
  { path: "/typesafe-jev/threads", changeFrequency: "weekly", priority: "0.7" },
  { path: "/typesafe-jev/videos", changeFrequency: "weekly", priority: "0.7" },
  { path: "/typesafe-jev/x-posts", changeFrequency: "weekly", priority: "0.7" },
  /*
   * Use-case facets: the second axis over the Jev columns. Generated from the one
   * vocabulary file so a new tag cannot be added to the pages and forgotten here.
   */
  { path: "/typesafe-jev/use-cases", changeFrequency: "weekly", priority: "0.8" },
  /* The explainer, split off the index on 2026-09-24 so the section could have a wide front door
     without putting prose at 1048. */
  { path: "/typesafe-jev/use-cases/jobs", changeFrequency: "monthly", priority: "0.6" },
  { path: "/typesafe-jev/statistics", changeFrequency: "monthly", priority: "0.7" },
  ...JEV_FACETS.map((f) => ({ path: `/typesafe-jev/use-cases/${f.slug}`, changeFrequency: "weekly", priority: "0.6" })),
  { path: "/typesafe-jev/builds", changeFrequency: "weekly", priority: "0.8" },
  /*
   * One entry per build dossier. These are the pages with content nobody else has — the
   * reason a card links to a page of ours instead of straight out to GitHub — so they get
   * the highest priority in the topic after the columns themselves.
   */
  ...jevBuildsWithPages.map((build) => ({
    path: `/typesafe-jev/builds/${build.dossier!.slug}`,
    changeFrequency: "monthly" as const,
    priority: "0.6",
    /* The day we read inside the repository. Before 2026-09-24 these 18 pages carried no lastmod at
       all, which is the one signal that tells a crawler they are worth revisiting. */
    lastmod: build.dossier!.readOn,
  })),
  /*
   * One entry per X post record, generated from the same pages file the routes are built from.
   *
   * These were **built and not declared** until 2026-09-23: 42 pages live and reachable by link,
   * absent from the sitemap, on a site whose whole discovery story is "the sitemap is the
   * declaration". Found by counting: 174 built pages against 129 declared. `check:files` now fails
   * on that difference, which is the only reason the next one will be caught on the same day.
   *
   * Weekly rather than monthly: a record's content is stable but its like count is re-read, and the
   * date on the page changes when the number does (ADR-0024).
   */
  ...jevXPostsWithPages.map((post) => ({
    path: `/typesafe-jev/x-posts/${post.page!.slug}`,
    changeFrequency: "weekly" as const,
    priority: "0.5",
    /* Per row: 42 of these were read on the 23rd and 41 on the 24th, and ADR-0024's rule is that the
       date travels with the number — a single column-wide date would be false for half of them. */
    lastmod: post.likesAsOf,
  })),
  { path: "/submit", changeFrequency: "monthly", priority: "0.5" },
  // Hand-maintained: `typesafe/jev-1.13` is served by OpenRouter but missing
  // from the /api/v1/models list the rest of this sitemap is derived from.
  { path: "/typesafe-jev", changeFrequency: "weekly", priority: "0.8" },
  /*
   * The topic's long-form page (2026-09-24): specs, price, question types and our own probe,
   * split off the front page when it grew a wall. It is the page a reader lands on from a search
   * for "jev specs" or "jev pricing", so it sits with the explainers rather than at 0.6.
   */
  { path: "/typesafe-jev/reference", changeFrequency: "monthly", priority: "0.8" },

  /*
   * Laya (2026-09-24). The second model topic, declared here the day it was built — the lesson from
   * the 42 X-post pages that were live and undeclared for a day is that a new section's pages are
   * exactly the ones a hand-maintained list forgets, so every one below is generated from the same
   * file its route is generated from.
   */
  { path: "/laya", changeFrequency: "weekly", priority: "0.8", lastmod: LAYA_READ_ON },
  /* The three explainers predate the columns and were re-read the day the topic was rebuilt. */
  { path: "/laya/reference", changeFrequency: "monthly", priority: "0.8", lastmod: LAYA_READ_ON },
  { path: "/laya/vs-jev", changeFrequency: "monthly", priority: "0.7", lastmod: LAYA_READ_ON },
  { path: "/laya/self-hosting", changeFrequency: "monthly", priority: "0.7", lastmod: LAYA_READ_ON },
  { path: "/laya/open-weights", changeFrequency: "monthly", priority: "0.6", lastmod: LAYA_READ_ON },
  /* Each column carries the day its own numbers were read — the same dates the columns print. */
  { path: "/laya/builds", changeFrequency: "weekly", priority: "0.8", lastmod: LAYA_BUILDS_READ_ON },
  ...layaBuildsWithPages.map((build) => ({
    path: `/laya/builds/${build.dossier!.slug}`,
    changeFrequency: "monthly" as const,
    priority: "0.6",
    lastmod: build.dossier!.readOn,
  })),
  { path: "/laya/x-posts", changeFrequency: "weekly", priority: "0.7", lastmod: LAYA_X_READ_ON },
  { path: "/laya/videos", changeFrequency: "weekly", priority: "0.7", lastmod: LAYA_VIDEOS_READ_ON },
  { path: "/laya/threads", changeFrequency: "weekly", priority: "0.7", lastmod: LAYA_THREADS_READ_ON },
  { path: "/laya/resources", changeFrequency: "monthly", priority: "0.6", lastmod: LAYA_RESOURCES_READ_ON },
  { path: "/laya/kinds", changeFrequency: "weekly", priority: "0.6", lastmod: LAYA_READ_ON },
  ...LAYA_KINDS.map((kind) => ({ path: `/laya/kinds/${kind.slug}`, changeFrequency: "weekly", priority: "0.6", lastmod: LAYA_READ_ON })),
  // Field notes: hand-written, and the only page here that reads other people's
  // repositories rather than the catalogue.
  // The section index for that series — entries are declared here too, because
  // they are reachable from it and the link audit has to be able to see the path.
  { path: "/field-notes", changeFrequency: "weekly", priority: "0.8" },
  { path: "/typesafe-jev/guide", changeFrequency: "weekly", priority: "0.8" },
  /*
   * The explainer cluster (roadmap/jev-explainer-cluster.md) — one URL per search intent. Listed
   * individually rather than globbed: a cluster page is a decision (which intents we serve), and a
   * glob would let a half-written page declare itself the moment it renders.
   */
  { path: "/typesafe-jev/pricing", changeFrequency: "monthly", priority: "0.8" },
  { path: "/typesafe-jev/vs-llm", changeFrequency: "monthly", priority: "0.8" },
  { path: "/typesafe-jev/open-source", changeFrequency: "weekly", priority: "0.7" },
  /*
   * The Laya topic's four original pages were declared here when the topic was four chapters. They
   * moved into the generated block above on 2026-09-24, when the topic grew columns: one list, one
   * place, because two lists of the same URLs produced a duplicate-URL failure on the first build.
   */
  { path: "/hunter-alpha-benchmarks", changeFrequency: "monthly", priority: "0.7" },
];

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");
  const newestPost = [...posts].sort((a, b) =>
    a.data.publishedAt < b.data.publishedAt ? 1 : -1,
  )[0]?.data.publishedAt;

  const entries: Entry[] = [
    ...STATIC_ENTRIES.map((entry) => {
      if (entry.path === "/blog" && newestPost) return { ...entry, lastmod: newestPost };
      // These two render the curated snapshot directly, so their content changed
      // on the day the snapshot did — that date is theirs.
      if (entry.path === "/openrouter-models" || entry.path === "/openrouter-pricing-calculator") {
        return { ...entry, lastmod: openrouterModels[0]?.dataAsOf };
      }
      return entry;
    }),
    ...openrouterModels.map((model) => ({
      path: `/openrouter-models/${model.slug}`,
      changeFrequency: "weekly",
      priority: "0.7",
      lastmod: model.dataAsOf,
    })),
    ...comparisonPairs.map((pair) => ({
      path: `/compare/${pair.slug}`,
      changeFrequency: "weekly",
      priority: "0.7",
      // Comparison pages print the same snapshot date their models carry; take it
      // from a model rather than hardcoding a second copy of it here.
      lastmod: openrouterModels[0]?.dataAsOf,
    })),
    ...posts.map((post) => ({
      path: `/blog/${post.id.replace(/\.md$/, "")}`,
      changeFrequency: "monthly",
      priority: "0.6",
      lastmod: post.data.publishedAt,
    })),
  ];

  const body = entries
    .map((entry) => {
      const lastmod = lastmodFor(entry.path, entry.lastmod);
      return [
        "  <url>",
        `    <loc>${escapeXml(`${BASE}${entry.path === "/" ? "" : entry.path}`)}</loc>`,
        ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
        `    <changefreq>${entry.changeFrequency}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};
