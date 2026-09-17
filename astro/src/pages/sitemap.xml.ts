import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { openrouterModels } from "@repo/lib/openrouter-models";
import { comparisonPairs } from "@repo/lib/openrouter-comparisons";

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
}

const STATIC_ENTRIES: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: "1" },
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
  { path: "/hunter-alpha-benchmarks", changeFrequency: "monthly", priority: "0.7" },
];

const escapeXml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog");

  const entries: Entry[] = [
    ...STATIC_ENTRIES,
    ...openrouterModels.map((model) => ({
      path: `/openrouter-models/${model.slug}`,
      changeFrequency: "weekly",
      priority: "0.7",
    })),
    ...comparisonPairs.map((pair) => ({
      path: `/compare/${pair.slug}`,
      changeFrequency: "weekly",
      priority: "0.7",
    })),
    ...posts.map((post) => ({
      path: `/blog/${post.id.replace(/\.md$/, "")}`,
      changeFrequency: "monthly",
      priority: "0.6",
    })),
  ];

  const lastmod = new Date().toISOString();
  const body = entries
    .map((entry) =>
      [
        "  <url>",
        `    <loc>${escapeXml(`${BASE}${entry.path === "/" ? "" : entry.path}`)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${entry.changeFrequency}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        "  </url>",
      ].join("\n"),
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
};
