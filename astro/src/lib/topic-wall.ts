/**
 * The card builders behind a front page's wall.
 *
 * A topic cover's wall and the home page's wall are the same cards, read from the same four
 * columns, so the mapping lives here. It moved on 2026-09-25, when the home page asked for a wall
 * and became the third caller — the comment it replaced in the two topic pages said the
 * duplication was fine "because this site has exactly two topic covers", and that stopped being
 * true the moment the front page wanted one of its own.
 *
 * What is *not* shared, and should not be: the sample size, the wall's headline, its note and its
 * foot. A topic cover says "this is a sample of this topic"; the home page says "this is a sample
 * of both". Those are different sentences about the same cards.
 */
import { jevBuilds } from "@repo/lib/jev-builds";
import { jevVideos } from "@repo/lib/jev-videos";
import { jevThreads } from "@repo/lib/jev-threads";
import { jevXPosts } from "@repo/lib/jev-x-posts";
import { jevTagsById } from "@repo/lib/jev-facets";
import { layaBuilds } from "@repo/lib/laya-builds";
import { layaVideos } from "@repo/lib/laya-videos";
import { layaThreads } from "@repo/lib/laya-threads";
import { layaXPosts } from "@repo/lib/laya-x-posts";
import { layaTagsById } from "@repo/lib/laya-kinds";

export interface WallItem {
  /** What this is, in the reader's words: "X post", "Repository", "Video", "Thread". */
  kind: string;
  headline: string;
  /** Our page for the record when we have one, otherwise the source itself. */
  href: string;
  external: boolean;
  note: string;
  /** Two short facts for the footer line: a count and a date. */
  meta: string[];
  thumb?: string;
  thumbW?: number;
  thumbH?: number;
  avatar?: string;
  /**
   * A progressive mp4 on X's CDN, when the row has one that fits the size cap
   * (`scripts/ingest-x-video.mjs`). Present means the frame becomes a player instead of a
   * poster — the same `XClipWall` behaviour the column pages have had since 2026-09-23.
   */
  video?: string;
  /**
   * The facets this row belongs to, so a wall can be filtered where it stands.
   *
   * They are passed in rather than looked up here because each topic has its own vocabulary
   * (ADR-0018): Jev's six use cases are not Laya's six kinds. `check:intake` already refuses a tag
   * that is not in the vocabulary, so this attribute can only ever carry slugs a facet page
   * exists for.
   */
  tags: string[];
}

/** One column, for the line under the wall that sends the reader to the full list. */
export interface WallColumn {
  label: string;
  href: string;
  count: number;
}

/**
 * A card with the two facts the *ordering* needs, which the rendered card never shows: which
 * topic it came from and the day it carried. The topic covers sort by a column's own rank (likes,
 * views, points) and never ask; the site feed sorts by `at` across both topics, which is the one
 * thing the home page's timeline does that no topic page does.
 */
export interface WallRow extends WallItem {
  topic: TopicSlug;
  /** ISO day, from the row's own `publishedAt` — never from the day we read it. */
  at: string;
  /**
   * The row's own count — likes, stars, views or points — kept so an ordering can filter on it.
   * `meta` carries a *formatted* version of the same number ("76,000 likes"), which is right for
   * the card and wrong for a comparison, so the raw value travels beside it.
   */
  signal: number;
  /**
   * Size of the row's clip, when it has one, so a page can decide whether playing it in place is
   * worth the bytes. `video` on the card is the URL; this is what it costs. Kept on the row rather
   * than looked up because the caller that cares (the home page) never sees the source record.
   */
  videoBytes?: number;
}

export type TopicSlug = "jev" | "laya";

const fmt = (n: number) => n.toLocaleString("en-US");

/**
 * What each topic holds, read from the same files the columns render.
 *
 * The home page prints these, and it must never print a typed number: this site has already had
 * a "15 models tracked" line survive a week after the catalogue grew.
 */
export const topicSizes = {
  jev: {
    builds: jevBuilds.length,
    xPosts: jevXPosts.length,
    videos: jevVideos.length,
    threads: jevThreads.length,
  },
  laya: {
    builds: layaBuilds.length,
    xPosts: layaXPosts.length,
    videos: layaVideos.length,
    threads: layaThreads.length,
  },
} as const;

export function topicRecords(topic: TopicSlug): number {
  const size = topicSizes[topic];
  return size.builds + size.xPosts + size.videos + size.threads;
}

/**
 * The four columns in the order a reader meets them.
 *
 * Jev's X rows mostly have a record page of ours — a hand-written slug and headline, because a
 * slug cut out of a tweet is a truncation. Laya's do not: that column links out, and says so on
 * the card. Everything else about the two is the same shape.
 */
