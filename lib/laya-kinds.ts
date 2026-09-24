/**
 * The second axis over the Laya columns: what kind of work a record is.
 *
 * Jev's second axis is use cases ("what is somebody using the decisions for"), because its corpus
 * is applications. Laya's first week produced almost no applications and a great many runtimes,
 * servers, demos and arguments about benchmarks, so its axis is **kinds of work** — and ADR-0018
 * is the decision that lets the two topics differ here rather than pretending a trading facet
 * exists for a model nobody is trading with.
 *
 * Mechanically this is the same thing Jev does: one published row, one note, and a facet listing
 * that gathers rows from every source by tag. Tags come from the queues rather than from the
 * mapped views, because reading them through the mapping is how seven of Jev's facet pages once
 * rendered empty (docs/lessons/), and the vocabulary is a single file so a typo fails the build
 * instead of producing a quiet empty page.
 */
import vocabulary from "./data/laya-tags.json";
import threadsQueue from "./data/laya-threads.json";
import videosQueue from "./data/laya-videos.json";
import buildsQueue from "./data/laya-builds.json";
import xPostsQueue from "./data/laya-x-posts.json";
import { layaBuilds } from "./laya-builds";
import { layaVideos } from "./laya-videos";
import { layaThreads } from "./laya-threads";
import { layaXPosts } from "./laya-x-posts";

const tagById = new Map<string, string[]>();
for (const queue of [threadsQueue, videosQueue, buildsQueue, xPostsQueue]) {
  for (const entry of (queue as unknown as { entries?: { id: string; tags?: string[] }[] }).entries ?? []) {
    if (entry.tags?.length) tagById.set(entry.id, entry.tags);
  }
}
const tagsOf = (id: string) => tagById.get(id) ?? [];

/** The same map the pages index by id — one map, one truth. */
export const layaTagsById: Record<string, string[]> = Object.fromEntries(tagById);

export interface KindItem {
  id: string;
  url: string;
  title: string;
  note: string;
  source: string;
  meta: string[];
  tags: string[];
  thumb: string;
  thumbW: number;
  thumbH: number;
  /** A page of ours, when the row has one — a facet is a view and should point at the record. */
  pageSlug: string | null;
  video: { url: string; width: number; height: number } | null;
}

export const LAYA_KINDS = vocabulary.tags as { slug: string; label: string; blurb: string }[];

const items: KindItem[] = [
  ...layaBuilds.map((e) => ({
    id: e.id, url: e.url, title: e.title, note: e.ourNote, source: "GitHub",
    meta: [`${e.stars.toLocaleString("en-US")} ★`, `last push ${e.pushedAt}`],
    tags: tagsOf(e.id), thumb: e.card ?? "", thumbW: 1280, thumbH: 640,
    pageSlug: e.dossier?.slug ?? null, video: null,
  })),
  ...layaVideos.map((e) => ({
    id: e.id, url: e.url, title: e.title, note: e.ourNote, source: "YouTube",
    meta: [`${e.views.toLocaleString("en-US")} views`, `${Math.floor(e.durationS / 60)} min`],
    tags: tagsOf(e.id), thumb: e.thumb, thumbW: e.thumbW, thumbH: e.thumbH,
    pageSlug: null, video: null,
  })),
  ...layaThreads.map((e) => ({
    id: e.id, url: e.url, title: e.title, note: e.ourNote, source: "Hacker News",
    meta: [`${e.score.toLocaleString("en-US")} points`, `${e.comments} comments`, e.publishedAt],
    tags: tagsOf(e.id), thumb: e.card ?? "", thumbW: 1200, thumbH: 630,
    pageSlug: null, video: null,
  })),
  ...layaXPosts.map((e) => ({
    id: e.id, url: e.url, title: e.title, note: e.ourNote, source: "X",
    meta: [e.author, e.publishedAt, `${e.likes.toLocaleString("en-US")} likes`],
    tags: tagsOf(e.id), thumb: e.thumb, thumbW: e.thumbW, thumbH: e.thumbH,
    pageSlug: null,
    video: e.video ? { url: e.video.url, width: e.video.width, height: e.video.height } : null,
  })),
];

/** One row per item: a post that is also a demo must not be counted twice. */
const unique = [...new Map(items.map((i) => [i.id, i])).values()];

export const kindItemById = new Map(unique.map((item) => [item.id, item]));

export const itemsByKind = (slug: string): KindItem[] =>
  unique.filter((i) => i.tags.includes(slug)).sort((a, b) => a.title.localeCompare(b.title));

export const LAYA_KIND_COUNTS = LAYA_KINDS.map((k) => ({ ...k, count: itemsByKind(k.slug).length }));
export const LAYA_TAGGED_TOTAL = unique.filter((i) => i.tags.length > 0).length;
export const LAYA_ITEMS_TOTAL = unique.length;
