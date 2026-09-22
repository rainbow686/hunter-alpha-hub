/**
 * Use-case facets — the second axis over the Jev columns.
 *
 * The reference site files every item once and lists it again under one of eight
 * use-case categories; measured, that is a facet, not a second copy (its /categories/*
 * pages are views over /builds/*). We do the same: one published row, one note, and a
 * facet listing that gathers rows across all four sources by tag.
 *
 * Tags are the controlled vocabulary in lib/data/jev-tags.json. A tag outside it fails
 * npm run checks, because a typo used to be silent here: it produced an empty page and a
 * green build (docs/lessons/).
 */
import vocabulary from "./data/jev-tags.json";
import { jevThreads } from "./jev-threads";
import { jevVideos } from "./jev-videos";
import { jevBuilds } from "./jev-builds";
import { jevXPosts } from "./jev-x-posts";
// The mapped views above drop fields a facet needs, so tags come straight from the queues.
// Reading them through the mapping silently produced seven empty pages and a green build —
// the same failure mode as the x-posts filter, which is why the vocabulary now also fails
// the build when a tag is unknown.
import threadsQueue from "./data/jev-threads.json";
import videosQueue from "./data/jev-videos.json";
import buildsQueue from "./data/jev-builds.json";
import xPostsQueue from "./data/jev-x-posts.json";

const tagById = new Map<string, string[]>();
for (const queue of [threadsQueue, videosQueue, buildsQueue, xPostsQueue]) {
  for (const entry of (queue as unknown as { entries?: { id: string; tags?: string[] }[] }).entries ?? []) {
    if (entry.tags?.length) tagById.set(entry.id, entry.tags);
  }
}
const tagsOf = (id: string) => tagById.get(id) ?? [];

/**
 * The same map, for pages that need to filter or label rows themselves. Exported as a
 * plain object so an `.astro` page can index it by id; the alternative — each page
 * re-reading four JSON files — is how the tags got dropped from the mapped views in the
 * first place (docs/lessons/). One map, one truth.
 */
export const jevTagsById: Record<string, string[]> = Object.fromEntries(tagById);

export interface FacetItem {
  id: string;
  url: string;
  title: string;
  note: string;
  source: string;
  sourceKind: string;
  meta: string[];
  tags: string[];
  thumb: string;
  thumbW: number;
  thumbH: number;
  readOn: string;
}

/**
 * Poster ratio, clamped to 3:4 portrait … 16:9 panorama.
 *
 * Lives here rather than in the page's frontmatter on purpose: an arrow function with a
 * template literal inside an .astro frontmatter block made the compiler fail with
 * 'Unexpected export' at a line that did not contain one, and the page it blamed was a
 * template. Moving the helper out made the error, and the page, go away.
 */
export const thumbRatio = (w: number, h: number): string =>
  !w || !h ? "16 / 9" : `${Math.min(Math.max(w / h, 0.75), 1.78).toFixed(3)} / 1`;

export const JEV_FACETS = vocabulary.tags as { slug: string; label: string; blurb: string }[];

const items: FacetItem[] = [
  ...jevBuilds.map((e) => ({
    id: e.id, url: e.url, title: e.title, note: e.ourNote, source: "GitHub", sourceKind: "project",
    meta: [`${e.stars.toLocaleString("en-US")} ★`, `last push ${e.pushedAt}`],
    tags: tagsOf(e.id),
    thumb: e.card ?? "", thumbW: 1280, thumbH: 640, readOn: "",
  })),
  ...jevVideos.map((e) => ({
    id: e.id, url: e.url, title: e.title, note: e.ourNote, source: "YouTube", sourceKind: "video",
    meta: [`${e.views.toLocaleString("en-US")} views`, `${Math.floor(e.durationS / 60)} min`],
    tags: tagsOf(e.id),
    thumb: e.thumb, thumbW: e.thumbW, thumbH: e.thumbH, readOn: "",
  })),
  ...jevThreads.map((e) => ({
    id: e.id, url: e.url, title: e.title, note: e.ourNote, source: "Hacker News", sourceKind: "thread",
    meta: [`${e.score.toLocaleString("en-US")} points`, `${e.comments} comments`, e.publishedAt],
    tags: tagsOf(e.id),
    thumb: e.card ?? "", thumbW: 1200, thumbH: 630, readOn: "",
  })),
  ...jevXPosts.map((e) => ({
    id: e.id, url: e.url, title: e.title, note: e.ourNote, source: "X", sourceKind: e.kind === "video" ? "video" : e.kind === "image" ? "image" : "post",
    meta: [e.author, e.publishedAt, `${e.likes.toLocaleString("en-US")} likes`],
    tags: tagsOf(e.id),
    thumb: e.thumb, thumbW: e.thumbW, thumbH: e.thumbH, readOn: "",
  })),
];

/** One row per item: an X post that is also a demo must not be counted twice. */
const unique = [...new Map(items.map((i) => [i.id, i])).values()];

/** Look a row up by its queue id — the use-case article cites examples by id, so a page
 *  and the prose cannot drift apart the way a hand-written link would. */
export const jevItemById = new Map(unique.map((item) => [item.id, item]));

export const itemsByFacet = (slug: string): FacetItem[] =>
  unique.filter((i) => i.tags.includes(slug)).sort((a, b) => a.title.localeCompare(b.title));

export const JEV_FACET_COUNTS = JEV_FACETS.map((f) => ({ ...f, count: itemsByFacet(f.slug).length }));
export const JEV_TAGGED_TOTAL = unique.filter((i) => i.tags.length > 0).length;
export const JEV_ITEMS_TOTAL = unique.length;