function jevColumns(excludeXId?: string): WallRow[][] {
  return [
    jevXPosts
      .filter((post) => post.id !== excludeXId)
      .map((post) => ({
        topic: "jev" as const,
        at: post.publishedAt,
        signal: post.likes,
        kind: "X post",
        headline: post.page?.headline ?? post.title,
        href: post.page ? `/typesafe-jev/x-posts/${post.page.slug}` : post.url,
        external: !post.page,
        note: post.ourNote,
        meta: [`${fmt(post.likes)} likes`, post.publishedAt],
        thumb: post.thumb || undefined,
        thumbW: post.thumbW,
        thumbH: post.thumbH,
        avatar: post.avatar || undefined,
        tags: jevTagsById[post.id] ?? [],
        video: post.video?.url,
        videoBytes: post.video?.bytes,
      })),
    jevBuilds.map((build) => ({
      topic: "jev" as const,
      at: build.publishedAt,
      signal: build.stars,
      kind: "Repository",
      headline: build.title,
      href: build.dossier ? `/typesafe-jev/builds/${build.dossier.slug}` : build.url,
      external: !build.dossier,
      note: build.ourNote,
      meta: [`${fmt(build.stars)} stars`, build.language ?? "—"],
      thumb: build.card ?? undefined,
      tags: jevTagsById[build.id] ?? [],
    })),
    jevVideos.map((video) => ({
      topic: "jev" as const,
      at: video.publishedAt,
      signal: video.views,
      kind: "Video",
      headline: video.title,
      href: video.url,
      external: true,
      note: video.ourNote,
      meta: [`${fmt(video.views)} views`, video.channel],
      thumb: video.thumb || undefined,
      thumbW: video.thumbW,
      thumbH: video.thumbH,
      tags: jevTagsById[video.id] ?? [],
    })),
    jevThreads.map((thread) => ({
      topic: "jev" as const,
      at: thread.publishedAt,
      signal: thread.score,
      kind: thread.source === "hn" ? "Hacker News" : "dev.to",
      headline: thread.title,
      href: thread.url,
      external: true,
      note: thread.ourNote,
      meta: [`${fmt(thread.score)} ${thread.scoreLabel}`, thread.publishedAt],
      tags: jevTagsById[thread.id] ?? [],
    })),
  ];
}

function layaColumns(excludeXId?: string): WallRow[][] {
  return [
    layaXPosts
      .filter((post) => post.id !== excludeXId)
      .map((post) => ({
        topic: "laya" as const,
        at: post.publishedAt,
        signal: post.likes,
        kind: "X post",
        headline: post.title,
        href: post.url,
        external: true,
        note: post.ourNote,
        meta: [`${fmt(post.likes)} likes`, post.publishedAt],
        thumb: post.thumb || undefined,
        thumbW: post.thumbW,
        thumbH: post.thumbH,
        avatar: post.avatar || undefined,
        tags: layaTagsById[post.id] ?? [],
        video: post.video?.url,
        videoBytes: post.video?.bytes,
      })),
    layaBuilds.map((build) => ({
      topic: "laya" as const,
      at: build.publishedAt,
      signal: build.stars,
      kind: "Repository",
      headline: build.title,
      href: build.dossier ? `/laya/builds/${build.dossier.slug}` : build.url,
      external: !build.dossier,
      note: build.ourNote,
      meta: [`${fmt(build.stars)} stars`, build.language ?? "—"],
      thumb: build.card ?? undefined,
      tags: layaTagsById[build.id] ?? [],
    })),
    layaVideos.map((video) => ({
      topic: "laya" as const,
      at: video.publishedAt,
      signal: video.views,
      kind: "Video",
      headline: video.title,
      href: video.url,
      external: true,
      note: video.ourNote,
      meta: [`${fmt(video.views)} views`, video.channel],
      thumb: video.thumb || undefined,
      thumbW: video.thumbW,
      thumbH: video.thumbH,
      tags: layaTagsById[video.id] ?? [],
    })),
    layaThreads.map((thread) => ({
      topic: "laya" as const,
      at: thread.publishedAt,
      signal: thread.score,
      kind: thread.source === "hn" ? "Hacker News" : "dev.to",
      headline: thread.title,
      href: thread.url,
      external: true,
      note: thread.ourNote,
      meta: [`${fmt(thread.score)} ${thread.scoreLabel}`, thread.publishedAt],
      tags: layaTagsById[thread.id] ?? [],
    })),
  ];
}

/**
 * Every row of a topic, in its four columns, at full length. Both callers below start here:
 * `topicWall` slices and interleaves, `siteFeed` sorts across topics. One mapping, two orders.
 */
