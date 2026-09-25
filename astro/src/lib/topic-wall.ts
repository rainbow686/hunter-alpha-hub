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
function jevColumns(perColumn: number, excludeXId?: string): WallItem[][] {
  return [
    jevXPosts
      .filter((post) => post.id !== excludeXId)
      .slice(0, perColumn)
      .map((post) => ({
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
      })),
    jevBuilds.slice(0, perColumn).map((build) => ({
      kind: "Repository",
      headline: build.title,
      href: build.dossier ? `/typesafe-jev/builds/${build.dossier.slug}` : build.url,
      external: !build.dossier,
      note: build.ourNote,
      meta: [`${fmt(build.stars)} stars`, build.language ?? "—"],
      thumb: build.card ?? undefined,
      tags: jevTagsById[build.id] ?? [],
    })),
    jevVideos.slice(0, perColumn).map((video) => ({
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
    jevThreads.slice(0, perColumn).map((thread) => ({
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

function layaColumns(perColumn: number, excludeXId?: string): WallItem[][] {
  return [
    layaXPosts
      .filter((post) => post.id !== excludeXId)
      .slice(0, perColumn)
      .map((post) => ({
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
      })),
    layaBuilds.slice(0, perColumn).map((build) => ({
      kind: "Repository",
      headline: build.title,
      href: build.dossier ? `/laya/builds/${build.dossier.slug}` : build.url,
      external: !build.dossier,
      note: build.ourNote,
      meta: [`${fmt(build.stars)} stars`, build.language ?? "—"],
      thumb: build.card ?? undefined,
      tags: layaTagsById[build.id] ?? [],
    })),
    layaVideos.slice(0, perColumn).map((video) => ({
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
    layaThreads.slice(0, perColumn).map((thread) => ({
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
  const parts =
    topic === "jev" ? jevColumns(perColumn, options.excludeXId) : layaColumns(perColumn, options.excludeXId);

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
