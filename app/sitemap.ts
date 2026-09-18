import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { openrouterModels } from '@/lib/openrouter-models';
import { comparisonPairs } from '@/lib/openrouter-comparisons';
import { lastmodFor } from '@/lib/content-dates';

/**
 * Every URL used to carry `new Date()` — i.e. "modified this second", on every
 * fetch, for all 87 pages. A `<lastmod>` a crawler cannot trust is one it
 * ignores, so the four pages that changed on 2026-09-18 had no way to say so on a
 * sitemap that had not been re-read since March. Dates now come from
 * lib/content-dates.ts, and a page with no known revision date carries no
 * `<lastmod>` at all rather than a false one.
 */
function withRealLastmod(entry: MetadataRoute.Sitemap[number]): MetadataRoute.Sitemap[number] {
  const path = new URL(entry.url).pathname.replace(/\/$/, "") || "/";
  const fallback = entry.lastModified
    ? new Date(entry.lastModified).toISOString()
    : undefined;
  const date = lastmodFor(path, fallback);
  if (!date) {
    const { lastModified: _omitted, ...rest } = entry;
    return rest;
  }
  return { ...entry, lastModified: new Date(`${date}T00:00:00.000Z`) };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.hunteralphahub.com';

  // 获取所有博客文章
  const posts = getAllPosts();
  // The blog index changes when a post is added, so its newest post is its real
  // revision date. Every other undated page stays undated on purpose.
  const newestPost = posts[0]?.publishedAt;

  const entries: MetadataRoute.Sitemap = [
    // 核心页面
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: newestPost ? new Date(newestPost) : undefined,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/access`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/zh/access`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/zh/faq`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/comparison`,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      // Renders the curated snapshot directly, so its content changed on the day
      // the snapshot did. Same for the calculator below.
      url: `${baseUrl}/openrouter-models`,
      lastModified: openrouterModels[0]?.dataAsOf ? new Date(openrouterModels[0].dataAsOf) : undefined,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/best-openrouter-models`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/openrouter-pricing-calculator`,
      lastModified: openrouterModels[0]?.dataAsOf ? new Date(openrouterModels[0].dataAsOf) : undefined,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/openrouter-free-models`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hunter-alpha`,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/ox-alpha`,
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/union-alpha`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/union-alpha-free`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/union-alpha-opencode`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/union-alpha-not-working`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      // Live since launch and linked from the footer and /terms, but it was
      // never in the sitemap — found on 2026-09-18 by the link audit's new
      // "200 but not in the sitemap" check.
      url: `${baseUrl}/privacy`,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      // Trust pages (AdSense ADS-UX-05 / ADS-PUB-05). Added 2026-09-18 with the
      // About/Contact pages themselves, so the sitemap never lags the site.
      url: `${baseUrl}/about`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/alpha-models`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/stealth-models`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/hunter-alpha-benchmarks`,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    // OpenRouter 模型页
    ...openrouterModels.map((model) => ({
      url: `${baseUrl}/openrouter-models/${model.slug}`,
      // The date the page's own numbers were read — the same date it prints.
      lastModified: new Date(`${model.dataAsOf}T00:00:00.000Z`),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    // Curated model comparisons
    ...comparisonPairs.map((comparison) => ({
      url: `${baseUrl}/compare/${comparison.slug}`,
      lastModified: openrouterModels[0]?.dataAsOf
        ? new Date(`${openrouterModels[0].dataAsOf}T00:00:00.000Z`)
        : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    // 博客文章 - 动态生成
    ...posts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];

  return entries.map(withRealLastmod);
}