export function topicRows(topic: TopicSlug, options: { excludeXId?: string } = {}): WallRow[][] {
  return topic === "jev" ? jevColumns(options.excludeXId) : layaColumns(options.excludeXId);
}

/** The label a card wears on the home page, where a reader cannot tell the two topics apart. */
export const TOPIC_LABEL: Record<TopicSlug, string> = { jev: "Jev", laya: "Laya" };

/**
 * What a row has to have earned before the front page's feed will show it, by what kind of row it
 * is. One number per kind because the platforms count different things — a repository with 100
 * stars and a post with 100 likes are not the same amount of attention, they are just the points
 * at which each stops being noise.
 *
 * Calibrated on the corpus as it stands (2026-09-25): the floors keep the launch post (76,000
 * likes), the MLX port (14,035), `laya` itself (22,757 stars) and the 1,349-point Hacker News
 * thread, and they drop the dev.to posts with zero reactions that pure date ordering put on top.
 */
const SIGNAL_FLOOR: Record<string, number> = {
  "X post": 100,
  Repository: 100,
  Video: 2_000,
  "Hacker News": 15,
  "dev.to": 15,
};

/**
 * `perColumn` rows from each of the four columns, interleaved rather than concatenated: one card
 * from each column, `perColumn` times over, so the first screen alone shows a post, a repository,
 * a recording and a discussion. Sorting the whole set by one number would put four X posts at the
 * top and make the wall look like a single column.
 */
export function topicWall(
  topic: TopicSlug,
  perColumn: number,
  options: { excludeXId?: string } = {},
): { items: WallItem[]; columns: WallColumn[] } {
  const parts = topicRows(topic, options).map((column) => column.slice(0, perColumn));

  const items: WallItem[] = [];
  for (let i = 0; i < perColumn; i += 1) {
    for (const part of parts) {
      if (part[i]) items.push(part[i]);
    }
  }

  const columns: WallColumn[] =
    topic === "jev"
      ? [
          { label: "Built with Jev", href: "/typesafe-jev/builds", count: jevBuilds.length },
          { label: "Seen on X", href: "/typesafe-jev/x-posts", count: jevXPosts.length },
          { label: "Videos", href: "/typesafe-jev/videos", count: jevVideos.length },
          { label: "Threads and write-ups", href: "/typesafe-jev/threads", count: jevThreads.length },
        ]
      : [
          { label: "Built with Laya", href: "/laya/builds", count: layaBuilds.length },
          { label: "Seen on X", href: "/laya/x-posts", count: layaXPosts.length },
          { label: "Videos", href: "/laya/videos", count: layaVideos.length },
          { label: "Threads", href: "/laya/threads", count: layaThreads.length },
        ];

  return { items, columns };
}

/**
 * What landed last that was worth looking at, across every topic, newest first.
 *
 * This is the home page's own view and the reason it has a card band at all. A topic cover shows
 * its *best* rows per column, picked in advance; the feed shows the rows that earned attention
 * anywhere on the site, in the order they happened, each card labelled with the topic it came from.
 *
 * Two rules, and both were learned by looking at the first attempt:
 *
 *   1. **Pure date order does not work.** Sorted by date alone, the first version printed twelve
 *      Jev cards — most of them dev.to posts with zero reactions — because Jev simply has the most
 *      recent rows and a blog post is published every day. A front-page feed that a reader never
 *      wants to click is not "the newest", it is the noise floor. `SIGNAL_FLOOR` is that fix: a
 *      row has to have been read by somebody before it can sit on this page.
 *   2. **Both topics get their turn.** The rows are picked per topic and then merged, so one model
 *      having a loud week cannot empty the band of the other.
 *
 * With two topics this still overlaps the covers on most cards — that is arithmetic, not a design
 * failure — but the feed is the version that keeps working when a third model arrives, because it
 * never had a per-topic shape to begin with.
 *
 * A card that carries a clip is left in: the hero excludes the row it already shows, so nothing
 * is fetched twice (the 2026-09-24 bug on the topic covers — see `docs/lessons/`).
 */
export function siteFeed(perTopic: number, options: { excludeXId?: string } = {}): WallRow[] {
  const newestFirst = (a: WallRow, b: WallRow) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0);
  const notable = (topic: TopicSlug) =>
    topicRows(topic, options)
      .flat()
      .filter((row) => row.signal >= (SIGNAL_FLOOR[row.kind] ?? 0))
      .sort(newestFirst)
      .slice(0, perTopic);

  return [...notable("jev"), ...notable("laya")].sort(newestFirst);
}
