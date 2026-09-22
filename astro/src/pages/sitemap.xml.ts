import type { APIRoute } from "astro";
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
  // Hand-maintained: `typesafe/jev-1.13` is served by OpenRouter but missing
  // from the /api/v1/models list the rest of this sitemap is derived from.
  { path: "/typesafe-jev", changeFrequency: "weekly", priority: "0.8" },
  // Field notes: hand-written, and the only page here that reads other people's
  // repositories rather than the catalogue.
  // The section index for that series — entries are declared here too, because
  // they are reachable from it and the link audit has to be able to see the path.
  { path: "/field-notes", changeFrequency: "weekly", priority: "0.8" },
  { path: "/jev-guide", changeFrequency: "weekly", priority: "0.8" },
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
